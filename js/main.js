// js/main.js
(function() {
    'use strict';

    if (!window.langData) {
        window.addEventListener('langDataLoaded', init);
    } else {
        init();
    }

    function init() {
        const langData = window.langData;
        const supportedLangs = ['en', 'es', 'th', 'vi', 'zh'];
        let currentLang = 'en';

        try {
            const saved = localStorage.getItem('proTrayLang');
            if (saved && supportedLangs.includes(saved)) currentLang = saved;
        } catch (_) {}

        if (!localStorage.getItem('proTrayLang')) {
            const userLang = navigator.language.split('-')[0];
            if (supportedLangs.includes(userLang)) currentLang = userLang;
        }

        const flagMap = { en: 'us', es: 'mx', th: 'th', vi: 'vn', zh: 'cn' };
        const langNames = { en: 'English', es: 'Español', th: 'ไทย', vi: 'Tiếng Việt', zh: '中文' };

        // ====== 图片映射（已修改为 assets/images/ 目录） ======
        const imageMap = {
            '50': 'assets/images/tray-50.jpg',
            '72': 'assets/images/tray-72.jpg',
            '105': 'assets/images/tray-105.jpg',
            '128': 'assets/images/tray-128.jpg'
        };

        // ---------- 翻译函数 ----------
        function setLanguage(lang) {
            if (!langData[lang]) return;
            currentLang = lang;

            document.querySelectorAll('[data-i18n]').forEach(el => {
                if (el.hasAttribute('data-i18n-option')) return;
                const key = el.getAttribute('data-i18n');
                const val = langData[lang][key];
                if (val !== undefined && typeof val === 'string') {
                    el.textContent = val;
                }
            });

            document.querySelectorAll('[data-i18n-option]').forEach(el => {
                const optionKey = el.getAttribute('data-i18n-option');
                const value = el.getAttribute('data-value');
                const optMap = langData[lang][optionKey];
                if (optMap && optMap[value]) {
                    el.textContent = optMap[value];
                }
            });

            document.querySelectorAll('select[data-i18n-options]').forEach(select => {
                const optionKey = select.getAttribute('data-i18n-options');
                const optMap = langData[lang][optionKey];
                if (!optMap) return;
                Array.from(select.options).forEach(opt => {
                    const val = opt.value;
                    if (optMap[val] !== undefined) {
                        opt.textContent = optMap[val];
                    }
                });
            });

            const label = document.getElementById('currentLangLabel');
            if (label) label.textContent = langNames[lang] || lang;

            const flagImg = document.getElementById('currentFlag');
            if (flagImg) {
                flagImg.src = 'https://flagcdn.com/w40/' + flagMap[lang] + '.png';
                flagImg.alt = langNames[lang] || lang;
            }

            document.querySelectorAll('.lang-option').forEach(opt => {
                const ol = opt.getAttribute('data-lang');
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
            const pitchMap = { '0.4': 0.2, '0.8': 0.35, '1.2': 0.5 };
            const pitch = pitchMap[thickness] || 0.35;
            const pcs = Math.floor((height - 5) / pitch);
            const gross = Math.round(((weight * pcs) + 1200) / 100) / 10;
            return { pcs, gross };
        }

        function getSelectedValue(model, param) {
            const activeBtn = document.querySelector(
                '.btn-group[data-model="' + model + '"][data-param="' + param + '"] .btn-option.active'
            );
            if (activeBtn) {
                return activeBtn.getAttribute('data-value');
            }
            const first = document.querySelector(
                '.btn-group[data-model="' + model + '"][data-param="' + param + '"] .btn-option'
            );
            return first ? first.getAttribute('data-value') : null;
        }

        function updateModel(model) {
            const weightVal = getSelectedValue(model, 'weight');
            const thicknessVal = getSelectedValue(model, 'thickness');
            const heightVal = getSelectedValue(model, 'height');

            if (!weightVal || !thicknessVal || !heightVal) return;

            const weight = parseFloat(weightVal);
            const thickness = thicknessVal;
            const height = parseFloat(heightVal);

            const result = calcPcsAndGross(weight, thickness, height);
            const pcsSpan = document.getElementById('pcs-' + model);
            const grossSpan = document.getElementById('gross-' + model);
            if (pcsSpan) pcsSpan.textContent = result.pcs;
            if (grossSpan) grossSpan.textContent = result.gross.toFixed(1);
        }

        // ---------- 更新右侧图片 ----------
        function updateImage(model) {
            const img = document.getElementById('productImage');
            if (img && imageMap[model]) {
                img.src = imageMap[model];
                img.alt = 'ProTray ' + model + ' Cell Tray';
            }
        }

        // ---------- 绑定按钮事件 ----------
        function bindButtonEvents() {
            document.querySelectorAll('.btn-option').forEach(btn => {
                btn.addEventListener('click', function() {
                    const group = this.closest('.btn-group');
                    if (!group) return;
                    group.querySelectorAll('.btn-option').forEach(b => {
                        b.classList.remove('active', 'bg-green-600', 'text-white', 'border-green-600');
                        b.classList.add('bg-white', 'text-gray-700', 'border-gray-300');
                    });
                    this.classList.add('active', 'bg-green-600', 'text-white');
                    this.classList.remove('bg-white', 'text-gray-700', 'border-gray-300');
                    const model = group.getAttribute('data-model');
                    if (model) {
                        updateModel(model);
                    }
                });
            });
        }

        // ---------- 初始化所有型号 ----------
        function initModels() {
            const models = new Set();
            document.querySelectorAll('.btn-group[data-model]').forEach(el => {
                models.add(el.getAttribute('data-model'));
            });
            models.forEach(model => {
                updateModel(model);
            });
            const activeTab = document.querySelector('.tab-content.active');
            if (activeTab) {
                const id = activeTab.id.replace('tab-', '');
                updateImage(id);
            }
        }

        // ---------- UI 事件绑定 ----------
        function bindEvents() {
            // 语言切换
            const toggle = document.getElementById('langToggle');
            const dropdown = document.getElementById('langDropdown');
            if (toggle && dropdown) {
                toggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    dropdown.classList.toggle('active');
                });
                document.addEventListener('click', function() {
                    dropdown.classList.remove('active');
                });

                document.querySelectorAll('.lang-option').forEach(opt => {
                    opt.addEventListener('click', function(e) {
                        e.preventDefault();
                        const lang = this.getAttribute('data-lang');
                        if (lang) {
                            setLanguage(lang);
                            dropdown.classList.remove('active');
                        }
                    });
                });
            }

            // Tab切换 + 图片联动
            const tabBtns = document.querySelectorAll('.tab-btn');
            const tabContents = document.querySelectorAll('.tab-content');
            tabBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const target = this.getAttribute('data-tab');
                    tabBtns.forEach(b => {
                        b.classList.remove('bg-green-600', 'text-white');
                        b.classList.add('bg-gray-200', 'text-gray-700');
                    });
                    this.classList.remove('bg-gray-200', 'text-gray-700');
                    this.classList.add('bg-green-600', 'text-white');

                    tabContents.forEach(c => c.classList.remove('active'));
                    const activeTab = document.getElementById('tab-' + target);
                    if (activeTab) {
                        activeTab.classList.add('active');
                        updateImage(target);
                    }
                });
            });

            // Hero 黄色按钮平滑滚动
            const reqSampleBtn = document.getElementById('reqSampleBtn');
            if (reqSampleBtn) {
                reqSampleBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    const formSection = document.getElementById('contactFormSection');
                    if (formSection) {
                        formSection.scrollIntoView({ behavior: 'smooth' });
                        setTimeout(function() {
                            const productSelect = document.getElementById('productModelSelect');
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
            const form = document.getElementById('leadContactForm');
            const successDiv = document.getElementById('formSuccessMessage');
            if (form && successDiv) {
                form.addEventListener('submit', function(e) {
                    e.preventDefault();

                    const submitBtn = this.querySelector('button[type="submit"]');
                    const originalText = submitBtn.textContent;
                    submitBtn.disabled = true;
                    submitBtn.textContent = (langData[currentLang]?.btnSubmit || 'Submit') + '...';

                    const formData = new FormData(this);

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
                                    const msg = langData[currentLang]?.formSuccessMessage ||
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
            const repSection = document.getElementById('repProgramSection');
            if (!repSection) return;
            const urlParams = new URLSearchParams(window.location.search);
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

        // 暴露公共方法
        window.setLanguage = setLanguage;
        window.updateModel = updateModel;
        window.updateImage = updateImage;

        console.log('✅ ProTray 已启动，当前语言:', currentLang);
    }
})();