export interface IDisposable
{
    dispose(): void;
    isDisposed: boolean;
    isDisposing: boolean;
}