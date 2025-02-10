import { exec } from "child_process";
import dotenv from "dotenv";
dotenv.config();
import axios from "axios";

export const transcribeAudio = (audioPath, outputPath, subtitlepath) => {
  return new Promise((resolve, reject) => {
    const command = `python C:\\Users\\saikr\\EduSpark\\open-ai\\whisper-script.py "${audioPath}" "${outputPath}"  --model medium `;
    console.log("Executing:", command);

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("Transcription Error:", stderr);
        reject(error);
      } else {
        console.log("Transcription Successful:", stdout);
        resolve();
      }
    });
  });
};

export const extractAudio = (videoUrl, audioPath) => {
  return new Promise((resolve, reject) => {
    exec(
      `"C:\\ffmpeg\\ffmpeg-7.1-essentials_build\\bin\\ffmpeg.exe" -i "${videoUrl}" -vn -acodec pcm_s16le "${audioPath}"`,
      (error) => {
        if (error) reject(error);
        else resolve();
      }
    );
  });
};

export const generateQuiz = async (storyText) => {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const API_URL =
    "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent";

  try {
    const prompt = `
      Generate a quiz with at least 2 multiple-choice questions based on the following text:
      "${storyText}"
      Each question should have 4 answer choices (A, B, C, D).
      Provide the correct answer along with a brief explanation.

      Respond ONLY with a valid JSON array in this exact format:
      [
        { 
          "question": "What is the moral of the story?", 
          "options": ["Overconfidence leads to failure", "Speed is most important", "Never race against a hare", "Being slow is bad"], 
          "answer": "Overconfidence leads to failure",
          "explanation": "The story teaches that being overconfident, like the hare, can lead to failure, while consistency, like the tortoise, leads to success."
        },
        ...
      ]
    `;

    const response = await axios.post(
      `${API_URL}?key=${GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] },
      { headers: { "Content-Type": "application/json" } }
    );

    const candidate = response.data?.candidates?.[0];
    if (!candidate || !candidate.content || !candidate.content.parts) {
      throw new Error("Invalid AI response format");
    }

    const generatedText = candidate.content.parts[0]?.text?.trim() || "";
    console.log("Raw AI Response:", generatedText);

    const jsonMatch = generatedText.match(/\[.*\]/s);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in AI response");
    }

    const quizData = JSON.parse(jsonMatch[0]);

    return quizData;
  } catch (error) {
    console.error("Error generating quiz:", error.message);
    throw new Error("Failed to generate quiz");
  }
};

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const API_URL =
  "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent";

const chunkArray = (arr, size) => {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
};

export const generatesubtitle = async (subtitles, language) => {
  try {
    if (language === "English") {
      return subtitles;
    }

    const subtitleChunks = chunkArray(subtitles, 10);
    let translations = [];

    for (const chunk of subtitleChunks) {
      let parsed = null;
      let attempts = 3;

      while (attempts-- > 0) {
        try {
          const prompt = `
                Convert the following subtitles: ${JSON.stringify(
                  chunk
                )} to *${language}*.
                Rules:
                1. Keep start and end timestamps EXACTLY as original.
                2. ONLY translate the 'text' field, do NOT modify start/end timestamps.
                3. Respond STRICTLY with a valid JSON array in this exact format:
                   [{"start": 0.0, "end": 2.0, "text": "..."}, ...]
                4. NO explanations, NO markdown, NO extra formatting—just JSON.
              `;

          const response = await axios.post(
            `${API_URL}?key=${GEMINI_API_KEY}`,
            {
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0 },
            },
            { headers: { "Content-Type": "application/json" } }
          );

          const generatedText =
            response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

          const jsonStart = generatedText.indexOf("[");
          const jsonEnd = generatedText.lastIndexOf("]") + 1;
          const cleanedText = generatedText.substring(jsonStart, jsonEnd);

          parsed = JSON.parse(cleanedText);

          if (!Array.isArray(parsed) || parsed.length !== chunk.length) {
            throw new Error("Array length mismatch or invalid JSON");
          }

          parsed.forEach((item, index) => {
            if (
              typeof item.start !== "number" ||
              typeof item.end !== "number" ||
              typeof item.text !== "string"
            ) {
              throw new Error(`Invalid format at index ${index}`);
            }
            if (
              item.start !== chunk[index].start ||
              item.end !== chunk[index].end
            ) {
              throw new Error("Timestamp mismatch at index " + index);
            }
          });

          translations.push(...parsed);
          break;
        } catch (error) {
          console.error(`Retrying... Attempts left: ${attempts}`);
        }
      }

      if (!parsed || parsed.length !== chunk.length) {
        throw new Error("Subtitle translation failed after multiple retries.");
      }
    }

    return translations;
  } catch (error) {
    console.error("Translation Error:", {
      message: error.message,
      stack: error.stack,
    });
    throw new Error(`Subtitle translation failed`);
  }
};
