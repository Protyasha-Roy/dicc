async function findMeanings() {
    const inputText = document.getElementById('inputText').value;
    const words = inputText.match(/\b\w+\b/g).filter(word => word !== '');
    const meaningsDiv = document.getElementById('meanings');
    meaningsDiv.innerHTML = '';

    for (const word of words) {
        const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            const meanings = data[0].meanings.map(meaning => meaning.definitions[0].definition);
            const synonyms = data[0].meanings.flatMap(meaning => meaning.synonyms);
            const antonyms = data[0].meanings.flatMap(meaning => meaning.antonyms);
            const phonetic = data[0].phonetic;
            const audioUrl = data[0].phonetics[0].audio;
            let wordMeaning = `<div style="display: flex; align-items: center;"><p><strong>${word}:</strong> ${meanings.join(', ')}`;
            if (synonyms.length > 0) {
                wordMeaning += `<br><strong style="color: blue;">Synonyms:</strong> ${synonyms.join(', ')}`;
            }
            if (antonyms.length > 0) {
                wordMeaning += `<br><strong style="color: red;">Antonyms:</strong> ${antonyms.join(', ')}`;
            }
            wordMeaning += `</p>`;
            if (audioUrl) {
                wordMeaning += `<span class="pronunciation-button" style="margin-left: 5px;" onclick="playAudio('${audioUrl}')">&#x1F50A;</span>`;
            }
            wordMeaning += `</div>`;
            meaningsDiv.innerHTML += wordMeaning;
        } catch (error) {
            console.error('Error fetching data:', error);
            meaningsDiv.innerHTML += `<p><strong>${word}:</strong> No meaning found</p>`;
        }
    }
}

function playAudio(audioUrl) {
    const audio = new Audio(audioUrl);
    audio.play();
}

document.getElementById('inputText').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      findMeanings();
    }
  });
