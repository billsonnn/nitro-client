import React from 'react';
import { Nitro } from '../../../../nitro/Nitro';

export function RoomView(): JSX.Element
{
    const [ clientRef ] = React.useState(React.createRef<HTMLDivElement>());

    React.useEffect(() =>
    {
        Nitro.instance && clientRef && clientRef.current.append(Nitro.instance.renderer.view);
    }, [ ]);

    return (
        <div className="room-view" ref={ clientRef }></div>
    );
}