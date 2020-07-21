import React from 'react';
import { IMessageEvent } from '../../../../core/communication/messages/IMessageEvent';
import { Nitro } from '../../../../nitro/Nitro';

export function useCommunicationMessageEvent(event: IMessageEvent): void
{
    const handlerRef = React.useRef<IMessageEvent>();

    React.useEffect(() =>
    {
        handlerRef.current = event;

        Nitro.instance.communication.registerMessageEvent(handlerRef.current);

        return () =>
        {
            Nitro.instance.communication.removeMessageEvent(handlerRef.current);
        }
    }, [ ]);
}