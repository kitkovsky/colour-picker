"use strict";
const colourDivs = document.querySelectorAll(".colour");
const generateButton = document.querySelector(".generate");
const sliders = document.querySelectorAll("input[type='range']");
const currentHexes = document.querySelectorAll(".color h2");
function randomColours() {
    colourDivs.forEach((div) => {
        const hexText = div.children[0];
        const randomColour = chroma.random().hex();
        div.style.backgroundColor = randomColour;
        hexText.innerText = randomColour;
    });
}
randomColours();
