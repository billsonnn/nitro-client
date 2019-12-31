import { DownloadQueue } from '../../core/asset/download/DownloadQueue';
import { IDownloadQueue } from '../../core/asset/download/IDownloadQueue';
import { AvatarActionManager } from './actions/AvatarActionManager';
import { IActionDefinition } from './actions/interfaces/IActionDefinition';
import { IActiveActionData } from './actions/interfaces/IActiveActionData';
import { AnimationManager } from './animation/AnimationManager';
import { AvatarFigureContainer } from './AvatarFigureContainer';
import { AvatarManager } from './AvatarManager';
import { AnimationAction } from './structure/animation/AnimationAction';
import { AnimationData } from './structure/AnimationData';
import { IFigurePartSet } from './structure/figure/interfaces/IFigurePartSet';
import { IPalette } from './structure/figure/interfaces/IPalette';
import { SetType } from './structure/figure/SetType';
import { FigureSetData } from './structure/FigureSetData';
import { ActivePartSet } from './structure/parts/ActivePartSet';
import { PartDefinition } from './structure/parts/PartDefinition';
import { PartSetsData } from './structure/PartSetsData';

export class AvatarStructure
{
    private _avatarManager: AvatarManager;
    private _actionManager: AvatarActionManager;
    private _figureSetData: FigureSetData;
    private _partSetsData: PartSetsData;
    private _animationData: AnimationData;
    private _animationManager: AnimationManager;
    private _defaultAction: IActionDefinition;
    private _mandatorySetTypeIds: any;

    private _figureQueue: IDownloadQueue;
    private _isReady: boolean;

    constructor(avatarManager: AvatarManager)
    {
        if(!(avatarManager instanceof AvatarManager)) throw new Error('invalid_manager');

        this._avatarManager         = avatarManager;
        this._actionManager         = null;
        this._figureSetData         = new FigureSetData();
        this._partSetsData          = new PartSetsData();
        this._animationData         = new AnimationData();
        this._animationManager      = new AnimationManager();
        this._defaultAction         = null;
        this._mandatorySetTypeIds   = {};

        this._figureQueue           = new DownloadQueue(false);
        this._isReady               = false;
    }

    public dispose(): void
    {
        
    }

    public downloadFigure(figure: AvatarFigureContainer, cb: Function): void
    {
        if(!figure) return;

        this._figureQueue.queueObject(figure, cb);

        if(this._isReady) this._figureQueue.startDownloading();
    }

    public setAvatarActionManager(data: any): void
    {
        if(!data) return;

        this._actionManager = new AvatarActionManager(data);
        this._defaultAction = this._actionManager.getDefaultAction();

        this.setReadiness();
    }

    public getActionById(id: string): IActionDefinition
    {
        return this._actionManager.getActionById(id);
    }

    public getActionByName(name: string): IActionDefinition
    {
        return this._actionManager.getActionByName(name);
    }

    public processActions(actions: IActiveActionData[]): IActiveActionData[]
    {
        return this._actionManager.processActions(actions);
    }

    public parseFigureSetData(data: any): boolean
    {
        if(!data) return false;

        if(!this._figureSetData.parse(data)) return false;

        this.setReadiness();

        return true;
    }

    public parsePartSetsData(data: any): boolean
    {
        if(!data) return false;

        if(!this._partSetsData.parse(data)) return false;

        const rightItem = this._partSetsData.getPartDefinition('ri');

        if(rightItem) rightItem.appendToFigure = true;

        const leftItem = this._partSetsData.getPartDefinition('li');

        if(leftItem) leftItem.appendToFigure = true;

        this.setReadiness();

        return true;
    }

    public parseAnimationData(data: any): boolean
    {
        if(!data) return false;

        if(!this._animationData.parse(data)) return false;

        this.setReadiness();

        return true;
    }

    private setReadiness(): void
    {
        if(this._isReady) return;

        if(!this._actionManager || !this._actionManager.isReady || !this._figureSetData.isReady || !this._partSetsData.isReady || !this._animationData.isReady) return;

        this._isReady = true;

        this._figureQueue.startDownloading();
    }

    public getPartDefinition(type: string): PartDefinition
    {
        if(!this._partSetsData || !type) return null;

        return this._partSetsData.getPartDefinition(type);
    }

    public getSet(type: string): SetType
    {
        if(!this._figureSetData || !type) return null;

        return this._figureSetData.getSet(type);
    }

    public getPalette(id: string): IPalette
    {
        if(!this._figureSetData || !id) return null;

        return this._figureSetData.getPalette(id);
    }

    public getActivePartSet(id: string): ActivePartSet
    {
        if(!this._partSetsData || !id) return null;

        return this._partSetsData.getActivePartSet(id);
    }

    public getFigurePartSet(type: string, id: string): IFigurePartSet
    {
        if(!this._figureSetData || !type || !id) return null;

        return this._figureSetData.getFigurePartSet(type, id);
    }

    public getAnimation(id: string): AnimationAction
    {
        if(!this._animationData || !id) return null;

        return this._animationData.getAnimation(id);
    }

    public get avatarManager(): AvatarManager
    {
        return this._avatarManager;
    }

    public get figureSetData()
    {
        return this._figureSetData;
    }

    public get isReady(): boolean
    {
        return this._isReady;
    }
}