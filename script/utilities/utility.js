function rgbToHex(rgb, g, b) {
    if (rgb.toString().indexOf("#") > -1)
        return rgb;
    if (g == undefined || b == undefined) {
        if (typeof rgb == "string") {
            var result = /^rgb[a]?\(([\d]+)[ \n]*,[ \n]*([\d]+)[ \n]*,[ \n]*([\d]+)[ \n]*,?[ \n]*([.\d]+)?[ \n]*\)$/i.exec(rgb);
            return rgbToHex(parseInt(result[1]), parseInt(result[2]), parseInt(result[3]));
        }
        if (rgb.r == undefined || rgb.g == undefined || rgb.b == undefined) {
            return null;
        }
        return rgbToHex(rgb.r, rgb.g, rgb.b);
    }
    var r = rgb;
    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
