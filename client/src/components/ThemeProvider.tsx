import { useAppSelector } from "../redux/hooks";
import { ReactNode } from "react";

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { theme } = useAppSelector((state) => state.theme);
  return (
    <div className={theme}>
      <div className="bg-white text-gray-700 dark:text-gray-200  dark:bg-[rgb(16,23,42)] min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default ThemeProvider;
