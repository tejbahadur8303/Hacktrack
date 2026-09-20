import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import MyHackathons from "@/pages/MyHackathons";
import AddEditHackathon from "@/pages/AddEditHackathon";
import HackathonDetails from "@/pages/HackathonDetails";
import Calendar from "@/pages/Calendar";
import Deadlines from "@/pages/Deadlines";
import Reminders from "@/pages/Reminders";
import Statistics from "@/pages/Statistics";
import Settings from "@/pages/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/hackathons" element={<MyHackathons />} />
            <Route path="/hackathons/new" element={<AddEditHackathon />} />
            <Route path="/hackathons/:id" element={<HackathonDetails />} />
            <Route path="/hackathons/:id/edit" element={<AddEditHackathon />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/deadlines" element={<Deadlines />} />
            <Route path="/reminders" element={<Reminders />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
