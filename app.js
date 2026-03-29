let config = {
    lexique: {},
    grammaire: {
        futur: 'efu',
        passe: 'emas'
    }
};

let baseLexique = {};
let dictionaryIndex = new Map();
let verbFormIndex = new Map();
let isDictionaryEditorInitialized = false;

const LEXIQUE_STORAGE_KEY = 'grammajs-lexique-v1';
const AUXILIAIRES_FUTUR = new Set(['vais', 'vas', 'va', 'allons', 'allez', 'vont']);
const AUXILIAIRES_PASSE = new Set(['ai', 'as', 'a', 'avons', 'avez', 'ont', 'suis', 'es', 'est', 'sommes', 'etes', 'êtes', 'sont']);

const CONTRACTIONS = {
    j: 'je',
    m: 'me',
    t: 'te',
    s: 'se',
    l: 'le',
    d: 'de',
    n: 'ne',
    c: 'ce'
};

const IRREGULAR_VERB_FORMS = {
    aller: {
        present: ['vais', 'vas', 'va', 'allons', 'allez', 'vont'],
        future: ['irai', 'iras', 'ira', 'irons', 'irez', 'iront'],
        imperfect: ['allais', 'allais', 'allait', 'allions', 'alliez', 'allaient'],
        participle: ['alle', 'allée', 'allés', 'allées']
    },
    avoir: {
        present: ['ai', 'as', 'a', 'avons', 'avez', 'ont'],
        future: ['aurai', 'auras', 'aura', 'aurons', 'aurez', 'auront'],
        imperfect: ['avais', 'avais', 'avait', 'avions', 'aviez', 'avaient'],
        participle: ['eu', 'eue', 'eus', 'eues']
    },
    etre: {
        present: ['suis', 'es', 'est', 'sommes', 'etes', 'êtes', 'sont'],
        future: ['serai', 'seras', 'sera', 'serons', 'serez', 'seront'],
        imperfect: ['etais', 'etais', 'etait', 'etions', 'etiez', 'etaient'],
        participle: ['ete', 'etee', 'etes', 'etees']
    },
    faire: {
        present: ['fais', 'fais', 'fait', 'faisons', 'faites', 'font'],
        future: ['ferai', 'feras', 'fera', 'ferons', 'ferez', 'feront'],
        imperfect: ['faisais', 'faisais', 'faisait', 'faisions', 'faisiez', 'faisaient'],
        participle: ['fait', 'faite', 'faits', 'faites']
    },
    pouvoir: {
        present: ['peux', 'peux', 'peut', 'pouvons', 'pouvez', 'peuvent'],
        future: ['pourrai', 'pourras', 'pourra', 'pourrons', 'pourrez', 'pourront'],
        imperfect: ['pouvais', 'pouvais', 'pouvait', 'pouvions', 'pouviez', 'pouvaient'],
        participle: ['pu']
    },
    vouloir: {
        present: ['veux', 'veux', 'veut', 'voulons', 'voulez', 'veulent'],
        future: ['voudrai', 'voudras', 'voudra', 'voudrons', 'voudrez', 'voudront'],
        imperfect: ['voulais', 'voulais', 'voulait', 'voulions', 'vouliez', 'voulaient'],
        participle: ['voulu']
    },
    savoir: {
        present: ['sais', 'sais', 'sait', 'savons', 'savez', 'savent'],
        future: ['saurai', 'sauras', 'saura', 'saurons', 'saurez', 'sauront'],
        imperfect: ['savais', 'savais', 'savait', 'savions', 'saviez', 'savaient'],
        participle: ['su']
    },
    voir: {
        present: ['vois', 'vois', 'voit', 'voyons', 'voyez', 'voient'],
        future: ['verrai', 'verras', 'verra', 'verrons', 'verrez', 'verront'],
        imperfect: ['voyais', 'voyais', 'voyait', 'voyions', 'voyiez', 'voyaient'],
        participle: ['vu']
    },
    boire: {
        present: ['bois', 'bois', 'boit', 'buvons', 'buvez', 'boivent'],
        future: ['boirai', 'boiras', 'boira', 'boirons', 'boirez', 'boiront'],
        imperfect: ['buvais', 'buvais', 'buvait', 'buvions', 'buviez', 'buvaient'],
        participle: ['bu']
    },
    prendre: {
        present: ['prends', 'prends', 'prend', 'prenons', 'prenez', 'prennent'],
        future: ['prendrai', 'prendras', 'prendra', 'prendrons', 'prendrez', 'prendront'],
        imperfect: ['prenais', 'prenais', 'prenait', 'prenions', 'preniez', 'prenaient'],
        participle: ['pris']
    },
    dormir: {
        present: ['dors', 'dors', 'dort', 'dormons', 'dormez', 'dorment'],
        future: ['dormirai', 'dormiras', 'dormira', 'dormirons', 'dormirez', 'dormiront'],
        imperfect: ['dormais', 'dormais', 'dormait', 'dormions', 'dormiez', 'dormaient'],
        participle: ['dormi']
    },
    partir: {
        present: ['pars', 'pars', 'part', 'partons', 'partez', 'partent'],
        future: ['partirai', 'partiras', 'partira', 'partirons', 'partirez', 'partiront'],
        imperfect: ['partais', 'partais', 'partait', 'partions', 'partiez', 'partaient'],
        participle: ['parti']
    },
    mettre: {
        present: ['mets', 'mets', 'met', 'mettons', 'mettez', 'mettent'],
        future: ['mettrai', 'mettras', 'mettra', 'mettrons', 'mettrez', 'mettront'],
        imperfect: ['mettais', 'mettais', 'mettait', 'mettions', 'mettiez', 'mettaient'],
        participle: ['mis']
    },
    decendre: {
        present: ['descends', 'descends', 'descend', 'descendons', 'descendez', 'descendent'],
        future: ['descendrai', 'descendras', 'descendra', 'descendrons', 'descendrez', 'descendront'],
        imperfect: ['descendais', 'descendais', 'descendait', 'descendions', 'descendiez', 'descendaient'],
        participle: ['descendu']
    },
    eteindre: {
        present: ['eteins', 'eteins', 'eteint', 'eteignons', 'eteignez', 'eteignent'],
        future: ['eteindrai', 'eteindras', 'eteindra', 'eteindrons', 'eteindrez', 'eteindront'],
        imperfect: ['eteignais', 'eteignais', 'eteignait', 'eteignions', 'eteigniez', 'eteignaient'],
        participle: ['eteint']
    },
    rire: {
        present: ['ris', 'ris', 'rit', 'rions', 'riez', 'rient'],
        future: ['rirai', 'riras', 'rira', 'rirons', 'rierez', 'riront'],
        imperfect: ['riais', 'riais', 'riait', 'riions', 'riiez', 'riaient'],
        participle: ['ri']
    },
    promettre: {
        present: ['promets', 'promets', 'promet', 'promettons', 'promettez', 'promettent'],
        future: ['promettrai', 'promettras', 'promettra', 'promettrons', 'promettrez', 'promettront'],
        imperfect: ['promettais', 'promettais', 'promettait', 'promettions', 'promettiez', 'promettaient'],
        participle: ['promis']
    }
};

