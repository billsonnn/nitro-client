import { IDisposable } from '../common/disposable/IDisposable';

export interface IEventDispatcher extends IDisposable
{
    addEventListener(type: string, callback: Function): void
    removeEventListener(type: string, callback: Function): void;
    dispatchEvent(event: Event): boolean;
}