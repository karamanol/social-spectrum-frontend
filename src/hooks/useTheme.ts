import { useEffect } from "react";

export function useTheme() {
  // Sets dark theme if it was previously enabled
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") document.documentElement.classList.add("dark");
    document.body.classList.add("dark:bg-[#282C34]");
  }, []);
}
