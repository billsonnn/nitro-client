export interface IInventoryModel
{
    show(): void;
    hide(): void;
    requestLoad(): void;
    type: string;
}