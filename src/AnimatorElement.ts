export interface AnimatorElement
{
    dispose(): void;
    update(now: number): void;
}