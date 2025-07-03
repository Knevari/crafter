import Time from "./core/time/time";
import { ECS } from "./engine/TwoD";
import { SYSTEM_STATE } from "./core/gears/ecs/system";
import { GameMain } from "./game/game.main";


await GameMain();

const time = new Time();

const debug = document.querySelector("#debug")!;

time.on("start", () => {
  ECS.System.callStart(SYSTEM_STATE);
});

time.on("fixedUpdate", () => {
  ECS.System.callFixedUpdate(SYSTEM_STATE);
  debug.textContent = Time.fps.toString()
});

time.on("lateUpdate", () => {
  ECS.System.callLateUpdate(SYSTEM_STATE);
});

time.on("render", () => {

  ECS.System.callRender(SYSTEM_STATE);
  ECS.System.callDrawGizmos(SYSTEM_STATE);

});

time.on("update", () => {
  ECS.System.callUpdate(SYSTEM_STATE);
});

time.start();

window.addEventListener('wheel', (e) => {
  if (e.ctrlKey) e.preventDefault();
}, { passive: false });


['gesturestart', 'gesturechange', 'gestureend'].forEach(event => {
  window.addEventListener(event, e => e.preventDefault());
});
