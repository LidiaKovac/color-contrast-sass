function parseColorString(colorStr) {
    if (!colorStr) throw new Error("Empty color string");

    // If rgb(...) string
    const rgbMatch = colorStr.match(/rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)/i);
    if (rgbMatch) {
        return [Number(rgbMatch[1]), Number(rgbMatch[2]), Number(rgbMatch[3])];
    }

    // If hex string
    const hexMatch = colorStr.match(/^#([0-9a-f]{6})$/i);
    if (hexMatch) {
        const hex = hexMatch[1];
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return [r, g, b];
    }

    // Named colors basic list (expand as needed)
    const namedColors = {
        red: [255, 0, 0],
        lime: [0, 255, 0],
        blue: [0, 0, 255],
        yellow: [255, 255, 0],
        aqua: [0, 255, 255],
        // add more if you want
    };
    if (namedColors[colorStr.toLowerCase()]) {
        return namedColors[colorStr.toLowerCase()];
    }

    throw new Error(`Unknown color format: ${colorStr}`);
}

module.exports = {parseColorString}