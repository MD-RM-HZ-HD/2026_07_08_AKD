const formatContent = (content) => {
    if (!content) return '';
    const replacer = (str) => {
        if (typeof str !== 'string') return str;
        return str.replace(/\*(.*?)\*/g, '<span class="highlight">$1</span>');
    };
    
    if (Array.isArray(content)) {
        return content.map(item => replacer(item));
    }
    return replacer(content);
};

/* =========================================
   محرك الصوتيات المبسط والأنيق
   ========================================= */
window.formatTime = function(seconds) {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' + s : s}`;
};

window.toggleAudio = function(id, btn) {
    const audio = document.getElementById(id);
    if (!audio) return;
    
    document.querySelectorAll('.simple-audio-player audio').forEach(a => {
        if (a.id !== id && !a.paused) {
            a.pause();
            const otherBtn = a.parentElement.querySelector('.btn-play');
            if (otherBtn) otherBtn.textContent = '▶';
        }
    });

    if (audio.paused) {
        audio.play();
        btn.textContent = '⏸';
    } else {
        audio.pause();
        btn.textContent = '▶';
    }
};

window.seekAudio = function(event, id) {
    const audio = document.getElementById(id);
    if (!audio || !audio.duration) return;
    
    const progressBar = event.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    let clickX = event.clientX - rect.left;
    clickX = Math.max(0, Math.min(clickX, rect.width));
    
    audio.currentTime = (clickX / rect.width) * audio.duration;
};

window.toggleSpeed = function(id, btn) {
    const audio = document.getElementById(id);
    if (!audio) return;
    
    const speeds = [1, 1.5, 2];
    let currentIndex = speeds.indexOf(audio.playbackRate);
    let nextIndex = (currentIndex + 1) % speeds.length;
    
    audio.playbackRate = speeds[nextIndex];
    btn.textContent = speeds[nextIndex] + 'x';
};
/* ========================================= */

const DB = {
    mindmapTree: {
        1: typeof Mind_Map !== 'undefined' ? Mind_Map.children : null,
        2: typeof Mind_Map_1 !== 'undefined' ? Mind_Map_1.children : null
    },
text: {
        1: typeof lessonText !== 'undefined' ? lessonText : null,       // النص كاملاً (المصدر الأساسي)
        2: typeof lessonText_1 !== 'undefined' ? lessonText_1 : null,   // ملخص-1 (من ملف data.lesson.text.1.js)
        3: typeof lessonText_2 !== 'undefined' ? lessonText_2 : null    // ملخص-2 (من ملف data.lesson.text.2.js)
    },
    qa: {
        1: typeof lessonQuestions !== 'undefined' ? lessonQuestions : null
    },
    presentation: {
        1: typeof Presentation_Data !== 'undefined' ? Presentation_Data : null
    },
    cards: {
        1: typeof Flash_Cards !== 'undefined' ? Flash_Cards.map((item, i) => ({ _id: `c_${i}`, q: formatContent(item.question), a: formatContent(item.answer) })) : null,
        2: typeof Flash_Cards_1 !== 'undefined' ? Flash_Cards_1.map((item, i) => ({ _id: `c1_${i}`, q: formatContent(item.question), a: formatContent(item.answer) })) : null
    },
    tf: {
        1: typeof True_False !== 'undefined' ? True_False.map((item, i) => ({ _id: `tf_${i}`, q: formatContent(item.text), a: item.answer, exp: formatContent(item.explanation) })) : null,
        2: typeof True_False_1 !== 'undefined' ? True_False_1.map((item, i) => ({ _id: `tf1_${i}`, q: formatContent(item.text), a: item.answer, exp: formatContent(item.explanation) })) : null
    },
    mcq: {
        1: typeof Multiple_Choice !== 'undefined' ? Multiple_Choice.map((item, i) => ({ _id: `m_${i}`, q: formatContent(item.q), opts: formatContent(item.options), correct: item.correctIndex, exp: formatContent(item.rationale) })) : null,
        2: typeof Multiple_Choice_1 !== 'undefined' ? Multiple_Choice_1.map((item, i) => ({ _id: `m1_${i}`, q: formatContent(item.q), opts: formatContent(item.options), correct: item.correctIndex, exp: formatContent(item.rationale) })) : null
    },
    fill: {
        1: typeof Fill_Blank !== 'undefined' ? Fill_Blank.map((item, i) => ({ _id: `f_${i}`, q: formatContent(item.text), a: item.answer })) : null,
        2: typeof Fill_Blank_1 !== 'undefined' ? Fill_Blank_1.map((item, i) => ({ _id: `f1_${i}`, q: formatContent(item.text), a: item.answer })) : null
    },
    comp: {
        1: typeof Compare !== 'undefined' ? Compare : null,
        2: typeof Compare_1 !== 'undefined' ? Compare_1 : null
    }
};

const THEMES = [
    { name: "الأخضر الغابي (فاتح)", vars: { '--bg-main': '#DADADA', '--bg-panel': '#DADADA', '--bg-panel-solid': '#DADADA', '--bg-panel-hover': '#c4c4c4', '--border-color': '#4C6054', '--accent-primary': '#4C6054', '--accent-text': '#ffffff', '--text-main': '#1a1a1a', '--text-muted': '#4C6054', '--accent-green': '#059669', '--accent-danger': '#ef4444' } },
    { name: "الأخضر الرمادي", vars: { '--bg-main': '#e2e5e4', '--bg-panel': '#edf0ef', '--bg-panel-solid': '#edf0ef', '--bg-panel-hover': '#dce0df', '--border-color': '#5d7067', '--accent-primary': '#3f5249', '--accent-text': '#ffffff', '--text-main': '#1a1a1a', '--text-muted': '#5d7067', '--accent-green': '#059669', '--accent-danger': '#e11d48' } },
    { name: "الوضع الليلي", vars: { '--bg-main': '#121212', '--bg-panel': '#1e1e1e', '--bg-panel-solid': '#1e1e1e', '--bg-panel-hover': '#2d2d2d', '--border-color': '#4C6054', '--accent-primary': '#4C6054', '--accent-text': '#ffffff', '--text-main': '#e0e0e0', '--text-muted': '#8a9f91', '--accent-green': '#059669', '--accent-danger': '#ef4444' } },
    { name: "الرمادي", vars: { '--bg-main': '#f3f4f6', '--bg-panel': '#ffffff', '--bg-panel-solid': '#ffffff', '--bg-panel-hover': '#f9fafb', '--border-color': '#d1d5db', '--accent-primary': '#374151', '--accent-text': '#ffffff', '--text-main': '#111827', '--text-muted': '#6b7280', '--accent-green': '#10b981', '--accent-danger': '#ef4444' } }
];

