
import React, { useEffect, useState } from "react";

export default function ProductGrid() {


  return (
    <div className="p-32 pt-32 bg-transparent">
      
        {/* //  Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="animate-fade-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="bg-white  rounded-2xl shadow-lg border border-slate-100  overflow-hidden">
                <div className="h-80 skeleton rounded-t-2xl"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 skeleton rounded w-3/4"></div>
                  <div className="h-4 skeleton rounded w-1/2"></div>
                  <div className="h-4 skeleton rounded w-full"></div>
                  <div className="h-8 skeleton rounded w-1/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
    
    </div>
  );
}
