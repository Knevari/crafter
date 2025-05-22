export default class KeyInput {
  private static keyState = new Map<string, boolean>();
  private static keyDown = new Map<string, boolean>();
  private static keyUp = new Map<string, boolean>();

  public static initialize(): void {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  public static clear(): void {
    this.keyDown.clear();
    this.keyUp.clear();
  }

  public static getKeyDown(code: string): boolean {
    return this.getButtonState(this.keyDown, code);
  }

  public static getKey(code: string): boolean {
    return this.keyState.get(code) ?? false;
  }

  public static getKeyUp(code: string): boolean {
    return this.getButtonState(this.keyUp, code);
  }

  private static getButtonState(map: Map<string, boolean>, code: string): boolean {
    const state = map.get(code) ?? false;
    map.delete(code);
    return state;
  }

  private static handleKeyDown(e: KeyboardEvent): void {
    const code = e.code;
    if (!this.keyState.get(code)) {
      this.keyState.set(code, true);
      this.keyDown.set(code, true);
    }
  }

  private static handleKeyUp(e: KeyboardEvent): void {
    const code = e.code;
    this.keyState.set(code, false);
    this.keyUp.set(code, true);
  }
}
