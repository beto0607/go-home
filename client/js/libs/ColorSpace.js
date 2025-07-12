// Color spaces
//
// Author: Thomas Lochmatter, https://viereck.ch/thomas
// License: MIT
//
// See https://viereck.ch/hue-xy-rgb/ for explanations and code examples.
// A good explanation of color spaces can be found here: https://babelcolor.com/index_htm_files/A%20review%20of%20RGB%20color%20spaces.pdf

// Line 1 "/home/thomas/Desktop/Viereck/http/hue-xy-rgb/Color.inc.js"
// Line 1 "/home/thomas/Desktop/Viereck/http/hue-xy-rgb/bounded.inc.js"
function bounded(value, min, max) {
    if (value < min) return min;
    if (value > max) return max;
    return value;
}
// Line 4 "/home/thomas/Desktop/Viereck/http/hue-xy-rgb/Color.inc.js"

// A color. All components are values between 0 and 1.
function Color(r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
}

function colorComponent255(value) {
    return bounded(Math.floor(value * 255), 0, 255);
}

Color.prototype.toString = function () {
    return this.toCSS();
};

// Clones this color.
Color.prototype.clone = function () {
    return new Color(this.r, this.g, this.b, this.a);
};

// Returns a Float32Array with the premultiplied color components (RGBA) for use with WebGl.
Color.prototype.toGlColor = function () {
    return new Float32Array([this.r * this.a, this.g * this.a, this.b * this.a, this.a]);
};

// Returns a Float32Array with the premultiplied color components (RGB) for use with WebGl.
Color.prototype.toGlColor3 = function () {
    return new Float32Array([this.r * this.a, this.g * this.a, this.b * this.a]);
};

// Returns a CSS representation of the color.
Color.prototype.toCSS = function () {
    const r = colorComponent255(this.r).toFixed(0);
    const g = colorComponent255(this.g).toFixed(0);
    const b = colorComponent255(this.b).toFixed(0);
    const a = bounded(this.a, 0, 1).toFixed(3);
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
};

// Return a hex representation of the color. The opacity is ignored.
Color.prototype.toHex = function () {
    return '#' + hex(this.r) + hex(this.g) + hex(this.b);

    function hex(value) {
        const text = colorComponent255(value).toString(16);
        return text.length > 1 ? text : '0' + text;
    }
};

// Returns the color as integer in ARGB byte order.
Color.prototype.toARGBInteger = function () {
    return colorComponent255(this.a) * 0x1000000 + colorComponent255(this.r) * 0x10000 + colorComponent255(this.g) * 0x100 + colorComponent255(this.b);
};

// Returns the color as integer in RGB byte order.
Color.prototype.toRGBInteger = function () {
    return colorComponent255(this.r) * 0x10000 + colorComponent255(this.g) * 0x100 + colorComponent255(this.b);
};

// Returns an integer in ARGB byte order.
Color.prototype.toJson = function () {
    return { r: this.r, g: this.g, b: this.b, a: this.a };
};

// Return a color with all components clamped to [0, 1].
Color.prototype.clamped = function () {
    return new Color(clamped(this.r), clamped(this.g), clamped(this.b), clamped(this.a));

    function clamped(value) {
        if (value < 0) return 0;
        if (value > 1) return 1;
        return value;
    }
};

// Adds a color.
Color.prototype.plus = function (color) {
    return new Color(this.r + color.r, this.g + color.g, this.b + color.b, this.a + color.a);
};

// Subtracts a color.
Color.prototype.minus = function (color) {
    return new Color(this.r - color.r, this.g - color.g, this.b - color.b, this.a - color.a);
};

// Multiplies all color components with a factor.
Color.prototype.times = function (factor) {
    return new Color(this.r * factor, this.g * factor, this.b * factor, this.a * factor);
};

