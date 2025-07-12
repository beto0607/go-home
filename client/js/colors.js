/**
* @param {string} hex
* @returns {Color} 
*/
function hexToXYColor(hex) {
    console.log(hex)
    let color = Color.parse(hex);
    let xy = ColorSpace.sRGB.xyYFromColor(color);
    return {
        x: xy.x,
        y: xy.y
    }
}

/**
* @param {Color} color
* @returns {string} 
*/
function xyColorToHex({ x, y }, bri) {
    let maxY = ColorSpace.sRGB.findMaximumY(x, y);
    let color = ColorSpace.sRGB.colorFromXYY(x, y, maxY * bri / 255);
    return color.toHex()
}
