
const SEARCH_HIGHLIGHT_CLASS =
    'bg-gold-400/70 dark:bg-gold-400/40 text-inherit rounded-[3px] px-0.5';

function normalizeArabic(text) {
    if (!text) return '';
    return String(text)
        .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, '')
        .replace(/[أإآٱ]/g, 'ا')
        .replace(/ؤ/g, 'و')
        .replace(/ئ/g, 'ي')
        .replace(/ى/g, 'ي')
        .replace(/ک/g, 'ك')
        .replace(/ی/g, 'ي');
}
let searchDebounceTimer = null;
const SEARCH_DEBOUNCE_MS = 180;

function setupSearchLanguageRestriction() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        let value = e.target.value;

        if (currentLanguage === 'ar') {
            const cleaned = value.replace(/[a-zA-Z]/g, '');
            if (value !== cleaned) {
                e.target.value = cleaned;
                value = cleaned;
                showToast('الرجاء البحث باللغة العربية فقط');
            }
        } else {
            const cleaned = value.replace(/[\u0600-\u06FF]/g, '');
            if (value !== cleaned) {
                e.target.value = cleaned;
                value = cleaned;
                showToast('Please search in English only');
            }
        }

        const clearButton = document.getElementById('search-clear-btn');
        if (clearButton) {
            clearButton.classList.toggle('hidden', value.length === 0);
            clearButton.classList.toggle('flex', value.length > 0);
        }

        clearTimeout(searchDebounceTimer);
        searchDebounceTimer = setTimeout(() => {
            setSearchQuery(value);
            applyFilters();
        }, SEARCH_DEBOUNCE_MS);
    });
}
function handleSearch() {
    const searchInput = document.getElementById('search-input');
    const query = searchInput ? searchInput.value : '';

    clearTimeout(searchDebounceTimer);

    const clearButton = document.getElementById('search-clear-btn');
    if (clearButton) {
        clearButton.classList.toggle('hidden', query.length === 0);
        clearButton.classList.toggle('flex', query.length > 0);
    }

    setSearchQuery(query);
    applyFilters();
}

function clearSearch() {
    const searchInput = document.getElementById('search-input');
    const clearButton = document.getElementById('search-clear-btn');

    clearTimeout(searchDebounceTimer);

    if (searchInput) searchInput.value = '';
    if (clearButton) {
        clearButton.classList.add('hidden');
        clearButton.classList.remove('flex');
    }
    setSearchQuery('');
    applyFilters();
}

function escapeHTML(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function escapeRegex(text) {
    return String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
const HIGHLIGHT_CLASSES =
    'bg-gold-300/80 dark:bg-gold-400/30 text-stone-900 dark:text-gold-50 rounded px-0.5 box-decoration-clone';

function highlightEnglishText(text, query) {
    if (!text) return '';
    const safeText = escapeHTML(text);
    const rawQuery = query.trim();
    if (!rawQuery) return safeText;

    const normalizedQuery = rawQuery.replace(/\s+/g, ' ');
    const pattern = escapeRegex(normalizedQuery).replace(/ /g, '\\s+');
    const regex = new RegExp(`(\\b${pattern})`, 'gi');

    return safeText.replace(regex, `<mark class="${HIGHLIGHT_CLASSES}">$1</mark>`);
}
function highlightArabicText(text, query) {
    if (!text) return '';
    const originalText = String(text);
    const rawQuery = query.trim();

    if (!rawQuery) {
        return escapeHTML(originalText);
    }

    const normalizedQuery = normalizeArabic(rawQuery).toLowerCase();
    if (!normalizedQuery) return escapeHTML(originalText);

    const diacriticsRegex = '[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]*';

    const pattern = rawQuery.split('').map(char => {
        const norm = normalizeArabic(char);
        if (!norm) return '';
        const escaped = escapeRegex(norm);

        if (norm === 'ا') return `[اأإآٱ]${diacriticsRegex}`;
        if (norm === 'و') return `[وؤ]${diacriticsRegex}`;
        if (norm === 'ي') return `[يئى]${diacriticsRegex}`;

        return `${escaped}${diacriticsRegex}`;
    }).join('');

    try {
        const regex = new RegExp(`(${pattern})`, 'gi');

        return originalText.replace(regex, (match) => {
            return `<mark class="${HIGHLIGHT_CLASSES}">${escapeHTML(match)}</mark>`;
        });
    } catch (e) {
        return escapeHTML(originalText);
    }
}

function highlightText(text) {
    if (!text) return '';
    const query = filterState.searchQuery ? filterState.searchQuery.trim() : '';
    if (!query) {
        return escapeHTML(text);
    }
    if (currentLanguage === 'en') {
        return highlightEnglishText(text, query);
    }
    return highlightArabicText(text, query);
}