// Mixes two colors. This can also be used to darken (mix with black) or lighten (mix with white) colors.
Color.prototype.mixed = function (color, ratio) {
    const invRatio = 1 - ratio;
    return new Color(this.r * invRatio + color.r * ratio, this.g * invRatio + color.g * ratio, this.b * invRatio + color.b * ratio, this.a * invRatio + color.a * ratio);
};

// Returns a transparent color.
Color.prototype.transparent = function () {
    return new Color(this.r, this.g, this.b, 0);
};

// Returns an opaque color.
Color.prototype.opaque = function (opacity = 1) {
    return new Color(this.r, this.g, this.b, opacity);
};

// Calculates the distance between two colors.
Color.prototype.distanceToColor = function (color) {
    return Math.sqrt(this.distanceToColorSquared(color));
};

// Calculates the squared distance between two colors.
Color.prototype.distanceToColorSquared = function (color) {
    const dr = this.r - color.r;
    const dg = this.g - color.g;
    const db = this.b - color.b;
    const da = this.a - color.a;
    return dr * dr + dg * dg + db * db + da * da;
};

// Returns true if the two colors are equal.
Color.prototype.equals = function (color) {
    return this.distanceToColor(color) < 0.001;
};

// Create a color from a JSON object.
Color.fromJson = function (json) {
    if (!json) return null;
    return new Color(forceNumber(json.r, 0), forceNumber(json.g, 0), forceNumber(json.b, 0), forceNumber(json.a, 0));
};

// Creates a color. All parameters must be values between 0 and 1.
Color.rgba1 = function (r, g, b, a) {
    return new Color(r, g, b, a);
};

// Creates a color. All parameters must be values between 0 and 255.
Color.rgba255 = function (r, g, b, a) {
    return new Color(r / 255, g / 255, b / 255, a / 255);
};

// Creates a color. The parameters r, g, and b must be values between 0 and 255, and a must be a value between 0 (transparent) and 1 (opaque). This corresponds to the CSS notation.
Color.rgba = function (r, g, b, a) {
    return new Color(r / 255, g / 255, b / 255, a);
};

// Creates a color. The parameters r, g, and b must be values between 0 and 255. The opacity is set to 1.
Color.rgb = function (r, g, b) {
    return new Color(r / 255, g / 255, b / 255, 1);
};

Color.hsl = function (hue, saturation, lightness) {
    const c = (1 - Math.abs(2 * lightness - 1)) * saturation;
    const h = hue * 6;
    const x = c * (1 - Math.abs(h % 2 - 1));
    const m = lightness - c / 2;
    if (h < 1) return new Color(m + c, m + x, m + 0, 1);
    if (h < 2) return new Color(m + x, m + c, m + 0, 1);
    if (h < 3) return new Color(m + 0, m + c, m + x, 1);
    if (h < 4) return new Color(m + 0, m + x, m + c, 1);
    if (h < 5) return new Color(m + x, m + 0, m + c, 1);
    return new Color(m + c, m + 0, m + x, 1);
};

// Converts a 4-byte ARGB integer to a color.
Color.fromARGBInteger = function (value) {
    const a = (value >> 24) & 0xff;
    const r = (value >> 16) & 0xff;
    const g = (value >> 8) & 0xff;
    const b = value & 0xff;
    return new Color(r / 255, g / 255, b / 255, a / 255);
};

// Converts a 3-byte RGB integer to a color.
Color.fromRGBInteger = function (value) {
    const r = (value >> 16) & 0xff;
    const g = (value >> 8) & 0xff;
    const b = value & 0xff;
    return new Color(r / 255, g / 255, b / 255, 1);
};

