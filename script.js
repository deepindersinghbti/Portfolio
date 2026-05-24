// Theme initialization
const themeStorageKey = "portfolio-theme";
const systemThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
const root = document.documentElement;
let userThemePreference = localStorage.getItem(themeStorageKey);
let appliedTheme = "light";
let themeTransitionTimer;
let themeSelector;
let themeButtons = {};

function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}

userThemePreference = userThemePreference === "light" || userThemePreference === "dark" || userThemePreference === "system"
    ? userThemePreference
    : "system";

function runThemeTransitionWindow() {
    root.classList.add("theme-transition");
    clearTimeout(themeTransitionTimer);
    themeTransitionTimer = setTimeout(() => {
        root.classList.remove("theme-transition");
    }, 360);
}

function updateThemeButtons() {
    if (!themeSelector) return;

    const buttonStates = {
        light: userThemePreference === "light",
        dark: userThemePreference === "dark",
        system: userThemePreference === "system"
    };

    themeButtons.light?.classList.toggle("is-active", buttonStates.light);
    themeButtons.dark?.classList.toggle("is-active", buttonStates.dark);
    themeButtons.system?.classList.toggle("is-active", buttonStates.system);

    themeButtons.light?.setAttribute("aria-pressed", String(buttonStates.light));
    themeButtons.dark?.setAttribute("aria-pressed", String(buttonStates.dark));
    themeButtons.system?.setAttribute("aria-pressed", String(buttonStates.system));
    themeSelector.dataset.themePreference = userThemePreference;
}

function applyThemePreference(preference, options = {}) {
    const { animate = true, save = true } = options;

    userThemePreference = preference;
    appliedTheme = preference === "system" ? getSystemTheme() : preference;

    if (save) {
        localStorage.setItem(themeStorageKey, preference);
    }

    root.setAttribute("data-theme", appliedTheme);

    if (animate) {
        runThemeTransitionWindow();
    }

    updateThemeButtons();
}

applyThemePreference(userThemePreference, { animate: false });

