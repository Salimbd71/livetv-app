import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar"; // আপনার Navbar ফাইলের সঠিক পাথ দিন

const MainLayout = () => {
  return (
    <>
      {/* Navbar সব পেজের ওপরে থাকবে */}
      <Navbar /> 
      
      {/* Outlet এর জায়গায় একেক পেজে একেক কম্পোনেন্ট (যেমন: Index, About) লোড হবে */}
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;
