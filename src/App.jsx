import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { HomePage } from "./pages/HomePage";
import { SetupPage } from "./pages/SetupPage";
import StatsPage from "./pages/StatsPage";
import { PlayPage } from "./pages/PlayPage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/setup" element={<SetupPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/play/:gameId" element={<PlayPage />} />
      </Routes>
    </Layout>
  );
}
