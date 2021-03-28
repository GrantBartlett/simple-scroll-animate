export class AnimationElement 
{
    private observer: IntersectionObserver;
    private animationPlaying: boolean = false;
    private animationPlayedOnce: boolean = false;

    private _animateOnce: boolean = false;
    private _animateClass: string = "no-animation";
    private _animateThreshold: number = 0.5;

    constructor(private _htmlElement: HTMLElement)
    {
        if (this.htmlElement.dataset.animateOnce)
        {
            this._animateOnce = this.htmlElement.dataset.animateOnce === "true";
        }

        if (this.htmlElement.dataset.animateClass)
        {
            this._animateClass = this.htmlElement.dataset.animateClass;
        }

        if (this.htmlElement.dataset.animateThreshold)
        {
            this._animateThreshold = parseFloat(this.htmlElement.dataset.animateThreshold);
        }

        this.observer = new IntersectionObserver(this.onIntersectionCallback.bind(this), {
            rootMargin: "0px",
            threshold: this.animateThreshold
        });

        this.observer.observe(this.htmlElement);
    }

    private onIntersectionCallback(entries: IntersectionObserverEntry[], observer: IntersectionObserver): void
    {
        if (this.animationPlayedOnce === true && this.animateOnce === true)
        {
            // Configured to play the animation once, no need to keep the observer
            return observer.disconnect();
        }

        for (let i = 0; i < entries.length; i++)
        {
            const entry: IntersectionObserverEntry = entries[i];
            if (entry.isIntersecting === true && this.animationPlaying === false)
            {
                this.play();
            }
            else 
            {
                this.reset();
            }
        }
    }

    private play(): void
    {
        this.animationPlaying = true;
        this.animationPlayedOnce = true;

        this.htmlElement.classList.add(this.animateClass);
        this.htmlElement.addEventListener("animationcancel", this.onAnimationComplete.bind(this), false);
        this.htmlElement.addEventListener("animationend", this.onAnimationComplete.bind(this), false);
    }

    private onAnimationComplete(): void
    {
        this.animationPlaying = false;

        this.htmlElement.removeEventListener("animationcancel", this.onAnimationComplete.bind(this), false);
        this.htmlElement.removeEventListener("animationend", this.onAnimationComplete.bind(this), false);
    }

    private reset(): void
    {
        this.htmlElement.classList.remove(this.animateClass);
        this.htmlElement.removeEventListener("animationcancel", this.onAnimationComplete.bind(this), false);
        this.htmlElement.removeEventListener("animationend", this.onAnimationComplete.bind(this), false);
    }

    public dispose(): void
    {
        this.observer.disconnect();
    }

    public get animateOnce(): boolean { return this._animateOnce; }
    public get animateThreshold(): number { return this._animateThreshold; }
    public get animateClass(): string { return this._animateClass; }
    public get htmlElement(): HTMLElement { return this._htmlElement; }
}