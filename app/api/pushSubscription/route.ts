import supabase from "@/src/lib/supabase";

export async function POST(request: Request) {
    const {pushSubscription} = await request.json();
    const alreadyExist = await supabase.from("pushSubscription").select("*").eq("endpoint",pushSubscription.endpoint)
    console.log("Already Exit ",alreadyExist) 
    if(alreadyExist.success) return Response.json({ alreadyExist });
    const {data,error} = await supabase.from("pushSubscription").insert({
        endpoint:pushSubscription.endpoint, 
        keys:pushSubscription.keys
    });  

    console.log("data in backend",data);
    console.log('error ',error);
    
    
    return Response.json({ data });

}


