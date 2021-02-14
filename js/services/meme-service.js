var gImgs =
    [{ id: 1, url: 'img/memes-sqr/spongebob-mocking.jpg', keywords: ['spongebob', 'mocking'] },
    { id: 2, url: 'img/memes-sqr/spongebob-panting.jpg', keywords: ['spongebob', 'panting'] },
    { id: 3, url: 'img/memes-sqr/patrick-evil.jpg', keywords: ['patrick', 'evil'] },
    { id: 4, url: 'img/memes-sqr/krabs-blurred.jpg', keywords: ['krabs', 'confused'] },
    { id: 5, url: 'img/memes-sqr/krabs-sado.jpg', keywords: ['krabs'] },
    { id: 6, url: 'img/memes-sqr/krabs-wack.jpg', keywords: ['krabs', 'cool'] },
    { id: 7, url: 'img/memes-sqr/krabs-crazy.jpg', keywords: ['krabs', 'crazy'] },
    { id: 8, url: 'img/memes-sqr/squidward-watching.jpg', keywords: ['squidward', 'lonely', 'watching', 'patrick', 'spongebob'] },
    { id: 9, url: 'img/memes-sqr/squidward-leaving.jpg', keywords: ['squidward', 'leaving'] },
    { id: 10, url: 'img/memes-sqr/squidward-loser.jpg', keywords: ['squidward', 'loser'] },
    { id: 11, url: 'img/memes-sqr/squidward-shy.jpg', keywords: ['squidward', 'shy'] },
    { id: 12, url: 'img/memes-sqr/patrick-planning.jpg', keywords: ['patrick', 'evil', 'planning'] },
    { id: 13, url: 'img/memes-sqr/patrick-stupid.jpg', keywords: ['patrick', 'stupid'] },
    { id: 14, url: 'img/memes-sqr/spongebob-worshiping.jpg', keywords: ['spongebob', 'worshiping'] },
    { id: 15, url: 'img/memes-sqr/patrick-naked.png', keywords: ['patrick', 'naked'] },
    { id: 16, url: 'img/memes-sqr/spongebob-coffin.jpg', keywords: ['spongebob', 'patrick', 'coffin'] },
    { id: 17, url: 'img/memes-sqr/spongebob-treasure.jpg', keywords: ['spongebob', 'treasure'] },
    { id: 18, url: 'img/memes-sqr/patrick-yelling.jpeg', keywords: ['patrick', 'yelling'] },
    { id: 19, url: 'img/memes-sqr/spongebob-laughing.jpg', keywords: ['spongebob', 'laughing'] },
    { id: 20, url: 'img/memes-sqr/patrick-trumpet.jpg', keywords: ['patrick', 'trumpet'] },
    ];

var gCanvasSize = 300;
var gFilter = 'all';

var gMeme = {
    selectedImgId: null,
    activeLineIdx: 0,
    lines: [_createLine(40)]
}


////////////  images   ////////////

function getImgsForDisplay() {
    if (gFilter === 'all') return gImgs;
    var imgs = gImgs.filter(img => {
        return img.keywords.some(keyword => keyword === gFilter);
    });
    return imgs;
}

function setFilter(filter) {
    gFilter = filter;
}

function setImg(id) {
    gMeme.selectedImgId = id;
}

function getImgById(id) {
    return gImgs.find(img => img.id === id);
}

function getCurrImg() {
    return gImgs[gMeme.selectedImgId];
}


//////////// lines related functions ////////////

///get & find

function getMemeLines() {
    return gMeme.lines;
}

function getActiveLine() {
    return gMeme.lines[gMeme.activeLineIdx];
}

function findClickedLineIdx(pos) {
    var idx = gMeme.lines.findIndex(line => {
        return pos.x > line.x - (line.width / 2) - 10
            && pos.x < line.x + (line.width / 2) + 10
            && pos.y > line.y - line.size
            && pos.y < gElCanvas.height - (gElCanvas.height - line.y - 10)
    });
    return idx;
}

function _createLine(yPos) {
    return {
        x: gCanvasSize / 2,
        y: yPos,
        txt: 'your text here',
        size: 30,
        color: '#ffffff',
        stroke: '#000000',
        font: 'impact',
        align: 'center',
        gIsDragging: false
    };
}

///deletions & resets

function resetLines(isInitial) {
    gMeme.lines = [];
    if (isInitial) gMeme.lines.push(_createLine(40));
    gMeme.activeLineIdx = 0;
}

function deleteLine() {
    var idx = gMeme.activeLineIdx;
    gMeme.lines.splice(idx, 1);
    gMeme.activeLineIdx = idx - 1;
    if (gMeme.activeLineIdx < 0) gMeme.activeLineIdx = 0;
}

// updates & changes

function updateActiveLine(idx) {
    gMeme.activeLineIdx = idx;
}

function changeProperty(property, value) {
    gMeme.lines[gMeme.activeLineIdx][property] = value;
}

function changeFontSize(prefix) {
    var diff = prefix * 5;
    gMeme.lines[gMeme.activeLineIdx].size += diff;
}



//// new line addition 

function addLine() {
    var linesNum = gMeme.lines.length;
    var yPos;
    if (linesNum < 1) yPos = 40;
    else if (linesNum === 1) yPos = 280;
    else if (linesNum > 1) yPos = 150;

    var newLine = _createLine(yPos);
    gMeme.lines.push(newLine);
    gMeme.activeLineIdx = gMeme.lines.length - 1;
}
