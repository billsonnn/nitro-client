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
    const [ isDownloading, setIsDownloading ]       = React.useState(false);
    const [ isConnecting, setIsConnecting ]         = React.useState(false);
    const [ isConnected, setIsConnected ]           = React.useState(false);
    const [ isHandshaking, setIsHandshaking ]       = React.useState(false);
    const [ isHandshaked, setIsHandshaked ]         = React.useState(false);
    const [ isAuthenticated, setIsAuthenticated ]   = React.useState(false);
    const [ isError, setIsError ]                   = React.useState(false);
    const [ isClosed, setIsClosed ]                 = React.useState(false);

    const [ loadingOptions, setLoadingOptions ]     = React.useState<LoadingOptions>({ message: '', percentage: 0, hideProgress: false });

    if(!Nitro.instance)
    {
        Nitro.bootstrap({
            configurationUrl: '',
            sso: (new URLSearchParams(window.location.search).get('sso') || null)
        });

        setIsDownloading(true);

        Nitro.instance.core.asset.downloadAssets(NitroConfiguration.PRELOAD_ASSETS, (status: boolean) =>
        {
            setIsDownloading(false);
            setLoadingOptions({ message: 'Assets Loaded', percentage: 20, hideProgress: false });

            Nitro.instance.init();
        });
    }

    const handler = React.useCallback((event: NitroEvent) =>
    {
        switch(event.type)
        {
            case NitroCommunicationDemoEvent.CONNECTION_ESTABLISHED:
                setIsConnecting(false);
                setIsConnected(true);
                setLoadingOptions({ message: 'Connected', percentage: 40, hideProgress: false });
				break;
			case NitroCommunicationDemoEvent.CONNECTION_HANDSHAKING:
                setIsHandshaked(false);
                setIsHandshaking(true);
                setLoadingOptions({ message: 'Handshaking', percentage: 60, hideProgress: false });
				break
			case NitroCommunicationDemoEvent.CONNECTION_HANDSHAKED:
                setIsHandshaking(false);
                setIsHandshaked(true);
                setLoadingOptions({ message: 'Handshaked', percentage: 80, hideProgress: false });
				break;
			case NitroCommunicationDemoEvent.CONNECTION_HANDSHAKE_FAILED:
                setIsHandshaking(false);
                setIsHandshaked(false);
                setIsError(true);
                setLoadingOptions({ message: 'Handshake Failed', percentage: 0, hideProgress: true });
				break;
			case NitroCommunicationDemoEvent.CONNECTION_AUTHENTICATED:
                setIsAuthenticated(true);
                setLoadingOptions({ message: 'Authenticated', percentage: 100, hideProgress: false });
				break;
			case NitroCommunicationDemoEvent.CONNECTION_ERROR:
                setIsError(true);
                setLoadingOptions({ message: 'Connection Error', percentage: 0, hideProgress: true });
				break;
			case NitroCommunicationDemoEvent.CONNECTION_CLOSED:
                setIsClosed(true);
                setLoadingOptions({ message: 'Connection Closed', percentage: 0, hideProgress: true });
				break;
        }
    }, [ setIsConnecting, setIsConnected, setIsHandshaking, setIsHandshaked, setIsAuthenticated, setIsError, setIsClosed ]);

    useMainEvent(NitroCommunicationDemoEvent.CONNECTION_ESTABLISHED, handler);
    useMainEvent(NitroCommunicationDemoEvent.CONNECTION_HANDSHAKING, handler);
    useMainEvent(NitroCommunicationDemoEvent.CONNECTION_HANDSHAKED, handler);
    useMainEvent(NitroCommunicationDemoEvent.CONNECTION_HANDSHAKE_FAILED, handler);
    useMainEvent(NitroCommunicationDemoEvent.CONNECTION_AUTHENTICATED, handler);
    useMainEvent(NitroCommunicationDemoEvent.CONNECTION_ERROR, handler);
    useMainEvent(NitroCommunicationDemoEvent.CONNECTION_CLOSED, handler);

    return (
        <div className="main-view">
            { (isAuthenticated && !isError && !isClosed) ? <DesktopView /> : <LoadingView loadingOptions={ loadingOptions } /> }
        </div>
    );
}