Color.parse = function (text) {
    const html6Match = text.match(/#([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])/);
    if (html6Match) {
        const r = parseInt('0x' + html6Match[1]) / 255;
        const g = parseInt('0x' + html6Match[2]) / 255;
        const b = parseInt('0x' + html6Match[3]) / 255;
        return new Color(r, g, b, 1);
    }

    const html3Match = text.match(/#([0-9a-f])([0-9a-f])([0-9a-f])/);
    if (html3Match) {
        const r = parseInt('0x' + html3Match[1] + html3Match[1]) / 255;
        const g = parseInt('0x' + html3Match[2] + html3Match[2]) / 255;
        const b = parseInt('0x' + html3Match[3] + html3Match[3]) / 255;
        return new Color(r, g, b, 1);
    }

    const rgbMatch = text.match(/rgb\((\d+)[\s,](\d+)[\s,](\d+)\)/);
    if (rgbMatch) {
        const r = parseInt(rgbMatch[1]) / 255;
        const g = parseInt(rgbMatch[2]) / 255;
        const b = parseInt(rgbMatch[3]) / 255;
        return new Color(r, g, b, 1);
    }

    const rgbaMatch = text.match(/rgba\((\d+)[\s,](\d+)[\s,](\d+)[\s,]([\d\.]+)\)/);
    if (rgbaMatch) {
        const r = parseInt(rgbMatch[1]) / 255;
        const g = parseInt(rgbMatch[2]) / 255;
        const b = parseInt(rgbMatch[3]) / 255;
        const a = parseFloat(rgbMatch[4]);
        return new Color(r, g, b, a);
    }

    return null;
};

Color.black = new Color(0, 0, 0, 1);
Color.white = new Color(1, 1, 1, 1);
Color.transparentBlack = new Color(0, 0, 0, 0);
Color.transparentWhite = new Color(1, 1, 1, 0);
// Line 14 "/home/thomas/Desktop/Viereck/http/hue-xy-rgb/ColorSpace.build.js"
// Line 1 "/home/thomas/Desktop/Viereck/http/hue-xy-rgb/Gamut.inc.js"
// Gamut
function Gamut(rx, ry, gx, gy, bx, by) {
    const red = this.red = xy(rx, ry);
    const green = this.green = xy(gx, gy);
    const blue = this.blue = xy(bx, by);

    function xy(x, y) {
        return { x, y };
    }

    function subXY(a, b) {
        return xy(a.x - b.x, a.y - b.y);
    }

    // Returns if an xy point is inside the gamut.
    this.isInside = function (xyPoint) {
        let v0 = subXY(blue, red);
        let v1 = subXY(green, red);
        let v2 = subXY(xyPoint, red);

        let dot00 = v0.x * v0.x + v0.y * v0.y;
        let dot01 = v0.x * v1.x + v0.y * v1.y;
        let dot02 = v0.x * v2.x + v0.y * v2.y;
        let dot11 = v1.x * v1.x + v1.y * v1.y;
        let dot12 = v1.x * v2.x + v1.y * v2.y;

        let invDenom = 1 / (dot00 * dot11 - dot01 * dot01);

        let u = (dot11 * dot02 - dot01 * dot12) * invDenom;
        let v = (dot00 * dot12 - dot01 * dot02) * invDenom;
        return u >= 0 && v >= 0 && u + v < 1;
    };

    // Returns the closest xy point inside the gamut.
    this.closest = function (xyPoint) {
        function lineDistance(pointA, pointB) {
            return Math.hypot(pointB.x - pointA.x, pointB.y - pointA.y);
        }

        function closestPoint(xyPoint, pointA, pointB) {
            let xy2a = subXY(xyPoint, pointA);
            let a2b = subXY(pointB, pointA);
            let a2bSqr = Math.pow(a2b.x, 2) + Math.pow(a2b.y, 2);
            let xy2a_dot_a2b = xy2a.x * a2b.x + xy2a.y * a2b.y;
            let t = xy2a_dot_a2b / a2bSqr;
            return xy(pointA.x + a2b.x * t, pointA.y + a2b.y * t);
        }

        let greenBluePoint = closestPoint(xyPoint, green, blue);
        let greenRedPoint = closestPoint(xyPoint, green, red);
        let blueRedPoint = closestPoint(xyPoint, blue, red);

        let greenBlueDistance = lineDistance(xyPoint, greenBluePoint);
        let greenRedDistance = lineDistance(xyPoint, greenRedPoint);
        let blueRedDistance = lineDistance(xyPoint, blueRedPoint);

        if (greenBlueDistance < greenRedDistance && greenBlueDistance < blueRedDistance) return greenBluePoint;
        if (greenRedDistance < blueRedDistance) return greenRedPoint;
        return blueRedPoint;
    };
}

Gamut.none = new Gamut(1, 0, 0, 1, 0, 0);
// Line 14 "/home/thomas/Desktop/Viereck/http/hue-xy-rgb/ColorSpace.build.js"
// Line 1 "/home/thomas/Desktop/Viereck/http/hue-xy-rgb/ColorSpace.inc.js"
// Line 1 "/home/thomas/Desktop/Viereck/http/hue-xy-rgb/Matrix3.inc.js"
// Creates a new vector with 3 components (x, y, z).
function vector3(x, y, z) {
    return new Vector3(x, y, z);
}

function Vector3(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

// Creates a vector from a JSON object {x, y, z}.
Vector3.fromJson = function (json) {
    if (!json) return null;
    if (typeof (json) != 'object') return null;
    if (typeof (json.x) != 'number') return null;
    if (typeof (json.y) != 'number') return null;
    if (typeof (json.z) != 'number') return null;
    return new Vector3(json.x, json.y, json.z);
};

// Creates a vector from an array with 3 numbers [x, y, z].
Vector3.fromArray = function (array) {
    if (!Array.isArray(array)) return null;
    return new Vector3(array[0], array[1], array[2]);
};

Vector3.prototype.toString = function () {
    return 'vector3(' + this.x.toPrecision(6) + ', ' + this.y.toPrecision(6) + ', ' + this.z.toPrecision(6) + ')';
};

// Returns the length of the vector.
Vector3.prototype.length = function () {
    return distance3(this.x, this.y, this.z);
};

// Returns the squared length of the vector.
Vector3.prototype.lengthSquared = function () {
    return distanceSquared3(this.x, this.y, this.z);
};

// Creates a unit vector pointing in the same direction.
Vector3.prototype.unit = function () {
    const d = this.length();
    return new Vector3(this.x / d, this.y / d, this.z / d);
};

// Adds two vectors.
Vector3.prototype.plus = function (v) {
    return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
};

// Subtracts two vectors.
Vector3.prototype.minus = function (v) {
    return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
};

// Multiplies a vector by a scalar value.
Vector3.prototype.timesScalar = function (value) {
    return new Vector3(this.x * value, this.y * value, this.z * value);
};

// Multiplies a vector by -1.
Vector3.prototype.reversed = function (value) {
    return new Vector3(-this.x, -this.y, -this.z);
};

// Calculates the dot product of two vectors.
Vector3.prototype.dot = function (v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
};

// Calculates the cross product of two vectors.
Vector3.prototype.cross = function (v) {
    return new Vector3(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x);
};

// Returns if the two vectors are equal.
Vector3.prototype.equals = function (v) {
    return this.x == v.x && this.y == v.y && this.z == v.z;
};

// Returns a JSON object with {x, y, z}.
Vector3.prototype.toJson = function () {
    return { x: this.x, y: this.y, z: this.z };
};

// Returns an array with [x, y, z].
Vector3.prototype.toArray = function () {
    return [this.x, this.y, this.z];
};

// Returns an Float32Array with [x, y, z] suitable for use in WebGl.
Vector3.prototype.toGlArray = function () {
    return new Float32Array([this.x, this.y, this.z]);
};

// Returns an array with [x, y, z, 1], which is used for affine transformations using a 4x4 matrix.
Vector3.prototype.toArray4 = function () {
    return [this.x, this.y, this.z];
};

function distance3(dx, dy, dz) {
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function distanceSquared3(dx, dy, dz) {
    return dx * dx + dy * dy + dz * dz;
}

function Matrix3(elements) {
    this.elements = elements;
}

Matrix3.fromJson = function (json, defaultValue) {
    if (!Array.isArray(json)) return defaultValue;
    if (json.length != 9) return defaultValue;
    for (const element of json)
        if (!isNumber(element) || isNaN(element))
            return defaultValue;

    return new Matrix3(json);
};

Matrix3.createIdentity = function () {
    return new Matrix3([1, 0, 0, 0, 1, 0, 0, 0, 1]);
}

Matrix3.createWithColumnVectors = function (c1, c2, c3) {
    return new Matrix3([
        c1.x, c2.x, c3.x,
        c1.y, c2.y, c3.y,
        c1.z, c2.z, c3.z
    ]);
};

Matrix3.createWithColumnVectors2 = function (c1, c2) {
    return new Matrix3([
        c1.x, c2.x, 0,
        c1.y, c2.y, 0,
        0, 0, 1
    ]);
};

Matrix3.createTranslation = function (vector) {
    return new Matrix3([
        1, 0, vector.x,
        0, 1, vector.y,
        0, 0, 1
    ]);
};

Matrix3.createScaling = function (vector) {
    return new Matrix3([
        vector.x, 0, 0,
        0, vector.y, 0,
        0, 0, 1
    ]);
};

Matrix3.createRotation = function (angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return new Matrix3([
        c, -s, 0,
        s, c, 0,
        0, 0, 1
    ]);
};

Matrix3.prototype.e = function (x, y) {
    return this.elements[y * 3 + x];
};

Matrix3.prototype.row = function (y) {
    return this.elements.slice(y * 3, y * 3 + 3);
};

Matrix3.prototype.rowVector = function (y) {
    return new Vector3(this.elements[y * 3 + 0], this.elements[y * 3 + 1], this.elements[y * 3 + 2]);
};

Matrix3.prototype.column = function (x) {
    return [this.elements[x], this.elements[3 + x], this.elements[6 + x]];
};

Matrix3.prototype.columnVector = function (x) {
    return new Vector3(this.elements[x], this.elements[3 + x], this.elements[6 + x]);
};

Matrix3.prototype.diagonal = function () {
    return [this.elements[0], this.elements[4], this.elements[8]];
};

Matrix3.prototype.equals = function (that, precision) {
    if (!precision) precision = 0;
    for (let i = 0; i < 9; i++)
        if (Math.abs(this.elements[i] - that.elements[i]) > precision)
            return false;
    return true;
};

Matrix3.prototype.clone = function () {
    return new Matrix3(this.elements.slice());
};

Matrix3.prototype.times = function (matrix) {
    const result = new Array(9);
    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
            const i = y * 3 + x;
            result[i] = 0;
            for (let n = 0; n < 3; n++)
                result[i] += this.elements[y * 3 + n] * matrix.elements[(n * 3) + x];
        }
    }
    return new Matrix3(result);
};

Matrix3.prototype.timesArray = function (array) {
    const result = new Array(3);
    for (let i = 0; i < 3; i++) {
        result[i] = 0;
        for (let n = 0; n < 3; n++)
            result[i] += this.elements[i * 3 + n] * array[n];
    }
    return result;
};

Matrix3.prototype.timesVector = function (vector) {
    const elements = this.elements;
    return new Vector3(component(0), component(1), component(2));

    function component(i) {
        return 0 +
            elements[i * 3 + 0] * vector.x +
            elements[i * 3 + 1] * vector.y +
            elements[i * 3 + 2] * vector.z;
    }
};

Matrix3.prototype.arrayTimes = function (array) {
    const result = new Array(3);
    for (let i = 0; i < 3; i++) {
        result[i] = 0;
        for (let n = 0; n < 3; n++)
            result[i] += array[n] * this.elements[(n * 3) + i];
    }
    return result;
};

Matrix3.prototype.vectorTimes = function (vector) {
    const elements = this.elements;
    return new Vector3(component(0), component(1), component(2));

    function component(i) {
        return 0 +
            vector.x * elements[(0 * 3) + i] +
            vector.y * elements[(1 * 3) + i] +
            vector.z * elements[(2 * 3) + i];
    }
};

Matrix3.prototype.transposed = function () {
    const result = new Array(9);
    for (let y = 0; y < 3; y++)
        for (let x = 0; x < 3; x++)
            result[y * 3 + x] = this.elements[x * 3 + y];
    return new Matrix3(result);
};

Matrix3.prototype.inversed = function () {
    // Set inverse to the identity matrix
    const current = this.clone();
    const inverse = Matrix3.createIdentity();

    // Gaussian elimination (part 1)
    for (let i = 0; i < 3; i++) {
        // Get the diagonal term
        let d = current.elements[i * 3 + i];

        // If it is 0, there must be at least one row with a non-zero element (otherwise, the matrix is not invertible)
        if (d == 0) {
            let r = i + 1;
            while (r < 3 && Math.abs(current.elements[r * 3 + i]) < 1e-10) r++;
            if (r == 3) return null;  // i is the rank
            for (let c = 0; c < 3; c++) {
                current.elements[i * 3 + c] += current.elements[r * 3 + c];
                inverse.elements[i * 3 + c] += inverse.elements[r * 3 + c];
            }
            d = current.elements[i * 3 + i];
        }

        // Divide the row by the diagonal term
        const inv = 1 / d;
        for (let c = 0; c < 3; c++) {
            current.elements[i * 3 + c] *= inv;
            inverse.elements[i * 3 + c] *= inv;
        }

        // Divide all subsequent rows with a non-zero coefficient, and subtract the row
        for (let r = i + 1; r < 3; r++) {
            const p = current.elements[r * 3 + i];
            if (p != 0) {
                for (let c = 0; c < 3; c++) {
                    current.elements[r * 3 + c] -= current.elements[i * 3 + c] * p;
                    inverse.elements[r * 3 + c] -= inverse.elements[i * 3 + c] * p;
                }
            }
        }
    }

    // Gaussian elimination (part 2)
    for (let i = 3 - 1; i >= 0; i--) {
        for (let r = 0; r < i; r++) {
            const d = current.elements[r * 3 + i];
            for (let c = 0; c < 3; c++) {
                current.elements[r * 3 + c] -= current.elements[i * 3 + c] * d;
                inverse.elements[r * 3 + c] -= inverse.elements[i * 3 + c] * d;
            }
        }
    }

    return inverse;
};

Matrix3.prototype.toString = function () {
    let i = 0;
    let text = '';
    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
            text += digits4(this.elements[i]) + ' ';
            i++;
        }
        if (y < 2) text += '\n';
    }

    return text;

    function digits4(value) {
        const neg = value < 0;
        let text = '' + Math.round((neg ? -value : value) * 10000);
        while (text.length < 5) text = '0' + text;
        text = (neg ? '-' : '') + text.substr(0, text.length - 4) + '.' + text.substr(text.length - 4);
        while (text.length < 8) text = ' ' + text;
        return text;
    }
};