const StateManager = {
    saveState: function(stateObj) { try { localStorage.setItem('exam_app_state', JSON.stringify(stateObj)); } catch (e) {} },
    loadState: function() { try { const saved = localStorage.getItem('exam_app_state'); return saved ? JSON.parse(saved) : null; } catch (e) { return null; } },
    getAllTreeNodes: function() {
        let allIds = [];
        const extract = (nodes) => {
            if(!nodes) return;
            nodes.forEach(n => {
                const safeTitle = n.title ? String(n.title) : 'unknown';
                const nodeId = `node_${btoa(unescape(encodeURIComponent(safeTitle))).replace(/[^a-zA-Z0-9]/g, '')}`;
                allIds.push(nodeId);
                if(n.children) extract(n.children);
            });
        };
        if(DB.mindmapTree[1]) extract(DB.mindmapTree[1]);
        if(DB.mindmapTree[2]) extract(DB.mindmapTree[2]);
        return allIds;
    },
    saveMindmap: function(expandedNodes, scrollPos) { localStorage.setItem('exam_mindmap_state', JSON.stringify({ expandedNodes, scrollPos })); },
    loadMindmap: function() { const saved = localStorage.getItem('exam_mindmap_state'); return saved ? JSON.parse(saved) : { expandedNodes: this.getAllTreeNodes(), scrollPos: 0 }; },
    saveQuestionOrder: function(tabKey, setNum, array) { const orderKey = `order_${tabKey}_${setNum}`; const orderIds = array.map(item => item._id); localStorage.setItem(orderKey, JSON.stringify(orderIds)); },
    loadQuestionOrder: function(tabKey, setNum) { const orderKey = `order_${tabKey}_${setNum}`; const saved = localStorage.getItem(orderKey); return saved ? JSON.parse(saved) : null; },
    clearTabState: function(tabKey) {
        let currentState = this.loadState() || {};
        if(tabKey === 'cards') { currentState.cardsIdx = 0; currentState.cardsFlipped = false; localStorage.removeItem(`order_cards_${currentState.activeSet.cards}`); }
        if(tabKey === 'tf') { currentState.tfIdx = 0; currentState.tfScore = 0; currentState.tfChecked = false; currentState.tfSelected = null; localStorage.removeItem(`order_tf_${currentState.activeSet.tf}`); }
        if(tabKey === 'mcq') { currentState.mcqIdx = 0; currentState.mcqScore = 0; currentState.mcqChecked = false; currentState.mcqSelected = null; localStorage.removeItem(`order_mcq_${currentState.activeSet.mcq}`); }
        if(tabKey === 'fill') { currentState.fillIdx = 0; currentState.fillScore = 0; currentState.fillChecked = false; currentState.fillVals = []; currentState.fillScoreAdded = false; localStorage.removeItem(`order_fill_${currentState.activeSet.fill}`); }
        if(tabKey === 'comp') { currentState.compIdx = 0; currentState.compChecked = false; }
        this.saveState(currentState);
    }
};

let State = {
    tab: 'text', 
    fontSize: parseInt(localStorage.getItem('fontSize')) || 20,
    activeSet: { mindmap: 1, text: 1, qa: 1, presentation: 1, tf: 1, cards: 1, mcq: 1, fill: 1, comp: 1 }, 
    cardsIdx: 0, cardsFlipped: false,
    tfIdx: 0, tfSelected: null, tfChecked: false, tfScore: 0,
    mcqIdx: 0, mcqSelected: null, mcqChecked: false, mcqScore: 0,
    fillIdx: 0, fillVals: [], fillChecked: false, fillScore: 0, fillScoreAdded: false,
    compIdx: 0, compChecked: true, 
    isExamActive: { cards: false, tf: false, mcq: false, fill: false } 
};

const savedState = StateManager.loadState();
if (savedState) { State = { ...State, ...savedState }; State.compChecked = true; if(!State.fillVals) State.fillVals = []; }

const DOM = {
    app: document.getElementById('app-container'), 
    content: document.getElementById('content-area'),
    tabs: document.querySelectorAll('.pill-btn[data-tab]'), 
    themeSelect: document.getElementById('theme-select'), 
    fontSelect: document.getElementById('font-family-select'), 
    btnFontUp: document.getElementById('btn-font-up'), 
    btnFontDown: document.getElementById('btn-font-down'),
    btnReset: document.getElementById('btn-reset'), 
    settingsModal: document.getElementById('settings-modal'),
    settingsModalContent: document.getElementById('settings-modal-content'),
    navModal: document.getElementById('nav-modal'),
    navModalContent: document.getElementById('nav-modal-content'),
    headerWrapper: document.getElementById('header-wrapper')
};

function updateTabCounters() {
    const keys = ['cards', 'tf', 'mcq', 'fill', 'comp'];
    const counts = {};
    keys.forEach(key => {
        if (DB[key]) {
            const c1 = DB[key][1] ? DB[key][1].length : 0;
            const c2 = DB[key][2] ? DB[key][2].length : 0;
            counts[key] = (c1 > 0 && c2 > 0) ? `${c1} + ${c2}` : (c1 + c2);
        }
    });

    if(DOM.tabs) {
        DOM.tabs.forEach(btn => { 
            const tabKey = btn.dataset.tab;
            let cleanText = btn.textContent.split(' (')[0].trim();
            if(counts[tabKey] !== undefined) {
                btn.textContent = cleanText + ` (${counts[tabKey]})`;
            } else {
                btn.textContent = cleanText;
            }
        });
    }
}

function shuffleArray(array) { 
    if(!array || !Array.isArray(array)) return; 
    for (let i = array.length - 1; i > 0; i--) { 
        const j = Math.floor(Math.random() * (i + 1)); 
        [array[i], array[j]] = [array[j], array[i]]; 
    } 
}

function randomizeAllQuestions() { 
    Object.keys(DB).forEach(key => {
        if (['cards', 'tf', 'mcq', 'fill'].includes(key) && DB[key]) {
            [1, 2].forEach(setNum => {
                if(DB[key][setNum]) {
                    const savedOrder = StateManager.loadQuestionOrder(key, setNum);
                    if (savedOrder && State.isExamActive[key]) {
                        DB[key][setNum].sort((a, b) => savedOrder.indexOf(a._id) - savedOrder.indexOf(b._id));
                    } else {
                        shuffleArray(DB[key][setNum]);
                    }
                }
            });
        }
    });
}

function openModal(modal, content) {
    if(!modal || !content) return;
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        content.classList.remove('scale-95');
        content.classList.add('scale-100');
    }, 10);
}

function closeModal(modal, content) {
    if(!modal || !content) return;
    modal.classList.add('opacity-0');
    content.classList.remove('scale-100');
    content.classList.add('scale-95');
    setTimeout(() => { modal.classList.add('hidden'); }, 300);
}

function applyTheme(idx) {
    if(!THEMES[idx]) return;
    const theme = THEMES[idx]; 
    const root = document.documentElement;
    for (const [key, value] of Object.entries(theme.vars)) { 
        root.style.setProperty(key, value); 
    }
    localStorage.setItem('selectedThemeIdx', idx);
}

function applyFontFamily(fontName) {
    const fallbackChain = `"${fontName}", 'Noto Sans Arabic', 'IBM Plex Sans Arabic', 'Tajawal', 'Almarai', 'Alexandria', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, system-ui, sans-serif`;
    document.documentElement.style.setProperty('--font-family-base', fallbackChain);
    localStorage.setItem('selectedFontFamily', fontName);
}

function applyFontSize() { 
    document.documentElement.style.fontSize = State.fontSize + 'px'; 
}

function changeFont(val) { 
    State.fontSize = Math.max(12, Math.min(28, State.fontSize + val)); 
    localStorage.setItem('fontSize', State.fontSize); 
    applyFontSize(); 
}

