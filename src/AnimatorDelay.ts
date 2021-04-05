export class AnimatorDelay 
{
    private timerRunning: boolean = false;
    private timeElapsed: number = 0;
    private callbackFired: boolean = false;

    constructor(private animateDelay: number, private delayComplete: Function)
    {
    }

    public start(): void
    {
        this.timerRunning = true;
    }

    public update(deltaTime: number): void
    {
        if (this.timerRunning === false)
            return;

        this.timeElapsed += deltaTime;

        if (this.timeElapsed > this.animateDelay)
        {
            this.delayComplete();
            this.callbackFired = true;
            this.reset();
        }
    }

    private reset(): void
    {
        this.timerRunning = false;
        this.timeElapsed = 0;
    }

    public get animatorDelayComplete(): boolean 
    {
        return this.callbackFired;
    }
}