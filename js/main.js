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

    //// if there are no lines, prevent typing and show 'add lines' message:
    elInput.addEventListener("keydown", function (event) {
        if (!getgMemeLines().length) {
            event.preventDefault();
            elInput.placeholder = 'add lines!';
        }
    });
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
    emptyInput();
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
    elLink.download = 'mySpongeMeme'
}


/////////////////////////////////////


function toggleEditor() {
    document.querySelector('.editor').classList.toggle('hidden');
    document.querySelector('.gallery').classList.toggle('hidden');

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
    var line = getCurrLine();
    if (!line) return;
    gCtx.font = `${line.size}px ${line.font}`;

    var width = gCtx.measureText(line.txt).width;
    gCtx.beginPath();
    gCtx.strokeStyle = "#ffffff9d";
    var x = line.x - (width / 2);
    var y = line.y - line.size;
    gCtx.rect(x - 10, y, width + 20, line.size + 10);
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
    document.querySelector('#input-text').placeholder = '';
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