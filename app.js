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
randomColours();
