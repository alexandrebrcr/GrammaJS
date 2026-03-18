let config = {
    lexique: {},
    grammaire: {
        futur: 'efu',
        passe: 'emas'
    }
};

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
    venir: {
        present: ['viens', 'viens', 'vient', 'venons', 'venez', 'viennent'],
        future: ['viendrai', 'viendras', 'viendra', 'viendrons', 'viendrez', 'viendront'],
        imperfect: ['venais', 'venais', 'venait', 'venions', 'veniez', 'venaient'],
        participle: ['venu', 'venue', 'venus', 'venues']
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
    prendre: {
        present: ['prends', 'prends', 'prend', 'prenons', 'prenez', 'prennent'],
        future: ['prendrai', 'prendras', 'prendra', 'prendrons', 'prendrez', 'prendront'],
        imperfect: ['prenais', 'prenais', 'prenait', 'prenions', 'preniez', 'prenaient'],
        participle: ['pris']
    },
    dire: {
        present: ['dis', 'dis', 'dit', 'disons', 'dites', 'disent'],
        future: ['dirai', 'diras', 'dira', 'dirons', 'direz', 'diront'],
        imperfect: ['disais', 'disais', 'disait', 'disions', 'disiez', 'disaient'],
        participle: ['dit']
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
    }
};

let dictionaryIndex = new Map();
let verbFormIndex = new Map();

fetch('dictionary.json')
    .then((response) => response.json())
    .then((data) => {
        config = data;
        rebuildIndexes();
    })
    .catch(() => {
        rebuildIndexes();
    });

function normalizeLookup(value) {
    return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
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
    const key = dictionaryIndex.get(normalizeLookup(word));
    return key ? config.lexique[key] : null;
}

function translateLemma(lemma) {
    const key = dictionaryIndex.get(normalizeLookup(lemma));
    return key ? config.lexique[key] : null;
}

function getVerbInfo(word) {
    return verbFormIndex.get(normalizeLookup(word)) || null;
}

function translateVerbWord(word) {
    const verbInfo = getVerbInfo(word);
    if (!verbInfo) {
        return null;
    }

    const translation = translateLemma(verbInfo.lemma);
    if (!translation) {
        return null;
    }

    if (verbInfo.tense === 'future') {
        return `${config.grammaire.futur} ${translation}`;
    }

    if (verbInfo.tense === 'past') {
        return `${config.grammaire.passe} ${translation}`;
    }

    return translation;
}

function handleTranslate() {
    const inputText = document.getElementById('sourceText').value;
    const words = tokenize(inputText);
    const result = [];

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const nextWord = words[i + 1];

        if (AUXILIAIRES_FUTUR.has(word) && nextWord) {
            const translation = translateVerbWord(nextWord) || lookupDictionaryWord(nextWord) || `[${nextWord}]`;
            result.push(config.grammaire.futur, translation.replace(/^efu\s+/, ''));
            i++;
            continue;
        }

        if (AUXILIAIRES_PASSE.has(word) && nextWord) {
            const translation = translateVerbWord(nextWord) || lookupDictionaryWord(nextWord) || `[${nextWord}]`;
            result.push(config.grammaire.passe, translation.replace(/^emas\s+/, ''));
            i++;
            continue;
        }

        const directTranslation = lookupDictionaryWord(word);
        if (directTranslation) {
            result.push(directTranslation);
            continue;
        }

        const verbTranslation = translateVerbWord(word);
        if (verbTranslation) {
            result.push(verbTranslation);
            continue;
        }

        result.push(`[${word}]`);
    }

    document.getElementById('result').innerText = result.join(' ');
}
