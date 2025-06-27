import { Input, Types } from "../../engine/TwoD";

export const globalMouseState: Types.MouseInputState = Input.createMouseInputState();
export const globalKeyState: Types.KeyInputState = Input.createKeyInputState();

Input.attachKeyInputListeners(globalKeyState);
Input.attachMouseInputListeners(globalMouseState);

export function InputSystem(): Types.System {

    return {
        lateUpdate() {

            Input.clearMouseInput(globalMouseState);
            Input.clearKeyInput(globalKeyState);
        },
    }
}