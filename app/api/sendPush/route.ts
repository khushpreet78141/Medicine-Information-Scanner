import supabase from "@/src/lib/supabase";
import { timeStamp } from "console";
import { Meie_Script } from "next/font/google";
//const webpush = require('web-push');
import webpush from "web-push"
webpush.setVapidDetails(
    "mailto:khushpreetkaur78141@gmail.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
);

export async function GET(request: Request) {
    const currentTime = new Date().toLocaleTimeString("en-GB",{
        hour:"2-digit",
        minute:"2-digit",
        hour12:false
    });
    
    console.log("currentTime :",currentTime);
     
    
    const {data:reminder,error} = await supabase.from("Reminder-Times").select("*").eq("time",currentTime);
    if (error) {
  return Response.json(
    { success: false, error: error.message },
    { status: 500 }
  );
}

if (!reminder || reminder.length === 0) {
  return Response.json({
    success: true,
    message: "No reminders at this time.",
  });
}
    for (let index = 0; index < reminder.length; index++) {
        const element = reminder[index];
        const {data:reminders,error:reminder_error} = await supabase.from("reminders").select("*").eq("id",element.reminder_id).single();
            if(!reminders){
                console.error(reminder_error);
                    continue;
            }
                const {data:pushSubscription,error:pushSubscription_error} = await supabase.from("pushSubscription").select("*").eq("user_id",reminders.user_id);
                if(!pushSubscription || pushSubscription_error){
                    console.error(pushSubscription_error);
                    continue
                }
                
                console.log("pushSubscription for loggedIn user",pushSubscription);
                for (let ind = 0; ind < pushSubscription.length; ind++) {
                    const ele = pushSubscription[ind];
                    const subscription = {
                            endpoint: ele.endpoint,
                            keys: ele.keys,
                    };

         await webpush.sendNotification(ele,  JSON.stringify({
        title: "Medicine Reminder",
        body: `Time to take your medicine 💊 ${reminders.medicine_name} . `
    }));
    }
    }

    if (error) {
        return Response.json(
            { success: false, error: error.message },
            { status: 500 }
        );      
    }
   
    return Response.json({
    success: true,
    message: "Notifications sent."
});

}






