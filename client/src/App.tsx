import "./App.css";
import React from "react";
import {Routes, Route} from "react-router-dom";
import Home from "@/components/home/Home.tsx";
import Admin from "@/components/AdminPanel/Admin.tsx";




function App() {
  return (
    <Routes>
    <Route path="/" element={<Home/>} />
      <Route path="/admin" element={<Admin/>} />
    </Routes>
  );
}

export default App;
