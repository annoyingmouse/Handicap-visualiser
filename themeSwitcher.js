const calculateSettingAsThemeString = ({
  localStorageTheme,
  systemSettingDark,
}) => {
  if (localStorageTheme !== null) {
    return localStorageTheme;
  }
  if (systemSettingDark.matches) {
    return "dark";
  }
  return "light";
};

(() => {
  const themeSelect = document.getElementById("theme");
  const localStorageTheme = localStorage.getItem("theme");
  const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");
  let currentThemeSetting = calculateSettingAsThemeString({
    localStorageTheme,
    systemSettingDark,
  });

  if (currentThemeSetting === "dark") {
    document.querySelector("html").classList.add("wa-dark");
  } else {
    document.querySelector("html").classList.remove("wa-dark");
  }

  themeSelect.addEventListener("change", (event) => {
    const theme = event.target.value;
    if (theme === "dark") {
      document.querySelector("html").classList.add("wa-dark");
      localStorage.setItem("theme", theme);
    }
    if (theme === "light") {
      document.querySelector("html").classList.remove("wa-dark");
      localStorage.setItem("theme", theme);
    }
    if (theme === "system") {
      if (window.matchMedia("(prefers-color-scheme: dark)")) {
        document.querySelector("html").classList.add("wa-dark");
      } else {
        document.querySelector("html").classList.remove("wa-dark");
      }
      localStorage.removeItem("theme");
    }
  });
})();
