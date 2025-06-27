import type { KeyInputState } from "./key.input.type";

export function createKeyInputState(): KeyInputState {
  return {
    key: new Map<string, boolean>(),
    keyDown: new Map<string, boolean>(),
    keyUp: new Map<string, boolean>(),
  };
}


export function handleKeyDown(state: KeyInputState, e: KeyboardEvent): void {
  const code = e.code;
  if (!state.key.get(code)) {
    state.key.set(code, true);
    state.keyDown.set(code, true);
  }
}

export function handleKeyUp(state: KeyInputState, e: KeyboardEvent): void {
  const code = e.code;
  state.key.set(code, false);
  state.keyUp.set(code, true);
}

export function clearKeyInput(state: KeyInputState): void {
  state.keyDown.clear();
  state.keyUp.clear();
}

function getButtonState(map: Map<string, boolean>, code: string): boolean {
  const state = map.get(code) ?? false;
  map.delete(code); 
  return state;
}

export function getKeyDown(state: KeyInputState, code: string): boolean {
  return getButtonState(state.keyDown, code);
}

export function getKey(state: KeyInputState, code: string): boolean {
  return state.key.get(code) ?? false;
}

export function getKeyUp(state: KeyInputState, code: string): boolean {
  return getButtonState(state.keyUp, code);
}

export function attachKeyInputListeners(state: KeyInputState): void {
  window.addEventListener('keydown', (e) => handleKeyDown(state, e));
  window.addEventListener('keyup', (e) => handleKeyUp(state, e));
}
