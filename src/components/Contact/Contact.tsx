import React from 'react'

export default function Contact() {
  return (
    <div className="relative bg-transparent dark:bg-[#131313]">
      {/* Guide Lines - Responsive positioning */}
      {/* <div className="absolute left-0 right-0 top-0 h-px  bg-purple-500 z-[41]" /> */}
     

      {/* Main Content - Responsive padding that matches guide lines */}
      <section className="relative px-[5%] sm:px-[10%] md:px-[15%] flex items-center justify-center py-8 sm:py-5 md:py-5 z-[50] ">
        <div className="w-full border-4 sm:border-6 md:border-8 rounded-2xl sm:rounded-3xl border-purple-700 overflow-hidden">
          <a 
            href="mailto:assemayman5900@gmail.com" 
            className="w-full flex flex-col lg:flex-row items-center justify-between hover:opacity-90 transition-opacity"
          >
            {/* Image container - responsive sizing */}
            <div className="w-full lg:w-auto flex-shrink-0">
              <img 
                src="/gif.gif" 
                alt="Super hero contact animation"
                loading="lazy"
                decoding="async"
                className="w-full h-48 sm:h-64 md:h-80 lg:w-80 xl:w-96 lg:h-full object-cover rounded-xl sm:rounded-2xl"
              />
            </div>
            
            {/* Text container - responsive typography */}
            <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
              <h1 className="dark:text-[#f4f1f1] text-[#959494] text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl font-bold text-center leading-tight flex items-center justify-center ">
                Click to contact 
                <img src="/public/instagram-logo.webp" className='w-20' alt="#insta_logo" />
              </h1>
            </div>
          </a>
        </div>
      </section>
    </div>
  )
}
