var gElCanvas;
var gCtx;
var gDragStartPos;
var gIsDragging = false;

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
    document.getElementById('text-input').addEventListener('keyup', addText);
    window.addEventListener('keydown', handleInlineInput);
};

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

function onLogoClick() {
    var elGallery = document.querySelector('.gallery');
    if (elGallery.classList.contains('hidden')) toggleEditor();
}

function renderImages() {
    images = getImgsForDisplay();
    var strHTMLs = images.map(img => {
        return `<div class="gallery-item ${img.id}" onclick="onSetImg(${img.id})">
        <img src="./${img.url}" alt=""></div>`
    });
    document.querySelector('.gallery').innerHTML = strHTMLs.join('');
}

function onSetImg(id) {
    setImg(id);
    renderCanvas();
    toggleEditor();
}

function onFilterBy(filter) {
    setFilter(filter);
    renderImages();
}

function toggleEditor() {
    document.querySelector('.editor-container').classList.toggle('hidden');
    document.querySelectorAll('.home').forEach(element => {
        element.classList.toggle('hidden')
    });
}

//////////////// canvas ////////////////

function renderCanvas() {
    const img = new Image();
    var currImg = getCurrImg();
    img.src = `${currImg.url}`;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
        drawText();
        markActiveLine();
    }
}

function resetCanvas() {
    resetLines(true);
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
    emptyInput();
}


//////////////// editor controllers ////////////////

function onAddLine() {
    addLine();
    emptyInput();
    renderCanvas();
}

function onDeleteLine() {
    if (!getActiveLine()) return;
    deleteLine();
    emptyInput();
    renderCanvas();
}

function onChangeFontSize(prefix) {
    if (!getActiveLine()) return;
    changeFontSize(prefix);
    renderCanvas();
}

function onSetFont(font) {
    changeProperty('font', font);
    document.querySelector('#font-select').style.fontFamily = font;
    renderCanvas();
}

function onChangeTextColor(color) {
    if (!getActiveLine()) return;
    changeProperty('color', color);
    updateInputs();
    renderCanvas();
}

function onChangeStrokeColor(color) {
    if (!getActiveLine()) return;
    changeProperty('stroke', color);
    updateInputs();
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

function onReady() {
    updateActiveLine(-1);
    renderCanvas();
}
function onDownloadCanvas(elLink) {
    const data = gElCanvas.toDataURL()
    elLink.href = data;
    elLink.download = 'mySpongeMeme';
}



/////////////////text change & mark////////////////////

function addText() {
    var line = getActiveLine();
    if (!line) addLine();
    var txt = document.getElementById('text-input').value;
    changeProperty('txt', txt);
    renderCanvas();
}

function handleInlineInput(ev) {
    if (!getActiveLine()) addLine();
    var char = ev.key;
    var line = getActiveLine();
    if (line.txt === 'your text here') line.txt = ''
    if (char === 'Backspace') line.txt = line.txt.substring(0, line.txt.length - 1);
    else if (char === 'Escape' || char === 'Enter') updateActiveLine(-1);
    else if (char === 'Delete') onDeleteLine();
    else if (!String.fromCharCode(ev.keyCode).match(/(\w|\s)/g)) return;
    else line.txt += char;
    renderCanvas();
}

function drawText() {
    var lines = getMemeLines();
    lines.forEach(line => {
        gCtx.beginPath();
        gCtx.lineWidth = 2;
        gCtx.strokeStyle = line.stroke;
        gCtx.fillStyle = line.color;
        gCtx.font = `${line.size}px ${line.font} `;
        gCtx.textAlign = line.align;
        gCtx.fillText(line.txt, line.x, line.y, gElCanvas.width);
        if (line.font !== 'sponge') gCtx.strokeText(line.txt, line.x, line.y, gElCanvas.width);
    });
}

function markActiveLine() {
    var line = getActiveLine();
    if (!line) return;

    gCtx.font = `${line.size}px ${line.font}`;
    var width = gCtx.measureText(line.txt).width;
    changeProperty('width', width);

    gCtx.beginPath();
    gCtx.setLineDash([6, 5]);
    gCtx.strokeStyle = "#ffffff";
    var x = line.x - (line.width / 2);
    var y = line.y - line.size;
    gCtx.rect(x - 10, y, line.width + 20, line.size + 10);
    gCtx.stroke();
    gCtx.setLineDash([]);
}


///////////////// line dragging related functions ////////////////////

function onDown(ev) {
    emptyInput();
    const pos = getEvPos(ev);
    if (!lineClicked(pos)) return;
    gDragStartPos = pos;
}

function onMove(ev) {
    var activeLine = getActiveLine();
    if (gIsDragging) {
        const pos = getEvPos(ev);
        const dx = pos.x - gDragStartPos.x;
        const dy = pos.y - gDragStartPos.y;

        activeLine.x += dx
        activeLine.y += dy

        gDragStartPos = pos;
        renderCanvas();
    }
}

function onUp() {
    document.body.style.cursor = 'default';
    var activeLine = getActiveLine();
    if (!activeLine) return;
    gIsDragging = false;
}

function lineClicked(pos) {
    var idx = findClickedLineIdx(pos);
    updateActiveLine(idx);
    renderCanvas();
    if (idx !== -1) {
        updateInputs();
        gIsDragging = true;
        document.body.style.cursor = 'grabbing';
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
    var elInput = document.getElementById('text-input');
    elInput.value = '';
}

function updateInputs() {
    var activeLine = getActiveLine()
    document.querySelector('#text-fill').value = activeLine.color;
    document.querySelector('#text-stroke').value = activeLine.stroke;
    if (activeLine.txt !== 'your text here') document.querySelector('#text-input').value = activeLine.txt;
}
