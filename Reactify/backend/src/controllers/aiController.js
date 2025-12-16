import fetch from 'node-fetch';

/**
 * Generate slides using Google Gemini AI
 * POST /api/ai/generate-slides
 */
export const generateSlides = async (req, res) => {
    try {
        const { prompt, slideType = 'multiple-choice', count = 3 } = req.body;

        if (!prompt) {
            return res.status(400).json({
                success: false,
                message: 'Prompt is required'
            });
        }

        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

        if (!GEMINI_API_KEY) {
            return res.status(500).json({
                success: false,
                message: 'Gemini API key is not configured'
            });
        }

        // Build the prompt for slide generation
        const getSlideTypePrompt = (type) => {
            switch (type) {
                case 'word-cloud':
                    return 'Each slide should have a question that encourages participants to respond with single words or short phrases.';
                case 'open-ended':
                    return 'Each slide should have a thought-provoking question that encourages detailed written responses.';
                case 'scales':
                    return 'Each slide should have a statement that can be rated on a scale from strongly disagree to strongly agree.';
                case 'ranking':
                    return 'Each slide should have items that participants can rank in order of preference.';
                default: // multiple-choice
                    return 'Each slide should have a clear question and 4 answer options.';
            }
        };

        const systemPrompt = `You are a quiz and presentation creator. Create exactly ${count} interactive ${slideType.replace('-', ' ')} questions about: ${prompt}

${getSlideTypePrompt(slideType)}

Respond ONLY with valid JSON in this exact format, no other text:
{"slides":[{"question":"Your question here","type":"${slideType}","options":[{"text":"Option 1"},{"text":"Option 2"},{"text":"Option 3"},{"text":"Option 4"}]}]}

For word-cloud and open-ended types, omit the options array.`;

        // Use Google Gemini API (gemini-2.0-flash - confirmed available)
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: systemPrompt }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 2000
                    }
                })
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API Error:', errorText);

            return res.status(response.status).json({
                success: false,
                message: 'Failed to generate content from AI'
            });
        }

        const result = await response.json();

        // Extract the generated text from Gemini response
        let generatedText = '';
        if (result.candidates && result.candidates[0]?.content?.parts?.[0]?.text) {
            generatedText = result.candidates[0].content.parts[0].text;
        } else {
            console.error('Unexpected response format:', result);
            return res.status(500).json({
                success: false,
                message: 'Unexpected response format from AI'
            });
        }

        // Parse the JSON response
        let parsedResponse;
        try {
            // Try to extract JSON from the response
            const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                parsedResponse = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('No JSON found in response');
            }
        } catch (parseError) {
            console.error('Failed to parse AI response:', generatedText);

            // Fallback: Generate simple slides from the prompt
            parsedResponse = {
                slides: Array.from({ length: count }, (_, i) => ({
                    question: `Question ${i + 1} about ${prompt}`,
                    type: slideType,
                    options: slideType === 'word-cloud' || slideType === 'open-ended'
                        ? undefined
                        : [
                            { text: 'Option A' },
                            { text: 'Option B' },
                            { text: 'Option C' },
                            { text: 'Option D' }
                        ]
                }))
            };
        }

        // Validate and ensure correct structure
        if (!parsedResponse.slides || !Array.isArray(parsedResponse.slides)) {
            parsedResponse = { slides: [parsedResponse] };
        }

        // Ensure each slide has the correct type
        const slides = parsedResponse.slides.slice(0, count).map(slide => ({
            ...slide,
            type: slide.type || slideType
        }));

        res.json({
            success: true,
            slides
        });

    } catch (error) {
        console.error('AI Generation Error:', error);

        res.status(500).json({
            success: false,
            message: error.message || 'Failed to generate slides'
        });
    }
};
