export interface IRoomManagerListener
{
    onRoomEngineInitalized(flag: boolean): void;
    refreshRoomObjectFurnitureData(roomId: string, objectId: number, category: number): void;
}