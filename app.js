"use strict";
const colourDivs = document.querySelectorAll(".colour");
const generateButton = document.querySelector(".generate");
const sliders = document.querySelectorAll("input[type='range']");
const currentHexes = document.querySelectorAll(".color h2");
function randomColours() {
    colourDivs.forEach((div) => {
        const hexText = div.children[0];
        const randomColour = chroma.random();
        const randomColourHex = randomColour.hex();
        div.style.backgroundColor = randomColourHex;
        hexText.innerText = randomColourHex;
        checkTextContrast(randomColour, div);
        const sliders = div.querySelectorAll(".sliders input");
        colourizeSliders(randomColour, sliders);
    });
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
randomColours();
