import supabase from "@/src/lib/supabase";

export async function POST(request: Request) {
    //console.log("Login body",request);
    const loginData = await request.json();

    console.log("body inside Login",loginData);
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




