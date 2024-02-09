/**
 * Sets the initial theme in localStorage based on the user's system color scheme preference.
 * This function checks the system preference for dark mode and sets the theme in localStorage accordingly.
 * It's used to ensure a consistent theme is applied as soon as possible to avoid a flash of unstyled content (FOUC).
 */
const initiateLocalStorage = (): void => {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
};

/**
 * Initializes the application's dark mode by checking the user's theme preference stored in localStorage.
 * If no preference is found, it sets the theme based on the system's color scheme preference.
 * This function then applies the dark or light theme to the document, effectively preventing a flash of unstyled content (FOUC) related to theme changes.
 * This should be called at the top of the import list without defer to ensure it runs before the rest of the application.
 */
const initializeDarkMode = (): void => {
  const noExistingTheme = localStorage.getItem("theme");

  if (!noExistingTheme) {
    initiateLocalStorage();
  }

  const currentTheme = localStorage.getItem("theme");
  if (currentTheme === "dark") {
    document.documentElement.classList.add("dark-theme");
  } else {
    document.documentElement.classList.remove("dark-theme");
  }
};
initializeDarkMode();
