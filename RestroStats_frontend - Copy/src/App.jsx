import { useState } from "react";
import axios from "axios";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./components/ThemeProvider";
import Upload_Data from "./components/Upload_Data";
// import.meta.env.VITE_token

export default function App() {
  return (
    <div>
      {/* <ThemeProvider> */}
        {/* <Navbar /> */}
        <Upload_Data />
        {/* <Outlet /> */}
      {/* </ThemeProvider> */}
    </div>
  );
}
