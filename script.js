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

    function applyTheme(theme) {
        root.setAttribute("data-theme", theme);
        localStorage.setItem("portfolio-theme", theme);
        const isDark = theme === "dark";
        themeToggle.setAttribute("aria-pressed", String(isDark));
        themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    }

    themeToggle.addEventListener("click", () => {
        const currentTheme = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
        applyTheme(currentTheme === "dark" ? "light" : "dark");
    });

    applyTheme(root.getAttribute("data-theme") || "light");
});
