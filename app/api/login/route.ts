import supabase from "@/src/lib/supabase";

export async function POST(request: Request) {
    const {loginData} = await request.json();
   const {data,error} =  await supabase.auth.signInWithPassword({
  email:loginData.email,
  password:loginData.password,
});

console.log("logged in user",data.user);

if(error){
    console.log("error",error);
    return Response.json({success:false,message:"Failed to login"});
}

return Response.json(data);

}




