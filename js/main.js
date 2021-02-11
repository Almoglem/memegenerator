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
    emptyInput();
}

function onClearText() {
    deleteAllLines();
    renderCanvas();
}

function onBack() {
    document.querySelector('.download').classList.add('hidden');
    resetCanvas();
    toggleEditor();
}

function onReady() {
    removeActiveLine();
    renderCanvas();
    document.querySelector('.download').classList.remove('hidden');
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
    var line = getCurrLine();
    if (!line) return;
    var text = document.getElementById('input-text').value;
    line.txt = text;
    renderCanvas();
}

function drawText() {
    var lines = getgMemeLines();
    lines.forEach(line => {
        gCtx.beginPath();
        gCtx.lineWidth = 2;
        gCtx.strokeStyle = line.stroke;
        gCtx.fillStyle = line.color;
        gCtx.font = `${line.size}px ${line.font}`;
        gCtx.textAlign = line.align;
        gCtx.fillText(line.txt, line.x, line.y, gElCanvas.width);
        gCtx.strokeText(line.txt, line.x, line.y, gElCanvas.width);
    });
}

function MarkCurrLine() {
    var currLine = getCurrLine();
    if (!currLine) return;
    var width = gCtx.measureText(currLine.txt).width;
    gCtx.beginPath();
    gCtx.strokeStyle = "white";
    var x = currLine.x - (width / 2);
    var y = currLine.y - currLine.size;
    gCtx.rect(x - 10, y, width + 20, currLine.size + 10);
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
    resetLines();
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
    var elInput = document.getElementById('input-text');
    elInput.value = '';
}


function onAddLine() {
    addLine();
    emptyInput();
    renderCanvas();
}

function onDeleteLine() {
    deleteLine();
    renderCanvas();
}


function emptyInput() {
    var elInput = document.getElementById('input-text');
    elInput.value = '';
}