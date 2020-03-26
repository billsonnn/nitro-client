
export interface IAvatarImageListener
{
    dispose(): void;
    resetFigure(figure: string): void;
    isDisposed: boolean;
}