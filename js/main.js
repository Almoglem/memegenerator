var gElCanvas;
var gCtx;

function init() {
    gElCanvas = document.getElementById('meme-canvas');
    gCtx = gElCanvas.getContext('2d');
    renderImages();
    addEventListeners();
}

function addEventListeners() {
    var elInput = document.getElementById('input-text');
    elInput.addEventListener("keyup", addText);
}

function renderImages() {
    images = getImgsForDisplay();
    var strHTMLs = images.map(img => {
        return `<div class="gallery-item ${img.id}" onclick="onSetImg(${img.id})"> <img src="./${img.url}" alt=""> </div>`
    });
    document.querySelector('.gallery').innerHTML = strHTMLs.join('');
}

function onSetImg(id) {
    setgImg(id);
    renderCanvas();
    toggleEditor();
}

function onBack() {
    resetCanvas();
    toggleEditor();
}

function toggleEditor() {
    var elEditor = document.querySelector('.editor');
    var elGallery = document.querySelector('.gallery')
    elEditor.classList.toggle('hidden');
    elGallery.classList.toggle('hidden');
}

function addText() {
    var text = document.getElementById('input-text').value;
    var line = getCurrLine();
    line.txt = text;
    renderCanvas();
}

function onSwitchLine() {
    updateLineIdx();
    var line = getCurrLine();
    line.txt = 'your text here!✍'
    renderCanvas();
    var elInput = document.getElementById('input-text');
    elInput.value = '';
}

function renderCanvas() {
    const img = new Image();
    var currImg = getImgById(gCurrImgId);
    img.src = `./${currImg.url}`;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
        drawText();
    }
}

function drawText() {
    var lines = getgMemeLines();
    for (var i = 0; i < lines.length; i++) {
        gCtx.lineWidth = 2;
        gCtx.strokeStyle = lines[i].stroke;
        gCtx.fillStyle = lines[i].color;
        gCtx.font = `${lines[i].size}px ${lines[i].font}`;
        gCtx.textAlign = lines[i].align;
        gCtx.fillText(lines[i].txt, gElCanvas.width / 2, lines[i].y, gElCanvas.width);
        gCtx.strokeText(lines[i].txt, gElCanvas.width / 2, lines[i].y, gElCanvas.width);
    }
}

function clearText() {
    var lines = getgMemeLines();
    for (var i = 0; i < lines.length; i++) {
        lines[i].txt = '';
    }
    renderCanvas();
    updateLineIdx('reset');
}

function resetCanvas() {
    clearText();
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
    var elInput = document.getElementById('input-text');
    elInput.value = '';
}

function downloadCanvas(elLink) {
    const data = gElCanvas.toDataURL()
    elLink.href = data;
    elLink.download = 'myMeme'
}