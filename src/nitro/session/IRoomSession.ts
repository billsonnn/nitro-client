import { IDisposable } from '../../core/common/disposable/IDisposable';
import { IConnection } from '../../core/communication/connections/IConnection';
import { RoomModerationParser } from '../communication/messages/parser/room/data/RoomModerationParser';
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
    sendDanceMessage(danceId: number): void;
    pickupPet(id: number): void;
    pickupBot(id: number): void;
    connection: IConnection;
    userDataManager: UserDataManager;
    roomId: number;
    state: string;
    tradeMode: number;
    doorMode: number;
    allowPets: boolean;
    controllerLevel: number;
    ownerUserRoomId: number;
    isGuildRoom: boolean;
    isRoomOwner: boolean;
    isDecorating: boolean;
    isSpectator: boolean;
    moderationSettings: RoomModerationParser;
}