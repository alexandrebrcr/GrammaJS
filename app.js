let config = {};

// Charger le dictionnaire
fetch('dictionary.json')
    .then(response => response.json())
    .then(data => config = data);

function handleTranslate() {
    const text = document.getElementById('sourceText').value;
    const doc = nlp(text); // Utilise la bibliothèque compromise
    
    // On analyse la phrase mot par mot
    let output = doc.json()[0].terms.map(term => {
        let word = term.normal; // Le mot en minuscules
        let tags = term.tags;   // Les tags grammaticaux (PastTense, FutureTense, etc.)
        
        // 1. Chercher la racine (Lemme) si c'est un verbe
        let root = term.root || word;
        let translation = config.lexique[root] || `[${word}]`;

        // 2. Appliquer les règles de temps (votre logique type Espéranto)
        if (tags.includes('PastTense')) {
            translation = config.grammaire.passe + " " + translation;
        } 
        else if (tags.includes('FutureTense')) {
            translation = config.grammaire.futur + " " + translation;
        }

        // 3. Règle simple de pluriel
        if (tags.includes('Plural')) {
            translation += config.grammaire.pluriel;
        }

        return translation;
    });

    document.getElementById('result').innerText = output.join(' ');
}