export default function loadFont(name: string, url: string) {
    var newFont = new FontFace(name, `url(${url})`);
    newFont.load().then(function (loaded) {
        // @ts-ignore
        document.fonts.add(loaded);
    }).catch(function (error) {
        return error;
    });
}