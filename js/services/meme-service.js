var gImgs =
    [{ id: 1, name: 'spongebob-mocking', url: 'img/memes-sqr/spongebob-mocking.jpg', keywords: ['spongebob', 'mocking'] },
    { id: 2, name: 'spongebob-panting', url: 'img/memes-sqr/spongebob-panting.jpg', keywords: ['spongebob', 'panting'] },
    { id: 3, name: 'patrick-evil', url: 'img/memes-sqr/patrick-evil.jpg', keywords: ['patrick'] },
    { id: 4, name: 'krabs-blurred', url: 'img/memes-sqr/krabs-blurred.jpg', keywords: ['krabs', 'confused'] },
    { id: 5, name: 'krabs-sado', url: 'img/memes-sqr/krabs-sado.jpg', keywords: ['krabs'] },
    { id: 6, name: 'krabs-wack', url: 'img/memes-sqr/krabs-wack.jpg', keywords: ['krabs', 'cool'] },
    { id: 7, name: 'krabs-crazy', url: 'img/memes-sqr/krabs-crazy.jpg', keywords: ['krabs', 'crazy'] },
    ];

var gMeme = {
    selectedImgId: gCurrImgId, currLineIdx: 0,
    lines: [
        {
            txt: 'I never eat Falafel',
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

function getgMemeLine() {
    return gMeme.lines[gMeme.currLineIdx];
}

function getImgById(id) {
    return gImgs.find(img => img.id === id);
}
