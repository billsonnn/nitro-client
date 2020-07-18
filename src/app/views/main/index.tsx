import React from 'react';
import { NitroEvent } from '../../../core/events/NitroEvent';
import { NitroCommunicationDemoEvent } from '../../../nitro/communication/demo/NitroCommunicationDemoEvent';
import { Nitro } from '../../../nitro/Nitro';
import { NitroConfiguration } from '../../../NitroConfiguration';
import { useMainEvent } from '../../hooks/nitro/useMainEvent';
import { DesktopView } from '../desktop';
import { LoadingOptions, LoadingView } from './loading';

export function MainView(): JSX.Element
{
    const [ isReady, setIsReady ]               = React.useState(false);
    const [ isError, setIsError ]               = React.useState(false);
    const [ loadingOptions, setLoadingOptions ] = React.useState<LoadingOptions>({ message: '', percentage: 0, hideProgress: false });

    if(!Nitro.instance)
    {
        Nitro.bootstrap({
            configurationUrl: '',
            sso: (new URLSearchParams(window.location.search).get('sso') || null)
        });

        setLoadingOptions({ message: 'Downloading Assets', percentage: 0, hideProgress: false });

        Nitro.instance.core.asset.downloadAssets(NitroConfiguration.PRELOAD_ASSETS, (status: boolean) =>
        {
            setLoadingOptions({ message: 'Connecting', percentage: 25, hideProgress: false });

            Nitro.instance.communication.init();
        });
    }

    const handler = React.useCallback((event: NitroEvent) =>
    {
        switch(event.type)
        {
			case NitroCommunicationDemoEvent.CONNECTION_HANDSHAKING:
                setLoadingOptions({ message: 'Handshaking', percentage: 50, hideProgress: false });
				break
			case NitroCommunicationDemoEvent.CONNECTION_HANDSHAKE_FAILED:
                setLoadingOptions({ message: 'Handshake Failed', percentage: 0, hideProgress: true });
                setIsError(true);
				break;
			case NitroCommunicationDemoEvent.CONNECTION_AUTHENTICATED:
                setLoadingOptions({ message: 'Preparing Nitro', percentage: 75, hideProgress: false });
                Nitro.instance.init();
				break;
			case NitroCommunicationDemoEvent.CONNECTION_ERROR:
                setLoadingOptions({ message: 'Connection Error', percentage: 0, hideProgress: true });
                setIsError(true);
				break;
			case NitroCommunicationDemoEvent.CONNECTION_CLOSED:
                setLoadingOptions({ message: 'Connection Closed', percentage: 0, hideProgress: true });
                setIsError(true);
                break;
            case Nitro.READY:
                setLoadingOptions({ message: 'Ready', percentage: 100, hideProgress: false });
                setIsReady(true);
                Nitro.instance.communication.connection.onReady();
                break;
        }
    }, [ ]);

    useMainEvent(NitroCommunicationDemoEvent.CONNECTION_ESTABLISHED, handler);
    useMainEvent(NitroCommunicationDemoEvent.CONNECTION_HANDSHAKING, handler);
    useMainEvent(NitroCommunicationDemoEvent.CONNECTION_HANDSHAKE_FAILED, handler);
    useMainEvent(NitroCommunicationDemoEvent.CONNECTION_AUTHENTICATED, handler);
    useMainEvent(NitroCommunicationDemoEvent.CONNECTION_ERROR, handler);
    useMainEvent(NitroCommunicationDemoEvent.CONNECTION_CLOSED, handler);
    useMainEvent(Nitro.READY, handler);

    return (
        <div className="main-view">
            { (isReady && !isError) ? <DesktopView /> : <LoadingView loadingOptions={ loadingOptions } /> }
        </div>
    );
}