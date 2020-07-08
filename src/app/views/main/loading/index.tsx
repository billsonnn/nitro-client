import React, { useEffect } from 'react';

export interface LoadingOptions
{
    message: string;
    percentage: number;
    hideProgress: boolean;
}

export function LoadingView(props: { loadingOptions: LoadingOptions }): JSX.Element
{
    const [ message, setMessage ]           = React.useState('');
    const [ percentage, setPercentage ]     = React.useState(0);
    const [ hideProgress, setHideProgress ] = React.useState(false);

    useEffect(() =>
    {
        const loadingOptions = props.loadingOptions;

        setMessage(loadingOptions.message);
        setPercentage(loadingOptions.percentage);
        setHideProgress(loadingOptions.hideProgress);
    }, [ props.loadingOptions ]);

    return (
        <div className="loading-view">
            <div className="splash">
                <div className="photo" />
                <div className="frame" />
            </div>
            { message && message.length && <div className="text">{ message }</div> }
            { !hideProgress &&
                <div>
                    <div className="loading-progress">
                        <div className="bar" style={{ width: (percentage || 0) + '%' }}></div>
                    </div>
                    <div className="percent">{ percentage || 0 }%</div>
                </div>
            }
        </div>
    );
}