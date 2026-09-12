let allHadiths = [];
let allChapters = [];
let filteredHadiths = [];
let totalHadithsKnown = 0;
let backgroundLoadNote = '';
let bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
let currentPage = 1;
const itemsPerPage = 20;
let currentLanguage = 'ar';
let fontScale = 100;
let toastTimeout;

const translations = {
    ar: {
        siteTitle: "صحيح البخاري",
        siteSubtitle: "الجامع المسند الصحيح المختصر",
        bioBtn: "سيرة البخاري",
        langBtn: "English",

        heroTag: "موسوعة الحديث",
        heroTitle: "«على خُطى الحبيب ﷺ تسير القلوب»",
        heroQuote: "رَسُولُ اللَّهِ ﷺ: \"تَرَكْتُ فِيكُمْ أَمْرَيْنِ لَنْ تَضِلُّوا مَا تَمَسَّكْتُمْ بِهِمَا: كِتَابَ اللَّهِ وَسُنَّةَ نَبِيِّهِ\".",
        heroSource: "— رواه مالك",

        sidebarTitle: "أبواب الكتاب",
        allChapters: "جميع الأبواب",
        searchPlaceholder: "ابحث في نص الحديث، الراوي، أو الرقم...",

        lenAll: "الكل",
        lenShort: "قصيرة",
        lenLong: "طويلة",

        bookmarksBtn: "المفضلة",

        chaptersDrawerTitle: "أبواب الكتاب",
        clearAllFilters: "مسح الكل",
        filterBtnLabel: "فلترة",
        filtersModalTitle: "فلترة النتائج",
        filtersLengthLabel: "طول الحديث",
        doneBtn: "تم",

        modalTag: "أمير المؤمنين في الحديث",
        modalTitle: "الإمام أبو عبد الله محمد بن إسماعيل البخاري",
        modalDates: "(194 هـ - 256 هـ / 810 م - 870 م)",

        modalSec1Title: "نشأته وطلبه للعلم",
        modalSec1Text: "ولد في بخارى شوال سنة 194 هـ، ونشأ يتيماً في كفالة والده الذي كان من أهل العلم. حفظ القرآن الكريم وأمهات الكتب وهو لم يناهز عشر سنين، وأودع الله فيه قوة حفظ استثنائية.",

        modalSec2Title: "رحلاته العلمية",
        modalSec2Text: "رحل في طلب الحديث إلى معظم أقطار العالم الإسلامي؛ فزار مكة والمدينة والبصرة والكوفة وبغداد ومصر والشام، وسمع من أكثر من ألف شيخ، وجمع مئات الآلاف من الأحاديث.",

        modalSec3Title: "جمع الجامع الصحيح",
        modalSec3Text: "استغرق في تصنيف كتابه \"الجامع الصحيح\" 16 سنة، وانتقاه من بين 600,000 حديث. وكان لا يضع حديثاً في كتابه إلا بعد أن يغتسل ويصلي ركعتين يستخير الله فيها.",

        modalCloseBtn: "إغلاق",

        contactTitle: "تواصل معنا",
        contactDesc: "لأي استفسارات أو ملاحظات حول التطبيق والمحتوى، يمكنك التواصل معنا عبر الوسائل التالية:",
        contactEmail: "contact@bukhari-app.com",
        contactPhone: "+966 50 000 0000",

        footerTitle: "صحيح البخاري",
        footerSubtitle: "مكتبة إلكترونية شاملة مخصصة لخدمة وعرض أحاديث صحيح البخاري بيسر وسهولة، بمميزات بحث تفاعلية تناسب طلاب العلم والعموم.",

        footerLinksTitle: "روابط سريعة",
        footerLinkHome: "الرئيسية",
        footerLinkChapters: "دليل الأبواب",
        footerLinkBio: "سيرة الإمام البخاري",
        footerLinkBookmarks: "الأحاديث المفضلة",

        footerContactTitle: "تواصل معنا",
        footerContactEmail: "contact@bukhari-app.com",
        footerContactPhone: "+966 50 000 0000",
        footerContactLocation: "المدينة المنورة، المملكة العربية السعودية",

        footerRights: "جميع الحقوق محفوظة © 2026 منصة صحيح البخاري"
    },

    en: {
        siteTitle: "Sahih al-Bukhari",
        siteSubtitle: "The Authentic Hadith Collection",
        bioBtn: "Biography",
        langBtn: "العربية",

        heroTag: "Hadith Encyclopedia",
        heroTitle: "“Following in the footsteps of the Prophet ﷺ”",
        heroQuote: "The Messenger of Allah ﷺ said: \"I have left among you two things; if you hold fast to them, you will never go astray: the Book of Allah and the Sunnah of His Prophet.\"",
        heroSource: "— Narrated by Malik",

        sidebarTitle: "Book Chapters",
        allChapters: "All Chapters",
        searchPlaceholder: "Search Hadith text, narrator, or number...",

        lenAll: "All",
        lenShort: "Short",
        lenLong: "Long",

        bookmarksBtn: "Bookmarks",

        chaptersDrawerTitle: "Book Chapters",
        clearAllFilters: "Clear all",
        filterBtnLabel: "Filters",
        filtersModalTitle: "Filter Results",
        filtersLengthLabel: "Hadith Length",
        doneBtn: "Done",

        modalTag: "Leader of Believers in Hadith",
        modalTitle: "Imam Abu Abd-Allah Muhammad ibn Ismail al-Bukhari",
        modalDates: "(194 AH - 256 AH / 810 CE - 870 CE)",

        modalSec1Title: "Early Life & Education",
        modalSec1Text: "Born in Bukhara in Shawwal 194 AH, raised as an orphan under his mother's care. He memorized the Quran and major classical texts before age ten, gifted with extraordinary memory.",

        modalSec2Title: "Journeys for Knowledge",
        modalSec2Text: "He traveled extensively across Islamic lands including Makkah, Madinah, Basra, Kufa, Baghdad, Egypt, and Sham, learning from over 1,000 scholars.",

        modalSec3Title: "Compiling Sahih al-Bukhari",
        modalSec3Text: "It took him 16 years to compile 'Al-Jami' al-Sahih', selected from 600,000 narration accounts. He prayed two units of guidance prayer before inserting every single Hadith.",

        modalCloseBtn: "Close",

        contactTitle: "Contact Us",
        contactDesc: "For any inquiries or feedback regarding the application and content, you can reach out via:",
        contactEmail: "contact@bukhari-app.com",
        contactPhone: "+966 50 000 0000",

        footerTitle: "Sahih al-Bukhari",
        footerSubtitle: "A comprehensive digital library designed to serve and present Sahih al-Bukhari Hadiths easily with interactive search features.",

        footerLinksTitle: "Quick Links",
        footerLinkHome: "Home",
        footerLinkChapters: "Chapters Index",
        footerLinkBio: "Imam Bukhari Biography",
        footerLinkBookmarks: "Bookmarked Hadiths",

        footerContactTitle: "Contact Us",
        footerContactEmail: "contact@bukhari-app.com",
        footerContactPhone: "+966 50 000 0000",
        footerContactLocation: "Madinah, Kingdom of Saudi Arabia",

        footerRights: "All rights reserved © 2026 Sahih al-Bukhari Platform"
    }
};

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderSkeleton();
    initApp();
    setupModalEvents();
    setupDrawerEvents();
    setupFiltersModalEvents();
    setupSearchLanguageRestriction();
    setupScrollTopButton();
});

