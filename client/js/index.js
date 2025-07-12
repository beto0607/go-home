/**
 * @typedef {Object} Color 
 * @property {number} x
 * @property {number} y
 */
/**
 * @typedef {Object} State 
 * @property {string} name 
 * @property {boolean} powered
 * @property {number} brightness
 * @property {number} temperature 
 * @property {Color} color
 */

// ----
function bodyLoaded() {
    console.log("hello there")
    loadState()
}

var baseUrl = ""
/**
 * @type {State}
 */
let state = undefined

function loadState() {
    fetch(baseUrl + '/state')
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            state = data;
            updateStateView(data);
        })
}

/**
* @param {State} data
*/
function updateStateView(data) {
    hideLoader()
    updatePowerView(data.powered);
    updateBrightnessView(data.brightness);
    updateTemperatureView(data.temperature);
    updateColorView(data.color, data.brightness);
    updateNameView(data.name);
}

function hideLoader() {
    const loaderSpinner = document.querySelector('.loader')
    if (loaderSpinner instanceof HTMLElement) {
        loaderSpinner.style.setProperty('visibility', 'hidden')
    }
    const wrappers = document.querySelectorAll('section > div')
    for (const wrapper of wrappers) {
        wrapper.style.setProperty('visibility', 'visible')
    }
}

/**
* @param {boolean} powered
*/
function updatePowerView(powered) {
    // @type {HTMLCheckboxElement}
    const checkbox = document.getElementById('lamp-power')
    if (checkbox) {
        checkbox.checked = powered
    }
}
/**
* @param {number} brightness 
*/
function updateBrightnessView(brightness) {
    const brightnessInput = document.getElementById('brightness');
    if (brightnessInput) {
        brightnessInput.value = brightness;
    }
}
/**
* @param {number} temperature 
*/
function updateTemperatureView(temperature) {
    const temperatureInput = document.getElementById('temperature');
    if (temperatureInput) {
        temperatureInput.value = temperature;
    }
}
/**
* @param {Color} color 
* @param {number} brightness 
*/
function updateColorView(color, brightness) {
    const colorInput = document.getElementById('color')
    if (colorInput) {
        colorInput.value = xyColorToHex(color, brightness)
    }
}
/**
* @param {string} name 
*/
function updateNameView(name) {
    const nameSpan = document.getElementById('name-span')
    if (nameSpan) {
        nameSpan.textContent = name
    }
}


