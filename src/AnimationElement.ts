import { AnimatorDelay } from "./AnimatorDelay";
import { AnimatorElement } from "./AnimatorElement";

export class AnimationElement implements AnimatorElement
{
    private observer: IntersectionObserver;

    private _animateOnce: boolean = false;
    private _animateClass: string = "animate-in";
    private _animateThreshold: number = 0.5;
    private _animateRootMargin: string = "0px";
    private _animateDelaySeconds: number = 0;

    private animatorDelay: AnimatorDelay;
    private animationHasPlayedOnce: boolean = false;
    private animationIsPlaying: boolean = false;

    constructor(private _htmlElement: HTMLElement)
    {
        const animateOnce: string | undefined = this._htmlElement.dataset.animateOnce;
        if (animateOnce)
        {
            this._animateOnce = animateOnce === "true";
        }

        const animateClass: string | undefined = this._htmlElement.dataset.animateClass;
        if (animateClass)
        {
            this._animateClass = animateClass;
        }

        const animateThreshold: string | undefined = this._htmlElement.dataset.animateThreshold;
        if (animateThreshold)
        {
            this._animateThreshold = parseFloat(animateThreshold);
        }

        const animateRootMargin: string | undefined = this._htmlElement.dataset.animateRootMargin;
        if (animateRootMargin)
        {
            this._animateRootMargin = animateRootMargin;
        }

        const animateDelaySeconds: string | undefined = this._htmlElement.dataset.animateDelaySeconds;
        if (animateDelaySeconds)
        {
            this._animateDelaySeconds = parseFloat(animateDelaySeconds);
        }

        this.animatorDelay = new AnimatorDelay(this._animateDelaySeconds, this.onAnimationCanPlay.bind(this));

        this.observer = new IntersectionObserver(this.onIntersectionCallback.bind(this), {
            rootMargin: this._animateRootMargin,
            threshold: this._animateThreshold
        });

        this.observer.observe(this._htmlElement);
    }

    private onIntersectionCallback(entries: IntersectionObserverEntry[], observer: IntersectionObserver): void
    {
        if (this.animationHasPlayedOnce === true && this._animateOnce === true)
        {
            // Configured to play the animation once, no need to keep the observer
            return observer.disconnect();
        }

        for (let i = 0; i < entries.length; i++)
        {
            const entry: IntersectionObserverEntry = entries[i];
            if (entry.isIntersecting === true && this.animationIsPlaying === false && entry.intersectionRatio > 0)
            {
                this.play();
            }
            else if (this.animationIsPlaying === false)
            {
                this.finish();
            }
        }
    }

    private play(): void
    {
        this.animatorDelay.start();
    }

    private onTransitionComplete()
    {
        this.animationIsPlaying = false;
        this._htmlElement.removeEventListener("animationcancel", this.onTransitionComplete.bind(this));
        this._htmlElement.removeEventListener("animationend", this.onTransitionComplete.bind(this));
        this._htmlElement.removeEventListener("transitioncancel", this.onTransitionComplete.bind(this));
        this._htmlElement.removeEventListener("transitionend", this.onTransitionComplete.bind(this));
    }

    private onAnimationCanPlay(): void
    {
        this.animationIsPlaying = true;
        this.animationHasPlayedOnce = true;

        this._htmlElement.classList.add(this._animateClass);
        this._htmlElement.addEventListener("animationcancel", this.onTransitionComplete.bind(this), false);
        this._htmlElement.addEventListener("animationend", this.onTransitionComplete.bind(this), false);
        this._htmlElement.addEventListener("transitioncancel", this.onTransitionComplete.bind(this), false);
        this._htmlElement.addEventListener("transitionend", this.onTransitionComplete.bind(this), false);
    }

    private finish(): void
    {
        this._htmlElement.classList.remove(this._animateClass);
    }

    public dispose(): void
    {
        this.observer.disconnect();
    }

    public update(deltaTime: number): void
    {
        this.animatorDelay.update(deltaTime);
    }
}