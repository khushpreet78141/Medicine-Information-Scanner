import React from 'react'
import { useEffect } from 'react'

const useServiceWorker = () => { 
  useEffect(() => { 
        console.log("Service Hook is Running"); 
        if (!("serviceWorker" in navigator)) return; 
        const service = async()=>{ 
            try{ 
            const worker = await navigator.serviceWorker.register("/sw.js"); 
            if(worker){ 
                console.log("worker",worker); 
                console.log('Worker Registered Successfully'); 
                
            }  
            }catch(err){ 
        console.error(err); 
    } 
        } 
        service(); 

  }, []) ; 
  
}

export default useServiceWorker;
