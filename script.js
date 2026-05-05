// Theme initialization
(function () {
    const savedTheme = localStorage.getItem("portfolio-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.setAttribute("data-theme", savedTheme || (prefersDark ? "dark" : "light"));
})();

document.addEventListener("DOMContentLoaded", function () {
    // Hamburger menu functionality
    const hamburger = document.getElementById("hamburger");
    const navItems = document.getElementById("navItems");
    const navLinks = navItems.querySelectorAll("a");

    function closeMenu() {
        navItems.classList.remove("active");
        hamburger.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
    }

    function toggleMenu() {
        const isOpen = navItems.classList.toggle("active");
        hamburger.classList.toggle("active", isOpen);
        hamburger.setAttribute("aria-expanded", String(isOpen));
    }

    hamburger.addEventListener("click", toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
        if (!navItems.contains(event.target) && !hamburger.contains(event.target)) {
            closeMenu();
        }
    });

    // Theme toggle functionality
    const themeToggle = document.getElementById("themeToggle");
    const root = document.documentElement;
    let themeTransitionTimer;

    function runThemeTransitionWindow() {
        root.classList.add("theme-transition");
        clearTimeout(themeTransitionTimer);
        themeTransitionTimer = setTimeout(() => {
            root.classList.remove("theme-transition");
        }, 360);
    }

    function applyTheme(theme) {
        root.setAttribute("data-theme", theme);
        localStorage.setItem("portfolio-theme", theme);
        const isDark = theme === "dark";
        themeToggle.setAttribute("aria-pressed", String(isDark));
        themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    }

    themeToggle.addEventListener("pointerdown", () => {
        themeToggle.classList.add("is-pressing");
    });

    const clearPressState = () => themeToggle.classList.remove("is-pressing");
    themeToggle.addEventListener("pointerup", clearPressState);
    themeToggle.addEventListener("pointercancel", clearPressState);
    themeToggle.addEventListener("pointerleave", clearPressState);

    themeToggle.addEventListener("click", () => {
        runThemeTransitionWindow();
        themeToggle.classList.remove("is-rippling");
        themeToggle.classList.remove("is-popping");
        void themeToggle.offsetWidth;
        themeToggle.classList.add("is-rippling");
        themeToggle.classList.add("is-popping");
        setTimeout(() => {
            themeToggle.classList.remove("is-rippling");
        }, 380);
        setTimeout(() => {
            themeToggle.classList.remove("is-popping");
        }, 320);

        const currentTheme = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
        applyTheme(currentTheme === "dark" ? "light" : "dark");
    });

    applyTheme(root.getAttribute("data-theme") || "light");

    const year = document.getElementById("year");
    if (year) {
        year.textContent = new Date().getFullYear();
    }
});
