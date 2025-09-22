import Navbar from "./components/Navbar.jsx"
import Main from "./components/Main.jsx"
import SocieteBrowser from "./pages/SocieteBrowser.jsx"
import ScpiBrowser from "./pages/ScpiBrowser.jsx"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import SocieteDetails from "./pages/SocieteDetails.jsx"
import ScpiDetails from "./pages/ScpiDetails.jsx"
import Login from "./pages/Login.jsx"
import AdminDashboard from "./pages/AdminDashboard.jsx"


export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route index element={<Main />} />
        <Route path="/societes" element={<SocieteBrowser />} />
        <Route path="/societes/:id" element={<SocieteDetails />} />
        <Route path="/scpi" element={<ScpiBrowser />} />
        <Route path="/scpi/:id" element={<ScpiDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}