import React from 'react'
import supabase from '../lib/supabase'
import { useEffect,useState } from 'react'
interface Medicine {
  name: string;
  uses?: string;
  side_effects?: string[];
  
}

const History = () => {
  const [history, setHistory] = useState<Medicine []>([{name:"",uses:"",side_effects:[""]}]);
  //const history = [{ name: "khushi", uses: ["khushi bhandari"], side_effects: ["rhsmjjj"] }]

  useEffect(() => {
    const historyLoader = async()=>{
      const {data:medicineHistory,error:historyError} = await supabase.from("Medicine").select("name, uses, side_effects");

      if(historyError){
        return;
      }
      setHistory(medicineHistory);
    }
   
    historyLoader();
    
  }, []);
  
  
  return (
    <div className="w-full">
  {/* Heading */}
  <div className="mb-8">
    <h1 className="text-blue-950 font-bold text-3xl md:text-4xl">
      Your Medicine Journey
    </h1>
    <p className="text-gray-500 mt-2">
      Keep track of the medicines you've explored.
    </p>
  </div>

  {/* Empty State */}
  {history.length === 0 && (
    <div className="flex flex-col items-center justify-center py-16 px-6 border-2 border-dashed border-gray-300 rounded-3xl bg-gray-50">
      <div className="text-5xl mb-4">💊</div>

      <h2 className="text-xl font-semibold text-blue-950">
        No History Yet
      </h2>

      <p className="text-gray-500 mt-2 text-center max-w-md">
        Your scanned medicines will appear here once you start exploring them.
      </p>
    </div>
  )}

  {/* History Cards */}
  {history.length !== 0 && (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {history.map((item, index) => (
        <div
          key={index}
          className="group bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          {/* Medicine Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl shrink-0">
              💊
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Medicine
              </p>

              <h2 className="text-xl font-bold text-blue-950 truncate">
                {item.name}

              </h2>

            </div>
          </div>

          {/* Uses */}
          <div className="mb-6">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-blue-950 mb-3">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Uses
            </h3>

            <div className="space-y-2">
              {/*{item.uses?.map((item3) => (*/}
                <div
                  //key={item3}
                  className="flex items-start gap-2 text-sm text-gray-600"
                >
                  <span className="text-green-500 mt-0.5">✓</span>
                  <p>{item.uses}</p>
                </div>
              {/*))}*/}
            </div>
          </div>

          {/* Side Effects */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-blue-950 mb-3">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              Side Effects
            </h3>

            <div className="flex flex-wrap gap-2">
              {item.side_effects?.map((item2, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-medium border border-red-100"
                >
                  {item2}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom accent */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
            <span className="text-xs text-gray-400">
              Medicine Information
            </span>

            <span className="text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
              View →
            </span>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
  )
}

export default History
