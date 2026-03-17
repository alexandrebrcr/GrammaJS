let config = {};

// 1. Chargement du dictionnaire
fetch('dictionary.json')
    .then(response => response.json())
    .then(data => config = data);

function handleTranslate() {
    const inputText = document.getElementById('sourceText').value;
    // On nettoie un peu le texte (minuscules, retrait de la ponctuation simple)
    const words = inputText.toLowerCase().replace(/[.,!?;]/g, '').split(/\s+/);
    
    let result = [];
    
    for (let i = 0; i < words.length; i++) {
        let word = words[i];
        let nextWord = words[i + 1];

        // --- RÈGLE 1 : LE FUTUR PROCHE (ex: "vais manger") ---
        const auxiliairesFutur = ['vais', 'vas', 'va', 'allons', 'allez', 'vont'];
        if (auxiliairesFutur.includes(word) && nextWord) {
            let translation = config.lexique[nextWord] || `[${nextWord}]`;
            result.push(config.grammaire.futur + " " + translation);
            i++; // On saute le mot suivant car on l'a déjà traité
            continue;
        }

        // --- RÈGLE 2 : LE PASSÉ COMPOSÉ (ex: "ai mangé") ---
        const auxiliairesPasse = ['ai', 'as', 'a', 'avons', 'avez', 'ont', 'suis', 'es', 'est', 'sommes', 'êtes', 'sont'];
        if (auxiliairesPasse.includes(word) && nextWord) {
            // On essaie de trouver la racine du participe passé (simplifié)
            // ex: "mangé" devient "manger" pour le dictionnaire
            let root = nextWord.replace(/é$|és$|ée$|ées$/, 'er'); 
            let translation = config.lexique[root] || `[${nextWord}]`;
            result.push(config.grammaire.passe + " " + translation);
            i++; 
            continue;
        }

        // --- RÈGLE 3 : LE FUTUR SIMPLE (ex: "mangerai") ---
        if (word.endsWith('rai') || word.endsWith('ras') || word.endsWith('ra') || word.endsWith('rons') || word.endsWith('rez') || word.endsWith('ront')) {
            let root = word.replace(/rai$|ras$|ra$|rons$|rez$|ront$/, 'er');
            let translation = config.lexique[root] || `[${word}]`;
            result.push(config.grammaire.futur + " " + translation);
            continue;
        }

        // --- RÈGLE 4 : TRADUCTION SIMPLE (Noms, Pronoms, Verbes présents) ---
        let translation = config.lexique[word] || `[${word}]`;
        result.push(translation);
    }

    document.getElementById('result').innerText = result.join(' ');
}