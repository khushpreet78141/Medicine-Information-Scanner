import supabase from "@/src/lib/supabase";
export const dynamic = 'force-static'

export async function POST(request: Request) {
    const {formData }= await request.json();
 
  
const {data,error} = await supabase.from("reminders").insert({
    quantity:formData.quantity,
    frequency:formData.frequency,
    meal:formData.meal,
    start_date:formData.startingDate,
    end_date:formData.endingDate,
    medicine_name:formData.medicine
});

console.log(data);
console.log("reminders",error);

const {data2,error2} = await supabase.from("Reminder_Times").insert({
    time:formData.timing
});

console.log(data2);
console.log("Reminder_Times",error2);
//  const data = await res.json();
  return Response.json({ data });

}




