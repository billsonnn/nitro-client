import { IDisposable } from '../../core/common/disposable/IDisposable';
import { IRoomSession } from '../session/IRoomSession';
import { IRoomDesktop } from './IRoomDesktop';

export interface IRoomUI extends IDisposable
{
    createDesktopForSession(session: IRoomSession): IRoomDesktop;
    getDesktop(roomId: string): IRoomDesktop;
    _Str_17538(roomId: number): number;
}