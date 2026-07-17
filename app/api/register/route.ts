import supabase from "@/src/lib/supabase";


export async function POST(request: Request) {
    console.log("request body",request);
    const {registerData} = await request.json();
   const {data,error} =  await supabase.auth.signUp({
    //name:registerData.name,
  email:registerData.email,
  password:registerData.password,
  options:{
    data:{
        name:registerData.name
    }
  }
});

console.log("logged in user",data.user);

if(error){
    console.log("error",error);
    return Response.json({success:false,message:"Registration failed"});
}

return Response.json({success:true,message:"Registration SuccessFull"});

}

