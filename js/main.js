// js/main.js
(function() {
    'use strict';

    if (!window.langData) {
        window.addEventListener('langDataLoaded', init);
    } else {
        init();
    }

    function init() {
        var langData = window.langData;
        var supportedLangs = ['en', 'es', 'th', 'vi', 'zh'];
        var currentLang = 'en';

        // ====== 修改开始 ======
        // 仅从 localStorage 读取用户上次选择，若没有则默认 'en'
        // 移除自动检测浏览器语言逻辑，保证所有新访客看到英文
        try {
            var saved = localStorage.getItem('proTrayLang');
            if (saved && supportedLangs.indexOf(saved) !== -1) {
                currentLang = saved;
            }
        } catch (_) {}
        // 不再根据 navigator.language 自动切换
        // ====== 修改结束 ======

        var flagMap = { en: 'us', es: 'mx', th: 'th', vi: 'vn', zh: 'cn' };
        var langNames = { en: 'English', es: 'Español', th: 'ไทย', vi: 'Tiếng Việt', zh: '中文' };

        var imageMap = {
            '50': 'assets/images/tray-50.jpg',
            '72': 'assets/images/tray-72.jpg',
            '105': 'assets/images/tray-105.jpg',
            '128': 'assets/images/tray-128.jpg'
        };

        // ============================================================
        // 视频异步加载（无闪烁）
        // ============================================================
        function loadHeroVideo() {
            var video = document.getElementById('heroVideo');
            var placeholder = document.getElementById('videoPlaceholder');
            if (!video) return;

            var videoUrl = 'https://cloud.video.taobao.com/play/u/2214317181391/p/2/e/6/t/1/531712869626.mp4';

            if (video.src) {
                video.play().catch(function() {});
                return;
            }

            video.src = videoUrl;
            video.load();

            video.addEventListener('canplay', function onCanPlay() {
                video.removeEventListener('canplay', onCanPlay);
                video.style.opacity = '1';
                if (placeholder) {
                    placeholder.classList.add('hidden');
                }
                video.play().catch(function() {});
            });

            if (video.readyState >= 3) {
                video.style.opacity = '1';
                if (placeholder) {
                    placeholder.classList.add('hidden');
                }
                video.play().catch(function() {});
            }

            if (placeholder) {
                placeholder.addEventListener('click', function() {
                    if (!video.src) {
                        video.src = videoUrl;
                        video.load();
                    }
                    video.play().catch(function() {});
                });
            }
        }

        // ---------- 翻译函数 ----------
        function setLanguage(lang) {
            if (!langData[lang]) return;
            currentLang = lang;

            document.querySelectorAll('[data-i18n]').forEach(function(el) {
                if (el.hasAttribute('data-i18n-option')) return;
                var key = el.getAttribute('data-i18n');
                var val = langData[lang][key];
                if (val !== undefined && typeof val === 'string') {
                    el.textContent = val;
                }
            });

            document.querySelectorAll('[data-i18n-option]').forEach(function(el) {
                var optionKey = el.getAttribute('data-i18n-option');
                var value = el.getAttribute('data-value');
                var optMap = langData[lang][optionKey];
                if (optMap && optMap[value]) {
                    el.textContent = optMap[value];
                }
            });

            document.querySelectorAll('select[data-i18n-options]').forEach(function(select) {
                var optionKey = select.getAttribute('data-i18n-options');
                var optMap = langData[lang][optionKey];
                if (!optMap) return;
                Array.from(select.options).forEach(function(opt) {
                    var val = opt.value;
                    if (optMap[val] !== undefined) {
                        opt.textContent = optMap[val];
                    }
                });
            });

            var label = document.getElementById('currentLangLabel');
            if (label) label.textContent = langNames[lang] || lang;

            var flagImg = document.getElementById('currentFlag');
            if (flagImg) {
                flagImg.src = 'https://flagcdn.com/w40/' + flagMap[lang] + '.png';
                flagImg.alt = langNames[lang] || lang;
            }

            document.querySelectorAll('.lang-option').forEach(function(opt) {
                var ol = opt.getAttribute('data-lang');
                if (ol === lang) {
                    opt.style.fontWeight = '600';
                    opt.style.background = '#e5f0e5';
                } else {
                    opt.style.fontWeight = '400';
                    opt.style.background = 'transparent';
                }
            });

            try { localStorage.setItem('proTrayLang', lang); } catch (_) {}
        }

        // ---------- 联动计算核心 ----------
        function calcPcsAndGross(weight, thickness, height) {
            var pitchMap = { '0.4': 0.2, '0.8': 0.35, '1.2': 0.5 };
            var pitch = pitchMap[thickness] || 0.35;
            var pcs = Math.floor((height - 5) / pitch);
            var gross = Math.round(((weight * pcs) + 1200) / 100) / 10;
            return { pcs: pcs, gross: gross };
        }

        function getSelectedValue(model, param) {
            var activeBtn = document.querySelector('.btn-group[data-model="' + model + '"][data-param="' + param + '"] .btn-option.active');
            if (activeBtn) {
                return activeBtn.getAttribute('data-value');
            }
            var first = document.querySelector('.btn-group[data-model="' + model + '"][data-param="' + param + '"] .btn-option');
            return first ? first.getAttribute('data-value') : null;
        }

        function updateModel(model) {
            var weightVal = getSelectedValue(model, 'weight');
            var thicknessVal = getSelectedValue(model, 'thickness');
            var heightVal = getSelectedValue(model, 'height');
            if (!weightVal || !thicknessVal || !heightVal) return;
            var weight = parseFloat(weightVal);
            var thickness = thicknessVal;
            var height = parseFloat(heightVal);
            var result = calcPcsAndGross(weight, thickness, height);
            var pcsSpan = document.getElementById('pcs-' + model);
            var grossSpan = document.getElementById('gross-' + model);
            if (pcsSpan) pcsSpan.textContent = result.pcs;
            if (grossSpan) grossSpan.textContent = result.gross.toFixed(1);
        }

        function updateImage(model) {
            var img = document.getElementById('productImage');
            if (img && imageMap[model]) {
                img.src = imageMap[model];
                img.alt = 'ProTray ' + model + ' Cell Tray';
            }
        }

        // ---------- 绑定按钮事件 ----------
        function bindButtonEvents() {
            document.querySelectorAll('.btn-option').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    var group = this.closest('.btn-group');
                    if (!group) return;
                    group.querySelectorAll('.btn-option').forEach(function(b) {
                        b.classList.remove('active', 'bg-green-600', 'text-white', 'border-green-600');
                        b.classList.add('bg-white', 'text-gray-700', 'border-gray-300');
                    });
                    this.classList.add('active', 'bg-green-600', 'text-white');
                    this.classList.remove('bg-white', 'text-gray-700', 'border-gray-300');
                    var model = group.getAttribute('data-model');
                    if (model) {
                        updateModel(model);
                    }
                });
            });
        }

        // ---------- 初始化所有型号 ----------
        function initModels() {
            var models = new Set();
            document.querySelectorAll('.btn-group[data-model]').forEach(function(el) {
                models.add(el.getAttribute('data-model'));
            });
            models.forEach(function(model) {
                updateModel(model);
            });
            var activeTab = document.querySelector('.tab-content.active');
            if (activeTab) {
                var id = activeTab.id.replace('tab-', '');
                updateImage(id);
            }
        }

        // ---------- UI 事件绑定 ----------
        function bindEvents() {
            // 语言切换
            var toggle = document.getElementById('langToggle');
            var dropdown = document.getElementById('langDropdown');
            if (toggle && dropdown) {
                toggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    dropdown.classList.toggle('active');
                });
                document.addEventListener('click', function() {
                    dropdown.classList.remove('active');
                });

                document.querySelectorAll('.lang-option').forEach(function(opt) {
                    opt.addEventListener('click', function(e) {
                        e.preventDefault();
                        var lang = this.getAttribute('data-lang');
                        if (lang) {
                            setLanguage(lang);
                            dropdown.classList.remove('active');
                        }
                    });
                });
            }

            // Tab切换 + 图片联动
            var tabBtns = document.querySelectorAll('.tab-btn');
            var tabContents = document.querySelectorAll('.tab-content');
            tabBtns.forEach(function(btn) {
                btn.addEventListener('click', function() {
                    var target = this.getAttribute('data-tab');
                    tabBtns.forEach(function(b) {
                        b.classList.remove('bg-green-600', 'text-white');
                        b.classList.add('bg-gray-200', 'text-gray-700');
                    });
                    this.classList.remove('bg-gray-200', 'text-gray-700');
                    this.classList.add('bg-green-600', 'text-white');

                    tabContents.forEach(function(c) { c.classList.remove('active'); });
                    var activeTab = document.getElementById('tab-' + target);
                    if (activeTab) {
                        activeTab.classList.add('active');
                        updateImage(target);
                    }
                });
            });

            // Hero 黄色按钮平滑滚动
            var reqSampleBtn = document.getElementById('reqSampleBtn');
            if (reqSampleBtn) {
                reqSampleBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    var formSection = document.getElementById('contactFormSection');
                    if (formSection) {
                        formSection.scrollIntoView({ behavior: 'smooth' });
                        setTimeout(function() {
                            var productSelect = document.getElementById('productModelSelect');
                            if (productSelect) {
                                productSelect.focus();
                                productSelect.classList.add('ring-2', 'ring-green-500');
                                setTimeout(function() {
                                    productSelect.classList.remove('ring-2', 'ring-green-500');
                                }, 3000);
                            }
                        }, 800);
                    }
                });
            }

            // 表单异步提交（FormCarry）
            var form = document.getElementById('leadContactForm');
            var successDiv = document.getElementById('formSuccessMessage');
            if (form && successDiv) {
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    var submitBtn = this.querySelector('button[type="submit"]');
                    var originalText = submitBtn.textContent;
                    submitBtn.disabled = true;
                    submitBtn.textContent = (langData[currentLang]?.btnSubmit || 'Submit') + '...';

                    var formData = new FormData(this);

                    fetch(this.action, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Accept': 'application/json'
                        }
                    })
                        .then(function(response) {
                            if (response.ok) {
                                form.classList.add('opacity-0');
                                setTimeout(function() {
                                    form.classList.add('hidden');
                                    var msg = langData[currentLang]?.formSuccessMessage ||
                                        'Thank you! We will contact you within 24 hours.';
                                    successDiv.textContent = '✅ ' + msg;
                                    successDiv.classList.remove('hidden');
                                }, 500);
                            } else {
                                throw new Error('Network response was not ok.');
                            }
                        })
                        .catch(function(error) {
                            console.error('Form submission error:', error);
                            submitBtn.disabled = false;
                            submitBtn.textContent = originalText;
                            alert('Oops! Something went wrong. Please try again or contact us directly.');
                        });
                });
            }
        }

        // ---------- 检测 URL 参数控制销售代表板块 ----------
        function checkRepProgramVisibility() {
            var repSection = document.getElementById('repProgramSection');
            if (!repSection) return;
            var urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has('rep')) {
                repSection.style.display = 'block';
            } else {
                repSection.style.display = 'none';
            }
        }

        // ---------- 启动 ----------
        setLanguage(currentLang);
        bindButtonEvents();
        initModels();
        bindEvents();
        checkRepProgramVisibility();

        // 延迟加载视频，避免阻塞首屏渲染
        setTimeout(loadHeroVideo, 100);

        window.setLanguage = setLanguage;
        window.updateModel = updateModel;
        window.updateImage = updateImage;

        console.log('✅ ProTray 已启动，当前语言:', currentLang);
    }
})();