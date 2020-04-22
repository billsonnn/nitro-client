export interface IAvatarEffectListener
{
    dispose(): void;
    resetEffect(effect: number): void;
    isDisposed: boolean;
}