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
            '.about-img',
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
            id: 'vibeguard-ai',
            title: 'VibeGuard AI',
            description: 'AI-powered code security scanner that detects vulnerabilities in GitHub repositories and ZIP uploads with clear explanations and severity-based results.',
            techs: ['Next.js', 'FastAPI', 'Python', 'AI', 'Security'],
            github: 'https://github.com/deepindersinghbti/VibeGuard-AI',
            liveUrl: 'https://vibeguard-ai.vercel.app/',
            status: null,
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
            id: 'fairlens',
            title: 'FairLens',
            description: 'An AI-powered platform for detecting bias and fairness in decision systems',
            techs: ['Python', 'FastAPI', 'Next.js', 'Machine learning'],
            github: 'https://github.com/deepindersinghbti/FairLens',
            liveUrl: 'https://deepinder-fairlens.vercel.app/',
            status: null,
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
            id: 'trackleet',
            title: 'TrackLeet',
            description: 'A LeetCode progress tracker to visualize your coding problem-solving journey',
            techs: ['JavaScript', 'HTML', 'CSS', 'REST API'],
            github: 'https://github.com/deepindersinghbti/TrackLeet',
            liveUrl: 'https://trackleet.pages.dev/',
            status: null
        },
        {
            id: 'portfolio',
            title: 'Portfolio Website',
            description: 'Personal portfolio showcasing projects, skills and professional work',
            techs: ['HTML', 'CSS', 'JavaScript'],
            github: 'https://github.com/deepindersinghbti/Portfolio', liveUrl: 'https://deepinder-singh.pages.dev',
            status: null
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

    const projectModalId = 'projectDetailsModal';
    let activeProject = null;
    let previouslyFocusedElement = null;
    let modalScrollLockState = null;

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
            modal.classList.remove('is-open');
            modal.hidden = true;
        }

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

        if (modalCloseButton) {
            modalCloseButton.setAttribute('aria-label', `Close ${project.title} details`);
        }

        const whatItDoesHtml = details.whatItDoes.map(item => `<li>${item}</li>`).join('');
        const techStackHtml = details.techStack.map(tech => `<span class="modal-tech-tag">${tech}</span>`).join('');

        modalContent.innerHTML = `
            <div class="project-modal__header">
                <h2 id="projectModalTitle">${project.title}</h2>
                <p id="projectModalSubtitle">${details.subtitle}</p>
            </div>

            <div class="project-modal__body">
                <section class="project-modal__section">
                    <h3>Overview</h3>
                    <p>${details.overview}</p>
                </section>

                <section class="project-modal__section">
                    <h3>What it does</h3>
                    <ul>${whatItDoesHtml}</ul>
                </section>

                <section class="project-modal__section">
                    <h3>Why I built it</h3>
                    <p>${details.whyBuilt}</p>
                </section>

                <section class="project-modal__section">
                    <h3>Tech stack</h3>
                    <div class="modal-tech-list">${techStackHtml}</div>
                </section>

                <section class="project-modal__section">
                    <h3>Key learning</h3>
                    <p>${details.keyLearning}</p>
                </section>
            </div>

            <div class="project-modal__actions">
                <a class="project-modal__button project-modal__button--primary" href="${project.github}" target="_blank" rel="noopener noreferrer">View GitHub</a>
                <a class="project-modal__button" href="${project.liveUrl}" target="_blank" rel="noopener noreferrer">Visit Live Project</a>
            </div>
        `;
    }

    function getFocusableModalElements() {
        const modal = document.getElementById(projectModalId);
        if (!modal || modal.hidden) return [];

        return Array.from(modal.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'))
            .filter(element => element.offsetParent !== null);
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
        if (!modal || !activeProject) return;

        modal.classList.remove('is-open');
        modal.hidden = true;
        document.removeEventListener('keydown', handleProjectModalKeydown);
        unlockBodyScroll();
        activeProject = null;

        if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === 'function') {
            previouslyFocusedElement.focus({ preventScroll: true });
        }
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

            const badgeIcon = project.status === 'In Progress' ? '🚧' : '🏆';
            const badgeClass = project.status === 'Ideathon Winner' ? 'project-badge project-badge--winner' : 'project-badge';
            const badgeHtml = project.status
                ? `<span class="${badgeClass}">${badgeIcon} ${project.status}</span>`
                : '';
            const detailButtonHtml = project.details
                ? `<button class="project-details-btn" type="button" data-project-details="${project.id}">View Details</button>`
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
                        <div class="project-footer__detail">${detailButtonHtml}</div>
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
