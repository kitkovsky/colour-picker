const colourDivs = document.querySelectorAll<HTMLDivElement>(".colour");
const generateButton = document.querySelector<HTMLButtonElement>(".generate");
const sliders = document.querySelectorAll<HTMLInputElement>(
  "input[type='range']"
);
const currentHexes = document.querySelectorAll<HTMLDivElement>(".color h2");
let initialColours: chroma.Color[] = [];

sliders.forEach((slider) => {
  slider.addEventListener("input", hslControls);
});

function randomColours() {
  colourDivs.forEach((div) => {
    const hexText = div.children[0] as HTMLElement;
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

function colourizeSliders(colour: chroma.Color, sliders: NodeListOf<Element>) {
  const hue = sliders[0] as HTMLInputElement;
  hue.style.backgroundImage =
    "linear-gradient(to right, rgb(204, 75, 75), rgb(204, 204, 75), rgb(75, 204, 75), rgb(75, 204, 204), rgb(75, 75, 204), rgb(204, 75, 204), rgb(204, 75, 75))";

  const saturation = sliders[1] as HTMLInputElement;
  const minSaturation = colour.set("hsl.s", 0);
  const maxSaturation = colour.set("hsl.s", 1);
  const saturationScale = chroma.scale([minSaturation, colour, maxSaturation]);
  saturation.style.backgroundImage = `linear-gradient(to right, ${saturationScale(
    0
  )}, ${saturationScale(1)})`;

  const brightness = sliders[2] as HTMLInputElement;
  const midBrightness = colour.set("hsl.l", 0.5);
  const brightnessScale = chroma.scale(["black", midBrightness, "white"]);
  brightness.style.backgroundImage = `linear-gradient(to right, ${brightnessScale(
    0
  )}, ${brightnessScale(0.5)}, ${brightnessScale(1)})`;
}

function hslControls(event: Event) {
  const target = event.target as HTMLInputElement;
  const colourDivId =
    parseInt(target.getAttribute("data-hue")!) ||
    parseInt(target.getAttribute("data-sat")!) ||
    parseInt(target.getAttribute("data-bright")!);

  const currentDiv = colourDivs[colourDivId];
  const sliders = target.parentElement!.querySelectorAll(
    "input[type='range']"
  ) as NodeListOf<HTMLInputElement>;
  const hueSlider = sliders[0];
  const saturationSlider = sliders[1];
  const brightnessSlider = sliders[2];

  let bgColourText = initialColours[colourDivId];
  console.log(`initial colour: ${bgColourText} for div: ${colourDivId}`);

  const newColour = chroma(bgColourText)
    .set("hsl.h", hueSlider.value)
    .set("hsl.s", saturationSlider.value)
    .set("hsl.l", brightnessSlider.value);

  currentDiv.style.backgroundColor = newColour.hex();
  currentDiv.querySelector("h2")!.innerText = newColour.hex();
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

randomColours();
