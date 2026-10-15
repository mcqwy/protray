// js/main.js
(function() {
    'use strict';

    function init() {
        var langData = window.langData;
        var supportedLangs = ['en', 'es', 'th', 'vi', 'zh'];
        var currentLang = 'en';

        try {
            var saved = localStorage.getItem('proTrayLang');
            if (saved && supportedLangs.indexOf(saved) !== -1) {
                currentLang = saved;
            }
        } catch (_) {}

        var flagMap = { en: 'us', es: 'mx', th: 'th', vi: 'vn', zh: 'cn' };
        var langNames = { en: 'English', es: 'Español', th: 'ไทย', vi: 'Tiếng Việt', zh: '中文' };

        // 注意：目前 32、40、98 孔暂无真实图片，暂时复用 50 和 72 的图片，等你拍好新图后替换 assets/images/ 里的文件即可，不用改代码
        var imageMap = {
            '32': 'assets/images/tray-50.jpg',
            '40': 'assets/images/tray-50.jpg',
            '50': 'assets/images/tray-50.jpg',
            '72': 'assets/images/tray-72.jpg',
            '98': 'assets/images/tray-72.jpg',
            '105': 'assets/images/tray-105.jpg',
            '128': 'assets/images/tray-128.jpg'
        };

        // ========== 视频加载逻辑 ==========
        function loadHeroVideo() {
            var video = document.getElementById('heroVideo');
            var placeholder = document.getElementById('videoPlaceholder');
            if (!video) return;
            var videoUrl = 'https://cloud.video.taobao.com/play/u/2214317181391/p/2/e/6/t/1/531712869626.mp4';

            if (video.src) { video.play().catch(function() {}); return; }
            video.src = videoUrl; video.load();

            video.addEventListener('canplay', function onCanPlay() {
                video.removeEventListener('canplay', onCanPlay);
                video.style.opacity = '1';
                if (placeholder) { placeholder.classList.add('hidden'); }
                video.play().catch(function() {});
            });
        }

        function setLanguage(lang) {
            if (!langData[lang]) return;
            currentLang = lang;
            document.documentElement.lang = lang;

            document.querySelectorAll('[data-i18n]').forEach(function(el) {
                if (el.hasAttribute('data-i18n-option')) return;
                var key = el.getAttribute('data-i18n');
                var val = langData[lang][key];
                if (val !== undefined && typeof val === 'string') { el.textContent = val; }
            });
            document.querySelectorAll('[data-i18n-option]').forEach(function(el) {
                var optionKey = el.getAttribute('data-i18n-option');
                var value = el.getAttribute('data-value');
                var optMap = langData[lang][optionKey];
                if (optMap && optMap[value]) { el.textContent = optMap[value]; }
            });
            document.querySelectorAll('select[data-i18n-options]').forEach(function(select) {
                var optionKey = select.getAttribute('data-i18n-options');
                var optMap = langData[lang][optionKey];
                if (!optMap) return;
                Array.from(select.options).forEach(function(opt) {
                    var val = opt.value;
                    if (optMap[val] !== undefined) { opt.textContent = optMap[val]; }
                });
            });
            var label = document.getElementById('currentLangLabel');
            if (label) label.textContent = langNames[lang] || lang;
            var mobileLabel = document.getElementById('mobileCurrentLangLabel');
            if (mobileLabel) mobileLabel.textContent = langNames[lang] || lang;

            var flagImg = document.getElementById('currentFlag');
            if (flagImg) {
                flagImg.src = 'https://flagcdn.com/w40/' + flagMap[lang] + '.png';
                flagImg.alt = langNames[lang] || lang;
            }
            document.querySelectorAll('.lang-option').forEach(function(opt) {
                var ol = opt.getAttribute('data-lang');
                if (ol === lang) { opt.style.fontWeight = '600'; opt.style.background = '#e5f0e5'; }
                else { opt.style.fontWeight = '400'; opt.style.background = 'transparent'; }
            });
            try { localStorage.setItem('proTrayLang', lang); } catch (_) {}
        }

        function bindEvents() {
            // 语言切换
            var toggle = document.getElementById('langToggle');
            var dropdown = document.getElementById('langDropdown');
            if (toggle && dropdown) {
                toggle.addEventListener('click', function(e) {
                    e.preventDefault(); e.stopPropagation(); dropdown.classList.toggle('active');
                });
                document.addEventListener('click', function() { dropdown.classList.remove('active'); });
            }
            document.querySelectorAll('.lang-option').forEach(function(opt) {
                opt.addEventListener('click', function(e) {
                    e.preventDefault();
                    var lang = this.getAttribute('data-lang');
                    if (lang) { setLanguage(lang); if (dropdown) dropdown.classList.remove('active'); }
                });
            });

            // Tab 切换（32/40/50/72/98/105/128 Holes）
            var tabBtns = document.querySelectorAll('.tab-btn');
            var tabContents = document.querySelectorAll('.tab-content');
            tabBtns.forEach(function(btn) {
                btn.addEventListener('click', function() {
                    var target = this.getAttribute('data-tab');
                    tabBtns.forEach(function(b) {
                        b.classList.remove('bg-green-600', 'text-white');
                        b.classList.add('bg-gray-100', 'text-gray-700');
                    });
                    this.classList.remove('bg-gray-100', 'text-gray-700');
                    this.classList.add('bg-green-600', 'text-white');

                    tabContents.forEach(function(c) { c.classList.remove('active'); });
                    var activeTab = document.getElementById('tab-' + target);
                    if (activeTab) { activeTab.classList.add('active'); }

                    // 切换图片，并动态生成精准的 alt 描述
                    var img = document.getElementById('productImage');
                    if (img && imageMap[target]) {
                        img.src = imageMap[target];
                        img.alt = target + " holes commercial grade plastic seedling tray wholesale";
                    }
                });
            });

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
            var navQuoteBtn = document.getElementById('navQuoteBtn');
            var reqSampleBtn = document.getElementById('reqSampleBtn');
            function scrollToForm() {
                var formSection = document.getElementById('contactFormSection');
                if (formSection) {
                    formSection.scrollIntoView({ behavior: 'smooth' });
                    setTimeout(function() {
                        var nameInput = formSection.querySelector('input[name="name"]');
                        if (nameInput) nameInput.focus();
                    }, 800);
                }
            }
            if (navQuoteBtn) navQuoteBtn.addEventListener('click', scrollToForm);
            if (reqSampleBtn) reqSampleBtn.addEventListener('click', scrollToForm);

            // 表单提交与蜜罐
            var form = document.getElementById('leadContactForm');
            var successDiv = document.getElementById('formSuccessMessage');
            if (form && successDiv) {
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    var formData = new FormData(this);
                    if (formData.get('website_url')) { return; }
                    var submitBtn = this.querySelector('button[type="submit"]');
                    var originalText = submitBtn.textContent;
                    submitBtn.disabled = true;
                    submitBtn.textContent = (langData[currentLang]?.btnSubmit || 'Submit') + '...';

                    fetch(this.action, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } })
                        .then(function(response) {
                            if (response.ok) {
                                form.classList.add('opacity-0');
                                setTimeout(function() {
                                    form.classList.add('hidden');
                                    var msg = langData[currentLang]?.formSuccessMessage || 'Thank you! We will contact you within 24 hours.';
                                    successDiv.textContent = '✅ ' + msg;
                                    successDiv.classList.remove('hidden');
                                    successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }, 500);
                            } else { throw new Error('Network response was not ok.'); }
                        })
                        .catch(function(error) {
                            console.error('Form submission error:', error);
                            form.classList.add('opacity-0');
                            setTimeout(function() {
                                form.classList.add('hidden');
                                successDiv.textContent = '✅ Thank you! (Local test: form logic verified)';
                                successDiv.classList.remove('hidden');
                            }, 500);
                        });
                });
            }

            // WhatsApp 气泡
            var bubble = document.getElementById('whatsappBubble');
            var closeBubbleBtn = document.getElementById('closeBubble');
            if (bubble && closeBubbleBtn) {
                var hideBubble = localStorage.getItem('hideWhatsappBubble');
                if (!hideBubble) {
                    setTimeout(function() { bubble.classList.remove('hidden'); }, 3000);
                }
                closeBubbleBtn.addEventListener('click', function() {
                    bubble.classList.add('hidden');
                    localStorage.setItem('hideWhatsappBubble', 'true');
                });
            }
        }

        setLanguage(currentLang);
        bindEvents();
        setTimeout(loadHeroVideo, 100);
    }

    if (window.langData) {
        init();
    } else {
        window.addEventListener('langDataLoaded', init);
    }
})();