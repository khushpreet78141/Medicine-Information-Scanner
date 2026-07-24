import { type NextRequest } from 'next/server'

import { GoogleGenAI } from "@google/genai";
import supabase from "@/src/lib/supabase";
const ai = new GoogleGenAI({apiKey: process.env.Gemini_Api_Key});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const name = searchParams.get('name');
  console.log(name);
  //select title from books where to_tsvector(title) @@ to_tsquery('Lit:*');
  const { data, error:error1 } = await supabase
  .from("Medicine")
  .select("*")
  .eq("medicine_name", name)
  .maybeSingle();


  if (data) {
    return Response.json({
        source: "database",
        result: data,
    });
}

console.log(data);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: [   
      {
      text: `
    Search for medicine name ${name}
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
  const text = response.text
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();
  
  const medicine = JSON.parse(text);
  console.log(medicine);

  if (medicine.error) {
    return Response.json({
      status:404,
      message:"Response not given by Gemini"
    })

  // return 404 or appropriate response

}
 const {data:data2,error:error2} = await supabase
  .from("Medicine")
  .insert({
    medicine_name:medicine.medicine_name,
    generic_name: medicine.generic_name,
    quantity: medicine.quantity,
    category: medicine.category,
    uses:medicine.uses,
    side_effects:medicine.side_effects
  });
  console.log(data2);
  console.log(error2);
  return Response.json({
    result: medicine,
  });

}
