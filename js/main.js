var gElCanvas;
var gCtx;

function init() {
    gElCanvas = document.getElementById('meme-canvas');
    gCtx = gElCanvas.getContext('2d');
    drawImg(3)
}


function drawImg(id) {
    const img = new Image();
    var currImg = getImgById(id);
    img.src = `./${currImg.url}`;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
    }
}

function drawText(meme, x = gElCanvas.width / 2, y = 25) {
    gCtx.lineWidth = 2
    gCtx.strokeStyle = 'black'
    gCtx.fillStyle = 'white'
    gCtx.font = '30px impact'
    gCtx.textAlign = 'center'
    gCtx.fillText(meme.lines[0].txt, x, y)
    gCtx.strokeText(meme.lines[0].txt, x, y)
}
