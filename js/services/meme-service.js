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

var gMeme = {
    selectedImgId: gCurrImgId,
    currLineIdx: 0,
    lines: [
        {
            y: 40,
            txt: '',
            size: 30,
            color: 'white',
            stroke: 'black',
            font: 'impact',
            align: 'center'
        },
        {
            y: 280,
            txt: '',
            size: 30,
            color: 'white',
            stroke: 'black',
            font: 'impact',
            align: 'center'
        }
    ]
}

var gCurrImgId = null;

function getImgsForDisplay() {
    return gImgs;
}

function setgImg(id) {
    gCurrImgId = id;
}

function getgMemeLines() {
    return gMeme.lines;
}

function getCurrLine() {
    return gMeme.lines[gMeme.currLineIdx];
}

function updateLineIdx(isReset = false) {
    if (isReset) gMeme.currLineIdx = 0;
    else gMeme.currLineIdx = (gMeme.currLineIdx === 1) ? 0 : 1;
    /// for now, until further line addition is supperted
}

function getImgById(id) {
    return gImgs.find(img => img.id === id);
}
