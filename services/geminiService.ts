import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION_PT, SYSTEM_INSTRUCTION_EN, Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Converts a File object to a Base64 string required by Gemini API.
 */
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        // Remove the Data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Generates a social media caption based on a text briefing and an optional image.
 */
export const generateCaption = async (
  imageFile: File | null,
  briefing: string,
  language: Language
): Promise<string> => {
  try {
    const systemInstruction = language === 'pt' ? SYSTEM_INSTRUCTION_PT : SYSTEM_INSTRUCTION_EN;
    const promptPrefix = language === 'pt' ? "Gere uma postagem sobre:" : "Generate a post about:";
    
    const parts: any[] = [{ text: `${promptPrefix} ${briefing}` }];

    if (imageFile) {
      const imageBase64 = await fileToGenerativePart(imageFile);
      parts.unshift({
        inlineData: {
          mimeType: imageFile.type,
          data: imageBase64,
        },
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: parts,
      },
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7, 
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No caption generated.");
    }

    return text;
  } catch (error) {
    console.error("Error generating caption:", error);
    throw error;
  }
};

/**
 * Generates a creative image based on a briefing and an optional reference image style.
 */
export const generateCreative = async (
  briefing: string,
  language: Language,
  referenceImage: File | null
): Promise<string> => {
  try {
    const parts: any[] = [];
    let promptInstructions = "";

    // Advanced Prompt Engineering for Style Consistency and Innovation
    if (language === 'pt') {
        promptInstructions = `ATENÇÃO AOS DETALHES: Crie uma imagem extremamente inovadora e de alto impacto visual baseada no seguinte briefing: "${briefing}". `;
        
        if (referenceImage) {
            promptInstructions += `\nINSTRUÇÃO CRÍTICA DE ESTILO: Utilize a imagem anexada como REFERÊNCIA VISUAL OBRIGATÓRIA. Copie a iluminação, a paleta de cores, a textura, o ângulo e a estética geral (mood) da imagem de referência. A nova imagem deve parecer fazer parte da mesma sessão de fotos ou campanha da referência, mas retratando o objeto/cena descrito no briefing.`;
        } else {
            promptInstructions += `\nESTILO: Fotografia profissional de altíssima qualidade (8k), estética de tendência para mídias sociais, iluminação cinematográfica, composição premiada, hiper-realista.`;
        }
    } else {
        promptInstructions = `ATTENTION TO DETAIL: Create an extremely innovative and visually high-impact image based on the following briefing: "${briefing}". `;
        
        if (referenceImage) {
            promptInstructions += `\nCRITICAL STYLE INSTRUCTION: Use the attached image as a MANDATORY VISUAL REFERENCE. Mimic the lighting, color palette, texture, angle, and general aesthetic (mood) of the reference image. The new image must look like it belongs to the same photoshoot or campaign as the reference, but depicting the object/scene described in the briefing.`;
        } else {
            promptInstructions += `\nSTYLE: High-end professional photography (8k), trending social media aesthetic, cinematic lighting, award-winning composition, hyper-realistic.`;
        }
    }

    // Add Reference Image if exists
    if (referenceImage) {
      const imageBase64 = await fileToGenerativePart(referenceImage);
      parts.push({
        inlineData: {
          mimeType: referenceImage.type,
          data: imageBase64,
        },
      });
    }

    // Add Text Prompt
    parts.push({ text: promptInstructions });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: parts,
      },
    });

    // Iterate through parts to find the image
    const responseParts = response.candidates?.[0]?.content?.parts;
    if (responseParts) {
      for (const part of responseParts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image generated.");
  } catch (error) {
    console.error("Error generating creative:", error);
    throw error;
  }
};