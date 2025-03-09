import { useState } from "react";
import axios from "axios";
import Dashboard from "./components/Dashboard";
// import.meta.env.VITE_token

export default function App() {
  return (
    <div>
      <ThemeProvider>
        <Dashboard />
      </ThemeProvider>
    </div>
  );
}
