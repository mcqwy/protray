// js/components.js
(function() {
    'use strict';

    // ====== 导航栏组件 ======
    var headerHTML = `
    <nav class="bg-white/90 backdrop-blur-md shadow-sm fixed w-full top-0 z-50 transition-all">
        <div class="container mx-auto px-4 py-3 flex justify-between items-center">
            <!-- 左侧 Logo 和品牌名 -->
            <a href="index.html" class="flex items-center shrink-0 group">
                <img src="assets/images/logo.png" alt="ProTray" class="h-10 w-auto mr-2 group-hover:scale-105 transition-transform">
                <span class="text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors">ProTray</span>
            </a>

            <!-- 桌面端导航 -->
            <div class="hidden md:flex items-center space-x-6">
                <a href="index.html" class="text-gray-600 hover:text-green-600 font-medium transition-colors" data-i18n="navHome">Home</a>
                <a href="about.html" class="text-gray-600 hover:text-green-600 font-medium transition-colors" data-i18n="navAbout">About Us</a>
                <button id="navQuoteBtn" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-5 rounded-lg text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5" data-i18n="btnNavQuote">Get a Quote</button>
                
                <!-- 语言切换 -->
                <div class="relative shrink-0">
                    <button id="langToggle" class="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-1.5 shadow-sm hover:shadow-md text-sm transition">
                        <span class="mr-2"><img id="currentFlag" src="https://flagcdn.com/w40/us.png" alt="English" class="w-4 h-3 rounded" width="16" height="12"></span>
                        <span id="currentLangLabel" data-i18n="currentLang" class="hidden sm:inline">English</span>
                        <i class="fas fa-chevron-down ml-1 text-gray-500 text-xs"></i>
                    </button>
                    <div id="langDropdown" class="lang-dropdown">
                        <a href="#" class="lang-option" data-lang="en"><img src="https://flagcdn.com/w40/us.png" alt="English" width="20" height="14"><span>English</span></a>
                        <a href="#" class="lang-option" data-lang="es"><img src="https://flagcdn.com/w40/mx.png" alt="Español" width="20" height="14"><span>Español</span></a>
                        <a href="#" class="lang-option" data-lang="zh"><img src="https://flagcdn.com/w40/cn.png" alt="中文" width="20" height="14"><span>中文</span></a>
                        <a href="#" class="lang-option" data-lang="th"><img src="https://flagcdn.com/w40/th.png" alt="ไทย" width="20" height="14"><span>ไทย</span></a>
                        <a href="#" class="lang-option" data-lang="vi"><img src="https://flagcdn.com/w40/vn.png" alt="Tiếng Việt" width="20" height="14"><span>Tiếng Việt</span></a>
                    </div>
                </div>
            </div>

            <!-- 移动端菜单按钮 -->
            <button id="mobileMenuBtn" class="md:hidden text-gray-600 text-2xl focus:outline-none">
                <i class="fas fa-bars"></i>
            </button>
        </div>

        <!-- 移动端下拉菜单 -->
        <div id="mobileMenu" class="hidden md:hidden bg-white border-t px-4 py-4 space-y-4 shadow-lg">
            <a href="index.html" class="block text-gray-700 font-medium hover:text-green-600" data-i18n="navHome">Home</a>
            <a href="about.html" class="block text-gray-700 font-medium hover:text-green-600" data-i18n="navAbout">About Us</a>
            <button id="mobileQuoteBtn" class="w-full bg-green-600 text-white font-bold py-3 rounded-lg text-sm" data-i18n="btnNavQuote">Get a Quote</button>
            <div class="flex items-center space-x-3 pt-2">
                <div class="relative flex-1">
                    <button id="mobileLangToggle" class="flex items-center justify-between w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm">
                        <span id="mobileCurrentLangLabel" data-i18n="currentLang">English</span>
                        <i class="fas fa-chevron-down text-gray-500 text-xs"></i>
                    </button>
                    <div id="mobileLangDropdown" class="lang-dropdown w-full left-0 mt-1">
                        <a href="#" class="lang-option" data-lang="en"><img src="https://flagcdn.com/w40/us.png" alt="English" width="20" height="14"><span>English</span></a>
                        <a href="#" class="lang-option" data-lang="es"><img src="https://flagcdn.com/w40/mx.png" alt="Español" width="20" height="14"><span>Español</span></a>
                        <a href="#" class="lang-option" data-lang="zh"><img src="https://flagcdn.com/w40/cn.png" alt="中文" width="20" height="14"><span>中文</span></a>
                        <a href="#" class="lang-option" data-lang="th"><img src="https://flagcdn.com/w40/th.png" alt="ไทย" width="20" height="14"><span>ไทย</span></a>
                        <a href="#" class="lang-option" data-lang="vi"><img src="https://flagcdn.com/w40/vn.png" alt="Tiếng Việt" width="20" height="14"><span>Tiếng Việt</span></a>
                    </div>
                </div>
            </div>
        </div>
    </nav>
    `;

    // ====== 页脚组件 ======
    var footerHTML = `
    <footer class="bg-gray-800 text-white py-10 mt-12">
        <div class="container mx-auto px-4">
            <div class="flex flex-col md:flex-row justify-between items-center gap-6">
                <div class="text-center md:text-left">
                    <div class="flex items-center justify-center md:justify-start">
                        <img src="assets/images/logo.png" alt="ProTray" class="h-8 w-auto mr-2 brightness-0 invert">
                        <span class="text-xl font-bold">ProTray</span>
                    </div>
                    <p class="mt-3 text-gray-400 text-sm" data-i18n="footerAddress">Jining Logistics Hub, Shandong Province, China</p>
                </div>
                <div class="flex space-x-6">
                    <a href="#" class="text-gray-400 hover:text-white transition"><i class="fab fa-linkedin text-xl"></i></a>
                    <a href="#" class="text-gray-400 hover:text-white transition"><i class="fab fa-facebook text-xl"></i></a>
                    <a href="#" class="text-gray-400 hover:text-white transition"><i class="fab fa-instagram text-xl"></i></a>
                </div>
            </div>
            <div class="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
                <p>&copy; 2023 ProTray. All rights reserved.</p>
            </div>
        </div>
    </footer>
    `;

    window.ProTrayComponents = {
        header: headerHTML,
        footer: footerHTML
    };

    window.dispatchEvent(new CustomEvent('componentsLoaded'));
})();