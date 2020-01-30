export interface IRoomManagerListener
{
    refreshRoomObjectFurnitureData(roomId: number, objectId: number, category: number): void
}