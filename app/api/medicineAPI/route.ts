import { type NextRequest } from 'next/server'

import { GoogleGenAI } from "@google/genai";
import supabase from "@/src/lib/supabase";
const ai = new GoogleGenAI({apiKey: process.env.Gemini_Api_Key});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const name = searchParams.get('name');
  console.log(name);

  const { data:data1, error:error1 } = await supabase
  .from("Medicine")
  .select("*")
  .eq("name", name)
  .maybeSingle();


  if (data1) {
    return Response.json({
        source: "database",
        result: data1,
    });
}


console.log(data1);

  const response = await ai.models.generateContent({
  model: "gemini-2.5-flash-lite",
  contents: [
    {
      text: `
You are a medicine recommendation assistant.

The user searched:
"${name}"

The search may be:
- Medicine name
- Generic name
- Disease
- Symptom
- Medical condition
- Medicine category

Return the most relevant 3 to 5 medicines.

Return ONLY valid JSON.
Do not include markdown or explanations.

{
  "results": [
    {
      "name": "",
      "generic_name": "",
      "quantity": "",
      "category": "",
      "uses": "",
      "side_effects": [],
      "precautions": []
    }
  ]

}

If nothing relevant is found:

{
  "results": [],
  "error": "No relevant medicines found"
}
`
    }
  ]
});
  if(!response.text){
     return Response.json({
    success:false,
    message:"Text not return By Gemini API"
  });
  }

  const text = response.text
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();
  
  const medicine = JSON.parse(text);
  console.log(medicine);

  const result = medicine.results?.[0];

  if (!result) {
  return Response.json(
    {
      success: false,
      message: "No medicine found"
    },
    { status: 404 }
  );
  }

  if (medicine.error) {
     return Response.json(
    {
      success: false,
      message: "No relevant medicines found"
    },
    { status: 404 }
  );

  // return 404 or appropriate response
}

const { data: data2, error: error2 } = await supabase
  .from("Medicine")
  .insert({
    generic_name: result.generic_name,
    quantity: result.quantity,
    category: result.category,
    uses: result.uses,
    side_effects: result.side_effects,
    precautions: result.precautions,
    name: result.name,
  })
  .select();


  console.log("Data after searching in search Bar",data2);
  console.log("Error after searching in search Bar",error2);
  
  return Response.json({
    result: medicine,
  });


}







