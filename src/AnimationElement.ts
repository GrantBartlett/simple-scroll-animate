import { AnimatorDelay } from "./AnimatorDelay";
import { AnimatorElement } from "./AnimatorElement";

export class AnimationElement implements AnimatorElement
{
    private observer: IntersectionObserver;
    private _hasPlayedOnce: boolean = false;

    private _animateOnce: boolean = false;
    private _animateClass: string = "animate-in";
    private _animateThreshold: number = 0.5;
    private _animateRootMargin: string = "0px";
    private _animateDelaySeconds: number = 0;

    private _animatorDelay: AnimatorDelay;

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

        this._animatorDelay = new AnimatorDelay(this._animateDelaySeconds, this.onAnimationCanPlay.bind(this));

        this.observer = new IntersectionObserver(this.onIntersectionCallback.bind(this), {
            rootMargin: this._animateRootMargin,
            threshold: this._animateThreshold
        });

        this.observer.observe(this._htmlElement);
    }

    private onIntersectionCallback(entries: IntersectionObserverEntry[], observer: IntersectionObserver): void
    {
        if (this._hasPlayedOnce === true && this._animateOnce === true)
        {
            // Configured to play the animation once, no need to keep the observer
            return observer.disconnect();
        }

        for (let i = 0; i < entries.length; i++)
        {
            const entry: IntersectionObserverEntry = entries[i];
            if (entry.isIntersecting === true && entry.intersectionRatio > 0)
            {
                this.play();
            }
            else 
            {
                this.finish();
            }
        }
    }

    private play(): void
    {
        this._animatorDelay.start();
    }

    private onAnimationCanPlay(): void
    {
        console.log("onAnimationCanPlay");

        this._htmlElement.classList.add(this._animateClass);
        this._hasPlayedOnce = true;
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
        this._animatorDelay.update(deltaTime);
    }
}