/**
 * Represents an interval of time, i.e. the amount of time between two events.
 */
export class Interval {
  public static fromMilliseconds(ms: number) {
    return new Interval(ms);
  }

  public static fromHz(hz: number) {
    return new Interval(1000 / hz);
  }

  private constructor(public ms: number) { }

}

/**
 * Repeatedly executes a function, with a minimum time delay between each call.
 */
export class IntervalTaskRunner {

  private intervalId?: NodeJS.Timeout | number;

  private running: boolean = false;

  public constructor(private readonly task: () => void, private readonly interval: Interval) { }

  /**
   * Determines if this runner is running.
   * @returns `true` if running, `false` otherwise.
   */
  public isRunning(): boolean {
    return this.running;
  }

  /**
   * Starts the runner, repeatedly executing its operation using the Node/`Window` `setInterval` API.
   */
  public start(): this {
    this.intervalId = setInterval(this.task, this.interval.ms);
    this.running = true;
    return this;
  }

  /**
   * Stops the runner.
   */
  public stop(): this {
    // TS compiler is unsure if we are using a Node interval or a web API interval.
    // Either is fine as both APIs are identical, so we perform a cast here.
    clearInterval(this.intervalId as NodeJS.Timeout & number);
    this.running = false;
    return this;
  }
}