function normalizeLookup(value) {
    return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function resolveDictionaryKey(word) {
    return dictionaryIndex.get(normalizeLookup(word)) || null;
}

function getStoredLexique() {
    try {
        const raw = localStorage.getItem(LEXIQUE_STORAGE_KEY);
        if (!raw) {
            return null;
        }

        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
            return null;
        }

        return parsed;
    } catch {
        return null;
    }
}

function saveStoredLexique(lexique) {
    localStorage.setItem(LEXIQUE_STORAGE_KEY, JSON.stringify(lexique));
}

function clearStoredLexique() {
    localStorage.removeItem(LEXIQUE_STORAGE_KEY);
}

function setDictionaryStatus(message, isError = false) {
    const statusEl = document.getElementById('dictionaryStatus');
    if (!statusEl) {
        return;
    }

    statusEl.textContent = message;
    statusEl.classList.toggle('error', isError);
}

function rebuildIndexes() {
    dictionaryIndex = new Map();
    verbFormIndex = new Map();

    Object.keys(config.lexique || {}).forEach((lemma) => {
        dictionaryIndex.set(normalizeLookup(lemma), lemma);

        if (looksLikeVerbLemma(lemma)) {
            generateVerbForms(lemma).forEach(({ form, tense }) => {
                const normalizedForm = normalizeLookup(form);
                if (!verbFormIndex.has(normalizedForm)) {
                    verbFormIndex.set(normalizedForm, { lemma, tense });
                }
            });
        }
    });
}

