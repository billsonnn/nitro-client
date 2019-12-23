export interface IRoomHandlerListener
{
    sessionUpdate(id: number, type: string): void;
    sessionReinitialize(fromRoomId: number, toRoomId: number): void;
}