function getSetButtonsHTML(tabKey) {
    if (tabKey === 'qa' || tabKey === 'presentation') return ''; 
    const active = State.activeSet[tabKey];
    return `
        <div class="flex gap-1" dir="rtl">
            <button class="w-6 h-6 flex justify-center items-center rounded text-xs font-black transition-all border border-[color:var(--border-color)] ${active === 1 ? 'bg-[color:var(--accent-primary)] text-[color:var(--accent-text)]' : 'bg-[color:var(--accent-primary)]/30 text-[color:var(--accent-primary)] hover:bg-[color:var(--accent-primary)] hover:text-[color:var(--accent-text)]'}" onclick="window.switchSet('${tabKey}', 1)">1</button>
            <button class="w-6 h-6 flex justify-center items-center rounded text-xs font-black transition-all border border-[color:var(--border-color)] ${active === 2 ? 'bg-[color:var(--accent-primary)] text-[color:var(--accent-text)]' : 'bg-[color:var(--accent-primary)]/30 text-[color:var(--accent-primary)] hover:bg-[color:var(--accent-primary)] hover:text-[color:var(--accent-text)]'}" onclick="window.switchSet('${tabKey}', 2)">2</button>
        </div>
    `;
}

function getProgressBar(current, total, tabKey) {
    let setBtns = getSetButtonsHTML(tabKey);
    if(!total || total === 0) {
        return `<div class="flex justify-between items-center text-xs font-bold text-[color:var(--text-muted)] mb-4"><div class="flex items-center gap-2"><span>تبديل المجموعة:</span>${setBtns}</div></div>`;
    }
    const perc = ((current) / total) * 100;
    return `
        <div class="flex justify-between items-center text-xs font-bold text-[color:var(--text-muted)] mb-1">
            <div class="flex items-center gap-2"><span>مؤشر التقدم</span>${setBtns}</div>
            <span>${current + 1 > total ? total : current + 1} / ${total}</span>
        </div>
        <div class="progress-container mb-3">
            <div class="progress-bar bg-[color:var(--accent-primary)]" style="width: ${perc}%"></div>
        </div>
    `;
}

function renderFinishScreen(title, score, total, tabKey) {
    const perc = total > 0 ? Math.round((score / total) * 100) : 0;
    return `
        <div class="text-center py-6 flex flex-col items-center animate-fade-in">
            <div class="text-5xl mb-4">🏆</div>
            <h2 class="text-xl font-black mb-2 text-[color:var(--accent-primary)]">إنجاز قسم: ${title}</h2>
            <div class="bg-[color:var(--bg-panel-solid)] border-2 border-[color:var(--border-color)] rounded-2xl p-6 mb-6 w-full max-w-xs shadow-sm mx-auto">
                <div class="text-4xl font-black text-[color:var(--accent-primary)] mb-2">${score} <span class="text-xl text-[color:var(--text-muted)] opacity-60">/ ${total}</span></div>
                <div class="text-sm font-bold text-[color:var(--text-muted)] bg-[color:var(--bg-panel)] py-1 px-4 rounded-full border border-[color:var(--border-color)] inline-block">النسبة: ${perc}%</div>
            </div>
            <button class="action-btn max-w-xs text-sm py-3" onclick="window.restartQuiz('${tabKey}')">🔄 إعادة الاختبار</button>
        </div>
    `;
}

window.switchSet = function(tabKey, setNum) {
    State.activeSet[tabKey] = setNum;
    StateManager.saveState(State);
    window.restartQuiz(tabKey); 
    updateTabCounters();
    renderTab();
};

window.move = function(dir) {
    freezeOrderIfNeeded(State.tab);
    if (State.tab === 'cards') { State.cardsIdx += dir; State.cardsFlipped = false; }
    if (State.tab === 'tf') { State.tfIdx += dir; State.tfChecked = false; State.tfSelected = null; }
    if (State.tab === 'mcq') { State.mcqIdx += dir; State.mcqChecked = false; State.mcqSelected = null; }
    if (State.tab === 'fill') { State.fillIdx += dir; State.fillChecked = false; State.fillVals = []; State.fillScoreAdded = false; }
    if (State.tab === 'comp') { State.compIdx += dir; }
    
    if(State[`${State.tab}Idx`] < 0) State[`${State.tab}Idx`] = 0;

    StateManager.saveState(State);
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
    renderTab();
}

