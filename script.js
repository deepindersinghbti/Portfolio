// Icons: Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com
// License: https://fontawesome.com/license/free (icons CC BY 4.0)
const statusIcons = {
    loading: '<svg class="icon icon-circle-notch icon-spin" viewBox="0 0 512 512" aria-hidden="true" focusable="false"><path d="M222.7 32.1c5 16.9-4.6 34.8-21.5 39.8C121.8 95.6 64 169.1 64 256c0 106 86 192 192 192s192-86 192-192c0-86.9-57.8-160.4-137.1-184.1c-16.9-5-26.6-22.9-21.5-39.8s22.9-26.6 39.8-21.5C434.9 42.1 512 140 512 256c0 141.4-114.6 256-256 256S0 397.4 0 256C0 140 77.1 42.1 182.9 10.6c16.9-5 34.8 4.6 39.8 21.5z"/></svg>',
    success: '<svg class="icon icon-circle-check" viewBox="0 0 512 512" aria-hidden="true" focusable="false"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>',
    error: '<svg class="icon icon-triangle" viewBox="0 0 512 512" aria-hidden="true" focusable="false"><path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>'
};

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
            '.research-intro',
            '.paper-card',
            '.ongoing-card',
            '.project-card',
            '.skill-group',
            '.honours-list',
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
    const hamburger = document.getElementById("hamburger");

    function closeMenu() {
        navItems.classList.remove("active");
        hamburger.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
        hamburger.setAttribute("aria-label", "Open menu");
    }

    function toggleMenu() {
        const isOpen = navItems.classList.toggle("active");
        hamburger.classList.toggle("active", isOpen);
        hamburger.setAttribute("aria-expanded", String(isOpen));
        hamburger.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    }

    hamburger.addEventListener("click", toggleMenu);
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeMenu();
    });

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


    // Details shown in the project modal; the cards themselves are written in index.html
    const projects = [
        {
            id: 'fairlens',
            title: 'FairLens',
            github: 'https://github.com/deepindersinghbti/FairLens',
            liveUrl: 'https://deepinder-fairlens.vercel.app/',
            caseStudyUrl: 'projects/fairlens-case-study.html',
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
            github: 'https://github.com/deepindersinghbti/VibeGuard-AI',
            liveUrl: 'https://vibeguard-ai.vercel.app/',
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
            github: 'https://github.com/S-A-N-K-A-L-P/project_collab_sankalap',
            liveUrl: 'https://project-syncroo.netlify.app/',
            linkedin: 'https://www.linkedin.com/company/sankalp001/',
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
        }
    ];

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

    createProjectModal();
    window.addEventListener('pagehide', cleanupProjectModalState);
    window.addEventListener('beforeunload', cleanupProjectModalState);

    document.getElementById('projects-container')?.addEventListener('click', (event) => {
        const detailsButton = event.target.closest('[data-project-details]');
        if (!detailsButton) return;

        openProjectModal(detailsButton.dataset.projectDetails, detailsButton);
    });

    // Apply reveal animations to project cards
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

        const statusIcon = contactStatus.querySelector(".contact-status-card__icon");
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
                statusIcon.innerHTML = statusIcons.loading;
                statusEyebrow.textContent = "Sending";
                statusTitle.textContent = "Sending your message";
                statusText.textContent = "Please wait while we deliver it securely.";
                return;
            }

            if (type === "success") {
                statusIcon.innerHTML = statusIcons.success;
                statusEyebrow.textContent = "Success";
                statusTitle.textContent = "Message sent successfully 🚀";
                statusText.textContent = "Thanks for reaching out! I’ll get back to you soon.";
                return;
            }

            statusIcon.innerHTML = statusIcons.error;
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

            const nameInput = contactForm.elements.name;
            const subjectInput = contactForm.elements.subject;
            const name = nameInput && typeof nameInput.value === "string" ? nameInput.value.trim() : "";

            if (subjectInput && typeof subjectInput.value === "string") {
                subjectInput.value = `[Portfolio] ${name} sent a message`;
            }

            setButtonState({
                disabled: true,
                html: `${statusIcons.loading} Sending...`
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
                    html: `${statusIcons.success} Sent`
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