function initApp() {
    if (typeof bukhariData !== 'undefined') {
        processData(bukhariData);
    } else {
        fetchBukhariJSON();
    }
}

function renderSkeleton() {
    const container = document.getElementById('hadith-container');
    if (!container) return;
    const skeletonBlock = 'animate-pulse bg-stone-200 dark:bg-white/10 rounded';

    const cards = Array.from({ length: 4 }).map(() => `
        <div class="bg-white dark:bg-stone-900 border border-gold-500/20 rounded-2xl p-6 shadow-sm">
            <div class="flex items-center gap-3 mb-4">
                <div class="${skeletonBlock} h-6 w-24"></div>
                <div class="${skeletonBlock} h-4 w-32 hidden sm:block"></div>
            </div>
            <div class="space-y-2.5">
                <div class="${skeletonBlock} h-4 w-full"></div>
                <div class="${skeletonBlock} h-4 w-11/12"></div>
                <div class="${skeletonBlock} h-4 w-3/4"></div>
            </div>
        </div>
    `).join('');

    container.innerHTML = cards;
}

async function fetchBukhariJSON() {
    const cached = await getCachedBukhariData();
    if (cached) {
        processData(cached);
        refreshDataInBackground();
        return;
    }

    const usedChunks = await loadFromChunkedFormat();
    if (!usedChunks) {
        await fetchLegacyBukhariJSON();
    }
}

