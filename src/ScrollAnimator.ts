import { AnimationElement } from "./AnimationElement";

export class ScrollAnimator 
{
    private animationElements: Array<AnimationElement> = [];

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
}