function looksLikeVerbLemma(lemma) {
    const normalizedLemma = normalizeLookup(lemma);
    return Boolean(IRREGULAR_VERB_FORMS[normalizedLemma]) || /(er|ir|re|oir|uire)$/.test(normalizedLemma);
}

function generateVerbForms(lemma) {
    const normalizedLemma = normalizeLookup(lemma);
    const irregular = IRREGULAR_VERB_FORMS[normalizedLemma];

    if (irregular) {
        return [
            ...irregular.present.map((form) => ({ form, tense: 'present' })),
            ...irregular.future.map((form) => ({ form, tense: 'future' })),
            ...irregular.imperfect.map((form) => ({ form, tense: 'past' })),
            ...irregular.participle.map((form) => ({ form, tense: 'past' }))
        ];
    }

    if (normalizedLemma.endsWith('er')) {
        const stem = normalizedLemma.slice(0, -2);
        const futureStem = normalizedLemma;

        return [
            { form: `${stem}e`, tense: 'present' },
            { form: `${stem}es`, tense: 'present' },
            { form: `${stem}e`, tense: 'present' },
            { form: `${stem}ons`, tense: 'present' },
            { form: `${stem}ez`, tense: 'present' },
            { form: `${stem}ent`, tense: 'present' },
            { form: `${futureStem}ai`, tense: 'future' },
            { form: `${futureStem}as`, tense: 'future' },
            { form: `${futureStem}a`, tense: 'future' },
            { form: `${futureStem}ons`, tense: 'future' },
            { form: `${futureStem}ez`, tense: 'future' },
            { form: `${futureStem}ont`, tense: 'future' },
            { form: `${stem}eais`, tense: 'past' },
            { form: `${stem}eais`, tense: 'past' },
            { form: `${stem}eait`, tense: 'past' },
            { form: `${stem}eions`, tense: 'past' },
            { form: `${stem}eiez`, tense: 'past' },
            { form: `${stem}eaient`, tense: 'past' },
            { form: `${stem}e`, tense: 'past' }
        ];
    }

    if (normalizedLemma.endsWith('ir')) {
        const stem = normalizedLemma.slice(0, -2);

        return [
            { form: `${stem}is`, tense: 'present' },
            { form: `${stem}is`, tense: 'present' },
            { form: `${stem}it`, tense: 'present' },
            { form: `${stem}issons`, tense: 'present' },
            { form: `${stem}issez`, tense: 'present' },
            { form: `${stem}issent`, tense: 'present' },
            { form: `${normalizedLemma}ai`, tense: 'future' },
            { form: `${normalizedLemma}as`, tense: 'future' },
            { form: `${normalizedLemma}a`, tense: 'future' },
            { form: `${normalizedLemma}ons`, tense: 'future' },
            { form: `${normalizedLemma}ez`, tense: 'future' },
            { form: `${normalizedLemma}ont`, tense: 'future' },
            { form: `${stem}issais`, tense: 'past' },
            { form: `${stem}issais`, tense: 'past' },
            { form: `${stem}issait`, tense: 'past' },
            { form: `${stem}issions`, tense: 'past' },
            { form: `${stem}issiez`, tense: 'past' },
            { form: `${stem}issaient`, tense: 'past' },
            { form: `${stem}i`, tense: 'past' }
        ];
    }

    if (normalizedLemma.endsWith('re')) {
        const baseStem = normalizedLemma.slice(0, -2);
        const futureStem = `${baseStem}r`;

        return [
            { form: `${baseStem}s`, tense: 'present' },
            { form: `${baseStem}s`, tense: 'present' },
            { form: baseStem, tense: 'present' },
            { form: `${baseStem}ons`, tense: 'present' },
            { form: `${baseStem}ez`, tense: 'present' },
            { form: `${baseStem}ent`, tense: 'present' },
            { form: `${futureStem}ai`, tense: 'future' },
            { form: `${futureStem}as`, tense: 'future' },
            { form: `${futureStem}a`, tense: 'future' },
            { form: `${futureStem}ons`, tense: 'future' },
            { form: `${futureStem}ez`, tense: 'future' },
            { form: `${futureStem}ont`, tense: 'future' },
            { form: `${baseStem}ais`, tense: 'past' },
            { form: `${baseStem}ait`, tense: 'past' },
            { form: `${baseStem}ions`, tense: 'past' },
            { form: `${baseStem}iez`, tense: 'past' },
            { form: `${baseStem}aient`, tense: 'past' }
        ];
    }

    return [];
}

