var gImgs = [{ id: 1, name: 'spongebob-mocking', url: 'img/memes-sqr/spongebob-mocking.jpg', keywords: ['spongebob', 'mocking'] },
{ id: 2, name: 'spongebob-panting', url: 'img/memes-sqr/spongebob-panting.jpg', keywords: ['spongebob', 'panting'] }];

var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'I never eat Falafel',
            size: 20,
            align: 'left',
            color: 'red'
        }
    ]
}

function getImgById(id) {
    return gImgs.find(img => img.id === id);
}
