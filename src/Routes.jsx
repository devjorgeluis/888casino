import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Casino from "./pages/Casino";
import LiveCasino from "./pages/LiveCasino";
import Sports from "./pages/Sports";
import LiveSports from "./pages/LiveSports";
import Profile from "./pages/Profile/Profile";
import ProfileHistory from "./pages/Profile/ProfileHistory";
import ProfileTransaction from "./pages/Profile/ProfileTransaction";
import NoPage from "./pages/NoPage";
import Layout from "./components/Layout/Layout";

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/casino" element={<Casino />} />
                <Route path="/live-casino" element={<LiveCasino />} />
                <Route path="/sports" element={<Sports />} />
                <Route path="/live-sports" element={<LiveSports />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/history" element={<ProfileHistory />} />
                <Route path="/profile/transaction" element={<ProfileTransaction />} />
                <Route path="*" element={<NoPage />} />
            </Route>
        </Routes>
    );
}