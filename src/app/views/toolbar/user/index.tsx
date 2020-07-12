import React from 'react';
import { AvatarSetType } from '../../../../nitro/avatar/enum/AvatarSetType';
import { SessionData } from '../../../hooks/session/useSessionData';
import { AvatarImage } from '../../avatar/avatarimage';

export function ToolbarUserView(props: { sessionData: SessionData }): JSX.Element
{
    const [ figure, setFigure ] = React.useState('');

    React.useEffect(() =>
    {
        const sessionData = props.sessionData;

        if(sessionData)
        {
            setFigure(sessionData.userFigure);
        }
    }, [ props ]);

    return (
        <AvatarImage figure={ figure } setType={ AvatarSetType.HEAD } direction={ 2 } />
    );
}