function tokenize(inputText) {
    const cleanedText = inputText
        .toLowerCase()
        .replace(/’/g, "'")
        .replace(/[.,!?;:()\[\]{}"«»]/g, ' ');

    return cleanedText
        .split(/\s+/)
        .filter(Boolean)
        .flatMap((token) => {
            if (!token.includes("'")) {
                return [token];
            }

            const [prefix, ...restParts] = token.split("'");
            const rest = restParts.join('');

            if (prefix === 'qu') {
                return rest ? [rest] : [];
            }

            const contraction = CONTRACTIONS[prefix];
            if (contraction) {
                return rest ? [contraction, rest] : [contraction];
            }

            return rest ? [token.replace(/'/g, '')] : [];
        });
}

function lookupDictionaryWord(word) {
    const key = resolveDictionaryKey(word);
    return key ? config.lexique[key] : null;
}

function translateLemma(lemma) {
    const key = resolveDictionaryKey(lemma);
    return key ? config.lexique[key] : null;
}

function translateNumberToken(token) {
    if (!/^\d+$/.test(token)) {
        return null;
    }

    const directTranslation = lookupDictionaryWord(token);
    if (directTranslation) {
        return directTranslation;
    }

    const numericValue = Number(token);
    if (!Number.isSafeInteger(numericValue) || numericValue < 0) {
        return null;
    }

    if (numericValue === 0) {
        return lookupDictionaryWord('0');
    }

    // Current dictionary carries rank words up to thousands.
    if (numericValue > 9999) {
        return null;
    }

    let remainder = numericValue;
    const segments = [];
    const places = [1000, 100, 10, 1];

    for (const place of places) {
        const digit = Math.floor(remainder / place);
        remainder %= place;

        if (digit === 0) {
            continue;
        }

        const key = place === 1 ? `${digit}` : `${digit * place}`;
        const piece = lookupDictionaryWord(key);
        if (!piece) {
            return null;
        }

        segments.push(piece);
    }

    return segments.join(' ');
}

function getVerbInfo(word) {
    return verbFormIndex.get(normalizeLookup(word)) || null;
}

function detectVerb(word) {
    const info = getVerbInfo(word);
    if (info) {
        return info;
    }

    const key = resolveDictionaryKey(word);
    if (key && looksLikeVerbLemma(key)) {
        return { lemma: key, tense: 'infinitive' };
    }

    return null;
}

function translateVerbBase(word) {
    const detectedVerb = detectVerb(word);
    if (!detectedVerb) {
        return null;
    }

    return translateLemma(detectedVerb.lemma);
}

function translateStandaloneWord(word) {
    const directTranslation = lookupDictionaryWord(word);
    if (directTranslation) {
        return directTranslation;
    }

    const numberTranslation = translateNumberToken(word);
    if (numberTranslation) {
        return numberTranslation;
    }

    const detectedVerb = detectVerb(word);
    if (!detectedVerb) {
        return null;
    }

    const baseTranslation = translateLemma(detectedVerb.lemma);
    if (!baseTranslation) {
        return null;
    }

    if (detectedVerb.tense === 'future') {
        return `${config.grammaire.futur} ${baseTranslation}`;
    }

    if (detectedVerb.tense === 'past') {
        return `${config.grammaire.passe} ${baseTranslation}`;
    }

    return baseTranslation;
}

function translateNeutralWord(word) {
    const directTranslation = lookupDictionaryWord(word);
    if (directTranslation) {
        return directTranslation;
    }

    const numberTranslation = translateNumberToken(word);
    if (numberTranslation) {
        return numberTranslation;
    }

    const verbBaseTranslation = translateVerbBase(word);
    if (verbBaseTranslation) {
        return verbBaseTranslation;
    }

    return `[${word}]`;
}

function findVerbAfterAuxiliary(words, startIndex, options = {}) {
    const maxLookahead = options.maxLookahead || 4;
    const requirePast = Boolean(options.requirePast);

    for (let j = startIndex + 1; j <= Math.min(words.length - 1, startIndex + maxLookahead); j++) {
        const detectedVerb = detectVerb(words[j]);
        if (!detectedVerb) {
            continue;
        }

        if (requirePast && detectedVerb.tense !== 'past') {
            continue;
        }

        return { index: j, detectedVerb };
    }

    return null;
}

function initializeDictionaryEditor() {
    if (isDictionaryEditorInitialized) {
        return;
    }

    const openButton = document.getElementById('openDictionaryEditor');
    const closeButton = document.getElementById('closeDictionaryEditor');
    const saveButton = document.getElementById('saveDictionary');
    const resetButton = document.getElementById('resetDictionary');
    const modal = document.getElementById('dictionaryModal');
    const editor = document.getElementById('dictionaryEditor');

    if (!openButton || !closeButton || !saveButton || !resetButton || !modal || !editor) {
        return;
    }

    const refreshEditor = () => {
        editor.value = JSON.stringify(config.lexique, null, 2);
    };

    openButton.addEventListener('click', () => {
        refreshEditor();
        modal.hidden = false;
    });

    closeButton.addEventListener('click', () => {
        modal.hidden = true;
    });

    saveButton.addEventListener('click', () => {
        try {
            const parsed = JSON.parse(editor.value);
            if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
                throw new Error('Format invalide. Le dictionnaire doit être un objet JSON clé/valeur.');
            }

            const cleaned = {};
            Object.keys(parsed).forEach((key) => {
                if (typeof parsed[key] === 'string' && key.trim()) {
                    cleaned[key.trim()] = parsed[key].trim();
                }
            });

            config.lexique = cleaned;
            saveStoredLexique(config.lexique);
            rebuildIndexes();
            modal.hidden = true;
            setDictionaryStatus('Dictionnaire enregistré localement.');
        } catch (error) {
            setDictionaryStatus(error.message || 'Erreur de format JSON.', true);
        }
    });

    resetButton.addEventListener('click', () => {
        config.lexique = { ...baseLexique };
        clearStoredLexique();
        rebuildIndexes();
        refreshEditor();
        setDictionaryStatus('Dictionnaire réinitialisé sur la version intégrée.');
    });

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.hidden = true;
        }
    });

    isDictionaryEditorInitialized = true;
}

