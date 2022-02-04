"use strict";
// TODO: break up the code into smaller files, or rearrange this big boi
const colourDivs = document.querySelectorAll(".colour");
const generateButton = document.querySelector(".generate-button");
const sliders = document.querySelectorAll("input[type='range']");
const currentHexes = document.querySelectorAll(".colour h2");
const copyContainer = document.querySelector(".copy-container");
const adjustButtons = document.querySelectorAll(".adjust");
const lockButtons = document.querySelectorAll(".lock");
const closeAdjustmentButtons = document.querySelectorAll(".close-adjustment");
let initialColours = [];
sliders.forEach((slider) => {
    slider.addEventListener("input", hslControls);
});
currentHexes.forEach((hex) => {
    hex.addEventListener("click", copyHexToClipboard.bind(hex, hex));
});
copyContainer.addEventListener("click", () => {
    copyContainer.classList.remove("active");
    copyContainer.children[0].classList.remove("active");
});
document.addEventListener("keypress", (event) => {
    if (event.code === "Escape") {
        copyContainer.classList.remove("active");
        copyContainer.children[0].classList.remove("active");
    }
});
adjustButtons.forEach((button) => {
    button.addEventListener("click", () => {
        button.parentElement.parentElement.children[2].classList.toggle("active");
    });
});
closeAdjustmentButtons.forEach((button) => {
    button.addEventListener("click", () => {
        button.parentElement.classList.remove("active");
    });
});
generateButton.addEventListener("click", randomColours);
lockButtons.forEach((button) => {
    button.addEventListener("click", lockColour.bind(button, button));
});
function lockColour(button) {
    button.parentElement.parentElement.classList.toggle("locked");
    if (button.children[0].classList.contains("fa-lock-open")) {
        button.children[0].classList.replace("fa-lock-open", "fa-lock");
    }
    else {
        button.children[0].classList.replace("fa-lock", "fa-lock-open");
    }
}
function randomColours() {
    colourDivs.forEach((div) => {
        const hexText = div.children[0];
        const randomColour = chroma.random();
        if (div.classList.contains("locked")) {
            initialColours.push(chroma(hexText.innerText));
            return;
        }
        else {
            initialColours.push(randomColour);
        }
        const randomColourHex = randomColour.hex();
        div.style.backgroundColor = randomColourHex;
        hexText.innerText = randomColourHex;
        checkTextContrast(randomColour, div);
        const sliders = div.querySelectorAll(".sliders input");
        colourizeSliders(randomColour, sliders);
    });
    setSliders();
    // TODO: check the contrast of the sliders div?
}
function checkTextContrast(colour, colourDiv) {
    const text = colourDiv.children[0];
    const sliders = colourDiv.children[1].children[0];
    const lock = colourDiv.children[1].children[1];
    if (colour.luminance() > 0.5) {
        text.style.color = "black";
        sliders.style.color = "black";
        lock.style.color = "black";
    }
    else {
        text.style.color = "white";
        sliders.style.color = "white";
        lock.style.color = "white";
    }
}
function colourizeSliders(colour, sliders) {
    const hue = sliders[0];
    hue.style.backgroundImage =
        "linear-gradient(to right, rgb(204, 75, 75), rgb(204, 204, 75), rgb(75, 204, 75), rgb(75, 204, 204), rgb(75, 75, 204), rgb(204, 75, 204), rgb(204, 75, 75))";
    const saturation = sliders[1];
    const minSaturation = colour.set("hsl.s", 0);
    const maxSaturation = colour.set("hsl.s", 1);
    const saturationScale = chroma.scale([minSaturation, colour, maxSaturation]);
    saturation.style.backgroundImage = `linear-gradient(to right, ${saturationScale(0)}, ${saturationScale(1)})`;
    const brightness = sliders[2];
    const midBrightness = colour.set("hsl.l", 0.5);
    const brightnessScale = chroma.scale(["black", midBrightness, "white"]);
    brightness.style.backgroundImage = `linear-gradient(to right, ${brightnessScale(0)}, ${brightnessScale(0.5)}, ${brightnessScale(1)})`;
}
function hslControls(event) {
    const target = event.target;
    let colourDivId = parseInt(target.getAttribute("data-hue")) ||
        parseInt(target.getAttribute("data-sat")) ||
        parseInt(target.getAttribute("data-bright"));
    // FIXME: for some god forsaken reason if the first div's hue or saturation is changed, the colourDivId is NaN
    if (isNaN(colourDivId)) {
        colourDivId = 0;
    }
    const currentDiv = colourDivs[colourDivId];
    const sliders = target.parentElement.querySelectorAll("input[type='range']");
    const hueSlider = sliders[0];
    const saturationSlider = sliders[1];
    const brightnessSlider = sliders[2];
    let bgColourText = initialColours[colourDivId];
    const newColour = chroma(bgColourText)
        .set("hsl.h", hueSlider.value)
        .set("hsl.s", saturationSlider.value)
        .set("hsl.l", brightnessSlider.value);
    currentDiv.style.backgroundColor = newColour.hex();
    currentDiv.querySelector("h2").innerText = newColour.hex();
    checkTextContrast(newColour, currentDiv);
    colourizeSliders(newColour, sliders);
}
function setSliders() {
    colourDivs.forEach((div) => {
        const sliders = div.children[2].querySelectorAll("input");
        const divColour = div.style.backgroundColor;
        sliders.forEach((slider) => {
            switch (slider.name) {
                case "hue":
                    slider.value = chroma(divColour).hsl()[0].toString();
                    break;
                case "saturation":
                    slider.value = chroma(divColour).hsl()[1].toString();
                    break;
                case "brightness":
                    slider.value = chroma(divColour).hsl()[2].toString();
                    break;
            }
        });
    });
}
function copyHexToClipboard(hex) {
    navigator.clipboard.writeText(hex.innerText);
    copyContainer.classList.add("active");
    copyContainer.children[0].classList.add("active");
}
const saveButton = document.querySelector(".save-button");
const submitSave = document.querySelector(".submit-save");
const closeSave = document.querySelector(".close-save");
const saveContainer = document.querySelector(".save-container");
const saveInput = document.querySelector(".save-name");
let savedPalettes = [];
saveButton.addEventListener("click", openPalette);
closeSave.addEventListener("click", closePalette);
submitSave.addEventListener("click", savePalette);
saveInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        submitSave.click();
    }
});
function openPalette() {
    const popup = saveContainer.children[0];
    saveContainer.classList.add("active");
    popup.classList.add("active");
    saveInput.focus();
}
function closePalette() {
    const popup = saveContainer.children[0];
    saveContainer.classList.remove("active");
    popup.classList.remove("active");
}
function savePalette() {
    closePalette();
    const paletteName = saveInput.value;
    const colours = [];
    currentHexes.forEach((hex) => {
        colours.push(hex.innerText);
    });
    const paletteId = savedPalettes.length;
    const newPalette = {
        id: paletteId,
        name: paletteName,
        colours: colours,
    };
    savedPalettes.push(newPalette);
    localStorage.setItem("saved-palettes", JSON.stringify(savedPalettes));
    saveInput.value = "";
}
randomColours();
//# sourceMappingURL=app.js.map