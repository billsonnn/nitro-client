import React, { useEffect } from 'react';
import { Nitro } from '../../../../nitro/Nitro';

export function RoomView(): JSX.Element
{
    const [ clientRef ] = React.useState(React.createRef<HTMLDivElement>());

    useEffect(() =>
    {
        Nitro.instance && clientRef && clientRef.current.append(Nitro.instance.renderer.view);
    }, [ clientRef ]);

    return (
        <div className="room-view" ref={ clientRef }></div>
    );
}