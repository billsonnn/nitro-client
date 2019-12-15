export interface IDisposeable
{
    dispose(): void;
    isDisposed: boolean;
    isDisposing: boolean;
}