async function fetchLegacyBukhariJSON() {
    try {
        const response = await fetch('./data/bukhari.json');
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        const data = await response.json();
        processData(data);
        setCachedBukhariData(data);
    } catch (error) {
        console.error('Error loading data:', error);
        const container = document.getElementById('hadith-container');
        if (container) {
            container.innerHTML = `
            <div class="bg-white dark:bg-stone-900 rounded-2xl p-12 text-center border border-gold-500/20 shadow-sm">
                <i class="fa-solid fa-triangle-exclamation text-3xl text-gold-500/50 mb-3 block"></i>
                <div class="text-base font-bold text-stone-700 dark:text-stone-300">
                ${currentLanguage === 'en'
                    ? 'Failed to load data file.'
                    : 'حدث خطأ أثناء تحميل ملف البيانات.'
                }
                </div>
            </div>
        `;
        }
    }
}

async function loadFromChunkedFormat() {
    let meta;
    try {
        const response = await fetch('./data/meta.json');
        if (!response.ok) return false;
        meta = await response.json();
    } catch (error) {
        return false;
    }

    if (!meta || !Array.isArray(meta.index) || !meta.chunkCount) return false;

    totalHadithsKnown = meta.totalHadiths || meta.index.length;
    setChaptersFromRawList(meta.chapters);
    renderChaptersLists();
    updateBookmarksCount();

    try {
        const firstChunkRes = await fetch('./data/chunk-0.json');
        if (!firstChunkRes.ok) return false;
        const firstChunk = await firstChunkRes.json();
        allHadiths = firstChunk.hadiths || [];
        applyFilters();
    } catch (error) {
        return false;
    }

    streamRemainingChunks(meta);
    return true;
}

async function streamRemainingChunks(meta) {
    for (let i = 1; i < meta.chunkCount; i++) {
        try {
            const response = await fetch(`./data/chunk-${i}.json`);
            if (response.ok) {
                const chunk = await response.json();
                allHadiths = allHadiths.concat(chunk.hadiths || []);
                backgroundLoadNote = currentLanguage === 'en'
                    ? ` (loading more… ${i + 1}/${meta.chunkCount})`
                    : ` (جاري تحميل الباقي... ${i + 1}/${meta.chunkCount})`;
                applyFilters(true);
            }
        } catch (error) {}
    }

    backgroundLoadNote = '';
    totalHadithsKnown = allHadiths.length;
    updateResultsCount();
    setCachedBukhariData({ chapters: meta.chapters || [], hadiths: allHadiths });
}

const DATA_CACHE_DB_NAME = 'bukhari-cache';
const DATA_CACHE_STORE_NAME = 'kv';
const DATA_CACHE_KEY = 'bukhari-json-v1';

