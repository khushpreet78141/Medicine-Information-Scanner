import supabase from "@/src/lib/supabase";
import { timeStamp } from "console";
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
    const {reminder,error} = await supabase.from('reminder').select("*");
    const {data,error} = await supabase.from("pushSubscription").select("*");
    console.log("all pushSubscription",data);
    if (error) {
        return Response.json(
            { success: false, error: error.message },
            { status: 500 }
        );     
    }

    for (let index = 0; index < data.length; index++) {
        try{
        const element = data[index];
        const pushSubscription = {
            endpoint:element.endpoint,
            keys:element.keys
        }
        await webpush.sendNotification(pushSubscription,  JSON.stringify({
        title: "Medicine Reminder",
        body: "Time to take your medicine 💊"
    }));
    
}catch(error){
        console.error(error);
    }
    }
    return Response.json({
    success: true,
    message: "Notifications sent."
});

}







