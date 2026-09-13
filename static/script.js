/**
 * isyourrefrigerator.online
 * Core JavaScript Logic & Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
    // Console Easter Egg & Privacy Confirmation
    console.log(
        '%c❄️ isyourrefrigerator.online%c\nPrivacy-First Homelab: Zero cookies, zero third-party trackers, 100% chilled.',
        'color: #38bdf8; font-size: 16px; font-weight: bold; font-family: monospace;',
        'color: #94a3b8; font-size: 12px;'
    );

    // Active Navigation Highlight on Scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.site-nav .nav-link');

    function updateActiveNav() {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });

        // If at top of page, remove active states
        if (scrollY < 200) {
            navLinks.forEach(link => link.classList.remove('active'));
        }
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // Smooth Scrolling for internal anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId || targetId === '#contact' || targetId === '#privacy') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Copy to Clipboard (Server IP & Discord handle)
    const copyButtons = document.querySelectorAll('.btn-copy-ip');
    const toast = document.getElementById('toastNotice');

    function showToast(message) {
        if (!toast) return;
        toast.querySelector('.toast-text').textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2600);
    }

    copyButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            const val = btn.getAttribute('data-ip');
            if (!val) return;

            try {
                await navigator.clipboard.writeText(val);
                const originalHtml = btn.innerHTML;
                btn.classList.add('copied');
                btn.innerHTML = `
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Copied!</span>
                `;
                showToast(`Copied ${val} to clipboard!`);

                setTimeout(() => {
                    btn.classList.remove('copied');
                    btn.innerHTML = originalHtml;
                }, 2200);
            } catch (err) {
                prompt("Copy to clipboard:", val);
            }
        });
    });

    // Modal Helper Functions
    function openModalById(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        if (!modal) return;
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function closeAllModals() {
        document.querySelectorAll('.modal-backdrop').forEach(modal => {
            closeModal(modal);
        });
    }

    // Say Hi / Discord Modal Triggers
    document.querySelectorAll('.btn-say-hi').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModalById('contactModal');
        });
    });

    const closeContactBtn = document.getElementById('closeContactModal');
    if (closeContactBtn) {
        closeContactBtn.addEventListener('click', () => {
            closeModal(document.getElementById('contactModal'));
        });
    }

    // Privacy & Legal Modal Triggers
    document.querySelectorAll('.btn-privacy').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModalById('privacyModal');
        });
    });

    const closePrivacyBtn = document.getElementById('closePrivacyModal');
    if (closePrivacyBtn) {
        closePrivacyBtn.addEventListener('click', () => {
            closeModal(document.getElementById('privacyModal'));
        });
    }

    // Backdrop Click Dismiss for all Modals
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                closeModal(backdrop);
            }
        });
    });

    // Escape Key to Close Modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });

    // Dynamic current year in footer
    const currentYearElements = document.querySelectorAll('.current-year');
    const currentYear = new Date().getFullYear();
    currentYearElements.forEach(el => {
        el.textContent = currentYear;
    });
});