function openDataCacheDB() {
    return new Promise((resolve, reject) => {
        if (!('indexedDB' in window)) {
            reject(new Error('IndexedDB unsupported'));
            return;
        }
        const request = indexedDB.open(DATA_CACHE_DB_NAME, 1);
        request.onupgradeneeded = () => {
            request.result.createObjectStore(DATA_CACHE_STORE_NAME);
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function getCachedBukhariData() {
    try {
        const db = await openDataCacheDB();
        return await new Promise((resolve) => {
            const tx = db.transaction(DATA_CACHE_STORE_NAME, 'readonly');
            const req = tx.objectStore(DATA_CACHE_STORE_NAME).get(DATA_CACHE_KEY);
            req.onsuccess = () => resolve(req.result || null);
            req.onerror = () => resolve(null);
        });
    } catch (error) {
        return null;
    }
}

async function setCachedBukhariData(data) {
    try {
        const db = await openDataCacheDB();
        await new Promise((resolve) => {
            const tx = db.transaction(DATA_CACHE_STORE_NAME, 'readwrite');
            tx.objectStore(DATA_CACHE_STORE_NAME).put(data, DATA_CACHE_KEY);
            tx.oncomplete = () => resolve();
            tx.onerror = () => resolve();
        });
    } catch (error) {}
}

async function refreshDataInBackground() {
    try {
        const metaRes = await fetch('./data/meta.json', { cache: 'no-cache' });
        if (metaRes.ok) {
            const meta = await metaRes.json();
            if (meta && Array.isArray(meta.index) && meta.chunkCount) {
                const hadiths = [];
                for (let i = 0; i < meta.chunkCount; i++) {
                    const chunkRes = await fetch(`./data/chunk-${i}.json`, { cache: 'no-cache' });
                    if (!chunkRes.ok) return;
                    const chunk = await chunkRes.json();
                    hadiths.push(...(chunk.hadiths || []));
                }
                setCachedBukhariData({ chapters: meta.chapters || [], hadiths });
                return;
            }
        }
    } catch (error) {}

    try {
        const response = await fetch('./data/bukhari.json', { cache: 'no-cache' });
        if (!response.ok) return;
        const data = await response.json();
        setCachedBukhariData(data);
    } catch (error) {}
}

function processData(data) {
    allHadiths = data.hadiths || data.items || (Array.isArray(data) ? data : []);
    totalHadithsKnown = allHadiths.length;
    setChaptersFromRawList(data.chapters);
    renderChaptersLists();
    updateBookmarksCount();
    applyFilters();
}

function setChaptersFromRawList(rawChapters) {
    if (rawChapters && Array.isArray(rawChapters) && rawChapters.length > 0) {
        allChapters = rawChapters.map(c => ({
            id: String(c.id),
            name: c.arabic || c.name || c.title || `كتاب ${c.id}`,
            nameEn: c.english || c.nameEn || c.titleEn || `Book ${c.id}`
        }));
    } else {
        allChapters = extractChaptersFromHadiths(allHadiths);
    }
}

function extractChaptersFromHadiths(hadiths) {
    const chaptersMap = new Map();

    hadiths.forEach(h => {
        const cId = h.chapterId ?? h.bookId ?? h.chapter ?? 1;
        const key = String(cId);

        let cName = h.chapterArabic ?? h.chapterName ?? h.bookName ?? '';
        let cNameEn = h.chapterEnglish ?? h.chapterNameEn ?? h.bookNameEn ?? '';

        if (!cName || !isNaN(cName)) {
            cName = `الباب ${key}`;
        }
        if (!cNameEn || !isNaN(cNameEn)) {
            cNameEn = `Book ${key}`;
        }

        if (!chaptersMap.has(key)) {
            chaptersMap.set(key, {
                id: key,
                name: String(cName),
                nameEn: String(cNameEn)
            });
        }
    });

    return Array.from(chaptersMap.values());
}

const CHAPTER_LIST_TARGETS = [
    { containerId: 'chapters-list', prefix: 'side' },
    { containerId: 'chapters-list-mobile', prefix: 'drawer' }
];

const CHAPTER_ACTIVE_CLASSES = [
    'bg-gold-500/10', 'dark:bg-gold-400/10',
    'text-madinah-800', 'dark:text-gold-300',
    'font-bold',
    'border-gold-500/40', 'dark:border-gold-400/30'
];

function buildChaptersListHTML(prefix) {
    const t = translations[currentLanguage];
    const activeClasses = CHAPTER_ACTIVE_CLASSES.join(' ');

    let html = `
    <button
        onclick="selectChapterFromSidebar('all')"
        id="${prefix}-chap-all"
        class="w-full text-right rtl:text-right ltr:text-left px-3 py-2.5 rounded-xl text-sm font-sans font-bold transition-all mb-1 border flex items-center justify-between ${filterState.chapter === 'all' ? activeClasses : 'border-transparent'}"
    >
        <span>${t.allChapters}</span>
        <span class="text-[10px] bg-stone-200/50 dark:bg-stone-800 px-2 py-0.5 rounded-full">
            ${totalHadithsKnown || allHadiths.length}
        </span>
    </button>
`;

    html += allChapters.map(chapter => `
            <button
                onclick="selectChapterFromSidebar('${chapter.id}')"
                id="${prefix}-chap-${chapter.id}"
                class="w-full text-right rtl:text-right ltr:text-left px-3 py-2.5 rounded-xl text-sm font-sans text-stone-600 dark:text-stone-300 hover:bg-gold-500/10 hover:text-madinah-800 dark:hover:text-gold-300 transition-all mb-1 border flex items-center justify-between ${String(filterState.chapter) === String(chapter.id) ? activeClasses : 'border-transparent'}"
            >
                <span class="truncate pl-2">
                    ${currentLanguage === 'en' ? chapter.nameEn : chapter.name}
                </span>
            </button>
        `).join('');

    return html;
}

function renderChaptersLists() {
    CHAPTER_LIST_TARGETS.forEach(({ containerId, prefix }) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = buildChaptersListHTML(prefix);
    });
    updateChaptersTriggerLabel();
}

function selectChapterFromSidebar(chapterId) {
    setChapterFilter(chapterId);
    updateActiveSidebarChapter();
    updateChaptersTriggerLabel();
    applyFilters();
    toggleChaptersDrawer(false);
}

function updateActiveSidebarChapter() {
    CHAPTER_LIST_TARGETS.forEach(({ prefix }) => {
        [{ id: 'all' }, ...allChapters].forEach(chapter => {
            const button = document.getElementById(`${prefix}-chap-${chapter.id}`);
            if (!button) return;

            const isActive = String(chapter.id) === String(filterState.chapter);
            button.classList.toggle('border-transparent', !isActive);
            CHAPTER_ACTIVE_CLASSES.forEach((cls) => {
                button.classList.toggle(cls, isActive);
            });
        });
    });
}

function updateChaptersTriggerLabel() {
    const label = document.getElementById('chapters-trigger-label');
    if (!label) return;

    const t = translations[currentLanguage];
    if (filterState.chapter === 'all') {
        label.innerText = t.allChapters;
        return;
    }
    label.innerText = chapterLabelById(filterState.chapter);
}

function toggleChaptersDrawer(show) {
    const drawer = document.getElementById('chapters-drawer');
    const panel = document.getElementById('chapters-drawer-panel');

    if (!drawer || !panel) return;

    if (show) {
        drawer.classList.remove('hidden');
        requestAnimationFrame(() => {
            drawer.classList.remove('opacity-0', 'pointer-events-none');
            drawer.classList.add('opacity-100');
            panel.classList.remove('translate-y-full');
            panel.classList.add('translate-y-0');
        });
        document.body.style.overflow = 'hidden';
    } else {
        drawer.classList.remove('opacity-100');
        drawer.classList.add('opacity-0', 'pointer-events-none');
        panel.classList.remove('translate-y-0');
        panel.classList.add('translate-y-full');
        document.body.style.overflow = '';
    }
}

function setupDrawerEvents() {
    const drawer = document.getElementById('chapters-drawer');
    if (drawer) {
        drawer.addEventListener('click', e => {
            if (e.target === drawer) {
                toggleChaptersDrawer(false);
            }
        });
    }

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            toggleChaptersDrawer(false);
        }
    });
}

