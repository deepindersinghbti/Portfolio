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
