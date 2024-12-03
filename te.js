const choosedBtn = document.querySelector(".choose");
const uploadBtn = document.querySelector("#upload");
const image = document.querySelector("img");
const slider = document.querySelector("#slider");
const value = document.querySelector(".value");
const innerText = document.querySelector(".innerText");
const rotation = document.querySelectorAll(".rotation");
const buttons = document.querySelectorAll(".bt");
const reset = document.querySelector(".reset");
const save = document.querySelector(".save");

choosedBtn.addEventListener("click", () => {
  uploadBtn.click();
});

uploadBtn.addEventListener("change", (e) => {
  const file = e.target.files[0];
  const url = URL.createObjectURL(file);
  image.src = url;
  document.querySelector(".container").classList.remove("disable");z
});

const filters = {
  brightness: 100,
  saturate: 100,
  invert: 0,
  grayscale: 0,
};

const applyFilters = () => {
  const { brightness, saturate, invert, grayscale } = filters;
  image.style.filter = `
    brightness(${brightness}%)
    saturate(${saturate}%)
    invert(${invert}%)
    grayscale(${grayscale}%)`;
};

let currentFilter = "brightness";

slider.addEventListener("input", () => {
  const activeVal = slider.value;
  value.innerHTML = activeVal + "%";
  filters[currentFilter] = activeVal;
  applyFilters();
});

const updateButton = (activeButton, filterText, filterVal) => {
  buttons.forEach((btn) => {
    if (btn === activeButton) {
      btn.style.backgroundColor = "#5372F0";
      btn.style.borderColor = "#5372F0";
      btn.style.color = "#fff";
    } else {
      btn.style.backgroundColor = "#fff";
      btn.style.border = "1px solid #aaa";
      btn.style.color = "#6C757D";
    }
  });

  currentFilter = filterVal;

  innerText.innerHTML = filterText;

  slider.value = console.log(filters[filterVal]);
  value.innerHTML = filters[filterVal] + "%";
};

buttons.forEach((button, index) => {
  button.addEventListener("click", () => {
    const filters = ["brightness", "saturate", "invert", "grayscale"];
    const filterName = filters[index];

    const capitalizedFilterName =
      filterName.charAt(0).toUpperCase() + filterName.slice(1).toLowerCase();

    updateButton(button, capitalizedFilterName, filterName);
  });
});

const rotate = {
  currentRotationP: 0,
  currentRotation: 0,
  flipHorizontal: 1,
  flipVertical: 1,
};

const set = () => {
  const { currentRotationP, currentRotation, flipHorizontal, flipVertical } = rotate;
  image.style.transform = `
  rotate(${currentRotationP}deg)
  rotate(${currentRotation}deg)
  scaleX(${flipHorizontal})
  scaleY(${flipVertical})`;
};

save.addEventListener("click", ()=>{
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  ctx.translate(canvas.width / 2, canvas.height / 2);

  ctx.rotate((rotate.currentRotationP + rotate.currentRotation) * Math.PI / 180);
  ctx.scale(rotate.flipHorizontal, rotate.flipVertical);

  ctx.filter = `brightness(${filters.brightness}%) saturate(${filters.saturate}%) invert(${filters.invert}%) grayscale(${filters.grayscale}%)`;

  ctx.drawImage(image, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
  
  const link = document.createElement("a");
  link.download = "image.jpg";
  link.href = canvas.toDataURL();
  link.click();
})

let currentRotationP = 0,
  currentRotation = 0,
  flipHorizontal = 1,
  flipVertical = 1;

rotation.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.id === "rotateRight") {
      rotate.currentRotationP += 90;
    } else if (btn.id === "rotateLeft") {
      rotate.currentRotation -= 90;
    } else if (btn.id === "horizontal") {
      rotate.flipHorizontal = rotate.flipHorizontal === 1 ? -1 : 1;
    } else if (btn.id === "vertical") {
      rotate.flipVertical = rotate.flipVertical === 1 ? -1 : 1;
    }
    set();
  });
});

reset.addEventListener("click", () => {
  filters.brightness = 100;
  filters.saturate = 100;
  filters.invert = 0;
  filters.grayscale = 0;

  image.style.filter = "none";
  image.style.transform = "rotate(0) scale(1, 1)";

  slider.value = 100;
  innerText.innerHTML = "Brightness";
  value.innerHTML = "100%";

  buttons.forEach((btn) => {
    btn.style.backgroundColor = "#fff";
    btn.style.border = "1px solid #aaa";
    btn.style.color = "#6C757D";
  });

  rotate.currentRotationP = 0;
  rotate.currentRotation = 0;
  rotate.flipHorizontal = 1;
  rotate.flipVertical = 1;

  applyFilters();
});