function toggleFiltersModal(show) {
    const modal = document.getElementById('filters-modal');
    const card = document.getElementById('filters-modal-card');

    if (!modal || !card) return;

    if (show) {
        updateFiltersModalTranslations();
        modal.classList.remove('opacity-0', 'pointer-events-none');
        modal.classList.add('opacity-100');
        card.classList.remove('scale-95');
        card.classList.add('scale-100');
    } else {
        modal.classList.remove('opacity-100');
        modal.classList.add('opacity-0', 'pointer-events-none');
        card.classList.remove('scale-100');
        card.classList.add('scale-95');
    }
}

function setupFiltersModalEvents() {
    const modal = document.getElementById('filters-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                toggleFiltersModal(false);
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            toggleFiltersModal(false);
        }
    });
}

function updateFiltersModalTranslations() {
    const t = translations[currentLanguage];
    setElementText('filters-modal-title', t.filtersModalTitle);
    setElementText('filters-modal-length-label', t.filtersLengthLabel);
    setElementText('filters-modal-done-btn', t.doneBtn);
}

function updateFilterPanelBadge() {
    const badge = document.getElementById('filter-badge');
    if (!badge) return;

    const count = getPanelActiveFilterCount();
    badge.innerText = String(count);
    badge.classList.toggle('hidden', count === 0);
    badge.classList.toggle('flex', count > 0);
}

