import { AnimationElement } from "./AnimationElement";

export class ScrollAnimator 
{
    private animationElements: Array<AnimationElement> = [];
    private requestAnimationFrameRunning: boolean = false;

    constructor()
    {
    }

    /**
     * Create observers from a NodeListOf<HTMLElement>
     * Clears existing list of elements if any exist
     * @param elements
     */
    public create(elements: NodeListOf<HTMLElement>): void
    {
        this.dispose();

        if (this.requestAnimationFrameRunning === false)
        {
            this.requestAnimationFrameRunning = true;
            window.requestAnimationFrame(this.update.bind(this));
        }

        for (let i = 0; i < elements.length; i++)
        {
            const htmlElement = elements[i] as HTMLElement;

            this.animationElements.push(new AnimationElement(htmlElement));
        }
    }

    /**
     * Dispose of all observers and remove existing list elements
     */
    public dispose(): void
    {
        for (let i = 0; i < this.animationElements.length; i++)
        {
            this.animationElements[i].dispose();
        }
        this.animationElements = [];
    }

    private then: number = 0;
    private update(now: number): void
    {
        if (this.requestAnimationFrameRunning === false)
        {
            return;
        }

        now *= 0.001;
        const deltaTime: number = (now - this.then);

        for (let i = 0; i < this.animationElements.length; i++)
        {
            this.animationElements[i].update(deltaTime);
        }

        this.then = now;
        requestAnimationFrame(this.update.bind(this));
    }
}