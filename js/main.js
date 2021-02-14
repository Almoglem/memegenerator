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

    //// typing listeners
    window.addEventListener('keydown', function (event) {
        if (getActiveLine()) handleInlineInput(event);
    });

    var elInput = document.getElementById('input-text');
    elInput.addEventListener('keyup', addText);

    elInput.addEventListener('keydown', function (event) {
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

function onFilterBy(filter) {
    setFilter(filter);
    renderImages();
}

function toggleEditor() {
    document.querySelector('.editor-container').classList.toggle('hidden');
    document.querySelector('.gallery').classList.toggle('hidden');
    document.querySelector('.filter-container').classList.toggle('hidden');
    document.querySelector('.footer-container').classList.toggle('hidden');

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
        gCtx.setLineDash([]);
    }
}

function resetCanvas() {
    resetLines('initial');
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
    emptyInput();
}


//////////////// editor controllers ////////////////

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

function onChangeFontSize(action) {
    if (!getActiveLine()) return;
    changeFontSize(action);
    renderCanvas();
}

function onSetFont(fontFamily) {
    setFont(fontFamily);
    document.querySelector('#font-select').style.fontFamily = fontFamily;
    renderCanvas();
}

function onChangeTextColor(hex) {
    if (!getActiveLine()) return;
    changeTextColor(hex);
    updateColorInputs();
    renderCanvas();
}

function onChangeStrokeColor(hex) {
    if (!getActiveLine()) return;
    changeStrokeColor(hex);
    updateColorInputs();
    renderCanvas();
}


function onClearText() {
    resetLines();
    emptyInput();
    renderCanvas();
}

function onBack() {
    resetCanvas();
    toggleEditor();
}


function onDownloadCanvas(elLink) {
    updateActiveLine(-1);
    renderCanvas();
    const data = gElCanvas.toDataURL()
    elLink.href = data;
    elLink.download = 'mySpongeMeme';
}

/////////////////text change & mark////////////////////

function addText() {
    var line = getActiveLine();
    if (!line) return;
    var text = document.getElementById('input-text').value;
    line.txt = text;
    renderCanvas();
}

function handleInlineInput(ev) {
    var char = ev.key;
    var line = getActiveLine();
    if (line.txt === 'your text here') line.txt = ''
    if (char === 'Backspace') line.txt = line.txt.substring(0, line.txt.length - 1);
    else if (char === 'Escape' || char === 'Enter') updateActiveLine(-1);
    else if (char === 'Delete') deleteLine();
    else if (!String.fromCharCode(ev.keyCode).match(/(\w|\s)/g)) return;
    else line.txt += char;
    renderCanvas();
}

function drawText() {
    var lines = getgMemeLines();
    lines.forEach(line => {
        gCtx.beginPath();
        gCtx.lineWidth = 2;
        gCtx.strokeStyle = line.stroke;
        gCtx.fillStyle = line.color;
        gCtx.font = `${line.size}px ${line.font} `;
        gCtx.textAlign = line.align;
        gCtx.fillText(line.txt, line.x, line.y, gElCanvas.width);
        if (line.font !== 'Sponge') gCtx.strokeText(line.txt, line.x, line.y, gElCanvas.width);
    });
}

function MarkActiveLine() {
    var line = getActiveLine();
    if (!line) return;

    gCtx.font = `${line.size}px ${line.font}`;
    var width = gCtx.measureText(line.txt).width;
    updateLineWidth(width);

    gCtx.beginPath();
    gCtx.setLineDash([6, 5]);
    gCtx.strokeStyle = "#ffffff";
    var x = line.x - (line.width / 2);
    var y = line.y - line.size;
    gCtx.rect(x - 10, y, line.width + 20, line.size + 10);
    gCtx.stroke();
}


///////////////// line dragging related functions ////////////////////

function onDown(ev) {
    emptyInput();
    const pos = getEvPos(ev);
    if (!lineClicked(pos)) return;
    gStartPos = pos;
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
    if (clickedLineIdx !== -1) {
        document.body.style.cursor = 'grabbing';
        updateColorInputs();
        return true;
    }
    else return false;
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


//////////// inputs updates

function emptyInput() {
    var elInput = document.getElementById('input-text');
    elInput.value = '';
    elInput.placeholder = '';
}

function updateColorInputs() {
    var activeLine = getActiveLine()
    document.querySelector('#text-fill').value = activeLine.color;
    document.querySelector('#text-stroke').value = activeLine.stroke;
}
