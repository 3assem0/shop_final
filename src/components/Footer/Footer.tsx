import { Instagram, Mail, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <div className="relative ">
      <div className="absolute left-0 right-0 top-0 h-px bg-purple-400 z-[41]" />
    

<div className="text-black bg-transparent   px-[4%] sm:px-[9%] md:px-[14%]  py-8 sm:py-5 md:py-5 z-[50]">
  <footer className="bg-white rounded-lg shadow-sm m-4 ">
<div className="w-full mx-auto p-4 md:flex md:items-center md:justify-between">
       <span className="text-sm text-black sm:text-center flex items-center "><a href="https://" className="hover:underline"><img src="/logo.png" className="w-20" alt="#logo" /></a></span>
    <span className="text-sm text-black">© 2025 . All Rights Reserved.</span>
     <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-black sm:mt-0">
         <li>
             <a href="#" className="hover:underline me-4 md:me-6">About</a>
         </li>
       <li>
             <a href="#" className="hover:underline me-4 md:me-6">Contact</a>
         </li>
         <li>
             <a href="#" className="hover:underline">Products</a>
         </li>
     </ul>

     </div>
     </footer>
</div>
</div>
  );
};