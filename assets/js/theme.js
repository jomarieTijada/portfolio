/* Shared portfolio UI helpers */
(function () {
    const root = document.documentElement;
    const storageKeys = ['theme', 'community_theme'];

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
    }

    function closeById(id) {
        const modal = document.getElementById(id);
        if (!modal) return;

        modal.classList.add('hidden');
        modal.classList.remove('flex', 'active');
        document.body.style.overflow = 'auto';
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

    window.openCertModal = function (imgSrc) {
        const modal = document.getElementById('certModal');
        const modalImg = document.getElementById('modalImage');
        if (!modal || !modalImg) return;

        modalImg.src = imgSrc;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
    };

    window.closeCertModal = () => closeById('certModal');
    window.openRegisterModal = () => document.getElementById('registerModal')?.classList.add('active');
    window.closeRegisterModal = () => closeById('registerModal');
    window.openSignInModal = () => document.getElementById('signInModal')?.classList.add('active');
    window.closeSignInModal = () => closeById('signInModal');
    window.openCreatePostModal = () => document.getElementById('createPostModal')?.classList.add('active');
    window.closeCreatePostModal = () => closeById('createPostModal');

    document.addEventListener('DOMContentLoaded', () => {
        document.body.classList.add('ready');

        document.querySelectorAll('#darkModeToggle, #communityDarkModeToggle').forEach((toggle) => {
            syncToggleIcons(toggle);
            toggle.addEventListener('click', () => {
                root.classList.add('no-transitions');
                window.toggleTheme();
                syncToggleIcons(toggle);
                window.setTimeout(() => root.classList.remove('no-transitions'), 10);
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

    if (!paginationNumbers || allCards.length === 0) return;

    let currentPage = 1;
    const totalPages = Math.ceil(allCards.length / cardsPerPage);
    const paginationWrapper = paginationNumbers.closest('.fade-in');

    if (totalPages <= 1) {
        paginationWrapper?.classList.add('hidden');
    } else {
        paginationWrapper?.classList.remove('hidden');
    }

    function displayPage(page, isFirstLoad = false) {
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
            btn.className = 'w-10 h-10 rounded-lg border transition text-sm font-medium flex items-center justify-center';

            if (pageNumber === currentPage) {
                btn.classList.add('active', 'bg-black', 'text-white', 'border-black');
            } else {
                btn.classList.add('bg-white', 'text-gray-700', 'border-gray-200', 'dark:bg-black', 'dark:text-white', 'dark:border-gray-800');
            }

            btn.addEventListener('click', () => displayPage(pageNumber));
            return btn;
        });

        paginationNumbers.replaceChildren(...buttons);
        if (prevBtn) prevBtn.disabled = currentPage === 1;
        if (nextBtn) nextBtn.disabled = currentPage === totalPages;

        if (!isFirstLoad) {
            window.scrollTo({ top: container.offsetTop - 120, behavior: 'smooth' });
        }
    }

    prevBtn?.addEventListener('click', () => {
        if (currentPage > 1) displayPage(currentPage - 1);
    });

    nextBtn?.addEventListener('click', () => {
        if (currentPage < totalPages) displayPage(currentPage + 1);
    });

    displayPage(1, true);
};
