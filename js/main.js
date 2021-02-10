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
    elInput.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            document.getElementById("add-text-btn").click();
        }
    });
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
    drawImg();
    toggleEditor();
}

function toggleEditor() {
    var elEditor = document.querySelector('.editor');
    var elGallery = document.querySelector('.gallery')
    elEditor.classList.toggle('hidden');
    elGallery.classList.toggle('hidden');
}

function onAddText() {
    var elInput = document.getElementById('input-text');
    var text = elInput.value;
    var memeLine = getgMemeLine();
    memeLine.txt = text;
    drawText(text);
    elInput.value = '';
}


function drawImg() {
    const img = new Image();
    var currImg = getImgById(gCurrImgId);
    img.src = `./${currImg.url}`;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
    }
}

function drawText(text, x = gElCanvas.width / 2, y = 30) {
    var memeLine = getgMemeLine();
    gCtx.lineWidth = 2
    gCtx.strokeStyle = memeLine.stroke;
    gCtx.fillStyle = memeLine.color;
    gCtx.font = `${memeLine.size}px ${memeLine.font}`;
    gCtx.textAlign = memeLine.align;
    gCtx.fillText(text, x, y, gElCanvas.width);
    gCtx.strokeText(text, x, y, gElCanvas.width);
}

function clearAddOns() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height);
    drawImg(gCurrImgId);
}

function downloadCanvas(elLink) {
    const data = gElCanvas.toDataURL()
    elLink.href = data;
    elLink.download = 'myMeme'
}