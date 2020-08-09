export interface IRoomObjectModel
{
    dispose(): void;
    getValue(key: string): any;
    setValue(key: string, value: any): void;
    removeKey(key: string): void;
    updateCounter: number;
}