function setLengthFilter(lengthType) {
    setLengthFilterState(lengthType);

    ['all', 'short', 'long'].forEach(type => {
        const button = document.getElementById(`len-btn-${type}`);
        if (!button) return;

        if (type === lengthType) {
            button.className = 'flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-sans font-semibold transition-all duration-200 bg-madinah-800 text-gold-300 border border-gold-500/40 shadow-sm';
        } else {
            button.className = 'flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-sans font-semibold transition-all duration-200 text-stone-500 dark:text-stone-400 hover:text-madinah-800 dark:hover:text-gold-300 hover:bg-white dark:hover:bg-white/5';
        }
    });

    applyFilters();
}

function toggleBookmark(id) {
    const stringId = String(id);
    const index = bookmarks.indexOf(stringId);
    let isAdded = false;

    if (index > -1) {
        bookmarks.splice(index, 1);
    } else {
        bookmarks.push(stringId);
        isAdded = true;
    }

    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    return isAdded;
}

function toggleBookmarksFilter() {
    const isOnly = toggleBookmarksFilterState();
    const button = document.getElementById('bookmark-filter-btn');

    if (button) {
        button.classList.toggle('bg-gold-500/20', isOnly);
        button.classList.toggle('border-gold-500', isOnly);
        button.classList.toggle('text-gold-600', isOnly);
    }

    applyFilters();
}

function handleToggleBookmark(id) {
    const isAdded = toggleBookmark(id);

    showToast(
        isAdded
            ? (currentLanguage === 'en' ? 'Saved to bookmarks' : 'تم حفظ الحديث في المفضلة')
            : (currentLanguage === 'en' ? 'Removed from bookmarks' : 'تمت إزالة الحديث من المفضلة')
    );

    updateBookmarksCount();

    if (filterState.onlyBookmarks) {
        applyFilters();
    } else {
        renderCurrentPage();
    }
}

function updateBookmarksCount() {
    const badge = document.getElementById('bookmarks-count');
    if (!badge) return;

    badge.innerText = bookmarks.length;
    badge.classList.toggle('hidden', bookmarks.length === 0);
    badge.classList.toggle('flex', bookmarks.length > 0);
}

function copyHadith(id) {
    const hadith = allHadiths.find(
        item => String(item.id ?? item.number ?? item.hadithNumber) === String(id)
    );

    if (!hadith) return;

    const arabicText = hadith.arabic ?? hadith.text ?? hadith.hadithArabic ?? '';
    let englishNarrator = '';
    let englishText = '';

    if (typeof hadith.english === 'object' && hadith.english !== null) {
        englishNarrator = hadith.english.narrator || '';
        englishText = hadith.english.text || '';
    } else if (typeof hadith.english === 'string') {
        englishText = hadith.english;
    } else {
        englishText = hadith.textEn ?? hadith.text_en ?? '';
    }

    const textToCopy = currentLanguage === 'en'
        ? `${englishNarrator}\n\n${englishText}`.trim()
        : arabicText;

    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            showToast(currentLanguage === 'en' ? 'Hadith copied successfully' : 'تم نسخ الحديث بنجاح');
        })
        .catch(() => {
            showToast(currentLanguage === 'en' ? 'Failed to copy Hadith' : 'تعذر نسخ الحديث');
        });
}

function updateResultsCount() {
    const element = document.getElementById('results-count');
    if (!element) return;

    element.innerText = (currentLanguage === 'en'
        ? `${filteredHadiths.length} Hadiths found`
        : `تم العثور على ${filteredHadiths.length} حديث`) + backgroundLoadNote;
}

