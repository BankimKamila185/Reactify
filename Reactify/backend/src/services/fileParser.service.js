import fs from 'fs/promises';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';
// @ts-ignore - no types available
import { YoutubeTranscript } from 'youtube-transcript';


export const parsePDF = async (filePath) => {
    try {
        const dataBuffer = await fs.readFile(filePath);
        const data = await pdf(dataBuffer);

        return {
            text: data.text,
            pageCount: data.numpages,
            wordCount: data.text.split(/\s+/).length
        };
    } catch (error) {
        console.error('PDF parse error:', error);
        throw new Error('Failed to parse PDF file');
    }
};

export const parseDOCX = async (filePath) => {
    try {
        const result = await mammoth.extractRawText({ path: filePath });

        return {
            text: result.value,
            wordCount: result.value.split(/\s+/).length
        };
    } catch (error) {
        console.error('DOCX parse error:', error);
        throw new Error('Failed to parse DOCX file');
    }
};

export const parsePPTX = async (filePath) => {
    try {
        // Note: pptx-parser is a placeholder - you may need to use a different library
        // For now, we'll implement a basic text extraction
        const content = await fs.readFile(filePath, 'utf-8');

        // This is a simplified approach - in production, use a proper PPTX parser
        return {
            text: content,
            wordCount: content.split(/\s+/).length
        };
    } catch (error) {
        console.error('PPTX parse error:', error);
        throw new Error('Failed to parse PPTX file');
    }
};

export const parseTXT = async (filePath) => {
    try {
        const text = await fs.readFile(filePath, 'utf-8');

        return {
            text,
            wordCount: text.split(/\s+/).length
        };
    } catch (error) {
        console.error('TXT parse error:', error);
        throw new Error('Failed to parse TXT file');
    }
};

export const parseYouTubeTranscript = async (url) => {
    try {
        // Extract video ID from URL
        const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);

        if (!videoIdMatch) {
            throw new Error('Invalid YouTube URL');
        }

        const videoId = videoIdMatch[1];
        const transcript = await YoutubeTranscript.fetchTranscript(videoId);

        // Combine transcript text
        const text = transcript.map((item) => item.text).join(' ');

        return {
            text,
            wordCount: text.split(/\s+/).length
        };
    } catch (error) {
        console.error('YouTube transcript error:', error);
        throw new Error('Failed to fetch YouTube transcript. Ensure the video has captions enabled.');
    }
};