Matrix3.prototype.determinant = function () {
    const elements = this.elements;
    return elements[0] * det2(1, 2)
        - elements[1] * det2(0, 2)
        + elements[2] * det2(0, 1);

    function det2(x0, x1) {
        return elements[3 + x0] * elements[6 + x1]
            - elements[3 + x1] * elements[6 + x0];
    }
};

Matrix3.prototype.rotated = function (angle) {
    return Matrix3.createRotation(angle).times(this);
};

Matrix3.prototype.translated = function (vector) {
    return Matrix3.createTranslation(vector).times(this);
};

Matrix3.prototype.scaled = function (vector) {
    return Matrix3.createScaling(vector).times(this);
};

Matrix3.prototype.toJson = function () {
    return this.elements.slice();
};

const Identity3 = Matrix3.createIdentity();
// Line 4 "/home/thomas/Desktop/Viereck/http/hue-xy-rgb/ColorSpace.inc.js"

// No gamma correction.
function NoGammaCorrection() {
    this.transform = function (value) { return value; };
    this.invTransform = function (value) { return value; };
    this.toString = function () { return 'no gamma correction'; };
};

// Gamma correction.
function GammaCorrection(gamma, transition, slope, offset) {
    this.transform = function (value) {
        return value <= transition ? slope * value : (1 + offset) * Math.pow(value, gamma) - offset;
    };

    let gammaInv = 1 / gamma;
    let transitionInv = this.transform(transition);
    let slopeInv = 1 / slope;

    this.invTransform = function (value) {
        return value <= transitionInv ? value * slopeInv : Math.pow((value + offset) / (1 + offset), gammaInv);
    };

    this.toString = function () {
        return 'gamma ' + gamma;
    };
}

