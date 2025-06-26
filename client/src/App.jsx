import React from "react";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Hero from "./pages/Home/Hero";
import About from "./pages/Home/About";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
     
      <div className="pt-[60px] space-y-24">
        {/* Main Routes */}
        <Routes>
          <Route path="/" element={<>
                <Hero />
                <About />
              </>} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
