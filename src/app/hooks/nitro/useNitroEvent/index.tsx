import React from 'react';
import { IEventDispatcher } from '../../../../core/events/IEventDispatcher';
import { NitroEvent } from '../../../../core/events/NitroEvent';

export function useNitroEvent(type: string, eventDispatcher: IEventDispatcher, handler: (event: NitroEvent) => void): void
{
    const handlerRef = React.useRef<(event: NitroEvent) => void>();

    React.useEffect(() =>
    {
        handlerRef.current = handler;
    }, [ handler ]);

    React.useEffect(() =>
    {
        const eventListener = (event: NitroEvent) => handlerRef.current(event);

        eventDispatcher.addEventListener(type, eventListener);

        return () =>
        {
            eventDispatcher.removeEventListener(type, eventListener);
        }
    }, [ type, eventDispatcher ]);
}