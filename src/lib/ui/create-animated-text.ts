export function createAnimatedText(textString: string) {
  const text = document.createElement("text");
  text.classList.add("fade-in-text");
  text.textContent = textString;

  document.querySelector("#ui")?.appendChild(text);

  return {
    setText(textString: string) {
      text.textContent = textString;
    },
    setPosition(worldX: number, worldY: number) {
      text.style.left = worldX + "px";
      text.style.top = worldY + "px";
    },
    fadeIn() {
      text.classList.add("active");
    },
    fadeOut() {
      text.classList.remove("active");
    },
  };
}
