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

//////////////// gallery ////////////////

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


//////////////// editor controllers ////////////////

function onChangeFontSize(action) {
    changeFontSize(action);
    renderCanvas();
}

function onChangeLineHeight(direction) {
    ChangeLineHeight(direction);
    renderCanvas();
}

function onSwitchLine() {
    updateLineIdx();
    renderCanvas();
    var elInput = document.getElementById('input-text');
    elInput.value = '';
}

function onClearText() {
    emptyLines();
    renderCanvas();
    updateLineIdx('reset');
}

function onBack() {
    resetCanvas();
    toggleEditor();
}

function onReady() {
    removeActiveLine();
    renderCanvas();
}

function onDownloadCanvas(elLink) {
    const data = gElCanvas.toDataURL()
    elLink.href = data;
    elLink.download = 'myMeme'
}


/////////////////////////////////////


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

function drawText() {
    var lines = getgMemeLines();
    for (var i = 0; i < lines.length; i++) {
        gCtx.beginPath();
        gCtx.lineWidth = 2;
        gCtx.strokeStyle = lines[i].stroke;
        gCtx.fillStyle = lines[i].color;
        gCtx.font = `${lines[i].size}px ${lines[i].font}`;
        gCtx.textAlign = lines[i].align;
        gCtx.fillText(lines[i].txt, lines[i].x, lines[i].y, gElCanvas.width);
        gCtx.strokeText(lines[i].txt, lines[i].x, lines[i].y, gElCanvas.width);
    }
}

function MarkCurrLine() {
    var currLine = getCurrLine();
    if (!currLine) return;
    var lineWidth = parseInt(gCtx.measureText(currLine.txt).width);
    gCtx.beginPath();
    gCtx.lineWidth = "2";
    gCtx.strokeStyle = "white";
    var x = currLine.x - (lineWidth / 2)
    var y = currLine.y - currLine.size;
    gCtx.rect(x - 10, y, lineWidth + 20, currLine.size + 10);
    gCtx.stroke();
}

//////////////// canvas ////////////////

function renderCanvas() {
    const img = new Image();
    var currImg = getImgById(gCurrImgId);
    img.src = `./${currImg.url}`;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
        drawText();
        MarkCurrLine();
    }
}

function resetCanvas() {
    emptyLines();
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
    var elInput = document.getElementById('input-text');
    elInput.value = '';
}

