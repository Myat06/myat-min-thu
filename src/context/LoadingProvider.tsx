import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import Loading from "../components/Loading";

interface LoadingType {
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
  setLoading: (percent: number) => void;
}

export const LoadingContext = createContext<LoadingType | null>(null);

const SESSION_KEY = "portfolioLoaded";

export const LoadingProvider = ({ children }: PropsWithChildren) => {
  // Show loading only once per browser session
  const alreadyLoaded = !!sessionStorage.getItem(SESSION_KEY);

  const [isLoading, setIsLoadingState] = useState(!alreadyLoaded);
  const [loading, setLoading] = useState(0);

  const setIsLoading = (state: boolean) => {
    if (!state) sessionStorage.setItem(SESSION_KEY, "1");
    setIsLoadingState(state);
  };

  const value = { isLoading, setIsLoading, setLoading };

  useEffect(() => {
    if (alreadyLoaded) {
      // Skip loading screen — run entrance animations immediately
      import("../components/utils/initialFX").then((module) => {
        if (module.initialFX) {
          setTimeout(() => module.initialFX(), 100);
        }
      });
      return;
    }

    // On mobile/tablet there is no 3D model to drive the progress bar,
    // so we auto-advance it at the same pace as the desktop interval (1%/30ms).
    if (window.innerWidth <= 1024) {
      let pct = 0;
      const interval = setInterval(() => {
        pct += 1;
        setLoading(pct);
        if (pct >= 100) clearInterval(interval);
      }, 30);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <LoadingContext.Provider value={value as LoadingType}>
      {isLoading && <Loading percent={loading} />}
      <main className="main-body">{children}</main>
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
