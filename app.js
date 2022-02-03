"use strict";
const colourDivs = document.querySelectorAll(".colour");
const generateButton = document.querySelector(".generate");
const sliders = document.querySelectorAll("input[type='range']");
const currentHexes = document.querySelectorAll(".colour h2");
const copyContainer = document.querySelector(".copy-container");
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
    if (event.code === "Escape" || event.code === "Enter") {
        copyContainer.classList.remove("active");
        copyContainer.children[0].classList.remove("active");
    }
});
function randomColours() {
    colourDivs.forEach((div) => {
        const hexText = div.children[0];
        const randomColour = chroma.random();
        initialColours.push(randomColour);
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
    const colourDivId = parseInt(target.getAttribute("data-hue")) ||
        parseInt(target.getAttribute("data-sat")) ||
        parseInt(target.getAttribute("data-bright"));
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
randomColours();
//# sourceMappingURL=app.js.map