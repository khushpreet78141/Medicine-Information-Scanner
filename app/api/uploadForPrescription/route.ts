import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey: process.env.Gemini_Api_Key});

export async function POST(request: Request) {
    const formData = await request.formData();
    const image = formData.get("prescriptionImage");

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
        Analyze this doctor's prescription.

        Extract every medicine that you can identify.

        Explain each medicine in very simple words.

        If the handwriting or image is too unclear to identify the prescription,
        return an appropriate error response.
      `,
    },
  ],

  config: {
    responseMimeType: "application/json",

    responseSchema: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          explanation: {
            type: "STRING",
          },
          medicine_name: {
            type: "STRING",
          },
          confidence_level: {
            type: "STRING",
          },
          strength: {
            type: "STRING",
          },
          dosage: {
            type: "STRING",
          },
          frequency: {
            type: "STRING",
          },
          duration: {
            type: "STRING",
          },
        },
        required: [
          "explanation",
          "medicine_name",
          "confidence_level",
          "strength",
          "dosage",
          "frequency",
          "duration",
        ],
      },
    },
  },
});
  //let medicine;

  //if(response.text){
  //    const text = response.text
  //.replace(/```json/g, "")
  //.replace(/```/g, "")
  //.trim();
  //medicine = JSON.parse(text);

  //}

  console.log("Returned Prescription",response);
  if (!response) {
    return Response.json( {
    message: "Response not given by Gemini",
  },
  {
    status: 404,
  })
  }

  return Response.json({
    result: response,
    
  })

}