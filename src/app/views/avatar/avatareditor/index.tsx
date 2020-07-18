import React from 'react';
import { NitroEvent } from '../../../../core/events/NitroEvent';
import { AvatarRenderEvent } from '../../../../nitro/avatar/events/AvatarRenderEvent';
import { Nitro } from '../../../../nitro/Nitro';
import { useAvatarEvent } from '../../../hooks/nitro/useAvatarEvent';
import { AvatarEditorBodyView } from './body';
import { AvatarEditorHeadView } from './head';
import { AvatarEditorLegView } from './legs';
import { AvatarEditorPreview } from './preview';
import { AvatarEditorTorsoView } from './torso';

export interface AvatarEditorProps
{
    figure: string;
    gender: string;
}

export interface FigureBuilderSet
{
    id: string;
    color1: string;
    color2: string;
}

export class FigureBuilder {
    private _parts: Map<string,FigureBuilderSet>;

    constructor(figureString: string = null) {
        this._parts = new Map();

        if(figureString && figureString !== '') this.setFigure(figureString);
    }

    public setFigure(figureString: string): void
    {
        let splits = figureString.split(".");

        for(let index in splits) {
            let partset = splits[index];
            let bits = partset.split("-");
            let o:FigureBuilderSet = {id: null, color1: null, color2: null};

            if(bits[1]) {
                o.id = bits[1];
            }

            if(bits[2]) {
                o.color1 = bits[2];
            }

            if(bits[3]) {
                o.color2 = bits[3];
            }

            this._parts.set(bits[0], o);
        }
    }

    public update(settype:string, update:FigureBuilderSet) {
        if(update.id && update.id == "-1") {
            this._parts.delete(settype);
        }
        else {
            if(this._parts.has(settype)) {
                let part = this._parts.get(settype);
                part.id = update.id ? update.id : part.id;
                part.color1 = update.color1 ? update.color1 : part.color1;
                part.color2 = update.color2 ? update.color2 : part.color2;
                this._parts.set(settype, part);
            }
            else {
                this._parts.set(settype, update);
            }
        }

        console.log(this._parts);
    }

    public getFigure():string
    {
        let bits:string[] = [];

        this._parts.forEach((value, key, map) => { 
            let j = []; 
            j.push(key); 
            
            if(value.id) { j.push(value.id); }
            if(value.color1) { j.push(value.color1); }
            if(value.color2) { j.push(value.color2); }
            bits.push(j.join("-"));
        });

        return bits.join(".");
    }
}

export function AvatarEditor(props: AvatarEditorProps): JSX.Element
{
    const [ figure, setFigure ]                         = React.useState('');
    const [ gender, setGender ]                         = React.useState('M');
    const [ setType, setSetType ]                       = React.useState('hd');
    const [ avatarRenderReady, setAvatarRenderReady ]   = React.useState(false);

    const figureBuilder = new FigureBuilder();

    const setGenderHandler = (gender: string) =>
    {
        gender = (gender === 'M' ? 'M' : 'F');

        setGender(gender);
    };
    
    const setPartSetHandler = (partset: string, update: FigureBuilderSet) =>
    {
        figureBuilder.setFigure(figure);
        figureBuilder.update(partset, update);
        setFigure(figureBuilder.getFigure());
    };

    const onAvatarRenderEvent = (event: NitroEvent) =>
    {
        if(event.type === AvatarRenderEvent.AVATAR_RENDER_READY) setAvatarRenderReady(true);
    }

    const categories = [
        {
            name: 'Face & Body',
            setType: 'hd',
            view: <AvatarEditorBodyView key={ 'hd' } gender={ gender } setGenderHandler={ setGenderHandler } setPartSetHandler={setPartSetHandler}  />
        },
        {
            name: 'Head',
            setType: 'hr',
            view: <AvatarEditorHeadView key={ 'hr' } gender={ gender } setPartSetHandler={setPartSetHandler} />
        },
        {
            name: 'Torso',
            setType: 'ch',
            view: <AvatarEditorTorsoView key={ 'ch' } gender={ gender } setPartSetHandler={setPartSetHandler} />
        },
        {
            name: 'Legs',
            setType: 'lg',
            view: <AvatarEditorLegView key={ 'lg' } gender={ gender } setPartSetHandler={setPartSetHandler} />
        }
    ];

    React.useEffect(() =>
    {
        if((props.figure !== '') && (props.figure !== figure))
        {
            figureBuilder.setFigure(props.figure);
            setFigure(figureBuilder.getFigure());
        }
    }, [ props.figure ]);

    React.useEffect(() =>
    {
        if(Nitro.instance.avatar.isReady) setAvatarRenderReady(true);
    }, []);

    useAvatarEvent(AvatarRenderEvent.AVATAR_RENDER_READY, onAvatarRenderEvent);

    return (
        <div className="nitro-component avatareditor-view">
            { avatarRenderReady && <div className="component-body">
                <div className="body-left">
                    <div className="component-header">
                        <div className="header-title">Change Looks</div>
                    </div>
                    <div className="left-content">
                        <div className="view-categories">
                            {categories.map((value, index) => {
                                return <button type="button" className={ "btn btn-destiny" + (setType === value.setType ? ' active' : '') } key={ index } onClick={ event => setSetType(value.setType) }>{ value.name }</button>
                            })}
                        </div>
                        { categories.map((value, index) => {
                        return (setType === value.setType) && value.view
                        })}
                    </div>
                </div>
                <div className="body-right">
                    <AvatarEditorPreview figure={ figure } gender={ gender } />
                </div>
            </div> }
        </div>
    );
}