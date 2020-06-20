import { IDisposable } from '../../core/common/disposable/IDisposable';
import { IConnection } from '../../core/communication/connections/IConnection';
import { UserDataManager } from './UserDataManager';

export interface IRoomSession extends IDisposable
{
    setConnection(connection: IConnection): void;
    setControllerLevel(level: number): void;
    setOwnUserRoomId(userId: number): void;
    setRoomOwner(): void;
    start(): boolean;
    reset(roomId: number): void;
    sendChatMessage(text: string, styleId: number): void;
    sendShoutMessage(text: string, styleId: number): void;
    sendWhisperMessage(recipientName: string, text: string, styleId: number): void;
    sendChatTypingMessage(isTyping: boolean): void;
    pickupPet(id: number): void;
    pickupBot(id: number): void;
    connection: IConnection;
    roomId: number;
    state: string;
    userDataManager: UserDataManager;
    controllerLevel: number;
    ownerUserRoomId: number
    roomOwner: boolean;
    isDecorating: boolean;
    isSpectator: boolean;
}