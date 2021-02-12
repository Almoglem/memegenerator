var gElCanvas;
var gCtx;
var gStartPos;

var gTouchEvs = ['touchstart', 'touchmove', 'touchend'];

function init() {
    gElCanvas = document.getElementById('meme-canvas');
    gCtx = gElCanvas.getContext('2d');
    renderImages();
    addEventListeners();
}

///////////////// event listeners ////////////////////

function addEventListeners() {
    addMouseListeners();
    addTouchListeners();

    var elInput = document.getElementById('input-text');
    elInput.addEventListener("keyup", addText);
    elInput.addEventListener("keydown", function (event) {
        if (!getActiveLine()) {
            event.preventDefault();
            elInput.placeholder = 'no line selected!';
        }
    });
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousedown', onDown);
    gElCanvas.addEventListener('mousemove', onMove);
    gElCanvas.addEventListener('mouseup', onUp);
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchmove', onMove);
    gElCanvas.addEventListener('touchstart', onDown);
    gElCanvas.addEventListener('touchend', onUp);
}

//////////////// gallery & editor rendering or toggling ////////////////

function renderImages() {
    images = getImgsForDisplay();
    var strHTMLs = images.map(img => {
        return `<div class="gallery-item ${img.id}" onclick="onSetImg(${img.id})">
        <img src="./${img.url}" alt=""></div>`
    });
    document.querySelector('.gallery').innerHTML = strHTMLs.join('');
}

function onSetImg(id) {
    setgImg(id);
    renderCanvas();
    toggleEditor();
}

function toggleEditor() {
    document.querySelector('.editor').classList.toggle('hidden');
    document.querySelector('.gallery').classList.toggle('hidden');
}


//////////////// canvas ////////////////

function renderCanvas() {
    const img = new Image();
    var currImg = getImgById(gCurrImgId);
    img.src = `./${currImg.url}`;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
        drawText();
        MarkActiveLine();
    }
}

function resetCanvas() {
    resetLines('initial');
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
    var elInput = document.getElementById('input-text');
    elInput.value = '';
}


//////////////// editor controllers ////////////////

function onChangeFontSize(action) {
    if (!getActiveLine()) return;
    changeFontSize(action);
    renderCanvas();
}

function onChangeLineHeight(direction) {
    if (!getActiveLine()) return;
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
    if (!getActiveLine()) return;
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


function onDownloadCanvas(elLink) {
    const data = gElCanvas.toDataURL()
    elLink.href = data;
    elLink.download = 'mySpongeMeme'
}


/////////////////text change & mark////////////////////

function addText() {
    var line = getActiveLine();
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

function MarkActiveLine() {
    var line = getActiveLine();
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


///////////////// line dragging related functions ////////////////////

function onDown(ev) {
    const pos = getEvPos(ev);
    if (!lineClicked(pos)) return;
    gStartPos = pos;
    emptyInput();
}

function onMove(ev) {
    var activeLine = getActiveLine();
    if (activeLine && activeLine.isDragging) {
        const pos = getEvPos(ev);
        const dx = pos.x - gStartPos.x;
        const dy = pos.y - gStartPos.y;

        activeLine.x += dx
        activeLine.y += dy

        gStartPos = pos;
        renderCanvas();
    }
}

function onUp() {
    document.body.style.cursor = 'default';
    var activeLine = getActiveLine();
    if (!activeLine) return;
    activeLine.isDragging = false;
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
    document.body.style.cursor = 'grabbing';
    if (clickedLineIdx === -1) return false;
    else return true;
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


//////////// others/general

function emptyInput() {
    var elInput = document.getElementById('input-text');
    elInput.value = '';
    elInput.placeholder = '';
}