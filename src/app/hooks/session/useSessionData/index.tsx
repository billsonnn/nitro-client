import React from 'react';
import { UserFigureEvent } from '../../../../nitro/communication/messages/incoming/user/data/UserFigureEvent';
import { UserInfoEvent } from '../../../../nitro/communication/messages/incoming/user/data/UserInfoEvent';
import { useCommunicationMessageEvent } from '../../communication/useCommunicationMessageEvent';

export interface SessionData
{
    userId: number;
    userName: string;
    userFigure: string;
    userGender: string;
}

export function useSessionData(): SessionData
{
    const [ sessionData, setSessionData ]   = React.useState<SessionData>({ userId: 0, userName: '', userFigure: '', userGender: '' });

    const figureHandler = React.useCallback((event: UserFigureEvent) =>
    {
        const parser = event.getParser();

        if(parser)
        {
            setSessionData({
                userId: sessionData.userId,
                userName: sessionData.userName,
                userFigure: parser.figure,
                userGender: parser.gender
            });
        }
    }, [ ]);

    const userInfoHandler = React.useCallback((event: UserInfoEvent) =>
    {
        const parser = event.getParser();

        if(parser)
        {
            setSessionData({
                userId: parser.userInfo.userId,
                userName: parser.userInfo.username,
                userFigure: parser.userInfo.figure,
                userGender: parser.userInfo.gender
            });
        }
    }, [ ]);

    useCommunicationMessageEvent(new UserFigureEvent(figureHandler));
    useCommunicationMessageEvent(new UserInfoEvent(userInfoHandler));

    return sessionData;
}