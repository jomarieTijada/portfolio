/* Shared portfolio UI helpers */
(function () {
    const root = document.documentElement;
    const storageKeys = ['theme', 'community_theme'];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let certModalTimer;

    function getStoredTheme() {
        return localStorage.getItem('theme') || localStorage.getItem('community_theme');
    }

    function setStoredTheme(theme) {
        storageKeys.forEach((key) => localStorage.setItem(key, theme));
    }

    function applyTheme(theme) {
        root.classList.toggle('dark', theme === 'dark');
    }

    function getCurrentTheme() {
        return root.classList.contains('dark') ? 'dark' : 'light';
    }

    function syncToggleIcons(toggle) {
        const isDark = root.classList.contains('dark');
        toggle.querySelector('.dark-icon')?.classList.toggle('hidden', !isDark);
        toggle.querySelector('.light-icon')?.classList.toggle('hidden', isDark);
        toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }

    function closeById(id) {
        const modal = document.getElementById(id);
        if (!modal) return;

        modal.classList.add('hidden');
        modal.classList.remove('flex', 'active');
        document.body.style.overflow = 'auto';
    }

    function closeCertModalSmoothly() {
        const modal = document.getElementById('certModal');
        if (!modal || modal.classList.contains('hidden')) return;

        window.clearTimeout(certModalTimer);
        modal.classList.remove('is-visible');
        modal.classList.add('is-closing');
        modal.setAttribute('aria-hidden', 'true');

        const finishClose = () => {
            modal.classList.add('hidden');
            modal.classList.remove('flex', 'is-closing');
            document.body.style.overflow = 'auto';
        };

        if (reducedMotion.matches) {
            finishClose();
            return;
        }

        certModalTimer = window.setTimeout(finishClose, 180);
    }

    const storedTheme = getStoredTheme();
    if (storedTheme) {
        applyTheme(storedTheme);
    }

    window.toggleTheme = function () {
        const nextTheme = getCurrentTheme() === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
        setStoredTheme(nextTheme);
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: nextTheme } }));
    };

    window.openCertModal = function (imgSrc, altText = 'Certificate preview') {
        const modal = document.getElementById('certModal');
        const modalImg = document.getElementById('modalImage');
        if (!modal || !modalImg) return;

        window.clearTimeout(certModalTimer);
        modalImg.src = imgSrc;
        modalImg.alt = altText;
        modal.classList.remove('is-closing');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        if (reducedMotion.matches) {
            modal.classList.add('is-visible');
            return;
        }

        window.requestAnimationFrame(() => modal.classList.add('is-visible'));
    };

    window.closeCertModal = closeCertModalSmoothly;
    window.openRegisterModal = () => document.getElementById('registerModal')?.classList.add('active');
    window.closeRegisterModal = () => closeById('registerModal');
    window.openSignInModal = () => document.getElementById('signInModal')?.classList.add('active');
    window.closeSignInModal = () => closeById('signInModal');
    window.openCreatePostModal = () => document.getElementById('createPostModal')?.classList.add('active');
    window.closeCreatePostModal = () => closeById('createPostModal');

    document.addEventListener('DOMContentLoaded', () => {
        window.requestAnimationFrame(() => document.body.classList.add('ready'));

        document.querySelectorAll('#darkModeToggle, #communityDarkModeToggle').forEach((toggle) => {
            syncToggleIcons(toggle);
            toggle.addEventListener('click', () => {
                const switchTheme = () => {
                    window.toggleTheme();
                    syncToggleIcons(toggle);
                };

                if (reducedMotion.matches) {
                    switchTheme();
                    return;
                }

                root.classList.add('theme-transition');
                window.requestAnimationFrame(switchTheme);
                window.setTimeout(() => root.classList.remove('theme-transition'), 240);
            });
        });

        const carousel = document.getElementById('recommendation-carousel');
        const recDots = document.getElementById('rec-dots');

        if (carousel && recDots) {
            const recItems = Array.from(carousel.querySelectorAll('.rec-item'));
            let currentIndex = 0;
            let autoScroll;

            const updateCarousel = () => {
                recItems.forEach((item, index) => item.classList.toggle('active', index === currentIndex));
                recDots.querySelectorAll('.carousel-dot').forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentIndex);
                });
            };

            const startAutoScroll = () => {
                window.clearInterval(autoScroll);
                autoScroll = window.setInterval(() => {
                    currentIndex = (currentIndex + 1) % recItems.length;
                    updateCarousel();
                }, 7000);
            };

            recDots.replaceChildren(...recItems.map((_, index) => {
                const dot = document.createElement('span');
                dot.className = `carousel-dot${index === currentIndex ? ' active' : ''}`;
                dot.addEventListener('click', () => {
                    currentIndex = index;
                    updateCarousel();
                    startAutoScroll();
                });
                return dot;
            }));

            if (recItems.length) {
                updateCarousel();
                startAutoScroll();
            }
        }

        const projectContainer = document.getElementById('project-container');
        const certContainer = document.getElementById('cert-container');
        if (projectContainer) window.initNumberedPagination(projectContainer, '.project-card', 4);
        if (certContainer) window.initNumberedPagination(certContainer, '.cert-card', 4);

        const scrollBtn = document.getElementById('scrollToTop');
        if (scrollBtn) {
            const toggleScrollButton = () => {
                const isVisible = window.pageYOffset > 400;
                scrollBtn.classList.toggle('hidden', !isVisible);
                scrollBtn.classList.toggle('flex', isVisible);
            };

            window.addEventListener('scroll', toggleScrollButton, { passive: true });
            scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
            toggleScrollButton();
        }

        document.addEventListener('keydown', (event) => {
            if (event.key !== 'Escape') return;

            window.closeCertModal?.();
            window.closeRegisterModal?.();
            window.closeSignInModal?.();
            window.closeCreatePostModal?.();
            window.closeGalleryModal?.();
            window.closeImageModal?.();
        });

        document.addEventListener('click', (event) => {
            if (!event.target.classList?.contains('modal')) return;

            window.closeRegisterModal?.();
            window.closeSignInModal?.();
            window.closeCreatePostModal?.();
        });
    });
})();