fetch('dictionary.json')
    .then((response) => response.json())
    .then((data) => {
        config.grammaire = data.grammaire || config.grammaire;
        baseLexique = { ...(data.lexique || {}) };

        const storedLexique = getStoredLexique();
        config.lexique = storedLexique || { ...baseLexique };

        rebuildIndexes();
        initializeDictionaryEditor();

        if (storedLexique) {
            setDictionaryStatus('Version locale du dictionnaire chargée.');
        }
    })
    .catch(() => {
        config.lexique = getStoredLexique() || {};
        rebuildIndexes();
        initializeDictionaryEditor();
        setDictionaryStatus('Le dictionnaire distant est indisponible.', true);
    });

function handleTranslate() {
    const inputText = document.getElementById('sourceText').value;
    const words = tokenize(inputText);
    const result = [];

    for (let i = 0; i < words.length; i++) {
        const word = words[i];

        if (AUXILIAIRES_FUTUR.has(word)) {
            const verbMatch = findVerbAfterAuxiliary(words, i, { maxLookahead: 4, requirePast: false });
            if (verbMatch) {
                result.push(config.grammaire.futur);

                for (let j = i + 1; j < verbMatch.index; j++) {
                    result.push(translateNeutralWord(words[j]));
                }

                result.push(translateVerbBase(words[verbMatch.index]) || `[${words[verbMatch.index]}]`);
                i = verbMatch.index;
                continue;
            }
        }

        if (AUXILIAIRES_PASSE.has(word)) {
            const verbMatch = findVerbAfterAuxiliary(words, i, { maxLookahead: 4, requirePast: true });
            if (verbMatch) {
                result.push(config.grammaire.passe);

                for (let j = i + 1; j < verbMatch.index; j++) {
                    result.push(translateNeutralWord(words[j]));
                }

                result.push(translateVerbBase(words[verbMatch.index]) || `[${words[verbMatch.index]}]`);
                i = verbMatch.index;
                continue;
            }
        }

        const translatedWord = translateStandaloneWord(word);
        result.push(translatedWord || `[${word}]`);
    }

    document.getElementById('result').innerText = result.join(' ');
}