function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    clearTimeout(toastTimeout);

    const icon = document.getElementById('toast-icon');
    if (icon) {
        icon.className = isError
            ? 'fa-solid fa-circle-exclamation text-red-400 text-base sm:text-lg'
            : 'fa-solid fa-circle-check text-gold-400 text-base sm:text-lg';
    }

    const messageEl = document.getElementById('toast-message');
    if (messageEl) {
        messageEl.innerText = message;
    } else {
        toast.innerText = message;
    }

    toast.classList.remove('opacity-0', 'pointer-events-none');
    toast.classList.add('opacity-100');

    toastTimeout = setTimeout(() => {
        toast.classList.remove('opacity-100');
        toast.classList.add('opacity-0', 'pointer-events-none');
    }, 2500);
}

function changeFontSize(delta) {
    const newScale = fontScale + (delta * 10);

    if (newScale >= 80 && newScale <= 150) {
        fontScale = newScale;
    }

    const label = document.getElementById('font-size-label');
    if (label) {
        label.innerText = `${fontScale}%`;
    }

    renderCurrentPage();
}

function toggleDarkMode() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon(isDark);
}

function updateThemeIcon(isDark) {
    const themeIcon = document.getElementById('theme-icon');
    if (!themeIcon) return;

    themeIcon.className = isDark
        ? 'fa-solid fa-sun text-[13px] text-gold-400'
        : 'fa-solid fa-moon text-[13px]';
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

    document.documentElement.classList.toggle('dark', shouldUseDark);
    updateThemeIcon(shouldUseDark);
}

function setupScrollTopButton() {
    const button = document.getElementById('scroll-top-btn');
    if (!button) return;

    const hiddenClasses = ['opacity-0', 'translate-y-3', 'scale-90', 'pointer-events-none'];
    const shownClasses = ['opacity-100', 'translate-y-0', 'scale-100'];

    window.addEventListener('scroll', () => {
        const shouldShow = window.scrollY > 480;

        button.classList.remove(...(shouldShow ? hiddenClasses : shownClasses));
        button.classList.add(...(shouldShow ? shownClasses : hiddenClasses));
    }, { passive: true });
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleBukhariModal(show) {
    const modal = document.getElementById('bukhari-modal');
    const card = document.getElementById('bukhari-modal-card');

    if (!modal || !card) return;

    if (show) {
        updateModalTranslations();
        modal.classList.remove('opacity-0', 'pointer-events-none');
        modal.classList.add('opacity-100');
        card.classList.remove('scale-95');
        card.classList.add('scale-100');
    } else {
        modal.classList.remove('opacity-100');
        modal.classList.add('opacity-0', 'pointer-events-none');
        card.classList.remove('scale-100');
        card.classList.add('scale-95');
    }
}

function setupModalEvents() {
    const modal = document.getElementById('bukhari-modal');

    if (modal) {
        modal.addEventListener('click', e => {
            if (e.target === modal) {
                toggleBukhariModal(false);
            }
        });
    }

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            toggleBukhariModal(false);
        }
    });
}

function updateModalTranslations() {
    const t = translations[currentLanguage];
    const modalCard = document.getElementById('bukhari-modal-card');

    if (!modalCard) return;

    const tag = modalCard.querySelector('.bg-madinah-900 span, header span');
    if (tag) tag.innerText = t.modalTag;

    const mainTitle = document.getElementById('modal-bio-title') || modalCard.querySelector('h3');
    if (mainTitle) mainTitle.innerText = t.modalTitle;

    const dates = document.getElementById('modal-bio-dates') || modalCard.querySelector('header p');
    if (dates) dates.innerText = t.modalDates;

    const h4s = modalCard.querySelectorAll('h4');
    const paragraphs = modalCard.querySelectorAll('div.p-6 p, div.md\\:p-8 p');

    if (h4s[0]) {
        h4s[0].querySelector('span')
            ? (h4s[0].querySelector('span').innerText = t.modalSec1Title)
            : (h4s[0].innerText = t.modalSec1Title);
    }
    if (paragraphs[0]) paragraphs[0].innerText = t.modalSec1Text;

    if (h4s[1]) {
        h4s[1].querySelector('span')
            ? (h4s[1].querySelector('span').innerText = t.modalSec2Title)
            : (h4s[1].innerText = t.modalSec2Title);
    }
    if (paragraphs[1]) paragraphs[1].innerText = t.modalSec2Text;

    if (h4s[2]) {
        h4s[2].querySelector('span')
            ? (h4s[2].querySelector('span').innerText = t.modalSec3Title)
            : (h4s[2].innerText = t.modalSec3Title);
    }
    if (paragraphs[2]) paragraphs[2].innerText = t.modalSec3Text;

    const closeButton = modalCard.querySelector('footer button, button[onclick*="toggleBukhariModal"]');
    if (closeButton) closeButton.innerText = t.modalCloseBtn;
}

