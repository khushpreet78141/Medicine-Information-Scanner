import { type NextRequest } from 'next/server'

import { GoogleGenAI } from "@google/genai";
import supabase from "@/src/lib/supabase";
const ai = new GoogleGenAI({apiKey: process.env.Gemini_Api_Key});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const name = searchParams.get('name');
  console.log(name);

  const { data, error:error1 } = await supabase
  .from("Medicine")
  .select("*")
  .eq("name", name)
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
  "name":"",
  "generic_name":"",
  "quantity":"",
  "category":"",
  "uses":"",
  "side_effects":[],
  "precautions":[]
}

If medicine is not found return

{
   "error":"Medicine not found"
} 
  `
      },
    ],
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
    
    generic_name: medicine.generic_name,
    quantity: medicine.quantity,
    category: medicine.category,
    uses:medicine.uses,
    side_effects:medicine.side_effects,
    precautions:medicine.precautions,
    name:medicine.name,


  });

  console.log(data2);
  console.log(error2);
  return Response.json({
    result: medicine,
  });

}
