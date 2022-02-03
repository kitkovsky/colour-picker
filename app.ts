const colourDivs = document.querySelectorAll<HTMLDivElement>(".colour");
const generateButton = document.querySelector<HTMLButtonElement>(".generate");
const sliders = document.querySelectorAll<HTMLInputElement>(
  "input[type='range']"
);
const currentHexes = document.querySelectorAll<HTMLDivElement>(".color h2");

function randomColours() {
  colourDivs.forEach((div) => {
    const hexText = div.children[0] as HTMLElement;
    const randomColour = chroma.random();
    const randomColourHex = randomColour.hex();

    div.style.backgroundColor = randomColourHex;
    hexText.innerText = randomColourHex;
    checkTextContrast(randomColour, div);
  });
}

function checkTextContrast(colour: chroma.Color, colourDiv: HTMLDivElement) {
  const text = colourDiv.children[0] as HTMLElement;
  const sliders = colourDiv.children[1].children[0] as HTMLElement;
  const lock = colourDiv.children[1].children[1] as HTMLElement;
  if (colour.luminance() > 0.5) {
    text.style.color = "black";
    sliders.style.color = "black";
    lock.style.color = "black";
  } else {
    text.style.color = "white";
    sliders.style.color = "white";
    lock.style.color = "white";
  }
}
randomColours();
