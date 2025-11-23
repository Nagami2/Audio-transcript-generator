
export const MAX_FILE_SIZE_MB = 2000; // 2GB
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// Optimized instructions to save tokens and improve stability
export const TRANSCRIPT_SYSTEM_INSTRUCTION = `
Generate a verbatim transcript.

Output Rules:
1. Format: [MM:SS] Speaker: Text
2. No Markdown/JSON. No intro/outro.
3. ID speakers as "Speaker 1", "Speaker 2".
4. Note non-speech as [Music], [Silence].

Example:
[00:00] Speaker 1: Hello.
[00:05] Speaker 2: Hi there.
`;

export const MODEL_NAME = 'gemini-2.5-flash';
