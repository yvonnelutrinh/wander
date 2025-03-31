import { Route, Routes } from "react-router-dom";
import "./App.scss";
import HomePage from "./pages/HomePage/HomePage";
import SelectionsPage from "./pages/SelectionsPage/SelectionsPage";
import ComparisonPage from "./pages/ComparisonPage/ComparisonPage";
import BreathePage from "./pages/BreathePage/BreathePage";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import EndPage from "./pages/EndPage/EndPage";
import Header from "./components/Header/Header";
import GroundPage from "./pages/GroundPage/GroundPage";
import Footer from "./components/Footer/Footer";

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/select" element={<SelectionsPage />} />
        <Route path="/ground" element={<GroundPage />} />
        <Route path="/breathe" element={<BreathePage />} />
        <Route path="/compare" element={<ComparisonPage />} />
        <Route path="/end" element={<EndPage />} />
        <Route path="/end/:insight" element={<EndPage />} />
        <Route path="/*" element={<ErrorPage />} />
      </Routes>
      <Footer />
    </>
  );
}
