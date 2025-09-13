import { Mail, Heart } from "lucide-react";
export const Footer = () => {
  return (
    <footer className="p-5 md:px-20">
      <div className="w-full md:h-[332px] md:p-11 p-4 text-background bg-[#fee0f9] rounded-[12px] flex flex-col justify-between max-md:gap-8">
        <div className="flex  flex-row justify-between  flex-wrap ">
          <div className=" max-w-[1200px] lg:text-9xl  h-auto block  md:text-8xl sm:text-8xl text-7xl font-handmade font-extrabold text-[#831670] " >
          MOHAIR
          </div>
          <ul className="flex flex-col flex-wrap gap-4 max-md:justify-start justify-end mb-2 text-[#831670] text-md">
              <li className="text-xl font-bold hover:text-[#a23891] "><a href="">Shop</a></li>
              <li className="hover:text-[#a23891] "><a href="">Clothing</a></li>
              <li className="hover:text-[#a23891]"><a href="">Bags</a></li>
            </ul>
         </div>
        <div className="flex px-2 justify-between items-center max-md:contents ">
           
            <ul className="flex flex-wrap gap-4 max-md:justify-start justify-end mb-2 text-[#831670]  text-md">
             <li>
                      <button 
                        className="text-[#831670] font-medium text-sm tracking-wide transition-all duration-200 relative group py-2">
                        Facebook
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#fb6f92]   transition-all duration-200 group-hover:w-full"></span>
                      </button>
                    </li>
                      <li>
                      <button 
                        className="text-[#831670] font-medium text-sm tracking-wide transition-all duration-200 relative group py-2">
                        Instgram
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#fb6f92]   transition-all duration-200 group-hover:w-full"></span>
                      </button>
                    </li>
                      <li>
                      <button 
                        className="text-[#831670] font-medium text-sm tracking-wide transition-all duration-200 relative group py-2">
                        Whatsapp
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#fb6f92]   transition-all duration-200 group-hover:w-full"></span>
                      </button>
                    </li>
            </ul>
      
          <p className="text-[#831670] ">{new Date().getFullYear()}© — All rights reserved</p>
           
        </div>
      </div>
      
    </footer>
  );
};