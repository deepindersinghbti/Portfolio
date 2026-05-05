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


    const projects = [
        {
            id: 'portfolio',
            title: 'Portfolio Website',
            description: 'Personal portfolio showcasing projects, skills and professional work',
            techs: ['HTML', 'CSS', 'JavaScript'],
            github: 'https://github.com/deepindersinghbti/Portfolio', liveUrl: 'https://deepinder-singh.pages.dev',
            status: null
        },
        {
            id: 'trackleet',
            title: 'TrackLeet',
            description: 'A LeetCode progress tracker to visualize your coding problem-solving journey',
            techs: ['JavaScript', 'HTML', 'CSS', 'REST API'],
            github: 'https://github.com/deepindersinghbti/TrackLeet',
            liveUrl: 'https://trackleet.netlify.app/',
            status: null
        },
        {
            id: 'fairlens',
            title: 'FairLens',
            description: 'An AI-powered platform for detecting bias and fairness in decision systems',
            techs: ['Python', 'FastAPI', 'Next.js', 'Machine learning'],
            github: 'https://github.com/deepindersinghbti/FairLens',
            liveUrl: null, // No live deployment yet
            status: 'In Progress'
        }
    ];

    // SVG Icon Functions
    function getSvgGithub() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>`;
    }

    function getSvgExternalLink() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
        </svg>`;
    }

    function getSvgWrench() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
        </svg>`;
    }

    // Render projects
    function renderProjects() {
        const container = document.getElementById('projects-container');
        if (!container) return;

        container.innerHTML = projects.map(project => {
            const techTagsHtml = project.techs
                .map(tech => `<span class="tech-tag">${tech}</span>`)
                .join('');

            let actionIconsHtml = `
                <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="icon-btn" aria-label="View on GitHub">
                    ${getSvgGithub()}
                </a>
            `;

            if (project.status) {
                // Show disabled wrench only for projects in progress
                actionIconsHtml += `
                    <button class="icon-btn" disabled aria-disabled="true" title="Live demo coming soon">
                        ${getSvgWrench()}
                    </button>
                `;
            } else {
                // Show external link arrow for all others
                actionIconsHtml += `
                    <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="icon-btn" aria-label="View live demo">
                        ${getSvgExternalLink()}
                    </a>
                `;
            }

            const badgeHtml = project.status
                ? `<span class="project-badge">🚧 ${project.status}</span>`
                : '';

            return `
                <article class="project-card" data-project-id="${project.id}">
                    <div class="project-header">
                        <h3 class="project-title">${project.title}</h3>
                        ${badgeHtml}
                    </div>
                    <p class="project-description">${project.description}</p>
                    <div class="project-techs">${techTagsHtml}</div>
                    <div class="project-footer">
                        <div></div>
                        <div class="project-actions">${actionIconsHtml}</div>
                    </div>
                </article>
            `;
        }).join('');
    }

    // Call render on DOM ready
    renderProjects();
});
