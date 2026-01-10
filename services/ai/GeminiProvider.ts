import { GoogleGenAI, Type } from "@google/genai";
import { TextGeneratorProvider, ImageGeneratorProvider, VideoGeneratorProvider, TrendingTopic } from "./interfaces";
import { AIResponse, SeoConfig, LandingPage } from "../../types";
import { storage } from "../../lib/firebase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

export class GeminiTextProvider implements TextGeneratorProvider {
  async generatePost(topic: string): Promise<AIResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Você é um Especialista em Redação Web de elite. Escreva um post profundo sobre: "${topic}".
      
      **REGRAS DE FORMATO:**
      1. Campo "content" com Markdown puro (sem <html>).
      2. Gere um "imagePrompt" em INGLÊS para uma capa cinematográfica.
      3. O SEO metaTitle deve ser impactante.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            summary: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            imagePrompt: { type: Type.STRING },
            seo: {
              type: Type.OBJECT,
              properties: {
                  metaTitle: { type: Type.STRING },
                  metaDescription: { type: Type.STRING },
                  focusKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                  slug: { type: Type.STRING }
              },
              required: ["metaTitle", "metaDescription", "focusKeywords", "slug"]
            },
            slug: { type: Type.STRING }
          },
          required: ["title", "content", "summary", "slug", "tags", "seo", "imagePrompt"]
        }
      }
    });

    if (!response.text) throw new Error("Falha na geração");
    return JSON.parse(response.text) as AIResponse;
  }

  async generateVisualPrompt(title: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a specific image generation prompt for the blog post title: "${title}".
      
      The prompt MUST adhere to this style:
      "Cinematic 8k masterpiece, photorealistic, dramatic lighting. A conceptual fusion of human creativity (represented by artistic splashes, neurons, or hands writing) merging with artificial intelligence (glowing digital circuits, holographic data streams, golden nodes). High contrast, teal and orange color grading, shallow depth of field, award-winning photography style."
      
      Return ONLY the English prompt string.`,
    });
    return response.text || title;
  }

  async generateSeo(title: string, content: string): Promise<SeoConfig> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Gere SEO metadata para: ${title}.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    metaTitle: { type: Type.STRING },
                    metaDescription: { type: Type.STRING },
                    focusKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                    slug: { type: Type.STRING }
                },
                required: ["metaTitle", "metaDescription", "focusKeywords", "slug"]
            }
        }
    });
    return JSON.parse(response.text!) as SeoConfig;
  }

  async generateLanding(data: LandingPage): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Gere uma Landing Page usando Tailwind CSS para: ${data.subject}.`,
    });
    return response.text!;
  }

  async getTrendingTopics(niche: string): Promise<TrendingTopic[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Tendências em: "${niche}".`,
      config: { tools: [{ googleSearch: {} }] }
    });
    return [];
  }
}

export class GeminiImageProvider implements ImageGeneratorProvider {
  async generateImage(prompt: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: { imageConfig: { aspectRatio: "16:9" } },
      });
      
      let base64Data = "";
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          base64Data = part.inlineData.data;
          break;
        }
      }

      if (base64Data) {
        const fileName = `covers/${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
        const storageRef = ref(storage, fileName);
        await uploadString(storageRef, base64Data, 'base64', { contentType: 'image/png' });
        return await getDownloadURL(storageRef);
      }
      throw new Error("Dados de imagem não encontrados.");
    } catch (error: any) {
      if (error.message?.includes("429") || error.message?.includes("quota")) {
        throw new Error("COTA_EXCEDIDA_IMAGEM");
      }
      throw error;
    }
  }
}

export class VeoVideoProvider implements VideoGeneratorProvider {
  async generateVideo(prompt: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
    });
    while (!operation.done) {
      await new Promise(r => setTimeout(r, 10000));
      operation = await ai.operations.getVideosOperation({operation: operation});
    }
    return operation.response?.generatedVideos?.[0]?.video?.uri + `&key=${process.env.API_KEY}`;
  }
}