
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
  Return only valid JSON
  
{
  "medicine_name":"",
  "generic_name":"",
  "quantity":"",
  "category":"",
  "uses":"",
  "side_effects":[]
}
  If medicine is not found return

{
   "error":"Medicine not found"
}
   
  `
      },
    ],
  });
  let medicine;
  if(response.text){
      const text = response.text
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();
   medicine = JSON.parse(text);

  }
  if (medicine.error) {
    return Response.json({
      status:404,
      message:"Response not given by Gemini"
    })
  }

  return Response.json({
    result: medicine,
    
  })
  
}

``