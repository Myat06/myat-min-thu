import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import "./App.css";
import { LoadingProvider } from "./context/LoadingProvider";

const CharacterModel = lazy(() => import("./components/Character"));
const MainContainer  = lazy(() => import("./components/MainContainer"));
const MyWorks        = lazy(() => import("./pages/MyWorks"));
const ContactPage    = lazy(() => import("./pages/ContactPage"));
const ResumePage     = lazy(() => import("./pages/ResumePage"));

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <LoadingProvider>
              <Suspense fallback={null}>
                <MainContainer>
                  <Suspense fallback={null}>
                    <CharacterModel />
                  </Suspense>
                </MainContainer>
              </Suspense>
            </LoadingProvider>
          }
        />
        <Route
          path="/resume"
          element={
            <Suspense fallback={<div>Loading…</div>}>
              <ResumePage />
            </Suspense>
          }
        />
        <Route
          path="/portfolio"
          element={
            <Suspense fallback={<div>Loading…</div>}>
              <MyWorks />
            </Suspense>
          }
        />
        <Route
          path="/myworks"
          element={
            <Suspense fallback={<div>Loading…</div>}>
              <MyWorks />
            </Suspense>
          }
        />
        <Route
          path="/contact"
          element={
            <Suspense fallback={<div>Loading…</div>}>
              <ContactPage />
            </Suspense>
          }
        />
      </Routes>
      <Analytics />
      <SpeedInsights />
    </BrowserRouter>
  );
};

export default App;