window.initNumberedPagination = function (container, childSelector, cardsPerPage) {
    const allCards = Array.from(container.querySelectorAll(childSelector));
    const paginationNumbers = document.getElementById('pagination-numbers');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!paginationNumbers || allCards.length === 0) return;

    let currentPage = 1;
    let isTransitioning = false;
    const totalPages = Math.ceil(allCards.length / cardsPerPage);
    const paginationWrapper = paginationNumbers.closest('.fade-in');

    if (totalPages <= 1) {
        paginationWrapper?.classList.add('hidden');
    } else {
        paginationWrapper?.classList.remove('hidden');
    }

    function commitPage(page) {
        currentPage = page;
        const start = (page - 1) * cardsPerPage;
        const end = start + cardsPerPage;

        allCards.forEach((card, index) => {
            card.classList.toggle('hidden', index < start || index >= end);
        });

        const buttons = Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;
            const btn = document.createElement('button');
            btn.textContent = pageNumber;
            btn.className = 'w-10 h-10 rounded-lg border transition-colors text-sm font-medium flex items-center justify-center';
            btn.type = 'button';
            btn.setAttribute('aria-label', `Go to page ${pageNumber}`);

            if (pageNumber === currentPage) {
                btn.classList.add('active', 'bg-black', 'text-white', 'border-black');
                btn.setAttribute('aria-current', 'page');
            } else {
                btn.classList.add('bg-white', 'text-gray-700', 'border-gray-200', 'dark:bg-black', 'dark:text-white', 'dark:border-gray-800');
            }

            btn.addEventListener('click', () => displayPage(pageNumber));
            return btn;
        });

        paginationNumbers.replaceChildren(...buttons);
        if (prevBtn) prevBtn.disabled = currentPage === 1;
        if (nextBtn) nextBtn.disabled = currentPage === totalPages;
    }

    function scrollToContainer() {
        window.requestAnimationFrame(() => {
            window.scrollTo({ top: container.offsetTop - 120, behavior: 'smooth' });
        });
    }

    function displayPage(page, isFirstLoad = false) {
        const targetPage = Math.min(Math.max(page, 1), totalPages);
        if (isTransitioning || (!isFirstLoad && targetPage === currentPage)) return;

        if (isFirstLoad || reducedMotion.matches) {
            commitPage(targetPage);
            if (!isFirstLoad) scrollToContainer();
            return;
        }

        isTransitioning = true;
        container.classList.add('is-page-changing');
        if (prevBtn) prevBtn.disabled = true;
        if (nextBtn) nextBtn.disabled = true;

        window.setTimeout(() => {
            commitPage(targetPage);
            window.requestAnimationFrame(() => {
                container.classList.remove('is-page-changing');
                isTransitioning = false;
                scrollToContainer();
            });
        }, 140);
    }

    prevBtn?.addEventListener('click', () => {
        if (currentPage > 1) displayPage(currentPage - 1);
    });

    nextBtn?.addEventListener('click', () => {
        if (currentPage < totalPages) displayPage(currentPage + 1);
    });

    displayPage(1, true);
};
