import { gameState } from "../game-state";

export function createHealthBar() {
  const wrapper = document.createElement("div");
  wrapper.classList.add("health-bar-wrapper");

  const bar = document.createElement("div");
  bar.classList.add("health-bar");

  const text = document.createElement("span");
  text.classList.add("health-text");

  bar.appendChild(text);
  wrapper.appendChild(bar);

  document.querySelector("#ui")?.appendChild(wrapper);

  return {
    update() {
      const health = gameState.player.health;
      const percentage = (health.current / health.max) * 100;

      bar.style.width = `${percentage}%`;
      text.innerText = `${health.current}/${health.max}`;
    },
  };
}
