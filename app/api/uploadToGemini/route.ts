
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey: process.env.Gemini_Api_Key});
 
export async function POST(req: Request) {
   const formData = await req.formData()
   const image = formData.get("image");

     if (!(image instanceof File)) {
    return Response.json(
      { error: "No image uploaded" },
      { status: 400 }
    );
  }

  const bytes = await image.arrayBuffer();

  const base64Image = Buffer.from(bytes).toString("base64");
  
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: [
      {
        inlineData: {
          mimeType: image.type,
          data: base64Image,
        },
      },
      {
        text: `
  Identify the medicine in this image.
  Return:
  1. Medicine name
  2. Generic name
  3. Main uses
  4. Common side effects
  5. Safety disclaimer if uncertain
  `
      },
    ],
  });

  return Response.json({
    result: response.text,
  })
}

``