window.restartQuiz = function(tab) {
    State.isExamActive[tab] = false;
    StateManager.clearTabState(tab);
    
    const freshState = StateManager.loadState();
    if(freshState) State = { ...State, ...freshState };
    if(!State.fillVals) State.fillVals = [];

    if (DB[tab] && tab !== 'comp' && tab !== 'qa' && tab !== 'presentation' && tab !== 'mindmap' && tab !== 'text') {
        shuffleArray(DB[tab][State.activeSet[tab]]);
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
    updateTabCounters();
    renderTab();
}

window.toggleNode = function(element, nodeId) { 
    const ul = element.nextElementSibling; 
    const icon = element.querySelector('.toggle-icon'); 
    
    if (ul && ul.tagName === 'UL') { 
        ul.classList.toggle('hidden'); 
        if (icon) icon.textContent = ul.classList.contains('hidden') ? '+' : '−'; 
        
        const mindmapState = StateManager.loadMindmap();
        let expanded = new Set(mindmapState.expandedNodes);
        if (!ul.classList.contains('hidden')) { expanded.add(nodeId); } else { expanded.delete(nodeId); }
        StateManager.saveMindmap(Array.from(expanded), window.scrollY);
    } 
};

function freezeOrderIfNeeded(tab) {
    if (['cards', 'tf', 'mcq', 'fill'].includes(tab) && !State.isExamActive[tab]) {
        State.isExamActive[tab] = true;
        StateManager.saveQuestionOrder(tab, State.activeSet[tab], DB[tab][State.activeSet[tab]]);
    }
}

function buildTreeHTML(node, level = 0, expandedNodes = new Set()) {
    const hasChildren = node.children && node.children.length > 0; 
    const safeTitle = node.title ? String(node.title) : 'unknown';
    const nodeId = `node_${btoa(unescape(encodeURIComponent(safeTitle))).replace(/[^a-zA-Z0-9]/g, '')}`; 
    const isExpanded = expandedNodes.has(nodeId);
    const toggleIcon = hasChildren ? `<span class="toggle-icon">${isExpanded ? '−' : '+'}</span>` : ''; 
    const pointerClass = hasChildren ? 'cursor-pointer' : 'cursor-default'; 
    const rootClass = level === 0 ? 'root-node' : '';
    
    // تم إضافة text-base md:text-lg لمطابقة حجم خط الأسئلة بدقة
    let html = `<li class="tree-node"><div class="tree-content text-base md:text-lg level-${level} ${rootClass} ${pointerClass}" ${hasChildren ? `onclick="window.toggleNode(this, '${nodeId}')"` : ''}><span>${node.title}</span>${toggleIcon}</div>`;
    
    if (hasChildren) { 
        html += `<ul class="tree-list pr-3 md:pr-4 transition-all ${isExpanded ? '' : 'hidden'}">`; 
        node.children.forEach(child => { html += buildTreeHTML(child, level + 1, expandedNodes); }); 
        html += `</ul>`; 
    }
    return html + `</li>`;
}

function renderMindmap() {
    const active = State.activeSet.mindmap;
    const currentData = DB.mindmapTree[active];
    
    const headerBtns = `<div class="flex justify-center items-center gap-2 mb-4"><span class="text-xs font-bold text-[color:var(--text-muted)]">اختر المشجرة:</span>${getSetButtonsHTML('mindmap')}</div>`;

    if(!currentData || currentData.length === 0) return headerBtns + '<div class="text-center p-4 text-[color:var(--accent-danger)] font-bold">⚠️ عذراً، لا توجد بيانات للمشجرة في هذه المجموعة.</div>';
    
    // 
   //const mindmapState = StateManager.loadMindmap();
    //const expandedSet = new Set(mindmapState.expandedNodes);
// نقوم بجمع كافة الـ IDs لفتح كل العقد
    const allIds = StateManager.getAllTreeNodes();
    const expandedSet = new Set(allIds); 
    // ------------------


    let treeHTML = `<ul class="tree-list root-list pr-0" id="mindmap-container">`; 
    currentData.forEach(node => { treeHTML += buildTreeHTML(node, 0, expandedSet); }); 
    treeHTML += `</ul>`;
    
    return `${headerBtns}<div class="overflow-x-auto pb-4 px-1">${treeHTML}</div>`;
}

function renderText() {
    const active = State.activeSet.text || 1; 
    const currentData = DB.text[active];

    // أزرار التبديل الثلاثة
    const headerBtns = `
        <div class="flex justify-center items-center gap-2 mb-4 mt-2">
            <span class="text-xs font-bold text-[color:var(--text-muted)]">اختر النص:</span>
            <div class="flex gap-2" dir="rtl">
                <button class="px-3 py-1 flex justify-center items-center rounded text-xs font-black transition-all border border-[color:var(--border-color)] ${active === 1 ? 'bg-[color:var(--accent-primary)] text-[color:var(--accent-text)]' : 'bg-[color:var(--accent-primary)]/30 text-[color:var(--accent-primary)] hover:bg-[color:var(--accent-primary)] hover:text-[color:var(--accent-text)]'}" onclick="window.switchSet('text', 1)">النص كاملاً</button>
                <button class="px-3 py-1 flex justify-center items-center rounded text-xs font-black transition-all border border-[color:var(--border-color)] ${active === 2 ? 'bg-[color:var(--accent-primary)] text-[color:var(--accent-text)]' : 'bg-[color:var(--accent-primary)]/30 text-[color:var(--accent-primary)] hover:bg-[color:var(--accent-primary)] hover:text-[color:var(--accent-text)]'}" onclick="window.switchSet('text', 2)">ملخص-1</button>
                <button class="px-3 py-1 flex justify-center items-center rounded text-xs font-black transition-all border border-[color:var(--border-color)] ${active === 3 ? 'bg-[color:var(--accent-primary)] text-[color:var(--accent-text)]' : 'bg-[color:var(--accent-primary)]/30 text-[color:var(--accent-primary)] hover:bg-[color:var(--accent-primary)] hover:text-[color:var(--accent-text)]'}" onclick="window.switchSet('text', 3)">ملخص-2</button>
            </div>
        </div>
    `;

    if(!currentData || currentData.length === 0) return headerBtns + '<div class="text-center p-4 text-[color:var(--accent-danger)] font-bold">⚠️ عذراً، لا توجد بيانات للملخص في هذا القسم.</div>';

    let audioHTML = `
        <div class="global-audio-section mb-6 flex flex-col gap-5">
            <div class="w-full">
                <h3 class="text-sm md:text-base font-black text-[color:var(--accent-primary)] mb-2 text-right" dir="rtl"> الملف الصوتي</h3>
                <div class="simple-audio-player shadow-sm" dir="ltr">
                    <audio id="global-audio-1" src="Audio/aud_1.mp3" preload="metadata"></audio>
                    <div class="player-row">
                        <button class="btn-play" onclick="window.toggleAudio('global-audio-1', this)">▶</button>
                        <span class="time-current" id="current-global-audio-1">0:00</span>
                        <div class="progress-bar" onclick="window.seekAudio(event, 'global-audio-1')">
                            <div class="progress-fill" id="progress-global-audio-1"></div>
                        </div>
                        <span class="time-total" id="total-global-audio-1">0:00</span>
                        <button class="btn-speed" onclick="window.toggleSpeed('global-audio-1', this)">1x</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    let html = '';
    currentData.forEach((section, secIndex) => {
        const isActive = secIndex === 0 ? 'active' : '';
        html += `
            <div class="accordion-item ${isActive}">
                <button class="accordion-header bg-[color:var(--accent-primary)] text-white w-full flex justify-between items-center font-black text-sm md:text-base py-3 px-4 focus:outline-none border-none">
                    <span>📖 ${section.lesson}</span>
                    <span class="accordion-icon font-black text-white bg-black/20">▼</span>
                </button>
                <div class="accordion-body"><div class="grid-wrapper"><div class="p-2 md:p-6 bg-[color:var(--bg-panel-solid)] lesson-content">${section.text}</div></div></div>
            </div>`;
    });
    
    // تم إضافة headerBtns لعرض أزرار التبديل فوق المحتوى
    return `<div class="pb-4">${headerBtns}${audioHTML}${html}</div>`;
}

function renderQA() {
    const active = State.activeSet.qa || 1; 
    const currentData = DB.qa[active];
    if(!currentData || currentData.length === 0) return '<div class="text-center p-4 text-[color:var(--accent-danger)] font-bold">⚠️ عذراً، لا توجد بيانات للأسئلة.</div>';

    let html = '';
    currentData.forEach((section, secIndex) => {
        const isActive = secIndex === 0 ? 'active' : '';
        html += `<div class="accordion-item ${isActive}"><button class="accordion-header bg-[color:var(--accent-primary)] text-white w-full flex justify-between items-center font-black text-sm md:text-base py-3 px-4 focus:outline-none border-none"><span>📚 ${formatContent(section.lesson)}</span><span class="accordion-icon font-black text-white bg-black/20">▼</span></button><div class="accordion-body"><div class="grid-wrapper"><div class="p-2 md:p-5 flex flex-col gap-4">`;
        
        section.questions.forEach((item, index) => {
            const isLast = index === section.questions.length - 1;
            const borderClass = isLast ? '' : 'border-b border-dashed border-[color:var(--border-color)] pb-4 mb-4';
            html += `<div class="${borderClass}"><div class="text-base md:text-lg font-black text-[color:var(--accent-primary)] mb-2 flex items-start gap-2"><span class="inline-flex shrink-0 items-center justify-center bg-[color:var(--bg-panel)] px-2 py-0.5 rounded text-xs border border-[color:var(--border-color)] shadow-sm">س ${index + 1}</span><span class="leading-relaxed">${formatContent(item.q)}</span></div><div class="text-base md:text-lg font-bold leading-relaxed text-[color:var(--text-main)] bg-[color:var(--bg-panel-solid)] p-3 rounded-lg border-r-4 border-[color:var(--accent-green)] shadow-sm mr-2 md:mr-8">${formatContent(item.a)}</div></div>`;
        });
        html += `</div></div></div></div>`;
    });
    return `<div class="pb-4">${html}</div>`;
}

function renderPresentation() {
    const active = State.activeSet.presentation || 1; 
    const currentData = DB.presentation[active];

    if(!currentData || currentData.length === 0) return '<div class="text-center p-4 text-[color:var(--accent-danger)] font-bold">⚠️ عذراً، لا توجد بيانات للشروح.</div>';

    let html = '<div class="pb-4">';
    currentData.forEach((item, index) => {
        const isActive = index === 0 ? 'active' : '';
        html += `
        <div class="accordion-item ${isActive}">
            <button class="accordion-header bg-[color:var(--accent-primary)] text-white w-full flex justify-between items-center font-black text-sm md:text-base py-3 px-4 focus:outline-none border-none">
                <span>📑 ${item.title}</span>
                <span class="accordion-icon font-black text-white bg-black/20">▼</span>
            </button>
            <div class="accordion-body">
                <div class="grid-wrapper">
                    <div class="p-2 md:p-6 bg-[color:var(--bg-panel-solid)] flex flex-col gap-8">

                        <div class="w-full">
                            <h3 class="text-sm md:text-base font-black text-[color:var(--accent-primary)] mb-2 text-right" dir="rtl">الملف الصوتي</h3>
                            <div class="simple-audio-player shadow-sm" dir="ltr">
                                <audio id="audio-pres-${index}" src="${item.audio}" preload="metadata"></audio>
                                <div class="player-row">
                                    <button class="btn-play" onclick="window.toggleAudio('audio-pres-${index}', this)">▶</button>
                                    <span class="time-current" id="current-audio-pres-${index}">0:00</span>
                                    <div class="progress-bar" onclick="window.seekAudio(event, 'audio-pres-${index}')">
                                        <div class="progress-fill" id="progress-audio-pres-${index}"></div>
                                    </div>
                                    <span class="time-total" id="total-audio-pres-${index}">0:00</span>
                                    <button class="btn-speed" onclick="window.toggleSpeed('audio-pres-${index}', this)">1x</button>
                                </div>
                            </div>
                        </div>

                        <div class="w-full">
                            <h3 class="text-sm md:text-base font-black text-[color:var(--accent-primary)] mb-2 text-right" dir="rtl">الملف التفاعلي</h3>
                            <div class="flex justify-end gap-2 mb-3">
                                 <a href="${item.pdf}" target="_blank" class="px-4 py-2 bg-[color:var(--accent-primary)] text-[color:var(--accent-text)] text-xs font-bold rounded-lg shadow-sm hover:opacity-90 transition">فتح في صفحة جديدة</a>
                                 <a href="${item.pdf}" download class="px-4 py-2 bg-[color:var(--accent-green)] text-white text-xs font-bold rounded-lg shadow-sm hover:opacity-90 transition">حفظ الملف</a>
                            </div>
                            <iframe src="${item.pdf}#toolbar=1&navpanes=0&view=FitH" class="w-full h-[65vh] md:h-[75vh] border-0 rounded-xl shadow-sm bg-white" allowfullscreen></iframe>                        </div>

                        <div class="w-full">
                            <h3 class="text-sm md:text-base font-black text-[color:var(--accent-primary)] mb-2 text-right" dir="rtl">انفوجرافيك</h3>
                            <div class="flex flex-col items-center gap-4 bg-[color:var(--bg-main)] p-4 rounded-xl border border-[color:var(--border-color)]">
                                <img src="${item.Info}" class="max-w-full h-auto rounded-lg shadow-sm" onerror="this.style.display='none'">
                                <a href="${item.Info}" download class="px-4 py-2 bg-[color:var(--accent-green)] text-white text-xs font-bold rounded-lg shadow-sm hover:opacity-90 transition self-start">تحميل الصورة</a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>`;
    });
    html += '</div>';
    return html;
}

function renderCards() {
    const active = State.activeSet.cards;
    const currentData = DB.cards[active];
    if(!currentData || currentData.length === 0) return getProgressBar(0, 0, 'cards') + '<div class="text-center p-4 text-[color:var(--accent-danger)] font-bold">⚠️ عذراً، لا توجد بطاقات متاحة في هذه المجموعة.</div>';
    if (State.cardsIdx >= currentData.length) return renderFinishScreen('البطاقات الذكية', currentData.length, currentData.length, 'cards');
    
    const data = currentData[State.cardsIdx];
    return `
        ${getProgressBar(State.cardsIdx, currentData.length, 'cards')}
        <div class="flip-card mt-6 mb-6" id="action-flip">
            <div class="flip-card-inner ${State.cardsFlipped ? 'rotate-y-180' : ''}" style="transform: ${State.cardsFlipped ? 'rotateY(180deg)' : 'none'}">
                <div class="flip-card-front shadow-sm"><div class="text-lg md:text-xl font-black leading-relaxed text-center">${data.q}</div></div>
                <div class="flip-card-back shadow-md"><div class="text-lg md:text-xl font-black leading-relaxed text-center">${data.a}</div></div>
            </div>
        </div>
        <div class="flex justify-center gap-2 mt-4">
            <button class="action-btn text-sm py-2 max-w-[100px] bg-[color:var(--bg-panel-solid)] text-[color:var(--text-main)] border border-[color:var(--border-color)] shadow-sm" onclick="window.move(-1)" ${State.cardsIdx === 0 ? 'disabled' : ''}>السابق</button>
            <button class="action-btn text-sm py-2 max-w-[150px] shadow-sm" id="btn-next">التالي</button>
        </div>
    `;
}

function renderTF() {
    const active = State.activeSet.tf;
    const currentData = DB.tf[active];
    if(!currentData || currentData.length === 0) return getProgressBar(0, 0, 'tf') + '<div class="text-center p-4 text-[color:var(--accent-danger)] font-bold">⚠️ عذراً، لا توجد بيانات.</div>';
    if (State.tfIdx >= currentData.length) return renderFinishScreen('الصواب والخطأ', State.tfScore, currentData.length, 'tf');
    
    const data = currentData[State.tfIdx]; 
    let msgHTML = '';
    
    if (State.tfChecked) {
        const isCorrect = State.tfSelected === data.a;
        msgHTML = `<div class="p-3 mt-4 rounded-xl border-2 animate-fade-in ${isCorrect ? 'bg-[color:var(--accent-green)] text-white border-[color:var(--accent-green)]' : 'bg-[color:var(--accent-danger)] text-white border-[color:var(--accent-danger)]'}"><div class="font-black text-sm text-center mb-2">${isCorrect ? '✅ دقيق!' : '❌ خطأ! الجواب: ' + (data.a ? 'صواب' : 'خطأ')}</div>${data.exp ? `<div class="pt-2 border-t border-white/30 text-xs font-bold leading-relaxed text-right">💡 ${data.exp}</div>` : ''}</div>`;
    }

    let trueClasses = "opt-btn p-3 rounded-xl font-black text-base md:text-lg transition-all ";
    let falseClasses = "opt-btn p-3 rounded-xl font-black text-base md:text-lg transition-all ";

    if (State.tfChecked) {
        if (data.a === true) trueClasses += "correct"; else if (State.tfSelected === true) trueClasses += "wrong"; else trueClasses += "opacity-50 grayscale";
        if (data.a === false) falseClasses += "correct"; else if (State.tfSelected === false) falseClasses += "wrong"; else falseClasses += "opacity-50 grayscale";
    } else {
        if (State.tfSelected === true) trueClasses += "selected"; if (State.tfSelected === false) falseClasses += "selected";
    }
    
    return `
        ${getProgressBar(State.tfIdx, currentData.length, 'tf')}
        <div class="relative bg-[color:var(--bg-panel-solid)] border-2 border-[color:var(--border-color)] p-3 md:p-6 rounded-2xl mt-5 mb-4 shadow-sm"><div class="absolute -top-3 right-4 bg-[color:var(--accent-primary)] text-[color:var(--accent-text)] px-3 py-1 rounded-lg text-xs font-black border border-[color:var(--bg-panel)]">صح / خطأ؟</div><h3 class="text-lg md:text-xl font-black text-center leading-relaxed mt-2">${data.q}</h3></div>
        <div class="grid grid-cols-2 gap-3"><button class="${trueClasses}" data-val="true">✅ صواب</button><button class="${falseClasses}" data-val="false">❌ خطأ</button></div>
        ${msgHTML}
        <div class="flex justify-center mt-5"><button class="action-btn max-w-xs text-sm py-3" id="btn-next" ${!State.tfChecked ? 'disabled' : ''}>${State.tfIdx === currentData.length - 1 ? 'إنهاء الاختبار' : 'التالي'}</button></div>
    `;
}

function renderMCQ() {
    const active = State.activeSet.mcq;
    const currentData = DB.mcq[active];
    if(!currentData || currentData.length === 0) return getProgressBar(0, 0, 'mcq') + '<div class="text-center p-4 text-[color:var(--accent-danger)] font-bold">⚠️ عذراً، لا توجد بيانات.</div>';
    if (State.mcqIdx >= currentData.length) return renderFinishScreen('الاختيار من متعدد', State.mcqScore, currentData.length, 'mcq');
    
    const data = currentData[State.mcqIdx]; 
    let msgHTML = '';
    let optsHTML = data.opts.map((opt, i) => {
        let classes = "opt-btn p-3 rounded-xl font-bold text-right mb-2 block w-full text-base md:text-lg transition-all shadow-sm ";
        if (State.mcqChecked) { if (i === data.correct) classes += "correct"; else if (i === State.mcqSelected) classes += "wrong"; else classes += "opacity-50 grayscale"; } 
        else if (State.mcqSelected === i) { classes += "selected"; }
        return `<button class="${classes}" data-idx="${i}"><span class="inline-block bg-[color:var(--bg-main)] text-[color:var(--text-main)] rounded px-2 py-0.5 text-xs ml-2 border border-[color:var(--border-color)]">${String.fromCharCode(1613 + i)}</span> ${opt}</button>`;
    }).join('');
    
    if (State.mcqChecked) {
        const isCorrect = State.mcqSelected === data.correct;
        msgHTML = `<div class="p-3 mt-4 rounded-xl border-2 animate-fade-in ${isCorrect ? 'bg-[color:var(--accent-green)] text-white border-[color:var(--accent-green)]' : 'bg-[color:var(--accent-danger)] text-white border-[color:var(--accent-danger)]'}"><div class="font-black text-sm text-center mb-2">${isCorrect ? '✅ إجابة صحيحة!' : '❌ إجابة خاطئة!'}</div>${data.exp ? `<div class="pt-2 border-t border-white/30 text-xs font-bold leading-relaxed text-right">💡 ${data.exp}</div>` : ''}</div>`;
    }
    
    return `
        ${getProgressBar(State.mcqIdx, currentData.length, 'mcq')}
        <div class="bg-[color:var(--bg-panel-solid)] border-2 border-[color:var(--border-color)] border-r-4 border-r-[color:var(--accent-primary)] p-3 md:p-4 rounded-xl mt-4 mb-4 shadow-sm"><h3 class="text-lg md:text-xl font-black leading-relaxed">${data.q}</h3></div>
        <div class="mt-2">${optsHTML}</div>
        ${msgHTML}
        <div class="flex justify-center mt-5"><button class="action-btn max-w-xs text-sm py-3 shadow-md" id="btn-next" ${!State.mcqChecked ? 'disabled' : ''}>${State.mcqIdx === currentData.length - 1 ? 'إنهاء الاختبار' : 'التالي'}</button></div>
    `;
}

function renderFill() {
    const active = State.activeSet.fill;
    const currentData = DB.fill[active];
    
    if(!currentData || currentData.length === 0) return getProgressBar(0, 0, 'fill') + '<div class="text-center p-4 text-[color:var(--accent-danger)] font-bold">⚠️ عذراً، لا توجد بيانات.</div>';
    if (State.fillIdx >= currentData.length) return renderFinishScreen('املأ الفراغ', State.fillScore, currentData.length, 'fill');
    
    const data = currentData[State.fillIdx]; 
    if (!State.fillVals) State.fillVals = [];

    let blankIdx = 0;
    
    const textHTML = data.q.replace(/_+/g, () => {
        let val = State.fillVals[blankIdx] || '';
        let html = '';
        
        if (State.fillChecked) {
            let isCorrect = false;
            let expected = '';
            
            if (Array.isArray(data.a)) {
                if ((data.q.match(/_+/g)||[]).length > 1) {
                    expected = data.a[blankIdx];
                    if(Array.isArray(expected)) {
                        isCorrect = expected.some(e => e.trim() === val.trim());
                        expected = expected.join(' / ');
                    } else {
                        isCorrect = expected && expected.toString().trim() === val.trim();
                    }
                } else {
                    isCorrect = data.a.some(e => e.trim() === val.trim());
                    expected = data.a.join(' / ');
                }
            } else {
                isCorrect = data.a.trim() === val.trim();
                expected = data.a;
            }

            if (isCorrect) {
                html = `<span class="inline-block border-b-2 border-solid border-[color:var(--accent-green)] text-[color:var(--accent-green)] bg-green-500/10 px-2 py-0.5 mx-1 font-bold text-sm md:text-base text-center align-middle rounded-t">✔️ ${val}</span>`;
            } else {
                let displayAns = val ? `❌ ${val} ⬅️ ${expected}` : `💡 ${expected}`;
                html = `<span class="inline-block border-b-2 border-solid border-[color:var(--accent-danger)] text-[color:var(--accent-danger)] bg-red-500/10 px-2 py-0.5 mx-1 font-bold text-sm md:text-base text-center align-middle rounded-t" dir="rtl">${displayAns}</span>`;
            }
        } else {
            html = `<input type="text" class="fill-input-box inline-block border-b-2 border-dashed border-[color:var(--accent-primary)] bg-[color:var(--bg-panel)] text-center text-[color:var(--text-main)] font-bold outline-none focus:border-solid focus:border-b-4 focus:border-[color:var(--accent-green)] transition-all w-24 md:w-32 mx-1 px-1 py-0.5 align-middle rounded-none" data-idx="${blankIdx}" value="${val}" autocomplete="off" placeholder="...">`;
        }
        blankIdx++;
        return html;
    });
    
    return `
        ${getProgressBar(State.fillIdx, currentData.length, 'fill')}
        <div class="bg-[color:var(--bg-panel-solid)] border-2 border-[color:var(--border-color)] p-4 md:p-6 rounded-xl mt-4 mb-6 text-center shadow-sm leading-loose text-lg md:text-xl font-black">
            ${textHTML}
        </div>
        ${!State.fillChecked ? `<div class="flex justify-center mt-6"><button class="action-btn max-w-xs text-sm py-3 shadow-md border-2 border-[color:var(--border-color)] hover:bg-[color:var(--bg-panel-hover)] bg-[color:var(--bg-panel-solid)] text-[color:var(--text-main)] transition-all flex items-center justify-center gap-2" id="btn-check"><span class="text-xl">✔️</span> تحقق من الإجابة</button></div>` : ''}
        <div class="flex justify-center mt-6 pt-4 border-t border-dashed border-[color:var(--border-color)]"><button class="action-btn max-w-xs text-sm py-3 shadow-md" id="btn-next" ${!State.fillChecked ? 'disabled' : ''}>${State.fillIdx === currentData.length - 1 ? '🏁 إنهاء القسم' : 'التالية'}</button></div>
    `;
}

function renderComp() {
    const active = State.activeSet.comp;
    const currentData = DB.comp[active];
    if(!currentData || currentData.length === 0) return getProgressBar(0, 0, 'comp') + '<div class="text-center p-4 text-[color:var(--accent-danger)] font-bold">⚠️ عذراً، لا توجد بيانات.</div>';
    if (State.compIdx >= currentData.length) return renderFinishScreen('المقارنات', currentData.length, currentData.length, 'comp');
    
    const data = currentData[State.compIdx]; 
    if (!data.criteria && data.q && data.a) {
        return `
            ${getProgressBar(State.compIdx, currentData.length, 'comp')}
            <div class="bg-[color:var(--bg-panel-solid)] border-2 border-[color:var(--border-color)] p-3 md:p-6 rounded-2xl mt-10 mb-8 shadow-sm"><h3 class="text-xl font-black text-center text-[color:var(--accent-primary)] leading-relaxed"> ${formatContent(data.q)} </h3></div>
            <div class="mt-4 border-t-2 border-dashed border-[color:var(--border-color)] pt-8 animate-fade-in relative"><div class="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[color:var(--accent-primary)] text-[color:var(--accent-text)] px-6 py-1 rounded-full font-black text-sm border-2 border-[color:var(--bg-panel)]">تفاصيل المقارنة</div><div class="grid grid-cols-1 gap-6 mt-4"><div class="p-3 md:p-6 bg-[color:var(--bg-panel-solid)] text-[color:var(--text-main)] rounded-2xl font-bold text-lg text-center leading-relaxed flex items-center justify-center min-h-[120px] border-2 border-[color:var(--accent-green)] relative shadow-sm">${formatContent(data.a)}</div></div></div>
            <div class="flex justify-center mt-12"><button class="action-btn max-w-sm text-xl py-4 shadow-md" id="btn-next">${State.compIdx === currentData.length - 1 ? 'إنهاء القسم' : 'التالية'}</button></div>
        `;
    }

    let colA_HTML = data.criteria.map((c) => `<div class="mb-4 last:mb-0"><div class="text-sm md:text-base font-black text-[color:var(--accent-primary)] mb-2 border-b border-dashed border-[color:var(--border-color)] pb-1">▪️ ${formatContent(c.label)}</div><div class="p-2 text-base leading-relaxed text-right font-bold animate-fade-in bg-transparent border-none">${formatContent(c.answerA)}</div></div>`).join('');
    let colB_HTML = data.criteria.map((c) => `<div class="mb-4 last:mb-0"><div class="text-sm md:text-base font-black text-[color:var(--accent-primary)] mb-2 border-b border-dashed border-[color:var(--border-color)] pb-1">▪️ ${formatContent(c.label)}</div><div class="p-2 text-base leading-relaxed text-right font-bold animate-fade-in bg-transparent border-none">${formatContent(c.answerB)}</div></div>`).join('');
    
    return `
        ${getProgressBar(State.compIdx, currentData.length, 'comp')}
        <div class="bg-[color:var(--bg-panel-solid)] border-2 border-[color:var(--border-color)] p-3 md:p-4 rounded-xl mt-4 mb-6 shadow-sm"><h3 class="text-lg md:text-xl font-black text-center text-[color:var(--accent-primary)] leading-relaxed">${formatContent(data.title)}</h3></div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"><div class="bg-[color:var(--bg-panel-solid)] rounded-xl border-2 border-[color:var(--border-color)] overflow-hidden shadow-sm flex flex-col animate-fade-in"><div class="bg-[color:var(--accent-primary)] text-[color:var(--accent-text)] text-center font-black text-sm md:text-base py-3 px-4">${formatContent(data.caseA_label)}</div><div class="p-2 md:p-4 bg-[color:var(--bg-main)] flex-1">${colA_HTML}</div></div><div class="bg-[color:var(--bg-panel-solid)] rounded-xl border-2 border-[color:var(--border-color)] overflow-hidden shadow-sm flex flex-col animate-fade-in" style="animation-delay: 0.1s"><div class="bg-[color:var(--accent-primary)] text-[color:var(--accent-text)] text-center font-black text-sm md:text-base py-3 px-4">${formatContent(data.caseB_label)}</div><div class="p-2 md:p-4 bg-[color:var(--bg-main)] flex-1">${colB_HTML}</div></div></div>
        <div class="flex justify-center mt-6 pt-4 border-t border-dashed border-[color:var(--border-color)]"><button class="action-btn max-w-xs text-sm py-3 shadow-md" id="btn-next">${State.compIdx === currentData.length - 1 ? '🏁 إنهاء القسم' : 'التالية'}</button></div>
    `;
}

function renderTab() {
    if(!DOM.content) return; 
    let html = '';
    
    if (State.tab !== 'mindmap' && document.getElementById('mindmap-container')) {
        const mindmapState = StateManager.loadMindmap();
        mindmapState.scrollPos = window.scrollY;
        StateManager.saveMindmap(mindmapState.expandedNodes, mindmapState.scrollPos);
    }

    switch(State.tab) { 
        case 'mindmap': html = renderMindmap(); break; 
        case 'text': html = renderText(); break;
        case 'qa': html = renderQA(); break; 
        case 'presentation': html = renderPresentation(); break; 
        case 'cards': html = renderCards(); break; 
        case 'tf': html = renderTF(); break; 
        case 'mcq': html = renderMCQ(); break; 
        case 'fill': html = renderFill(); break; 
        case 'comp': html = renderComp(); break; 
    }
    
    DOM.content.innerHTML = `<div class="animate-fade-in">${html}</div>`; 
    attachDynamicListeners();

    if (State.tab === 'mindmap') {
        const mindmapState = StateManager.loadMindmap();
        window.scrollTo({ top: mindmapState.scrollPos, behavior: 'instant' });
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function attachDynamicListeners() {
    const next = document.getElementById('btn-next'); 
    const check = document.getElementById('btn-check'); 
    const flip = document.getElementById('action-flip'); 
    
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => header.parentElement.classList.toggle('active'));
    });
    
    document.querySelectorAll('.simple-audio-player audio').forEach(audio => {
        const id = audio.id;
        const timeCurrent = document.getElementById(`current-${id}`);
        const timeTotal = document.getElementById(`total-${id}`);
        const progressFill = document.getElementById(`progress-${id}`);

        if (audio.readyState > 0 && timeTotal) {
            timeTotal.textContent = window.formatTime(audio.duration);
        }
        audio.addEventListener('loadedmetadata', () => {
            if (timeTotal) timeTotal.textContent = window.formatTime(audio.duration);
        });

        audio.addEventListener('timeupdate', () => {
            if (timeCurrent) timeCurrent.textContent = window.formatTime(audio.currentTime);
            if (progressFill && audio.duration) {
                const percent = (audio.currentTime / audio.duration) * 100;
                progressFill.style.width = `${percent}%`;
            }
        });
        
        audio.addEventListener('ended', () => {
           const btn = audio.parentElement.querySelector('.btn-play');
           if(btn) btn.textContent = '▶';
           if(progressFill) progressFill.style.width = '0%';
           if(timeCurrent) timeCurrent.textContent = '0:00';
        });
    });

    if(next) next.addEventListener('click', () => window.move(1));
    
    if(check) {
        check.addEventListener('click', () => { 
            const active = State.activeSet[State.tab];
            freezeOrderIfNeeded(State.tab); 
            
            if(State.tab === 'fill' && !State.fillChecked) {
                const data = DB.fill[active][State.fillIdx];
                const numBlanks = (data.q.match(/_+/g) || []).length;
                let correctCount = 0;

                for (let i = 0; i < numBlanks; i++) {
                    let val = (State.fillVals[i] || '').trim();
                    let isCorrect = false;
                    
                    if (Array.isArray(data.a)) {
                        if (numBlanks > 1) {
                            let expected = data.a[i];
                            if(Array.isArray(expected)) isCorrect = expected.some(e => e.trim() === val);
                            else if (expected) isCorrect = expected.toString().trim() === val;
                        } else {
                            isCorrect = data.a.some(e => e.trim() === val);
                        }
                    } else {
                        isCorrect = data.a.trim() === val;
                    }
                    if (isCorrect) correctCount++;
                }

                if(correctCount === numBlanks && !State.fillScoreAdded) { 
                    State.fillScore++; 
                    State.fillScoreAdded = true; 
                }
                State.fillChecked = true; 
            }
            StateManager.saveState(State);
            renderTab(); 
        });
    }
    
    document.querySelectorAll('.fill-input-box').forEach(inp => {
        inp.addEventListener('input', (e) => {
            const idx = parseInt(e.target.dataset.idx);
            State.fillVals[idx] = e.target.value;
            StateManager.saveState(State);
        });
        inp.addEventListener('keypress', (e) => {
            if(e.key === 'Enter') check?.click();
        });
    });
    
    if(flip) {
        flip.addEventListener('click', () => { 
            freezeOrderIfNeeded(State.tab);
            State.cardsFlipped = !State.cardsFlipped; 
            StateManager.saveState(State);
            renderTab(); 
        });
    }
    
    document.querySelectorAll('.opt-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const active = State.activeSet[State.tab];
            freezeOrderIfNeeded(State.tab); 
            
            if (State.tab === 'tf' && !State.tfChecked) { 
                State.tfSelected = e.target.closest('.opt-btn').dataset.val === 'true'; 
                State.tfChecked = true; 
                if (State.tfSelected === DB.tf[active][State.tfIdx].a) State.tfScore++; 
                StateManager.saveState(State);
                renderTab(); 
            }
            if (State.tab === 'mcq' && !State.mcqChecked) { 
                State.mcqSelected = parseInt(e.target.closest('.opt-btn').dataset.idx); 
                State.mcqChecked = true; 
                if (State.mcqSelected === DB.mcq[active][State.mcqIdx].correct) State.mcqScore++; 
                StateManager.saveState(State);
                renderTab(); 
            }
        });
    });
}

function initApp() {
    randomizeAllQuestions(); 
    updateTabCounters(); 
    applyFontSize();
    
    const savedTheme = localStorage.getItem('selectedThemeIdx');
    if(DOM.themeSelect) DOM.themeSelect.value = savedTheme !== null && THEMES[savedTheme] ? savedTheme : 0;
    applyTheme(DOM.themeSelect ? parseInt(DOM.themeSelect.value) : 0);

    const savedFontFamily = localStorage.getItem('selectedFontFamily') || 'Noto Sans Arabic';
    if(DOM.fontSelect) DOM.fontSelect.value = savedFontFamily;
    applyFontFamily(savedFontFamily);

    document.getElementById('top-settings-btn')?.addEventListener('click', () => openModal(DOM.settingsModal, DOM.settingsModalContent));
    document.getElementById('close-settings-btn')?.addEventListener('click', () => closeModal(DOM.settingsModal, DOM.settingsModalContent));

    document.getElementById('top-nav-btn')?.addEventListener('click', () => openModal(DOM.navModal, DOM.navModalContent));
    document.getElementById('close-nav-btn')?.addEventListener('click', () => closeModal(DOM.navModal, DOM.navModalContent));

    [DOM.settingsModal, DOM.navModal].forEach(modal => {
        if(modal) {
            modal.addEventListener('click', (e) => {
                if(e.target === modal) closeModal(modal, modal.firstElementChild);
            });
        }
    });

    if(DOM.btnReset) {
        DOM.btnReset.addEventListener('click', () => {
            if(confirm("⚠️ هل أنت متأكد من رغبتك في إعادة ضبط التطبيق بالكامل؟ سيتم مسح جميع الإجابات والترتيب المحفوظ.")) {
                localStorage.clear();
                window.location.reload();
            }
        });
    }

    if(DOM.themeSelect) DOM.themeSelect.addEventListener('change', (e) => applyTheme(parseInt(e.target.value)));
    if(DOM.fontSelect) DOM.fontSelect.addEventListener('change', (e) => applyFontFamily(e.target.value));
    if(DOM.btnFontUp) DOM.btnFontUp.addEventListener('click', () => changeFont(1));
    if(DOM.btnFontDown) DOM.btnFontDown.addEventListener('click', () => changeFont(-1));
    
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        if (!DOM.headerWrapper) return;
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY && currentScrollY > 60) {
            DOM.headerWrapper.style.transform = 'translateY(-100%)';
        } else {
            DOM.headerWrapper.style.transform = 'translateY(0)';
        }
        lastScrollY = currentScrollY;
    });

    if(DOM.tabs) {
        DOM.tabs.forEach(btn => {
            if(btn.dataset.tab === State.tab) btn.classList.add('active'); 
            btn.addEventListener('click', (e) => {
                const targetTab = e.currentTarget.dataset.tab;
                if(!targetTab) return; 
                
                DOM.tabs.forEach(b => {
                    b.classList.remove('active');
                    if (b.dataset.tab === targetTab) b.classList.add('active');
                });
                
                State.tab = targetTab; 
                StateManager.saveState(State);
                
                if (DOM.navModal && !DOM.navModal.classList.contains('hidden')) { 
                    closeModal(DOM.navModal, DOM.navModalContent); 
                }
                renderTab();
            });
        });
    }
    renderTab();
}

document.addEventListener('DOMContentLoaded', initApp);
