(function() {
    'use strict';

    function init() {
        // 语言下拉菜单展开/收起
        var toggle = document.getElementById('langToggle');
        var dropdown = document.getElementById('langDropdown');
        if (toggle && dropdown) {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                dropdown.classList.toggle('active');
            });
            document.addEventListener('click', function() { dropdown.classList.remove('active'); });
        }

        // FAQ 折叠
        document.querySelectorAll('.faq-question').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var answer = this.nextElementSibling;
                var icon = this.querySelector('i');
                if (answer.classList.contains('hidden')) {
                    answer.classList.remove('hidden');
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-up');
                } else {
                    answer.classList.add('hidden');
                    icon.classList.remove('fa-chevron-up');
                    icon.classList.add('fa-chevron-down');
                }
            });
        });

        // 平滑滚动到表单
        var reqBtn = document.getElementById('reqSampleBtn');
        if (reqBtn) {
            reqBtn.addEventListener('click', function() {
                var section = document.getElementById('contactFormSection');
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                    setTimeout(function() {
                        var nameInput = section.querySelector('input[name="name"]');
                        if (nameInput) nameInput.focus();
                    }, 800);
                }
            });
        }

        // 表单提交
        var form = document.getElementById('leadContactForm');
        var successDiv = document.getElementById('formSuccessMessage');
        if (form && successDiv) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                var formData = new FormData(this);
                if (formData.get('website_url')) { return; }
                var submitBtn = this.querySelector('button[type="submit"]');
                submitBtn.disabled = true;
                var originalText = submitBtn.textContent;
                submitBtn.textContent = '...';
                fetch(this.action, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } })
                    .then(function(r) {
                        if (r.ok) {
                            form.classList.add('hidden');
                            successDiv.textContent = '✅ ' + (window.__FORM_SUCCESS__ || 'Thank you!');
                            successDiv.classList.remove('hidden');
                        } else { throw new Error('Failed'); }
                    })
                    .catch(function() {
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalText;
                        alert('Something went wrong. Please try again.');
                    });
            });
        }

        // WhatsApp 气泡
        var bubble = document.getElementById('whatsappBubble');
        var closeBtn = document.getElementById('closeBubble');
        if (bubble && closeBtn) {
            if (!localStorage.getItem('hideWhatsappBubble')) {
                setTimeout(function() { bubble.classList.remove('hidden'); }, 3000);
            }
            closeBtn.addEventListener('click', function() {
                bubble.classList.add('hidden');
                localStorage.setItem('hideWhatsappBubble', 'true');
            });
        }

        // 视频加载
        var video = document.getElementById('heroVideo');
        var placeholder = document.getElementById('videoPlaceholder');
        if (video) {
            var videoUrl = 'https://cloud.video.taobao.com/play/u/2214317181391/p/2/e/6/t/1/531712869626.mp4';
            if (!video.src) {
                video.src = videoUrl;
                video.load();
                video.addEventListener('canplay', function() {
                    video.style.opacity = '1';
                    if (placeholder) placeholder.classList.add('hidden');
                    video.play().catch(function() {});
                });
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();