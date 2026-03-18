let config = {};

// 1. Chargement du dictionnaire
fetch('dictionary.json')
    .then(response => response.json())
    .then(data => config = data);

function handleTranslate() {
    const inputText = document.getElementById('sourceText').value;
    // Nettoyage minimal: minuscules et suppression de la ponctuation la plus courante.
    const words = inputText.toLowerCase().replace(/[.,!?;]/g, '').split(/\s+/).filter(Boolean);

    let result = [];

    for (let i = 0; i < words.length; i++) {
        let word = words[i];
        let nextWord = words[i + 1];

        // --- RÈGLE 1 : FUTUR FRANÇAIS -> efu + verbe Meniki ---
        const auxiliairesFutur = ['vais', 'vas', 'va', 'allons', 'allez', 'vont'];
        if (auxiliairesFutur.includes(word) && nextWord) {
            let translation = config.lexique[nextWord] || `[${nextWord}]`;
            result.push(config.grammaire.futur + " " + translation);
            i++;
            continue;
        }

        // --- RÈGLE 2 : PASSÉ FRANÇAIS -> emas + verbe Meniki ---
        const auxiliairesPasse = ['ai', 'as', 'a', 'avons', 'avez', 'ont', 'suis', 'es', 'est', 'sommes', 'êtes', 'sont'];
        if (auxiliairesPasse.includes(word) && nextWord) {
            let translation = config.lexique[nextWord] || `[${nextWord}]`;
            result.push(config.grammaire.passe + " " + translation);
            i++;
            continue;
        }

        // --- RÈGLE 3 : TRADUCTION SIMPLE (pronoms, verbes, noms) ---
        let translation = config.lexique[word] || `[${word}]`;
        result.push(translation);
    }

    document.getElementById('result').innerText = result.join(' ');
}