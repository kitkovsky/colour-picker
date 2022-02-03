const colourDivs = document.querySelectorAll<HTMLDivElement>(".colour");
const generateButton = document.querySelector<HTMLButtonElement>(".generate");
const sliders = document.querySelectorAll<HTMLInputElement>(
  "input[type='range']"
);
const currentHexes = document.querySelectorAll<HTMLDivElement>(".color h2");

function randomColours(){
  colourDivs.forEach((div) => {
    const hexText = div.children[0] as HTMLElement;
    const randomColour = chroma.random().hex();

    div.style.backgroundColor = randomColour;
    hexText.innerText = randomColour;
  });
}

randomColours();
