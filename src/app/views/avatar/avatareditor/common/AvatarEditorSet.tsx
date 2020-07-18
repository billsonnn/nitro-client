import React from 'react';
import { FigureBuilderSet } from '..';
import { AvatarFigureContainer } from '../../../../../nitro/avatar/AvatarFigureContainer';
import { IFigurePartSet } from '../../../../../nitro/avatar/structure/figure/IFigurePartSet';
import { Nitro } from '../../../../../nitro/Nitro';
import { AvatarEditorPartSet } from './AvatarEditorPartSet';

export interface AvatarEditorSetProps
{
    setName: string;
    gender: string;
    setPartSetHandler: (partset: string, update: FigureBuilderSet) => void;
}

export function AvatarEditorSet(props: AvatarEditorSetProps): JSX.Element
{
    const [ partSets, setPartSets ] = React.useState<{ set: IFigurePartSet, figureContainer: AvatarFigureContainer, loaded: boolean }[]>([]);

    React.useEffect(() =>
    {
        const setName   = props.setName;
        const gender    = props.gender;

        if(!setName || !gender) return;

        const setType = Nitro.instance.avatar.structure.figureData._Str_740(setName);

        if(!setType) return;
        
        const sets = setType._Str_710;
        const partSets: { set: IFigurePartSet, figureContainer: AvatarFigureContainer, loaded: boolean }[] = [];

        for(let set of sets.values())
        {
            if(!set || ((set.gender !== gender) && (set.gender !== 'U')) || !set._Str_608) continue;

            let addItem = true;

            if(set._Str_651)
            {
                // check if owns item
                addItem = false;
            }

            if(!addItem) continue;

            let loaded = false;

            const figureContainer = new AvatarFigureContainer((set.type + '-' + set.id));

            if(Nitro.instance.avatar.downloadManager.isAvatarFigureContainerReady(figureContainer)) loaded = true;

            partSets.push({ set, figureContainer, loaded });
        }

        partSets.sort(sortParts);

        setPartSets(partSets);

        window.scrollTo(0, 0);

    }, [ props.setName, props.gender ]);

    const sortParts = (k: { set: IFigurePartSet, figureContainer: AvatarFigureContainer, loaded: boolean }, _arg_2: { set: IFigurePartSet, figureContainer: AvatarFigureContainer, loaded: boolean }) =>
    {
        var _local_3 = (!k.set ? 9999999999 : k.set.clubLevel);
        var _local_4 = (!_arg_2.set ? 9999999999 : _arg_2.set.clubLevel);
        var _local_5 = (!k.set ? false : k.set._Str_651);
        var _local_6 = (!_arg_2 ? false : _arg_2.set._Str_651);

        if(_local_5 && !_local_6) return 1;

        if(_local_6 && !_local_5) return -1;

        if(_local_3 > _local_4) return -1;

        if(_local_3 < _local_4) return 1;

        if(k.set.id > _arg_2.set.id) return -1;

        if(k.set.id < _arg_2.set.id) return 1;

        return 0;
    }

    const onClearClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
    {
        props.setPartSetHandler(props.setName, {id: '-1', color1: null, color2: null});

    }

    return (
        <div className="set-container">
            <div className="container-items">
                <div className="item-detail clear" onClick={ onClearClick } />
                {partSets.map((value, index) => {
                    return <AvatarEditorPartSet key={ value.set.id } set={ value.set } figureContainer={ value.figureContainer } loaded={ value.loaded } setPartSetHandler={props.setPartSetHandler} />
                })}
            </div>
        </div>
    );
}