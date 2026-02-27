const API_URL = "https://speedtype.api.pierre-jehan.com";

const requestHeaders = { 
    "Accept": "application/ld+json" 
};

const postHeaders = { 
    "Accept": "application/ld+json",
    "Content-Type": "application/ld+json"
};

let timer = null;
let timeLeft = 0;
let totalDuration = 0;
let totalCorrectWords = 0;
let currentPage = 1;

const durationSelect = document.getElementById('duration');
const btnStart = document.getElementById('btn-start');
const timeLeftSpan = document.getElementById('time-left');
const wordsDisplay = document.getElementById('words-display');
const textInput = document.getElementById('text-input');
const resultsDiv = document.getElementById('results');
const wpmSpan = document.getElementById('wpm');
const correctWordsSpan = document.getElementById('correct-words');

async function loadParagraph() {
    wordsDisplay.textContent = "Chargement..."; 
    try {
        const response = await fetch(`${API_URL}/random-paragraph`, { 
            method: 'GET',
            headers: requestHeaders
        });
        const data = await response.json();
        wordsDisplay.textContent = data.content;
    } catch (error) {
        wordsDisplay.textContent = "Erreur API";
    }
}

async function startGame() {
    totalDuration = parseInt(durationSelect.value);
    timeLeft = totalDuration;
    totalCorrectWords = 0;
    resultsDiv.classList.add('hidden');
    textInput.value = "";
    textInput.disabled = false;
    timeLeftSpan.textContent = timeLeft;
    await loadParagraph();
    textInput.focus();
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        timeLeftSpan.textContent = timeLeft;
        if (timeLeft <= 0) endGame();
    }, 1000);
}

function checkTyping() {
    const typedText = textInput.value;
    const targetText = wordsDisplay.textContent;
    if (!targetText.startsWith(typedText)) {
        textInput.classList.add('error');
    } else {
        textInput.classList.remove('error');
    }
    if (typedText === targetText && targetText !== "") {
        totalCorrectWords += targetText.trim().split(/\s+/).length;
        textInput.value = "";
        loadParagraph();
    }
}

function endGame() {
    clearInterval(timer);
    textInput.disabled = true;
    textInput.classList.remove('error');
    const currentTyped = textInput.value.trim();
    if (currentTyped !== "") {
        const typedWords = currentTyped.split(/\s+/);
        const targetWords = wordsDisplay.textContent.split(/\s+/);
        let matched = 0;
        typedWords.forEach((word, i) => { if (word === targetWords[i]) matched++; });
        totalCorrectWords += matched;
    }
    const wpm = Math.round((totalCorrectWords / totalDuration) * 60);
    correctWordsSpan.textContent = totalCorrectWords;
    wpmSpan.textContent = wpm;
    resultsDiv.classList.remove('hidden');
}

async function loadScores() {
    const period = document.getElementById('scores-period').value;
    let url = `${API_URL}/scores?page=${currentPage}&order[wpm]=desc`;

    if (period !== 'all') {
        const date = new Date();
        if (period === 'day') date.setHours(0, 0, 0, 0);
        else if (period === 'week') date.setDate(date.getDate() - 7);
        else if (period === 'year') date.setFullYear(date.getFullYear() - 1);
        url += `&createdAt[after]=${encodeURIComponent(date.toISOString())}`;
    }

    try {
        const res = await fetch(url, { headers: requestHeaders });
        const data = await res.json();
        const tbody = document.getElementById('scores-body');
        
        const scores = data['hydra:member'] || data['member'] || [];
        const view = data['hydra:view'] || data['view'];

        if (scores.length > 0) {
            tbody.innerHTML = scores.map((s, i) => `
                <tr>
                    <td>${(currentPage - 1) * 30 + i + 1}</td>
                    <td>${s.pseudo}</td>
                    <td>${s.wpm}</td>
                    <td>${s.timeLimit}s</td>
                    <td>${new Date(s.createdAt).toLocaleDateString()}</td>
                </tr>
            `).join('');
            document.getElementById('page-info').textContent = `Page ${currentPage}`;
            document.getElementById('btn-prev').disabled = !view || !view['hydra:previous'];
            document.getElementById('btn-next').disabled = !view || !view['hydra:next'];
        } else {
            tbody.innerHTML = '<tr><td colspan="5">Aucun score trouvé</td></tr>';
            document.getElementById('btn-prev').disabled = true;
            document.getElementById('btn-next').disabled = true;
        }
    } catch (e) {
        console.error(e);
    }
}

btnStart.onclick = startGame;
textInput.oninput = checkTyping;

document.getElementById('btn-scores').onclick = () => {
    currentPage = 1;
    loadScores();
    document.getElementById('modal-scores').showModal();
};

document.getElementById('modal-close').onclick = () => document.getElementById('modal-scores').close();
document.querySelectorAll('dialog').forEach(m => m.onclick = (e) => { if(e.target === m) m.close() });

document.getElementById('scores-period').onchange = () => {
    currentPage = 1;
    loadScores();
};

document.getElementById('btn-prev').onclick = () => {
    if (currentPage > 1) {
        currentPage--;
        loadScores();
    }
};

document.getElementById('btn-next').onclick = () => {
    currentPage++;
    loadScores();
};

document.getElementById('btn-save').onclick = async () => {
    const body = JSON.stringify({
        pseudo: document.getElementById('pseudo').value || "Anonyme",
        timeLimit: totalDuration,
        wpm: parseInt(wpmSpan.textContent)
    });
    try {
        const res = await fetch(`${API_URL}/scores`, { method: 'POST', headers: postHeaders, body });
        if (res.ok) { alert("Score enregistré !"); resultsDiv.classList.add('hidden'); }
    } catch (e) { alert("Erreur réseau"); }
};

document.getElementById('form-paragraph').onsubmit = async (e) => {
    e.preventDefault();
    const content = document.getElementById('paragraph-content').value;
    try {
        const res = await fetch(`${API_URL}/paragraphs`, {
            method: 'POST',
            headers: postHeaders,
            body: JSON.stringify({ content })
        });
        if (res.ok) {
            document.getElementById('modal-paragraph').close();
            e.target.reset();
            alert("Ajouté !");
        }
    } catch (err) { alert("Erreur"); }
};

document.getElementById('btn-add-paragraph').onclick = () => document.getElementById('modal-paragraph').showModal();
document.getElementById('modal-paragraph-close').onclick = () => document.getElementById('modal-paragraph').close();