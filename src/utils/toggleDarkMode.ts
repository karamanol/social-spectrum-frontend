export const toggleDarkMode = () => {
  const isSwithcingToDark = document.documentElement.classList.toggle("dark");

  if (isSwithcingToDark) {
    window.localStorage.setItem("theme", "dark");
    return "dark";
  } else {
    window.localStorage.setItem("theme", "light");
    return "light";
  }
};
