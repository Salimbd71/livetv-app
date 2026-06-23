import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import MainLayout from "./MainLayout.tsx"; // Layout ইমপোর্ট করুন
import Index from "./pages/Index.tsx";
import Categories from "./pages/Categories.tsx";
import Favorites from "./pages/Favorites.tsx";
import About from "./pages/About.tsx";
import Contact from "./pages/Contact.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <Routes>
          {/* MainLayout কে প্যারেন্ট রুট হিসেবে রাখা হলো */}
          <Route path="/" element={<MainLayout />}>
            {/* নিচের পেজগুলোতে অটোমেটিক Navbar চলে যাবে */}
            <Route index element={<Index />} />
            <Route path="categories" element={<Categories />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
          </Route>

          {/* ৪MD৪ পেজে যদি Navbar না দেখাতে চান, তবে তাকে Layout এর বাইরে রাখুন */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
