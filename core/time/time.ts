import { EventEmitter, type EventCallback } from "./emitter";

export type TimeEvent = 'start' | 'update' | 'fixedUpdate' | 'lateUpdate' | 'render';

export default class Time {
  private events = new EventEmitter();

  private accumulator = 0;
  private isRunning = false;
  private isPaused = false;
  private readonly maxFrameSkip = 5;

  private frameCount = 0;
  private lastFpsTime = 0;
  private animationFrameId?: number;
  private initialized = false;

  private static _deltaTime = 0;
  public static get deltaTime() {
    return this._deltaTime;
  }
  private static _time = 0;
  public static readonly fixedDeltaTime = 1 / 50;
  public static timeScale = 1;
  public static realtimeSinceStartup = 0;
  public static fps = 0;

  constructor() { }

  public on(event: TimeEvent, callback: EventCallback) {
    this.events.on(event, callback);
  }

  public off(event: TimeEvent, callback: EventCallback) {
    this.events.off(event, callback);
  }

  public offAll(event?: TimeEvent) {
    if (event) {
      this.events.clear(event);
    } else {
      this.events.clearAll();
    }
  }

  public start(): void {
    if (this.isRunning || this.initialized) return;

    this.events.emit('start');

    this.initialized = true;
    this.isRunning = true;
    this.isPaused = false;
    Time._time = performance.now();
    this.lastFpsTime = Time._time;

    this.loop();
  }

  public stop(): void {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }
  }

  public pause(): void {
    this.isPaused = true;
  }

  public resume(): void {
    if (!this.isRunning || !this.isPaused) return;
    this.isPaused = false;
    Time._time = performance.now();
    this.loop();
  }

  public step(): void {
    if (!this.isPaused) return;
    this.processFrame();
  }

  private loop(): void {
    if (!this.isRunning) return;

    if (!this.isPaused) {
      this.processFrame();
    }

    this.animationFrameId = requestAnimationFrame(() => this.loop());
  }

  private processFrame(): void {
    const now = performance.now();
    const realDelta = (now - Time._time) / 1000;

    Time._time = now;
    Time._deltaTime = realDelta * Time.timeScale;
    Time.realtimeSinceStartup += realDelta;


    this.accumulator += Time._deltaTime;
    let steps = 0;

    if (this.initialized) {
      while (this.accumulator >= Time.fixedDeltaTime && steps < this.maxFrameSkip) {
        this.events.emit('fixedUpdate');
        this.accumulator -= Time.fixedDeltaTime;
        steps++;
      }

      this.events.emit('update');
      this.events.emit('lateUpdate');
      this.events.emit('render');
    }

    this.calculateFPS(now);
  }

  private calculateFPS(now: number): void {
    this.frameCount++;
    if (now - this.lastFpsTime >= 1000) {
      Time.fps = this.frameCount;
      this.frameCount = 0;
      this.lastFpsTime = now;
    }
  }
}
