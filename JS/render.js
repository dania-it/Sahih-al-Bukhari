function renderCurrentPage() {
    const container = document.getElementById('hadith-container');

    if (!container) return;

    if (filteredHadiths.length === 0) {
        container.innerHTML = `
            <div class="bg-white dark:bg-stone-900 rounded-2xl p-12 text-center border border-gold-500/20 shadow-sm">
                <i class="fa-solid fa-magnifying-glass-minus text-4xl text-gold-500/40 mb-3 block"></i>
                <div class="text-base font-bold font-sans text-stone-700 dark:text-stone-300">
                    ${currentLanguage === 'en' ? 'No Hadiths found' : 'لم يتم العثور على أي أحاديث'}
                </div>
                <div class="text-sm font-sans text-stone-400 mt-2">
                    ${currentLanguage === 'en' ? 'Try changing your search or filter options' : 'جرب تغيير كلمات البحث أو الفلاتر المختارة'}
                </div>
                ${
                    (filterState.searchQuery || filterState.chapter !== 'all' || filterState.length !== 'all' || filterState.onlyBookmarks)
                    ? `
                        <button
                            onclick="clearAllFilters()"
                            class="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-madinah-800 hover:bg-madinah-700 text-gold-300 text-xs font-sans font-bold transition-colors"
                        >
                            <i class="fa-solid fa-rotate-left text-[10px]"></i>
                            ${currentLanguage === 'en' ? 'Clear all filters' : 'مسح كل الفلاتر'}
                        </button>
                    `
                    : ''
                }
            </div>
        `;
        return;
    }

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = filteredHadiths.slice(start, end);

    container.innerHTML = pageData.map((item) => {
        const id = item.id ?? item.number ?? item.hadithNumber;
        const arabicText = item.arabic ?? item.text ?? item.hadithArabic ?? '';

        let englishNarrator = '';
        let englishText = '';

        if (typeof item.english === 'object' && item.english !== null) {
            englishNarrator = item.english.narrator || '';
            englishText = item.english.text || '';
        } else if (typeof item.english === 'string') {
            englishText = item.english;
        } else {
            englishText = item.textEn ?? item.text_en ?? '';
        }

        const chapterId = item.chapterId ?? item.bookId ?? item.chapter;
        const matchedChapter = allChapters.find(
            (chapter) => String(chapter.id) === String(chapterId)
        );

        const chapterName = matchedChapter
            ? currentLanguage === 'en'
                ? matchedChapter.nameEn
                : matchedChapter.name
            : currentLanguage === 'en'
                ? 'Sahih al-Bukhari'
                : 'صحيح البخاري';

        const isBookmarked = bookmarks.includes(String(id));

        const contentHTML = currentLanguage === 'en'
            ? `
                <div class="text-left" dir="ltr">
                    ${
                        englishNarrator
                            ? `
                                <p class="text-sm font-sans font-semibold text-gold-600 dark:text-gold-400 mb-2">
                                    ${highlightText(englishNarrator)}
                                </p>
                            `
                            : ''
                    }
                    <p
                        class="text-stone-800 dark:text-stone-100 font-serif leading-[1.85] text-base"
                        style="font-size: ${fontScale * 0.95}%"
                    >
                        ${highlightText(
                            englishText || 'English translation not available for this Hadith.'
                        )}
                    </p>
                </div>
            `
            : `
                <p
                    class="text-stone-800 dark:text-stone-100 font-amiri leading-loose text-right text-xl"
                    style="font-size: ${fontScale}%"
                >
                    ${highlightText(arabicText)}
                </p>
            `;

        return `
            <div class="hadith-card bg-white dark:bg-stone-900 border border-gold-500/20 rounded-2xl p-6 shadow-sm relative overflow-hidden transition-all duration-200">
                <div class="flex items-center justify-between mb-4 pb-3 border-b border-stone-100 dark:border-stone-800/80">
                    <div class="flex items-center gap-2 min-w-0">
                        <span class="text-xs font-bold font-sans text-madinah-800 dark:text-gold-400 bg-gold-500/10 border border-gold-500/20 px-3 py-1 rounded-full shrink-0">
                            ${currentLanguage === 'en' ? `Hadith #${id}` : `حديث #${id}`}
                        </span>
                        <span class="text-sm text-stone-500 dark:text-stone-400 font-sans hidden sm:inline truncate">
                            ${escapeHTML(chapterName)}
                        </span>
                    </div>

                    <div class="flex items-center gap-2 shrink-0">
                        <button
                            onclick="copyHadith('${id}')"
                            title="${currentLanguage === 'en' ? 'Copy' : 'نسخ'}"
                            class="w-8 h-8 rounded-lg flex items-center justify-center border border-stone-200 dark:border-stone-800 text-stone-400 hover:text-madinah-800 dark:hover:text-gold-300 hover:bg-gold-500/10 transition-colors"
                        >
                            <i class="fa-regular fa-copy text-sm"></i>
                        </button>

                        <button
                            onclick="handleToggleBookmark('${id}')"
                            title="${currentLanguage === 'en' ? 'Bookmark' : 'إضافة للمفضلة'}"
                            class="w-8 h-8 rounded-lg flex items-center justify-center border border-stone-200 dark:border-stone-800 hover:bg-gold-500/10 transition-colors ${
                                isBookmarked
                                    ? 'text-gold-500 bg-gold-500/10 border-gold-500/30'
                                    : 'text-stone-400'
                            }"
                        >
                            <i class="${isBookmarked ? 'fa-solid' : 'fa-regular'} fa-bookmark text-sm"></i>
                        </button>
                    </div>
                </div>

                <div class="space-y-4">
                    ${contentHTML}
                </div>
            </div>
        `;
    }).join('');
}

function renderPagination() {
    const totalPages = Math.ceil(filteredHadiths.length / itemsPerPage) || 1;
    const container = document.getElementById('pagination-buttons');
    const info = document.getElementById('pagination-info');

    if (info) {
        info.innerText = currentLanguage === 'en'
            ? `Page ${currentPage} of ${totalPages}`
            : `الصفحة ${currentPage} من ${totalPages}`;
    }

    if (!container) return;

    let buttonsHTML = `
        <button
            onclick="goToPage(${currentPage - 1})"
            ${currentPage === 1 ? 'disabled' : ''}
            class="pagination-nav-btn flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border-2 border-gold-500/50 dark:border-gold-500/40 text-madinah-800 dark:text-gold-300 bg-white dark:bg-stone-900 text-xs font-sans font-bold hover:bg-gold-50 dark:hover:bg-gold-500/10 hover:border-gold-500 disabled:opacity-35 disabled:hover:bg-white dark:disabled:hover:bg-stone-900 disabled:cursor-not-allowed transition-colors"
        >
            <i class="fa-solid ${currentLanguage === 'en' ? 'fa-chevron-left' : 'fa-chevron-right'} text-[10px]"></i>
            ${currentLanguage === 'en' ? 'Previous' : 'السابق'}
        </button>
    `;

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            buttonsHTML += `
                <button
                    onclick="goToPage(${i})"
                    class="min-w-[34px] px-3 py-1.5 rounded-lg text-xs font-sans font-bold transition-colors border-2 ${
                        currentPage === i
                            ? 'bg-madinah-800 text-gold-300 border-madinah-800 shadow-sm'
                            : 'border-gold-500/30 dark:border-gold-500/25 text-stone-600 dark:text-stone-300 bg-white dark:bg-stone-900 hover:border-gold-500 hover:bg-gold-50 dark:hover:bg-gold-500/10'
                    }"
                >
                    ${i}
                </button>
            `;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            buttonsHTML += `
                <span class="px-1 text-stone-400 text-xs flex items-center">
                    ...
                </span>
            `;
        }
    }

    buttonsHTML += `
        <button
            onclick="goToPage(${currentPage + 1})"
            ${currentPage === totalPages ? 'disabled' : ''}
            class="pagination-nav-btn flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border-2 border-gold-500/50 dark:border-gold-500/40 text-madinah-800 dark:text-gold-300 bg-white dark:bg-stone-900 text-xs font-sans font-bold hover:bg-gold-50 dark:hover:bg-gold-500/10 hover:border-gold-500 disabled:opacity-35 disabled:hover:bg-white dark:disabled:hover:bg-stone-900 disabled:cursor-not-allowed transition-colors"
        >
            ${currentLanguage === 'en' ? 'Next' : 'التالي'}
            <i class="fa-solid ${currentLanguage === 'en' ? 'fa-chevron-right' : 'fa-chevron-left'} text-[10px]"></i>
        </button>
    `;

    container.innerHTML = buttonsHTML;
}

function goToPage(page) {
    const totalPages = Math.ceil(filteredHadiths.length / itemsPerPage) || 1;

    if (page < 1 || page > totalPages) {
        return;
    }

    currentPage = page;
    renderCurrentPage();
    renderPagination();

    window.scrollTo({
        top: 300,
        behavior: 'smooth'
    });
}