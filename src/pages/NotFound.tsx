import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Instagram, Mail, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShoppingBag, User, Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
const NotFound = () => {
  const location = useLocation();

  const [cartCount] = useState(0);
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white">
   <main className="grid min-h-full backdrop-blur ">
  <div className="text-center">
    <p className=" text-5xl font-semibold text-indigo-600">404</p>
    <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">Page not found</h1>
    <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">Sorry, we couldn’t find the page you’re looking for.</p>
    <div className="mt-10 flex items-center justify-center gap-x-6">
      <a href="/" className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-purple-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Go back home</a>
      
    </div>
  </div>
</main>
    </div>
  );
};

export default NotFound;
