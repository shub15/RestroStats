import { useState } from "react";
import axios from "axios";
import { Outlet } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
// import.meta.env.VITE_token

export default function App() {
  return (
    <div>
      <ThemeProvider>
        <Outlet />
      </ThemeProvider>
    </div>
  );
}