function setElementText(id, text) {
    const element = document.getElementById(id);
    if (element && text !== undefined) {
        element.innerText = text;
    }
}

function toggleLanguage() {
    currentLanguage = currentLanguage === 'ar' ? 'en' : 'ar';
    const t = translations[currentLanguage];

    document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage;

    clearSearch();

    setElementText('lang-btn-text', t.langBtn);

    const brandTitle = document.getElementById('brand-title') || document.getElementById('site-title');
    const brandSubtitle = document.getElementById('brand-subtitle') || document.getElementById('site-subtitle');

    if (brandTitle) brandTitle.innerText = t.siteTitle;
    if (brandSubtitle) brandSubtitle.innerText = t.siteSubtitle;

    setElementText('bio-btn-label', t.bioBtn);
    setElementText('banner-badge', t.heroTag);
    setElementText('hero-tag', t.heroTag);
    setElementText('banner-title', t.heroTitle);
    setElementText('hero-title', t.heroTitle);
    setElementText('banner-hadith', t.heroQuote);
    setElementText('hero-quote', t.heroQuote);
    setElementText('hero-quote-source', t.heroSource);

    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.placeholder = t.searchPlaceholder;

    setElementText('chapters-sidebar-title-text', t.sidebarTitle);
    setElementText('chapters-drawer-title', t.chaptersDrawerTitle);
    setElementText('filter-toggle-label', t.filterBtnLabel);
    setElementText('len-label-all', t.lenAll);
    setElementText('len-label-short', t.lenShort);
    setElementText('len-label-long', t.lenLong);
    setElementText('bookmarks-btn-label', t.bookmarksBtn);

    const btnAll = document.getElementById('len-btn-all');
    if (btnAll && btnAll.querySelector('span')) {
        btnAll.querySelector('span').innerText = t.lenAll;
    }

    const btnShort = document.getElementById('len-btn-short');
    if (btnShort && btnShort.querySelector('span')) {
        btnShort.querySelector('span').innerText = t.lenShort;
    }

    const btnLong = document.getElementById('len-btn-long');
    if (btnLong && btnLong.querySelector('span')) {
        btnLong.querySelector('span').innerText = t.lenLong;
    }

    const bookmarkButton = document.getElementById('bookmark-filter-btn');
    if (bookmarkButton && bookmarkButton.querySelector('span')) {
        bookmarkButton.querySelector('span').innerText = t.bookmarksBtn;
    }

    setElementText('contact-title', t.contactTitle);
    setElementText('contact-desc', t.contactDesc);
    setElementText('contact-email', t.contactEmail);
    setElementText('contact-phone', t.contactPhone);
    setElementText('footer-title', t.footerTitle);
    setElementText('footer-subtitle', t.footerSubtitle);
    setElementText('footer-links-title', t.footerLinksTitle);
    setElementText('footer-link-home', t.footerLinkHome);
    setElementText('footer-link-chapters', t.footerLinkChapters);
    setElementText('footer-link-bio', t.footerLinkBio);
    setElementText('footer-link-bookmarks', t.footerLinkBookmarks);
    setElementText('footer-contact-title', t.footerContactTitle);
    setElementText('footer-contact-email', t.footerContactEmail);
    setElementText('footer-contact-phone', t.footerContactPhone);
    setElementText('footer-contact-location', t.footerContactLocation);
    setElementText('footer-rights', t.footerRights);

    updateModalTranslations();
    updateFiltersModalTranslations();
    renderChaptersLists();
    renderCurrentPage();
    renderPagination();
    updateResultsCount();
    renderActiveFilters();
}