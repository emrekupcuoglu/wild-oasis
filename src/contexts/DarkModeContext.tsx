import { createContext, useEffect } from "react";
import { useLocalStorageState } from "../hooks/useLocalStorageState";

interface DarkModeContextProps {
  isDarkMode: boolean;
  toggleDarkMode: (() => void) | null;
}
const DarkModeContext = createContext<DarkModeContextProps | undefined>(
  undefined
);

function DarkModeProvider({
  children,
}: {
  children: React.ReactElement | React.ReactElement[];
}) {
  const { value: isDarkMode, setValue: setIsDarkMode } = useLocalStorageState(
    // false,
    window.matchMedia("(prefers-color-scheme: dark)").matches,
    "isDarkMode"
  );

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark-mode");
      document.documentElement.classList.remove("light-mode");
    } else {
      document.documentElement.classList.add("light-mode");
      document.documentElement.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  function toggleDarkMode() {
    setIsDarkMode((prev) => !prev);
  }
  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export { DarkModeContext };
export default DarkModeProvider;
