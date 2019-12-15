import { IDisposeable } from '../common/disposable/IDisposable';

export interface IEventDispatcher extends IDisposeable
{
    addEventListener(type: string, callback: Function): void
    removeEventListener(type: string, callback: Function): void;
    dispatchEvent(event: Event): boolean;
}