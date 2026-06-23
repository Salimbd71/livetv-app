import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import MainLayout from "./components/MainLayout"; // ⚠️ পরিবর্তন: সঠিক পাথ দেওয়া হয়েছে
import Index from "./pages/Index";
import Categories from "./pages/Categories";
import Favorites from "./pages/Favorites";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

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
            <Route index element={<Index />} />
            <Route path="categories" element={<Categories />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
          </Route>

          {/* 404 পেজ */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
