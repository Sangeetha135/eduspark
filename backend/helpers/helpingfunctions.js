import { exec } from "child_process";
import dotenv from "dotenv";
dotenv.config();
import axios from "axios";

export const transcribeAudio = (audioPath, outputPath, subtitlepath) => {
  return new Promise((resolve, reject) => {
    const command = `python C:\\Users\\sange\\Desktop\\hackathon\\EduSpark-main\\open-ai\\whisper-script.py "${audioPath}" "${outputPath}"  --model medium `;
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
      `"C:\\ffmpeg\\ffmpeg.exe" -i "${videoUrl}" -vn -acodec pcm_s16le "${audioPath}"`,
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

    // Extract JSON from AI response
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

export const generatesubtitle = async (subtitles, language) => {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const API_URL =
    "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent";

  try {
    const prompt = `
      Convert the following subtitles: ${JSON.stringify(
        subtitles
      )} to **${language}**.
      Rules:
      1. Keep start and end timestamps EXACTLY as original.
      2. ONLY translate the 'text' field, do NOT modify start/end timestamps.
      3. Respond STRICTLY with a valid JSON array in this exact format:
         [{"start": 0.0, "end": 2.0, "text": "..."}, ...]
      4. NO explanations, NO markdown, NO extra formatting—just JSON.
    `;

    const response = await axios.post(
      `${API_URL}?key=${GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] },
      { headers: { "Content-Type": "application/json" } }
    );

    // Extract generated text
    const generatedText =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    // console.log("Raw AI Response:", generatedText);

    // Extract JSON array from AI response
    const jsonMatch = generatedText.match(/(\[.*\])/s);
    if (!jsonMatch) {
      console.error("AI did not return valid JSON:", generatedText);
      throw new Error("No valid JSON found in AI response");
    }

    const cleanedText = jsonMatch[0];
    // console.log("Extracted JSON:", cleanedText);

    // Parse and validate JSON
    const parsed = JSON.parse(cleanedText);

    if (!Array.isArray(parsed)) {
      throw new Error("Response is not an array");
    }
    if (parsed.length !== subtitles.length) {
      throw new Error("Array length mismatch");
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
        item.start !== subtitles[index].start ||
        item.end !== subtitles[index].end
      ) {
        throw new Error("Timestamp mismatch at index " + index);
      }
    });

    return parsed;
  } catch (error) {
    console.error("Translation Error:", {
      message: error.message,
      stack: error.stack,
    });
    throw new Error(`Subtitle translation failed`);
  }
};