if (typeof systemThemeQuery.addEventListener === "function") {
    systemThemeQuery.addEventListener("change", () => {
        if (userThemePreference === "system") {
            applyThemePreference("system", { animate: true, save: false });
        }
    });
} else if (typeof systemThemeQuery.addListener === "function") {
    systemThemeQuery.addListener(() => {
        if (userThemePreference === "system") {
            applyThemePreference("system", { animate: true, save: false });
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const skillCategories = [
        {
            name: "Frontend",
            skills: [
                { name: "HTML & CSS", iconClasses: ["fa-brands fa-html5", "fa-brands fa-css3-alt"] },
                { name: "JavaScript", iconClass: "fa-brands fa-js" },
                { name: "Next.js", iconType: "asset", assetPath: "assets/nextjs.svg" }
            ]
        },
        {
            name: "Backend",
            skills: [
                { name: "Python", iconClass: "fa-brands fa-python" },
                { name: "FastAPI", iconClass: "fa-solid fa-server", context: "Used in VibeGuard & FairLens" },
                { name: "REST APIs", iconClass: "fa-solid fa-network-wired" }
            ]
        },
        {
            name: "Database",
            skills: [
                { name: "MongoDB", iconType: "asset", assetPath: "assets/mongodb.svg", context: "Used in PIXEL project" }
            ]
        },
        {
            name: "DevOps / Deployment",
            skills: [
                { name: "Cloud & Deployment", iconClass: "fa-solid fa-cloud-arrow-up", context: "Deployed on Cloudflare, Vercel & Render" },
                { name: "AWS Fundamentals", iconClass: "fa-brands fa-aws" }
            ]
        },
        {
            name: "Tools",
            skills: [
                { name: "Git & GitHub", iconClass: "fa-brands fa-github" }
            ]
        }
    ];

    function createSkillIcon(skill) {
        if (skill.iconClasses) {
            const iconGroup = document.createElement("span");
            iconGroup.className = "skill-icon-group";
            iconGroup.setAttribute("aria-hidden", "true");

            skill.iconClasses.forEach((iconClass) => {
                const icon = document.createElement("i");
                icon.className = iconClass;
                iconGroup.appendChild(icon);
            });

            return iconGroup;
        }

        if (skill.iconType === "asset") {
            const iconAsset = document.createElement("span");
            iconAsset.className = "skill-asset-icon";
            iconAsset.setAttribute("aria-hidden", "true");
            iconAsset.style.setProperty("--skill-icon-asset", `url("${skill.assetPath}")`);
            return iconAsset;
        }

        const icon = document.createElement("i");
        icon.className = skill.iconClass;
        icon.setAttribute("aria-hidden", "true");
        return icon;
    }

    function renderSkills() {
        const skillsContainer = document.getElementById("skillsContainer");
        if (!skillsContainer) return;

        const fragment = document.createDocumentFragment();

        skillCategories.forEach((category) => {
            const categorySection = document.createElement("section");
            categorySection.className = "skill-category";

            const headingId = `skill-category-${category.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
            const heading = document.createElement("h2");
            heading.className = "skill-category-title";
            heading.id = headingId;
            heading.textContent = category.name;

            const grid = document.createElement("div");
            grid.className = `skills-boxes skills-boxes--count-${category.skills.length}`;
            grid.setAttribute("aria-labelledby", headingId);

            category.skills.forEach((skill) => {
                const skillCard = document.createElement("div");
                skillCard.className = "skillBox";

                const text = document.createElement("span");
                text.className = "skill-text";

                const label = document.createElement("span");
                label.className = "skill-label";
                label.textContent = skill.name;

                text.appendChild(label);

                if (skill.context) {
                    const context = document.createElement("span");
                    context.className = "skill-context";
                    context.textContent = skill.context;
                    text.appendChild(context);
                }

                skillCard.appendChild(createSkillIcon(skill));
                skillCard.appendChild(text);
                grid.appendChild(skillCard);
            });

            categorySection.appendChild(heading);
            categorySection.appendChild(grid);
            fragment.appendChild(categorySection);
        });

        skillsContainer.innerHTML = "";
        skillsContainer.appendChild(fragment);
    }

    renderSkills();

    // ================= SCROLL REVEAL ANIMATIONS =================
    // Intersection Observer for scroll reveal animations
    const revealElements = () => {
        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (prefersReducedMotion) {
            // If reduced motion is preferred, just show all elements immediately
            document.querySelectorAll('.reveal').forEach(el => {
                el.classList.add('is-visible');
            });
            return;
        }

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Optionally unobserve to prevent re-triggering
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Add reveal class and observe elements
        const elementsToReveal = [
            '.section-heading',
            '.about-text',
            '.statBlock',
            '.achievement-card',
            '.project-card',
            '.skillBox',
            '.certification-card',
            '.social-card',
            '.contact-form'
        ];

        elementsToReveal.forEach(selector => {
            document.querySelectorAll(selector).forEach((el, index) => {
                el.classList.add('reveal');
                // Add stagger delay classes for groups (0-4 index)
                el.classList.add(`stagger-${(index % 5) + 1}`);
                observer.observe(el);
            });
        });
    };

    // Call after DOM is ready
    revealElements();

    // ================= NAVBAR SCROLL BEHAVIOR =================
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        // Add 'scrolled' class when scrolled down more than a threshold
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    }, { passive: true });

    // ================= HAMBURGER MENU FUNCTIONALITY =================
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

    // Theme selector functionality
    themeSelector = document.getElementById("themeSelector");
    themeButtons = {
        light: document.getElementById("themeBtnLight"),
        dark: document.getElementById("themeBtnDark"),
        system: document.getElementById("themeBtnSystem")
    };

    const clearPressState = () => themeSelector?.classList.remove("is-pressing");

    function triggerThemeSelectorAnimation() {
        if (!themeSelector) return;

        themeSelector.classList.remove("is-rippling");
        themeSelector.classList.remove("is-popping");
        void themeSelector.offsetWidth;
        themeSelector.classList.add("is-rippling");
        themeSelector.classList.add("is-popping");
        setTimeout(() => {
            themeSelector.classList.remove("is-rippling");
        }, 380);
        setTimeout(() => {
            themeSelector.classList.remove("is-popping");
        }, 320);
    }

    const themeOptions = [
        [themeButtons.light, "light"],
        [themeButtons.dark, "dark"],
        [themeButtons.system, "system"]
    ];

    themeOptions.forEach(([button, preference]) => {
        if (!button) return;

        button.addEventListener("pointerdown", () => {
            themeSelector?.classList.add("is-pressing");
        });
        button.addEventListener("pointerup", clearPressState);
        button.addEventListener("pointercancel", clearPressState);
        button.addEventListener("pointerleave", clearPressState);
        button.addEventListener("click", () => {
            triggerThemeSelectorAnimation();
            applyThemePreference(preference);
        });
    });

    updateThemeButtons();

    const year = document.getElementById("year");
    if (year) {
        year.textContent = new Date().getFullYear();
    }


    const projects = [
        {
            id: 'fairlens',
            title: 'FairLens',
            description: "Identifies bias in datasets and machine learning models with visual analytics and AI-driven insights.",
            techs: ['Python', 'FastAPI', 'Next.js', 'Machine learning'],
            github: 'https://github.com/deepindersinghbti/FairLens',
            liveUrl: 'https://deepinder-fairlens.vercel.app/',
            caseStudyUrl: 'projects/fairlens-case-study.html',
            status: null,
            featuredLabel: 'Flagship Project',
            featuredLevel: 'primary',
            details: {
                subtitle: 'AI-powered bias and fairness analysis platform for datasets and machine learning outputs.',
                overview: 'FairLens is a full-stack web application that helps detect and explain bias in datasets and model predictions. It allows users to upload CSV files, choose target and sensitive columns, visualize fairness-related metrics, and generate AI-assisted insights to better understand potential unfairness in decision-making systems.',
                whatItDoes: [
                    'Accepts CSV dataset uploads',
                    'Allows users to select target, sensitive, and optional prediction columns',
                    'Supports dataset-level and model-output fairness analysis',
                    'Calculates group-wise fairness metrics',
                    'Visualizes bias patterns using charts',
                    'Generates AI-assisted fairness insights',
                    'Provides downloadable reports for analysis results'
                ],
                whyBuilt: 'I built FairLens for an online hackathon focused on using AI to solve meaningful problems. The goal was to create a practical tool that makes fairness analysis easier to understand for students, developers, and non-experts working with datasets or machine learning systems.',
                techStack: ['Next.js', 'FastAPI', 'Python', 'Machine Learning', 'Gemini API', 'Recharts', 'CSV Processing', 'Vercel', 'Render'],
                keyLearning: 'This project helped me understand how fairness metrics can be applied in real applications. It also improved my skills in full-stack development, CSV handling, data visualization, AI integration, frontend validation, API design, deployment, and building user-friendly explanations for technical concepts.'
            }
        },
        {
            id: 'vibeguard-ai',
            title: 'VibeGuard AI',
            description: 'AI-powered code security scanner that detects vulnerabilities in GitHub repositories and ZIP uploads with clear explanations and severity-based results.',
            techs: ['Next.js', 'FastAPI', 'Python', 'AI', 'Security'],
            github: 'https://github.com/deepindersinghbti/VibeGuard-AI',
            liveUrl: 'https://vibeguard-ai.vercel.app/',
            status: null,
            featuredLabel: 'Featured',
            featuredLevel: 'secondary',
            details: {
                subtitle: 'AI-powered code security scanner for GitHub repositories and ZIP file uploads.',
                overview: 'VibeGuard AI is a full-stack security scanning platform that helps developers detect risky code patterns, exposed secrets, insecure configurations, and common vulnerability indicators in GitHub repositories and uploaded ZIP files.',
                whatItDoes: [
                    'Scans public GitHub repositories using a repository URL',
                    'Supports ZIP file upload with drag-and-drop',
                    'Detects security issues using rule-based scanners',
                    'Displays severity-based findings',
                    'Provides clear explanations for detected issues',
                    'Uses AI-assisted explanations to help developers understand vulnerabilities faster'
                ],
                whyBuilt: 'VibeGuard AI began as a hackathon project, but I later rebuilt it from scratch to turn the idea into a cleaner, more reliable, and production-ready security tool. The rebuild helped me focus deeply on UX, deployment, file upload handling, API design, and practical code security scanning.',
                techStack: ['Next.js', 'FastAPI', 'Python', 'AI Integration', 'Security Scanning', 'Vercel', 'Render'],
                keyLearning: 'This project helped me improve my understanding of full-stack development, API integration, deployment, code security, file upload handling, and building polished user-facing developer tools.'
            }
        },
        {
            id: 'pixel-sankalp',
            title: 'PIXEL / SANKALP Collaboration Platform',
            cardTitleHtml: '<span class="project-title-nowrap">PIXEL / SANKALP</span><span>Collaboration Platform</span>',
            description: "A full-stack collaboration platform for managing proposals, voting, and project workflows within a developer community.",
            techs: ['Next.js', 'MongoDB', 'Supabase Auth', 'RBAC', 'Project Management'],
            github: 'https://github.com/S-A-N-K-A-L-P/project_collab_sankalap',
            liveUrl: 'https://project-syncroo.netlify.app/',
            linkedin: 'https://www.linkedin.com/company/sankalp001/',
            status: 'Collaborative Project',
            actions: [
                { label: 'GitHub', url: 'https://github.com/S-A-N-K-A-L-P/project_collab_sankalap', icon: 'github' },
                { label: 'Live Demo', url: 'https://project-syncroo.netlify.app/', icon: 'external', primary: true },
                { label: 'LinkedIn', url: 'https://www.linkedin.com/company/sankalp001/', icon: 'linkedin' }
            ],
            details: {
                title: 'PIXEL Project Management System',
                subtitle: 'A collaborative project management platform for PIXEL, designed to manage student project proposals, discussions, and team workflow. I contributed by improving the existing system through new interaction features, editing functionality, bug fixes, and UI customization.',
                sections: [
                    {
                        title: 'Overview',
                        content: 'PIXEL was originally designed and architected by a senior as a project management system for student project proposals, discussions, and team workflow. My role was to improve and extend the existing platform through focused feature additions, bug fixes, and UI customization.'
                    },
                    {
                        title: 'My Contributions',
                        items: [
                            'Fixed the logout button issue so users could reliably sign out of the platform.',
                            'Added a proposal comment system to support discussion and feedback.',
                            'Implemented nested replies on comments, supporting up to 3 levels of replies.',
                            'Added an edit proposal feature so users could update submitted proposals.',
                            'Fixed a bug where the original comment disappeared while attempting to edit it.',
                            'Added a theme switcher to improve personalization and user experience.'
                        ]
                    },
                    {
                        title: 'Tech/Context',
                        content: 'Built on an existing Next.js and MongoDB-based project management system. My work focused on feature development, bug fixing, UI improvements, and improving collaboration workflows.'
                    }
                ]
            }
        },
        {
            id: 'trackleet',
            title: 'TrackLeet',
            description: 'A LeetCode progress tracker to visualize your coding problem-solving journey',
            techs: ['JavaScript', 'HTML', 'CSS', 'REST API'],
            github: 'https://github.com/deepindersinghbti/TrackLeet',
            liveUrl: 'https://trackleet.pages.dev/',
            status: null,
            details: {
                subtitle: "Tracks and visualizes LeetCode progress with clean analytics to monitor consistency and performance.",
                overview: 'TrackLeet is a beginner-friendly web project that allows users to enter a LeetCode username and view basic coding statistics fetched from an external API. It was built using vanilla HTML, CSS, and JavaScript as one of my early projects while learning responsive UI design, API usage, and DOM manipulation.',
                whatItDoes: [
                    'Takes a LeetCode username as input',
                    'Fetches user statistics from an API',
                    'Displays coding profile data in a simple UI',
                    'Provides a responsive layout for different screen sizes',
                    'Demonstrates basic frontend interaction using JavaScript'
                ],
                whyBuilt: 'I built TrackLeet while learning web development to practice creating a responsive interface and working with APIs. It was not intended to be a complex or production-level application, but it helped me understand how real websites can fetch data dynamically and update the UI based on user input.',
                techStack: ['HTML', 'CSS', 'JavaScript', 'API Integration', 'Responsive Design', 'Cloudflare Pages'],
                keyLearning: 'This project helped me strengthen my fundamentals in frontend development, especially handling user input, making API requests, updating the DOM, designing a simple responsive layout, and deploying a static website online.'
            }
        },
        {
            id: 'portfolio',
            title: 'Portfolio Website',
            description: 'Personal portfolio showcasing projects, skills and professional work',
            techs: ['HTML', 'CSS', 'JavaScript'],
            github: 'https://github.com/deepindersinghbti/Portfolio', liveUrl: 'https://deepinder-singh.pages.dev',
            status: null,
            details: {
                subtitle: "A responsive developer portfolio showcasing projects, skills, and interactive UI with modern design principles.",
                overview: 'This portfolio website is my personal space on the web, designed to showcase my projects, technical skills, learning journey, and contact information in a clean and accessible way. It was built with vanilla HTML, CSS, and JavaScript, with a strong focus on responsive design, theme support, smooth interactions, and a polished user experience.',
                whatItDoes: [
                    'Showcases my featured projects',
                    'Provides GitHub and live project links',
                    'Includes detailed project modals',
                    'Supports light, dark, and system theme modes',
                    'Uses a responsive layout for mobile, tablet, and desktop',
                    'Includes a contact form for reaching out',
                    'Presents my skills and developer profile in one place'
                ],
                whyBuilt: 'I built this portfolio to create a professional online presence and present my work beyond just GitHub repositories. It also became a practical project where I could improve my frontend fundamentals, experiment with UI design, polish responsive layouts, and gradually evolve the site as I build better projects.',
                techStack: ['HTML', 'CSS', 'JavaScript', 'Responsive Design', 'Theme Switching', 'Web3Forms', 'Cloudflare Pages'],
                keyLearning: 'This project helped me improve my understanding of layout design, responsive navigation, theme handling, accessibility, deployment, contact form integration, and presenting projects in a way that feels clean, professional, and easy to explore.'
            }
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

    function getSvgLinkedIn() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V8.98h3.42v1.57h.05c.48-.9 1.64-1.85 3.37-1.85 3.61 0 4.28 2.38 4.28 5.47v6.28ZM5.32 7.41a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.1 20.45H3.53V8.98H7.1v11.47ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z"/>
        </svg>`;
    }

    function getSvgWrench() {
        return `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
        </svg>`;
    }

    function getProjectActionIcon(icon) {
        if (icon === 'github') return getSvgGithub();
        if (icon === 'linkedin') return getSvgLinkedIn();
        return getSvgExternalLink();
    }

    function getActionTooltip(icon) {
        if (icon === 'github') return 'View Code';
        if (icon === 'linkedin') return 'Project LinkedIn Page';
        return 'Live Demo';
    }

    function getProjectActions(project) {
        if (project.actions) {
            return project.actions;
        }

        const actions = [
            { label: 'View GitHub', url: project.github, icon: 'github', primary: true },
            { label: 'Visit Live Project', url: project.liveUrl, icon: 'external' }
        ];

        if (project.caseStudyUrl) {
            actions.push({ label: 'Read Case Study', url: project.caseStudyUrl, icon: 'external' });
        }

        return actions;
    }

    const projectModalId = 'projectDetailsModal';
    let activeProject = null;
    let previouslyFocusedElement = null;
    let modalScrollLockState = null;
    let modalCloseTimer = null;

    function lockBodyScroll() {
        if (modalScrollLockState || !document.body || !document.documentElement) return;

        modalScrollLockState = {
            overflow: document.body.style.overflow,
            htmlOverflow: document.documentElement.style.overflow
        };

        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
    }

    function unlockBodyScroll() {
        if (!modalScrollLockState || !document.body || !document.documentElement) return;

        const { overflow, htmlOverflow } = modalScrollLockState;

        document.body.style.overflow = overflow;
        document.documentElement.style.overflow = htmlOverflow;

        modalScrollLockState = null;
    }

    function cleanupProjectModalState() {
        const modal = document.getElementById(projectModalId);

        if (modal) {
            modal.classList.remove('is-open', 'is-closing');
            modal.removeAttribute('data-active-project');
            modal.hidden = true;
        }

        clearTimeout(modalCloseTimer);
        document.removeEventListener('keydown', handleProjectModalKeydown);
        unlockBodyScroll();
        activeProject = null;
    }

    function createProjectModal() {
        if (document.getElementById(projectModalId)) return;

        const modal = document.createElement('div');
        modal.id = projectModalId;
        modal.className = 'project-modal';
        modal.hidden = true;
        modal.innerHTML = `
            <div class="project-modal__overlay" data-project-modal-close></div>
            <section class="project-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="projectModalTitle" aria-describedby="projectModalSubtitle" tabindex="-1">
                <button class="project-modal__close" type="button" aria-label="Close VibeGuard AI details" data-project-modal-close>
                    <span aria-hidden="true">&times;</span>
                </button>
                <div class="project-modal__content"></div>
            </section>
        `;

        document.body.appendChild(modal);

        modal.addEventListener('click', (event) => {
            if (event.target.closest('[data-project-modal-close]')) {
                closeProjectModal();
            }
        });
    }

    function renderProjectModalContent(project) {
        const details = project.details;
        const modalContent = document.querySelector(`#${projectModalId} .project-modal__content`);
        const modalCloseButton = document.querySelector(`#${projectModalId} .project-modal__close`);
        if (!details || !modalContent) return;
        const modalTitle = details.title || project.title;

        if (modalCloseButton) {
            modalCloseButton.setAttribute('aria-label', `Close ${modalTitle} details`);
        }

        const sectionsHtml = details.sections
            ? details.sections.map((section) => {
                const bodyHtml = section.tags
                    ? `<div class="modal-tech-list">${section.tags.map(tech => `<span class="modal-tech-tag">${tech}</span>`).join('')}</div>`
                    : section.items
                        ? `<ul>${section.items.map(item => `<li>${item}</li>`).join('')}</ul>`
                        : `<p>${section.content}</p>`;

                return `
                    <section class="project-modal__section">
                        <h3>${section.title}</h3>
                        ${bodyHtml}
                    </section>
                `;
            }).join('')
            : `
                <section class="project-modal__section">
                    <h3>Overview</h3>
                    <p>${details.overview}</p>
                </section>

                <section class="project-modal__section">
                    <h3>What it does</h3>
                    <ul>${details.whatItDoes.map(item => `<li>${item}</li>`).join('')}</ul>
                </section>

                <section class="project-modal__section">
                    <h3>Why I built it</h3>
                    <p>${details.whyBuilt}</p>
                </section>

                <section class="project-modal__section">
                    <h3>Tech stack</h3>
                    <div class="modal-tech-list">${details.techStack.map(tech => `<span class="modal-tech-tag">${tech}</span>`).join('')}</div>
                </section>

                <section class="project-modal__section">
                    <h3>Key learning</h3>
                    <p>${details.keyLearning}</p>
                </section>
            `;
        const modalActionsHtml = getProjectActions(project)
            .map(action => `<a class="project-modal__button${action.primary ? ' project-modal__button--primary' : ''}" href="${action.url}" target="_blank" rel="noopener noreferrer">${action.label}</a>`)
            .join('');

        modalContent.innerHTML = `
            <div class="project-modal__header">
                <h2 id="projectModalTitle">${modalTitle}</h2>
                <p id="projectModalSubtitle">${details.subtitle}</p>
            </div>

            <div class="project-modal__body">
                ${sectionsHtml}
            </div>

            <div class="project-modal__actions">
                ${modalActionsHtml}
            </div>
        `;
    }

    function getFocusableModalElements() {
        const modal = document.getElementById(projectModalId);
        if (!modal || modal.hidden) return [];

        return Array.from(modal.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'))
            .filter(element => element.offsetParent !== null);
    }

    function getProjectModalTransitionDuration(element) {
        const styles = window.getComputedStyle(element);
        const durations = styles.transitionDuration.split(',');
        const delays = styles.transitionDelay.split(',');

        return durations.reduce((longestDuration, duration, index) => {
            const delay = delays[index] || delays[delays.length - 1] || '0s';
            const totalDuration = parseCssTime(duration) + parseCssTime(delay);
            return Math.max(longestDuration, totalDuration);
        }, 0);
    }

    function parseCssTime(value) {
        const time = Number.parseFloat(value);
        if (Number.isNaN(time)) return 0;
        return value.trim().endsWith('ms') ? time : time * 1000;
    }

    function handleProjectModalKeydown(event) {
        if (!activeProject) return;

        if (event.key === 'Escape') {
            closeProjectModal();
            return;
        }

        if (event.key !== 'Tab') return;

        const focusableElements = getFocusableModalElements();
        if (!focusableElements.length) return;

        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstFocusable) {
            event.preventDefault();
            lastFocusable.focus();
        } else if (!event.shiftKey && document.activeElement === lastFocusable) {
            event.preventDefault();
            firstFocusable.focus();
        }
    }

    function openProjectModal(projectId, triggerElement) {
        const project = projects.find(item => item.id === projectId && item.details);
        const modal = document.getElementById(projectModalId);
        const dialog = modal?.querySelector('.project-modal__dialog');
        if (!project || !modal || !dialog) return;

        clearTimeout(modalCloseTimer);
        modal.classList.remove('is-closing');
        modal.dataset.activeProject = project.id;
        activeProject = project;
        previouslyFocusedElement = triggerElement || document.activeElement;
        renderProjectModalContent(project);

        modal.hidden = false;
        lockBodyScroll();
        document.addEventListener('keydown', handleProjectModalKeydown);

        requestAnimationFrame(() => {
            modal.classList.add('is-open');
            dialog.focus();
        });
    }

    function closeProjectModal() {
        const modal = document.getElementById(projectModalId);
        const dialog = modal?.querySelector('.project-modal__dialog');
        if (!modal || !dialog || !activeProject || modal.classList.contains('is-closing')) return;

        const handleDialogTransitionEnd = (event) => {
            if (event.target === dialog && event.propertyName === 'transform') {
                finishClose();
            }
        };

        const finishClose = () => {
            clearTimeout(modalCloseTimer);
            dialog.removeEventListener('transitionend', handleDialogTransitionEnd);
            modal.classList.remove('is-open', 'is-closing');
            modal.removeAttribute('data-active-project');
            modal.hidden = true;
            document.removeEventListener('keydown', handleProjectModalKeydown);
            unlockBodyScroll();
            activeProject = null;

            if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === 'function') {
                previouslyFocusedElement.focus({ preventScroll: true });
            }
        };

        modal.classList.add('is-closing');
        modal.classList.remove('is-open');
        dialog.addEventListener('transitionend', handleDialogTransitionEnd);
        modalCloseTimer = setTimeout(finishClose, getProjectModalTransitionDuration(dialog) + 50);
    }

    // Render projects
    function renderProjects() {
        const container = document.getElementById('projects-container');
        if (!container) return;

        container.innerHTML = projects.map(project => {
            const techTagsHtml = project.techs
                .map(tech => `<span class="tech-tag">${tech}</span>`)
                .join('');

            const actionIconsHtml = project.actions
                ? project.actions.map(action => `
                    <a href="${action.url}" target="_blank" rel="noopener noreferrer" class="icon-btn" aria-label="${getActionTooltip(action.icon)}" title="${getActionTooltip(action.icon)}">
                        ${getProjectActionIcon(action.icon)}
                    </a>
                `).join('')
                : `
                <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="icon-btn" aria-label="View Code" title="View Code">
                    ${getSvgGithub()}
                </a>
                ${project.status === 'In Progress'
                    ? `<button class="icon-btn" disabled aria-disabled="true" title="Live demo coming soon">${getSvgWrench()}</button>`
                    : `<a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="icon-btn" aria-label="Live Demo" title="Live Demo">${getSvgExternalLink()}</a>`
                }
            `;

            const badgeIcon = project.status === 'In Progress' ? '🚧' : '🏆';
            const badgeClass = project.status === 'Ideathon Winner'
                ? 'project-badge project-badge--winner'
                : project.status === 'Collaborative Project'
                    ? 'project-badge project-badge--collaborative'
                    : 'project-badge';
            const badgeHtml = project.status
                ? `<span class="${badgeClass}">${project.status === 'Collaborative Project' ? '<i class="fa-solid fa-users"></i><span>Collaborative Project</span>' : `${badgeIcon} ${project.status}`}</span>`
                : '';
            const featuredBadgeHtml = project.featuredLabel
                ? `<span class="project-badge project-badge--featured">${project.featuredLabel}</span>`
                : '';
            const detailButtonHtml = project.details
                ? `<button class="project-details-btn" type="button" data-project-details="${project.id}">View Details</button>`
                : '';
            const caseStudyButtonHtml = project.caseStudyUrl
                ? `<a class="project-details-btn project-details-btn--secondary" href="${project.caseStudyUrl}">Read Case Study</a>`
                : '';
            const cardTitleHtml = project.cardTitleHtml || project.title;
            const featuredLevelAttr = project.featuredLevel ? ` data-featured-level="${project.featuredLevel}"` : '';

            return `
                <article class="project-card" data-project-id="${project.id}"${featuredLevelAttr}>
                    <div class="project-header">
                        <h3 class="project-title">${cardTitleHtml}</h3>
                        ${featuredBadgeHtml}
                        ${badgeHtml}
                    </div>
                    <p class="project-description">${project.description}</p>
                    <div class="project-techs">${techTagsHtml}</div>
                    <div class="project-footer">
                        <div class="project-footer__detail">${detailButtonHtml}${caseStudyButtonHtml}</div>
                        <div class="project-actions">${actionIconsHtml}</div>
                    </div>
                </article>
            `;
        }).join('');
    }

    // Call render on DOM ready
    renderProjects();
    createProjectModal();
    window.addEventListener('pagehide', cleanupProjectModalState);
    window.addEventListener('beforeunload', cleanupProjectModalState);

    document.getElementById('projects-container')?.addEventListener('click', (event) => {
        const detailsButton = event.target.closest('[data-project-details]');
        if (!detailsButton) return;

        openProjectModal(detailsButton.dataset.projectDetails, detailsButton);
    });

    // Apply reveal animations to dynamically rendered project cards
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!prefersReducedMotion) {
        const projectCards = document.querySelectorAll('.project-card');
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const projectObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    projectObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        projectCards.forEach((card, index) => {
            card.classList.add('reveal', `stagger-${(index % 5) + 1}`);
            projectObserver.observe(card);
        });
    } else {
        // If reduced motion, just show all project cards
        document.querySelectorAll('.project-card').forEach(card => {
            card.classList.add('is-visible');
        });
    }

    const contactForm = document.querySelector(".contact-form");
    const contactStatus = document.getElementById("contactStatus");
    const sendButton = document.querySelector(".send-btn");
    const messageTextarea = document.getElementById("message-box");

    function resizeMessageTextarea() {
        if (!messageTextarea) return;

        messageTextarea.style.height = "auto";
        messageTextarea.style.height = Math.min(messageTextarea.scrollHeight, 340) + "px";
    }

    if (messageTextarea) {
        messageTextarea.addEventListener("input", resizeMessageTextarea);
        window.addEventListener("load", resizeMessageTextarea);
        resizeMessageTextarea();
    }

    if (contactForm && contactStatus && sendButton) {
        const originalButtonHTML = sendButton.innerHTML;
        let isSubmitting = false;
        let hideStatusTimer;
        let buttonResetTimer;

        const statusIcon = contactStatus.querySelector(".contact-status-card__icon i");
        const statusEyebrow = contactStatus.querySelector(".contact-status-card__eyebrow");
        const statusTitle = contactStatus.querySelector(".contact-status-card__title");
        const statusText = contactStatus.querySelector(".contact-status-card__text");

        function setButtonState({ disabled, html }) {
            sendButton.disabled = disabled;
            sendButton.setAttribute("aria-disabled", String(disabled));
            if (html !== undefined) {
                sendButton.innerHTML = html;
            }
        }

        function clearStatusTimers() {
            clearTimeout(hideStatusTimer);
            clearTimeout(buttonResetTimer);
        }

        function setStatusVisible(isVisible) {
            contactStatus.hidden = false;
            contactStatus.classList.toggle("is-visible", isVisible);
            contactStatus.classList.toggle("is-hiding", !isVisible);
        }

        function hideStatusCard() {
            contactStatus.classList.remove("is-visible");
            contactStatus.classList.add("is-hiding");
            clearTimeout(hideStatusTimer);
            hideStatusTimer = setTimeout(() => {
                contactStatus.hidden = true;
            }, 260);
        }

        function showStatus(type) {
            contactStatus.dataset.state = type;
            setStatusVisible(true);

            if (type === "loading") {
                statusIcon.className = "fa-solid fa-circle-notch fa-spin";
                statusEyebrow.textContent = "Sending";
                statusTitle.textContent = "Sending your message";
                statusText.textContent = "Please wait while we deliver it securely.";
                return;
            }

            if (type === "success") {
                statusIcon.className = "fa-solid fa-circle-check";
                statusEyebrow.textContent = "Success";
                statusTitle.textContent = "Message sent successfully 🚀";
                statusText.textContent = "Thanks for reaching out! I’ll get back to you soon.";
                return;
            }

            statusIcon.className = "fa-solid fa-triangle-exclamation";
            statusEyebrow.textContent = "Error";
            statusTitle.textContent = "Something went wrong";
            statusText.textContent = "Please try again. Your message is still saved in the form.";
        }

        function restoreButton() {
            setButtonState({ disabled: false, html: originalButtonHTML });
            contactForm.setAttribute("aria-busy", "false");
            isSubmitting = false;
        }

        function scheduleHideStatus(delay) {
            clearTimeout(hideStatusTimer);
            hideStatusTimer = setTimeout(() => {
                hideStatusCard();
            }, delay);
        }

        contactForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            if (isSubmitting) {
                return;
            }

            clearStatusTimers();
            isSubmitting = true;
            contactForm.setAttribute("aria-busy", "true");
            setButtonState({
                disabled: true,
                html: '<i class="fa-solid fa-circle-notch fa-spin" aria-hidden="true"></i> Sending...'
            });

            try {
                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    body: new FormData(contactForm)
                });

                const result = await response.json().catch(() => ({}));

                if (!response.ok || result.success === false) {
                    throw new Error(result.message || "Something went wrong. Please try again.");
                }

                contactForm.reset();
                // Show success card
                showStatus("success");
                // Temporarily show 'Sent' on the button, then restore
                setButtonState({
                    disabled: true,
                    html: '<i class="fa-solid fa-circle-check" aria-hidden="true"></i> Sent'
                });
                // Auto-hide success card after ~3.8s
                scheduleHideStatus(3800);
                // Restore button after 1.2s
                clearTimeout(buttonResetTimer);
                buttonResetTimer = setTimeout(() => {
                    restoreButton();
                }, 1200);
            } catch (error) {
                showStatus("error");
                statusText.textContent = error.message || "Something went wrong. Please try again.";
                clearTimeout(buttonResetTimer);
                restoreButton();
            }
        });
    }
});
