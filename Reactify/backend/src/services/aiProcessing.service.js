import OpenAI from 'openai';
import AIJob from '../models/AIJob.js';
import { AIJobStatus, ContentType, PollType, GeneratedPoll } from '../types/index.js';
import { emitAIProgress } from '../events/aiProgressEmitter.js';
import {
    parsePDF,
    parseDOCX,
    parsePPTX,
    parseTXT,
    parseYouTubeTranscript
} from './fileParser.service.js';
import { nanoid } from 'nanoid';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || ''
});

export const processAIContent = async (jobId) => {
    try {
        const job = await AIJob.findById(jobId);

        if (!job) {
            console.error('AI job not found:', jobId);
            return;
        }

        // Update status to processing
        job.status = AIJobStatus.PROCESSING;
        job.progress = 10;
        job.statusMessage = 'Extracting content...';
        await job.save();
        emitAIProgress(job.sessionId.toString(), job);

        // Parse content based on type
        let parsedContent;

        switch (job.contentType) {
            case ContentType.PDF:
                const pdfData = await parsePDF(job.fileUrl!);
                parsedContent = pdfData.text;
                break;
            case ContentType.DOCX:
                const docxData = await parseDOCX(job.fileUrl!);
                parsedContent = docxData.text;
                break;
            case ContentType.PPTX:
                const pptxData = await parsePPTX(job.fileUrl!);
                parsedContent = pptxData.text;
                break;
            case ContentType.TXT:
                const txtData = await parseTXT(job.fileUrl!);
                parsedContent = txtData.text;
                break;
            case ContentType.YOUTUBE:
                const ytData = await parseYouTubeTranscript(job.fileUrl!);
                parsedContent = ytData.text;
                break;
            default:
                throw new Error('Unsupported content type');
        }

        // Update progress
        job.progress = 40;
        job.statusMessage = 'Analyzing content with AI...';
        await job.save();
        emitAIProgress(job.sessionId.toString(), job);

        // Generate polls using OpenAI
        const generatedPolls = await generatePollsFromContent(parsedContent);

        // Update job with results
        job.status = AIJobStatus.COMPLETED;
        job.progress = 100;
        job.statusMessage = 'Processing complete!';
        job.result = generatedPolls;
        await job.save();
        emitAIProgress(job.sessionId.toString(), job);

    } catch (error) {
        console.error('AI processing error:', error);

        const job = await AIJob.findById(jobId);
        if (job) {
            job.status = AIJobStatus.FAILED;
            job.error = error.message || 'Processing failed';
            job.statusMessage = 'Processing failed';
            await job.save();
            emitAIProgress(job.sessionId.toString(), job);
        }
    }
};

const generatePollsFromContent = async (content) => {
    try {
        // Truncate content if too long (OpenAI token limits)
        const maxLength = 12000; // Roughly 3000 tokens
        const truncatedContent = content.length > maxLength
            ? content.substring(0, maxLength) + '...'
            : content;

        const prompt = `You are an expert at creating engaging poll questions. Based on the following content, generate 5-8 diverse and thought-provoking poll questions.

Content:
${truncatedContent}

For each poll, provide:
1. A clear, concise question
2. The poll type (single_choice, multiple_choice, rating, or text)
3. If applicable, 3-5 answer options

Return your response as a valid JSON array with this structure:
[
  {
    "type": "single_choice",
    "question": "Your question here?",
    "options": ["Option 1", "Option 2", "Option 3"]
  }
]

Guidelines:
- Mix different poll types
- Make questions specific to the content
- Keep questions clear and concise
- For rating questions, don't include options (1-5 scale is assumed)
- For text questions, don't include options
- Options should be mutually exclusive for single_choice
- Generate 5-8 questions total`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'You are a helpful assistant that generates poll questions in JSON format.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 2000
        });

        const responseText = response.choices[0]?.message?.content || '[]';

        // Extract JSON from response (handle markdown code blocks)
        const jsonMatch = responseText.match(/\[[\s\S]*\]/);
        const jsonText = jsonMatch ? jsonMatch[0] : responseText;

        const rawPolls = JSON.parse(jsonText);

        // Format polls with IDs
        const formattedPolls: GeneratedPoll[] = rawPolls.map((poll) => ({
            type: poll.type as PollType,
            question: poll.question,
            options: poll.options?.map((text) => ({
                id: nanoid(8),
                text
            })),
            aiGenerated: true
        }));

        return formattedPolls;

    } catch (error) {
        console.error('OpenAI generation error:', error);

        // Return fallback polls if AI generation fails
        return [
            {
                type: PollType.SINGLE_CHOICE,
                question: 'How would you rate your understanding of this content?',
                options: [
                    { id: nanoid(8), text: 'Excellent' },
                    { id: nanoid(8), text: 'Good' },
                    { id: nanoid(8), text: 'Fair' },
                    { id: nanoid(8), text: 'Poor' }
                ],
                aiGenerated: true
            },
            {
                type: PollType.RATING,
                question: 'Rate the quality of this content (1-5)',
                aiGenerated: true
            },
            {
                type: PollType.OPEN_TEXT,
                question: 'What was the most interesting part of this content?',
                aiGenerated: true
            }
        ];
    }
};