// A color space. The matrix is a Matrix3 to transform (gamma-corrected) RGB values to XYZ coordinates.
function ColorSpace(matrix, gammaCorrection) {
    let matrixInv = matrix.inversed();

    // Transforms a color to XYZ coordinates. The alpha component is ignored.
    this.xyzFromColor = function (color) {
        let rgb = [
            gammaCorrection.invTransform(color.r),
            gammaCorrection.invTransform(color.g),
            gammaCorrection.invTransform(color.b)
        ];

        let xyz = matrix.timesArray(rgb);
        return {
            x: xyz[0],
            y: xyz[1],
            z: xyz[2]
        };
    };

    // Transforms a color to xyY coordinates.
    this.xyYFromColor = function (color) {
        if (color.r < 1e-12 && color.g < 1e-12 && color.b < 1e-12) {
            let xyz = this.xyzFromColor(Color.white);
            let sum = xyz.x + xyz.y + xyz.z;
            return {
                x: xyz.x / sum,
                y: xyz.y / sum,
                Y: 0
            };
        }

        let xyz = this.xyzFromColor(color);
        let sum = xyz.x + xyz.y + xyz.z;
        return {
            x: xyz.x / sum,
            y: xyz.y / sum,
            Y: xyz.y
        };
    };

    // Transforms XYZ coordinates to a color.
    this.colorFromXYZ = function (x, y, z) {
        let rgb = matrixInv.timesArray([x, y, z]);
        return new Color(
            gammaCorrection.transform(rgb[0]),
            gammaCorrection.transform(rgb[1]),
            gammaCorrection.transform(rgb[2]),
            1
        );
    };

    // Transforms xyY coordinates to a color.
    this.colorFromXYY = function (x, y, Y) {
        let z = 1.0 - x - y;
        return this.colorFromXYZ((Y / y) * x, Y, (Y / y) * z);
    };

    this.findMaximumY = function (x, y, iterations = 10) {
        let bri = 1;
        for (let i = 0; i < iterations; i++) {
            const color = this.colorFromXYY(x, y, bri);
            const max = Math.max(color.r, color.g, color.b);
            bri = bri / max;
        }

        return bri;
    };

    this.toString = function () {
        return 'ColorSpace([\n' + matrix.toString() + '], ' + gammaCorrection.toString() + ')';
    };
}

ColorSpace.sRGB = new ColorSpace(new Matrix3([
    0.412453, 0.35758, 0.180423,
    0.212671, 0.71516, 0.072169,
    0.019334, 0.119193, 0.950227
]), new GammaCorrection(0.42, 0.0031308, 12.92, 0.055));

ColorSpace.wide = new ColorSpace(new Matrix3([
    0.7164, 0.1010, 0.1468,
    0.2587, 0.7247, 0.0166,
    0.0000, 0.0512, 0.7740
]), new NoGammaCorrection());

ColorSpace.adobeRGB = new ColorSpace(new Matrix3([
    0.5767, 0.1856, 0.1882,
    0.2974, 0.6273, 0.0753,
    0.0270, 0.0707, 0.9911
]), new NoGammaCorrection());
// Line 14 "/home/thomas/Desktop/Viereck/http/hue-xy-rgb/ColorSpace.build.js"

