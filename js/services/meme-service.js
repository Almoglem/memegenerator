var gImgs =
    [{ id: 1, url: 'img/memes-sqr/spongebob-mocking.jpg', keywords: ['spongebob', 'mocking'] },
    { id: 2, url: 'img/memes-sqr/spongebob-panting.jpg', keywords: ['spongebob', 'panting'] },
    { id: 3, url: 'img/memes-sqr/patrick-evil.jpg', keywords: ['patrick', 'evil'] },
    { id: 4, url: 'img/memes-sqr/krabs-blurred.jpg', keywords: ['krabs', 'confused'] },
    { id: 5, url: 'img/memes-sqr/krabs-sado.jpg', keywords: ['krabs'] },
    { id: 6, url: 'img/memes-sqr/krabs-wack.jpg', keywords: ['krabs', 'cool'] },
    { id: 7, url: 'img/memes-sqr/krabs-crazy.jpg', keywords: ['krabs', 'crazy'] },
    { id: 8, url: 'img/memes-sqr/squidward-watching.jpg', keywords: ['squidward', 'lonely', 'watching'] },
    { id: 9, url: 'img/memes-sqr/squidward-leaving.jpg', keywords: ['squidward', 'leaving'] },
    { id: 10, url: 'img/memes-sqr/squidward-loser.jpg', keywords: ['squidward', 'loser'] },
    { id: 11, url: 'img/memes-sqr/squidward-shy.jpg', keywords: ['squidward', 'shy'] },
    { id: 12, url: 'img/memes-sqr/patrick-planning.jpg', keywords: ['patrick', 'evil', 'planning'] },
    ];

var gCurrImgId;

var gMeme = {
    selectedImgId: gCurrImgId,
    currLineIdx: 0,
    lines: [
        {
            x: gCanvasSize / 2,
            y: 40,
            txt: 'your line goes here!',
            size: 30,
            color: 'white',
            stroke: 'black',
            font: 'impact',
            align: 'center'
        }
    ]
}

var gCanvasSize = 300;


////////////  images   ////////////

function getImgsForDisplay() {
    return gImgs;
}

function setgImg(id) {
    gCurrImgId = id;
}

function getImgById(id) {
    return gImgs.find(img => img.id === id);
}


//////////// lines related functions ////////////

function getgMemeLines() {
    return gMeme.lines;
}

function getCurrLine() {
    return gMeme.lines[gMeme.currLineIdx];
}

function resetLines() {
    gMeme.lines = [{
        x: gCanvasSize / 2,
        y: 40,
        txt: 'your line goes here!',
        size: 30,
        color: 'white',
        stroke: 'black',
        font: 'impact',
        align: 'center'
    }];
    gMeme.currLineIdx = 0;
}

function deleteAllLines() {
    gMeme.lines = [];
    gMeme.currLineIdx = 0;
}

function updateLineIdx() {
    gMeme.currLineIdx++;
    if (gMeme.currLineIdx === gMeme.lines.length) gMeme.currLineIdx = 0;
}

function removeActiveLine() {
    gMeme.currLineIdx = null;
}

function changeFontSize(action) {
    var currLine = gMeme.lines[gMeme.currLineIdx];
    var diff = 5;
    if (action === 'increase') currLine.size += diff;
    else if (action === 'decrease') {
        if (currLine.size < 20) return;
        gMeme.lines[gMeme.currLineIdx].size -= diff;
    }
}

function ChangeLineHeight(direction) {
    var diff = direction === 'up' ? -5 : 5;
    gMeme.lines[gMeme.currLineIdx].y += diff;
}


////////////////////////////////////////////////////////////

function addLine() {
    var linesNum = gMeme.lines.length;
    var y;
    if (!linesNum) y = 40;
    else if (linesNum === 1) y = 280;
    else if (linesNum > 1) y = 150;
    var newLine = {
        x: gCanvasSize / 2,
        y: y,
        txt: 'your line goes here!',
        size: 30,
        color: 'white',
        stroke: 'black',
        font: 'impact',
        align: 'center'
    }
    gMeme.lines.push(newLine);
    gMeme.currLineIdx = gMeme.lines.length - 1;
}

function deleteLine() {
    var idx = gMeme.currLineIdx;
    gMeme.lines.splice(idx, 1);
    gMeme.currLineIdx = idx - 1;
    if (gMeme.currLineIdx < 0) gMeme.currLineIdx = 0;
    emptyInput();
}
