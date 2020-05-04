export interface IRoomManagerListener
{
    refreshRoomObjectFurnitureData(roomId: string, objectId: number, category: number): void
}