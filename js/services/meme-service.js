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
var gCanvasSize = 300;

var gMeme = {
    selectedImgId: gCurrImgId,
    activeLineIdx: 0,
    lines: [createLine(40)]
}

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

///get & create

function getgMemeLines() {
    return gMeme.lines;
}

function getActiveLine() {
    return gMeme.lines[gMeme.activeLineIdx];
}

function createLine(yPos) {
    return {
        x: gCanvasSize / 2,
        y: yPos,
        txt: 'your line goes here!',
        size: 30,
        color: 'white',
        stroke: 'black',
        font: 'impact',
        align: 'center',
        isDragging: false
    };
}

///deletions & resets

function resetLines(state) {
    gMeme.lines = [];
    if (state === 'initial') gMeme.lines.push(createLine(40));
    gMeme.activeLineIdx = 0;
}

function deleteLine() {
    var idx = gMeme.activeLineIdx;
    gMeme.lines.splice(idx, 1);
    gMeme.activeLineIdx = idx - 1;
    if (gMeme.activeLineIdx < 0) gMeme.activeLineIdx = 0;
    emptyInput();
}

// updates & changes

function updateActiveLine(idx) {
    if (idx === -1) {
        gMeme.activeLineIdx = null;
        return;
    }
    gMeme.activeLineIdx = idx;
    gMeme.lines[idx].isDragging = true;
}

function changeFontSize(action) {
    var currLine = gMeme.lines[gMeme.activeLineIdx];
    var diff = 5;
    if (action === 'increase') currLine.size += diff;
    else if (action === 'decrease') {
        if (currLine.size < 20) return;
        gMeme.lines[gMeme.activeLineIdx].size -= diff;
    }
}

function ChangeLineHeight(direction) {
    var diff = direction === 'up' ? -5 : 5;
    gMeme.lines[gMeme.activeLineIdx].y += diff;
}

function updateLineWidth(width) {
    gMeme.lines[gMeme.activeLineIdx].width = width;
}

//// new line addition 

function addLine() {
    var linesNum = gMeme.lines.length;
    var yPos;
    if (linesNum < 1) yPos = 40;
    else if (linesNum === 1) yPos = 280;
    else if (linesNum > 1) yPos = 150;

    var newLine = createLine(yPos);
    gMeme.lines.push(newLine);
    gMeme.activeLineIdx = gMeme.lines.length - 1;
}
