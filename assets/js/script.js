/* Page-specific portfolio enhancements. */
(function () {
    function enhanceCardImageFallbacks() {
        document.querySelectorAll('.project-card img, .cert-card img').forEach((image) => {
            const replaceBrokenImage = () => {
                if (!image.isConnected) return;

                const card = image.closest('.project-card, .cert-card');
                const title = card?.querySelector('h2')?.textContent?.trim() || 'Portfolio item';
                const fallback = document.createElement('div');

                fallback.className = 'card-image-fallback';
                fallback.setAttribute('role', 'img');
                fallback.setAttribute('aria-label', title);
                fallback.innerHTML = `
                    <i class="fas fa-award" aria-hidden="true"></i>
                    <span>${title}</span>
                `;
                image.replaceWith(fallback);
            };

            image.addEventListener('error', replaceBrokenImage, { once: true });

            if (image.complete && image.naturalWidth === 0) {
                replaceBrokenImage();
            }
        });
    }

    document.addEventListener('DOMContentLoaded', enhanceCardImageFallbacks);
})();
