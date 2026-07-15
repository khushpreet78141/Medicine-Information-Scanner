import supabase from "@/src/lib/supabase";

export async function POST(request: Request) {
    const {email,password} = await request.json();
   const {data,error} =  await supabase.auth.signInWithPassword({
  email,
  password,
});

console.log("logged in user",data.user)
if(error){
    console.log()
}
}