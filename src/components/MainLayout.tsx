import { Outlet } from "react-router-dom";
import Navbar from "./Navbar"; // ⚠️ পরিবর্তন: একই ফোল্ডারে থাকায় শুধু "./Navbar" হবে

const MainLayout = () => {
  return (
    <>
      {/* Navbar সব পেজের ওপরে থাকবে */}
      <Navbar /> 
      
      {/* Outlet এর জায়গায় একেক পেজে একেক কম্পোনেন্ট লোড হবে */}
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;
