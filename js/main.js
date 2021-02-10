var gElCanvas;
var gCtx;
var gCurrImgId = 3;

function init() {
    gElCanvas = document.getElementById('meme-canvas');
    gCtx = gElCanvas.getContext('2d');
    drawImg(gCurrImgId);
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

function onAddText() {
    var elInput = document.getElementById('input-text');
    var text = elInput.value;
    drawText(text);
    elInput.value = '';
}

function drawImg(id) {
    const img = new Image();
    var currImg = getImgById(id);
    img.src = `./${currImg.url}`;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
    }
}

function drawText(text, x = gElCanvas.width / 2, y = 30) {
    gCtx.lineWidth = 2
    gCtx.strokeStyle = 'black'
    gCtx.fillStyle = 'white'
    gCtx.font = '30px impact'
    gCtx.textAlign = 'center'
    gCtx.fillText(text, x, y)
    gCtx.strokeText(text, x, y)
}

function onClearCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height);
    drawImg(gCurrImgId);

}