import React from 'react';
import { AvatarFigureContainer } from '../../../../../nitro/avatar/AvatarFigureContainer';
import { IAvatarImageListener } from '../../../../../nitro/avatar/IAvatarImageListener';
import { IFigurePartSet } from '../../../../../nitro/avatar/structure/figure/IFigurePartSet';
import { Nitro } from '../../../../../nitro/Nitro';
import { AvatarEditorSetPart } from './AvatarEditorSetPart';
import { FigureBuilderSet } from '..';

export interface AvatarEditorPartSetProps
{
    set: IFigurePartSet;
    figureContainer: AvatarFigureContainer;
    loaded: boolean;
    setPartSetHandler: (partset: string, update: FigureBuilderSet) => void;
}

export function AvatarEditorPartSet(props: AvatarEditorPartSetProps): JSX.Element
{
    const [ isLoaded, setIsLoaded ] = React.useState(props.loaded);

    React.useEffect(() =>
    {
        const set = props.set;

        if(!props.loaded)
        {
            if(props.figureContainer)
            {
                const listener: IAvatarImageListener = {
                    resetFigure: (figure: string) => setIsLoaded(true),
                    dispose: null,
                    disposed: false
                };

                Nitro.instance.avatar.downloadAvatarFigure(props.figureContainer, listener);
            }
        }

    }, [ props.set, props.loaded ]);

    function clickMe() {
        props.setPartSetHandler(props.set.type, {id: props.set.id.toString(), color1: null, color2: null});
        //alert("click " + props.set.id);
    }

    return (
        <AvatarEditorSetPart partSet={ props.set } isLoaded={ isLoaded } onClick={clickMe} />
    );
}