const filterState = {
    searchQuery: '',
    chapter: 'all',
    length: 'all',
    onlyBookmarks: false
};

function getHadithId(item) {
    return String(item.id ?? item.number ?? item.hadithNumber ?? '');
}

function getArabicText(item) {
    return (item.arabic ?? item.text ?? item.hadithArabic ?? '');
}

function getEnglishContent(item) {
    let narrator = '';
    let text = '';

    if (typeof item.english === 'object' && item.english !== null) {
        narrator = item.english.narrator || '';
        text = item.english.text || '';
    } else if (typeof item.english === 'string') {
        text = item.english;
    } else {
        text = item.textEn ?? item.text_en ?? '';
    }

    return { narrator, text };
}

function getHadithChapter(item) {
    return String(item.chapterId ?? item.bookId ?? item.chapter ?? 1);
}

function ensureSearchIndex(item) {
    if (item.__searchIndexed) return;

    const arabicText = getArabicText(item);
    item.__arNormalized = ' ' + normalizeArabic(arabicText).toLowerCase().replace(/\s+/g, ' ').trim() + ' ';

    const english = getEnglishContent(item);
    item.__enNormalized = ' ' + `${english.narrator} ${english.text}`.toLowerCase().replace(/\s+/g, ' ').trim() + ' ';

    item.__searchIndexed = true;
}

function matchesSearch(item) {
    const query = filterState.searchQuery.trim();
    if (!query) return true;

    ensureSearchIndex(item);

    const id = getHadithId(item);
    if (id.includes(query)) return true;

    if (currentLanguage === 'ar') {
        const normalizedQuery = normalizeArabic(query).toLowerCase().replace(/\s+/g, ' ').trim();
        if (!normalizedQuery) return true;
        return item.__arNormalized.includes(' ' + normalizedQuery);
    }

    const normalizedQuery = query.toLowerCase().replace(/\s+/g, ' ').trim();
    if (!normalizedQuery) return true;

    return item.__enNormalized.includes(' ' + normalizedQuery);
}

function matchesChapter(item) {
    if (filterState.chapter === 'all') return true;
    return getHadithChapter(item) === String(filterState.chapter);
}

function matchesLength(item) {
    if (filterState.length === 'all') return true;

    const text = currentLanguage === 'en' ? getEnglishContent(item).text : getArabicText(item);
    const length = String(text).length;

    if (filterState.length === 'short') return length < 150;
    if (filterState.length === 'long') return length > 400;

    return true;
}

function matchesBookmarks(item) {
    if (!filterState.onlyBookmarks) return true;
    const id = getHadithId(item);
    return bookmarks.includes(id);
}

function filterHadiths(hadiths) {
    return hadiths.filter(item => {
        return (
            matchesSearch(item) &&
            matchesChapter(item) &&
            matchesLength(item) &&
            matchesBookmarks(item)
        );
    });
}

function applyFilters() {
    filteredHadiths = filterHadiths(allHadiths);
    currentPage = 1;
    renderCurrentPage();
    renderPagination();
    updateResultsCount();
    renderActiveFilters();
    updateFilterPanelBadge();
}

function setSearchQuery(query) {
    filterState.searchQuery = query.trim();
}

function setChapterFilter(chapterId) {
    filterState.chapter = String(chapterId);
}

function setLengthFilterState(lengthType) {
    filterState.length = lengthType;
}

function toggleBookmarksFilterState() {
    filterState.onlyBookmarks = !filterState.onlyBookmarks;
    return filterState.onlyBookmarks;
}

function getPanelActiveFilterCount() {
    let count = 0;
    if (filterState.length !== 'all') count++;
    if (filterState.onlyBookmarks) count++;
    return count;
}

function chapterLabelById(chapterId) {
    const chapter = allChapters.find(c => String(c.id) === String(chapterId));
    if (!chapter) return chapterId;
    return currentLanguage === 'en' ? chapter.nameEn : chapter.name;
}

function buildChip(label, onClearFn) {
    return `
        <span class="inline-flex items-center gap-1.5 text-[11px] font-semibold font-sans px-2.5 py-1.5 rounded-full bg-gold-500/10 dark:bg-gold-400/10 border border-gold-500/30 text-gold-700 dark:text-gold-300 whitespace-nowrap">
            <span>${escapeHTML(label)}</span>
            <button
                onclick="${onClearFn}"
                aria-label="${currentLanguage === 'en' ? 'Remove filter' : 'إزالة الفلتر'}"
                class="flex items-center justify-center w-3.5 h-3.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
                <i class="fa-solid fa-xmark text-[9px]"></i>
            </button>
        </span>
    `;
}

function renderActiveFilters() {
    const row = document.getElementById('active-filters-row');
    const container = document.getElementById('active-filters');

    if (!row || !container) return;

    const chips = [];

    if (filterState.searchQuery) {
        const label = currentLanguage === 'en'
            ? `Search: "${filterState.searchQuery}"`
            : `بحث: "${filterState.searchQuery}"`;
        chips.push(buildChip(label, 'clearSearchFilterChip()'));
    }

    if (filterState.chapter !== 'all') {
        chips.push(buildChip(chapterLabelById(filterState.chapter), 'clearChapterFilterChip()'));
    }

    if (filterState.length !== 'all') {
        const label = filterState.length === 'short'
            ? (currentLanguage === 'en' ? 'Short Hadiths' : 'أحاديث قصيرة')
            : (currentLanguage === 'en' ? 'Long Hadiths' : 'أحاديث طويلة');
        chips.push(buildChip(label, 'clearLengthFilterChip()'));
    }

    if (filterState.onlyBookmarks) {
        const label = currentLanguage === 'en' ? 'Bookmarked only' : 'المفضلة فقط';
        chips.push(buildChip(label, 'clearBookmarksFilterChip()'));
    }

    container.innerHTML = chips.join('');

    const clearAllBtn = document.getElementById('clear-all-filters-btn');
    if (clearAllBtn) {
        clearAllBtn.innerText = currentLanguage === 'en' ? 'Clear all' : 'مسح الكل';
    }

    if (chips.length === 0) {
        row.classList.add('hidden');
        row.classList.remove('flex');
    } else {
        row.classList.remove('hidden');
        row.classList.add('flex');
    }
}

function clearSearchFilterChip() {
    clearSearch();
}

function clearChapterFilterChip() {
    selectChapterFromSidebar('all');
}

function clearLengthFilterChip() {
    setLengthFilter('all');
}

function clearBookmarksFilterChip() {
    if (filterState.onlyBookmarks) {
        toggleBookmarksFilter();
    }
}

function clearAllFilters() {
    clearSearch();

    if (filterState.chapter !== 'all') {
        selectChapterFromSidebar('all');
    }

    if (filterState.length !== 'all') {
        setLengthFilter('all');
    }

    if (filterState.onlyBookmarks) {
        toggleBookmarksFilter();
    }

    applyFilters();
}