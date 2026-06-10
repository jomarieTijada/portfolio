/** Community page utilities */
(function () {
    if (window.__communityUiLoaded) return;
    window.__communityUiLoaded = true;

    const ajaxHeaders = { 'X-Requested-With': 'XMLHttpRequest' };
    const isPostDetailPage = () => window.location.pathname.includes('post/index.html');

    function togglePasswordVisibility(inputId, iconSelector) {
        const input = document.getElementById(inputId);
        const icon = document.querySelector(iconSelector);
        if (!input || !icon) return;

        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        icon.classList.replace(isPassword ? 'fa-eye' : 'fa-eye-slash', isPassword ? 'fa-eye-slash' : 'fa-eye');
    }

    function toggleModal(id, show) {
        const el = document.getElementById(id);
        if (!el) return;

        if (show) {
            const wasHidden = el.classList.contains('hidden');
            el.classList.add('active');
            if (wasHidden) {
                el.classList.remove('hidden');
                el.classList.add('flex');
            }
        } else {
            el.classList.remove('active');
            if (el.classList.contains('flex')) {
                el.classList.add('hidden');
                el.classList.remove('flex');
            }
        }

        document.body.style.overflow = show ? 'hidden' : 'auto';
    }

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
        const tone = type === 'success' ? 'notification-success' : 'notification-error';

        notification.className = `notification-center ${tone}`;
        notification.innerHTML = `
            <div class="icon-circle">
                <i class="fas fa-${icon} text-4xl"></i>
            </div>
            <span class="text-lg font-bold text-center">${message}</span>
        `;

        document.body.appendChild(notification);
        window.setTimeout(() => {
            notification.style.opacity = '0';
            window.setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    function refreshPosts(showManualLoading = false) {
        const container = document.getElementById('posts-container');
        if (!container || isPostDetailPage() || document.querySelector('.modal.active')) return;

        const spinner = document.getElementById('loading-spinner');
        const filter = new URLSearchParams(window.location.search).get('filter') || 'recent';

        if (showManualLoading && spinner) spinner.style.display = 'block';

        fetch(`/community?filter=${encodeURIComponent(filter)}`, { headers: ajaxHeaders })
            .then((res) => res.text())
            .then((html) => {
                if (html.trim().length > 0) container.innerHTML = html;
            })
            .catch(() => {})
            .finally(() => {
                if (spinner) spinner.style.display = 'none';
            });
    }

    function bindAjaxForm(form, onSuccess, onErrorMessage = 'Request failed') {
        if (!form) return;

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(form);

            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: ajaxHeaders
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.status === 'success') {
                        showNotification(data.message, 'success');
                        onSuccess(data);
                    } else {
                        showNotification(data.message || onErrorMessage, 'error');
                    }
                })
                .catch(() => showNotification('Connection error', 'error'));
        });
    }

    function bindChangePasswordForm() {
        const passwordForm = document.querySelector('#changePasswordModal form');
        if (!passwordForm) return;

        passwordForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const submitBtn = passwordForm.querySelector('button[type="submit"]');
            const originalText = submitBtn?.innerText || '';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Updating...';
            }

            fetch('/csrf-token')
                .then((res) => res.json())
                .then((tokenData) => {
                    const tokenInput = passwordForm.querySelector('input[name="_token"]');
                    if (tokenInput) tokenInput.value = tokenData.token;

                    return fetch(passwordForm.action, {
                        method: 'POST',
                        body: new FormData(passwordForm),
                        headers: ajaxHeaders
                    });
                })
                .then((res) => res.json())
                .then((data) => {
                    if (data.status === 'success') {
                        showNotification(data.message, 'success');
                        window.closeChangePasswordModal();
                        passwordForm.reset();
                    } else {
                        showNotification(data.message || 'Error updating password', 'error');
                    }
                })
                .catch(() => showNotification('Connection error', 'error'))
                .finally(() => {
                    if (!submitBtn) return;
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                });
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        const communityToggleBtn = document.getElementById('communityDarkModeToggle');
        if (communityToggleBtn) {
            const updateIcons = () => {
                const isDark = document.documentElement.classList.contains('dark');
                communityToggleBtn.querySelector('.dark-icon')?.classList.toggle('hidden', !isDark);
                communityToggleBtn.querySelector('.light-icon')?.classList.toggle('hidden', isDark);
            };

            updateIcons();
            window.addEventListener('themeChanged', updateIcons);
        }

        bindAjaxForm(document.getElementById('edit-post-form'), () => {
            window.closeEditPostModal();
            isPostDetailPage() ? location.reload() : refreshPosts();
        }, 'Update failed');

        bindAjaxForm(document.getElementById('delete-post-form'), () => {
            window.closeDeleteConfirmModal();
            isPostDetailPage() ? window.location.href = '/community' : refreshPosts();
        });

        bindAjaxForm(document.getElementById('delete-comment-form'), () => {
            window.closeDeleteCommentModal();
            location.reload();
        });

        bindChangePasswordForm();

        if (document.getElementById('posts-container')) {
            window.setInterval(refreshPosts, 30000);
        }
    });

    window.togglePass = () => togglePasswordVisibility('signin-pass', '.toggle-password');
    window.toggleRegisterPass = () => togglePasswordVisibility('register-pass', '.toggle-password-register');
    window.toggleCurrentPass = () => togglePasswordVisibility('current-pass', '.toggle-current');
    window.toggleNewPass = () => togglePasswordVisibility('new-pass', '.toggle-new');
    window.toggleConfirmPass = () => togglePasswordVisibility('confirm-pass', '.toggle-confirm');

    window.toggleModal = toggleModal;
    window.showNotification = showNotification;
    window.openModal = () => toggleModal('registerModal', true);
    window.closeModal = () => toggleModal('registerModal', false);
    window.openCreatePostModal = () => toggleModal('createPostModal', true);
    window.closeCreatePostModal = () => toggleModal('createPostModal', false);
    window.closeDeleteCommentModal = () => toggleModal('deleteCommentModal', false);

    window.openSignInModal = () => {
        toggleModal('signInModal', true);
        window.setTimeout(() => document.getElementById('email')?.focus(), 100);
    };

    window.closeSignInModal = () => toggleModal('signInModal', false);

    window.refreshPosts = function (isManual = false) {
        const icon = document.getElementById('refresh-icon');
        if (isManual && icon) {
            icon.classList.add('animate-spin-once');
            window.setTimeout(() => icon.classList.remove('animate-spin-once'), 600);
        }

        if (typeof window.loadPosts === 'function') {
            window.loadPosts();
            return;
        }

        refreshPosts(isManual);
    };

    window.openChangePasswordModal = () => toggleModal('changePasswordModal', true);
    window.closeChangePasswordModal = () => toggleModal('changePasswordModal', false);

    window.openEditPostModal = function (id, title, content) {
        const modal = document.getElementById('editPostModal');
        const idInput = document.getElementById('edit-post-id');
        const titleInput = document.getElementById('edit-post-title');
        const contentInput = document.getElementById('edit-post-content');
        if (!modal || !idInput || !titleInput || !contentInput) return;

        idInput.value = id;
        titleInput.value = title;
        contentInput.value = content;
        toggleModal('editPostModal', true);
    };

    window.confirmDeletePost = function (postId) {
        const input = document.getElementById('delete-post-id');
        if (!input) return;

        input.value = postId;
        toggleModal('deleteConfirmModal', true);
    };

    window.closeEditPostModal = () => toggleModal('editPostModal', false);
    window.closeDeleteConfirmModal = () => toggleModal('deleteConfirmModal', false);

    window.confirmDeleteComment = function (commentId) {
        const input = document.getElementById('delete-comment-id');
        if (!input) return;

        input.value = commentId;
        toggleModal('deleteCommentModal', true);
    };
})();
