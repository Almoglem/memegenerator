var gElCanvas;
var gCtx;

var gTouchEvs = ['touchstart', 'touchmove', 'touchend'];

function init() {
    gElCanvas = document.getElementById('meme-canvas');
    gCtx = gElCanvas.getContext('2d');
    renderImages();
    addEventListeners();
}

function addEventListeners() {
    addMouseListeners();

    var elInput = document.getElementById('input-text');
    elInput.addEventListener("keyup", addText);

    //// if there are no lines/active lines, prevent typing and show message:
    elInput.addEventListener("keydown", function (event) {
        if (!getgMemeLines().length) {
            event.preventDefault();
            elInput.placeholder = 'add lines!';
        }
        else if (!getCurrLine()) {
            event.preventDefault();
            elInput.placeholder = 'choose a line!';
        }
    });
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousedown', onDown)
}

function onDown(ev) {
    emptyInput();
    const pos = getEvPos(ev);
    if (!lineClicked(pos)) return;
}


function lineClicked(pos) {
    var lines = getgMemeLines();
    var clickedLineIdx = lines.findIndex(line => {
        return pos.x > line.x - (line.width / 2) - 10
            && pos.x < line.x + (line.width / 2) + 10
            && pos.y > line.y - line.size
            && pos.y < gElCanvas.height - (gElCanvas.height - line.y - 10)
    });
    updateActiveLine(clickedLineIdx);
    renderCanvas();
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
    if (!getCurrLine()) return;
    changeFontSize(action);
    renderCanvas();
}

function onChangeLineHeight(direction) {
    if (!getCurrLine()) return;
    ChangeLineHeight(direction);
    renderCanvas();
}

function onAddLine() {
    document.querySelector('#input-text').placeholder = '';
    addLine();
    emptyInput();
    renderCanvas();
}

function onDeleteLine() {
    if (!getCurrLine()) return;
    deleteLine();
    renderCanvas();
}

function onClearText() {
    resetLines();
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
    updateLineWidth(width);

    gCtx.beginPath();
    gCtx.strokeStyle = "#ffffff9d";
    var x = line.x - (line.width / 2);
    var y = line.y - line.size;
    gCtx.rect(x - 10, y, line.width + 20, line.size + 10);
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
    resetLines('initial');
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
    var elInput = document.getElementById('input-text');
    elInput.value = '';
}

//////////// other

function emptyInput() {
    var elInput = document.getElementById('input-text');
    elInput.value = '';
}


function getEvPos(ev) {
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    return pos
}