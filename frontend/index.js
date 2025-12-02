// Configuração da API - ALTERE AQUI depois de fazer deploy no Railway
const API_URL = 'https://web-production-5c39.up.railway.app';

let selectedFiles = [];
let analysisResults = null;

// Elementos DOM
const uploadBox = document.getElementById('uploadBox');
const fileInput = document.getElementById('fileInput');
const filesList = document.getElementById('filesList');
const analyzeBtn = document.getElementById('analyzeBtn');
const loading = document.getElementById('loading');
const resultsSection = document.getElementById('resultsSection');
const resultsGrid = document.getElementById('resultsGrid');
const detailModal = document.getElementById('detailModal');
const closeModal = document.getElementById('closeModal');
const modalTitle = document.getElementById('modalTitle');
const similarityDetails = document.getElementById('similarityDetails');

// Event Listeners
uploadBox.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFileSelect);
analyzeBtn.addEventListener('click', analyzeFiles);
closeModal.addEventListener('click', () => detailModal.style.display = 'none');

// Drag and Drop
uploadBox.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadBox.classList.add('drag-over');
});

uploadBox.addEventListener('dragleave', () => {
    uploadBox.classList.remove('drag-over');
});

uploadBox.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadBox.classList.remove('drag-over');
    const files = Array.from(e.dataTransfer.files).filter(file => file.type === 'application/pdf');
    addFiles(files);
});

// Funções principais
function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    addFiles(files);
}

function addFiles(files) {
    if (selectedFiles.length + files.length > 100) {
        alert('Máximo de 100 arquivos permitidos!');
        return;
    }

    files.forEach(file => {
        if (!selectedFiles.find(f => f.name === file.name)) {
            selectedFiles.push(file);
        }
    });

    updateFilesList();
    updateAnalyzeButton();
}

function removeFile(index) {
    selectedFiles.splice(index, 1);
    updateFilesList();
    updateAnalyzeButton();
}

function updateFilesList() {
    if (selectedFiles.length === 0) {
        filesList.innerHTML = '';
        return;
    }

    filesList.innerHTML = selectedFiles.map((file, index) => `
        <div class="file-item">
            <div class="file-info">
                <div class="file-icon">PDF</div>
                <span class="file-name">${file.name}</span>
            </div>
            <button class="remove-btn" onclick="removeFile(${index})">Remover</button>
        </div>
    `).join('');
}

function updateAnalyzeButton() {
    analyzeBtn.disabled = selectedFiles.length < 2;
}

async function analyzeFiles() {
    if (selectedFiles.length < 2) {
        alert('Selecione pelo menos 2 arquivos para comparar!');
        return;
    }

    // Mostrar loading
    loading.style.display = 'block';
    resultsSection.style.display = 'none';
    analyzeBtn.disabled = true;

    // Preparar FormData
    const formData = new FormData();
    selectedFiles.forEach(file => {
        formData.append('files', file);
    });

    try {
        const response = await fetch(`${API_URL}/analyze`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Erro na análise');
        }

        analysisResults = await response.json();
        displayResults();
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao analisar arquivos. Verifique se o backend está rodando!');
    } finally {
        loading.style.display = 'none';
        analyzeBtn.disabled = false;
    }
}

function displayResults() {
    resultsSection.style.display = 'block';
    resultsGrid.innerHTML = '';

    // Filtrar apenas resultados com similaridade >= 40%
    const filteredResults = analysisResults.results.filter(r => r.similarity >= 40);

    if (filteredResults.length === 0) {
        resultsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #666;">Nenhuma similaridade significativa encontrada (acima de 40%).</p>';
        return;
    }

    // Agrupar por arquivo principal
    const groupedResults = {};
    filteredResults.forEach(result => {
        if (!groupedResults[result.file1]) {
            groupedResults[result.file1] = [];
        }
        groupedResults[result.file1].push(result);
    });

    // Criar cards
    Object.keys(groupedResults).forEach(fileName => {
        const similarities = groupedResults[fileName];
        const maxSimilarity = Math.max(...similarities.map(s => s.similarity));
        const category = getSimilarityCategory(maxSimilarity);

        const card = document.createElement('div');
        card.className = `result-card ${category}`;
        card.innerHTML = `
            <h3>${fileName}</h3>
            <div class="similarity-badge" style="background: ${getCategoryColor(category)}">
                ${maxSimilarity.toFixed(1)}%
            </div>
            <p style="margin-top: 10px; color: #666;">
                ${similarities.length} similaridade(s) encontrada(s)
            </p>
        `;
        card.addEventListener('click', () => showDetails(fileName, similarities));
        resultsGrid.appendChild(card);
    });
}

function showDetails(fileName, similarities) {
    modalTitle.textContent = `Detalhes: ${fileName}`;
    
    similarityDetails.innerHTML = similarities.map(sim => {
        const category = getSimilarityCategory(sim.similarity);
        return `
            <div class="similarity-item ${category}">
                <span>${sim.file2}</span>
                <span class="similarity-percentage" style="color: ${getCategoryColor(category)}">
                    ${sim.similarity.toFixed(1)}%
                </span>
            </div>
        `;
    }).join('');

    detailModal.style.display = 'flex';
}

function getSimilarityCategory(percentage) {
    if (percentage >= 80) return 'red';
    if (percentage >= 60) return 'orange';
    return 'yellow';
}

function getCategoryColor(category) {
    const colors = {
        'yellow': '#FFD93D',
        'orange': '#FF9B42',
        'red': '#C33C54'
    };
    return colors[category];
}

// Fechar modal ao clicar fora
window.addEventListener('click', (e) => {
    if (e.target === detailModal) {
        detailModal.style.display = 'none';
    }
});

// Expor função removeFile globalmente

window.removeFile = removeFile;
