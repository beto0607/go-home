var baseUrl = ""
const DEBOUNCE_TIME = 300
let lastUpdateTimeStamp = Date.now()

/**
* @param {boolean} newValue
*/
async function patchPower(newValue) {
    if (!canRequest()) {
        return
    }
    await fetch(
        baseUrl + '/power',
        {
            method: 'PATCH',
            body: JSON.stringify({ power: newValue })
        })
}

/**
* @param {number} newValue
*/
async function patchBrightness(newValue) {
    if (!canRequest()) {
        return
    }
    await fetch(
        baseUrl + '/brightness',
        {
            method: 'PATCH',
            body: JSON.stringify({ brightness: newValue })
        })
}

/**
* @param {number} newValue
*/
async function patchTemperature(newValue) {
    if (!canRequest()) {
        return
    }
    await fetch(
        baseUrl + '/temperature',
        {
            method: 'PATCH',
            body: JSON.stringify({ temperature: newValue })
        })
}

/**
* @param {Color} newValue
*/
async function patchColor(newValue) {
    if (!canRequest()) {
        return
    }
    await fetch(
        baseUrl + '/color',
        {
            method: 'PATCH',
            body: JSON.stringify({ x: newValue.x, y: newValue.y })
        })
}


// --- Utils ---
/**
* @returns {boolean}
*/
function canRequest() {
    if (Date.now() - lastUpdateTimeStamp < DEBOUNCE_TIME) {
        return false;
    }
    lastUpdateTimeStamp = Date.now()
    return true;
}
