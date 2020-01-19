import { IRoomObjectSpriteVisualization } from '../../../../room/object/visualization/IRoomObjectSpriteVisualization';
import { IObjectVisualizationData } from '../../../../room/object/visualization/IRoomObjectVisualizationData';
import { IRoomObjectVisualizationFactory } from '../../../../room/object/visualization/IRoomObjectVisualizationFactory';
import { RoomObjectSpriteVisualization } from '../../../../room/object/visualization/RoomObjectSpriteVisualization';
import { AvatarVisualization } from './avatar/AvatarVisualization';
import { AvatarVisualizationData } from './avatar/AvatarVisualizationData';
import { FurnitureAnimatedVisualization } from './furniture/FurnitureAnimatedVisualization';
import { FurnitureAnimatedVisualizationData } from './furniture/FurnitureAnimatedVisualizationData';
import { FurnitureBadgeDisplayVisualization } from './furniture/FurnitureBadgeDisplayVisualization';
import { FurnitureBBVisualization } from './furniture/FurnitureBBVisualization';
import { FurnitureBottleVisualization } from './furniture/FurnitureBottleVisualization';
import { FurnitureCounterClockVisualization } from './furniture/FurnitureCounterClockVisualization';
import { FurnitureFireworksVisualization } from './furniture/FurnitureFireworksVisualization';
import { FurnitureGuildCustomizedVisualization } from './furniture/FurnitureGuildCustomizedVisualization';
import { FurnitureHabboWheelVisualization } from './furniture/FurnitureHabboWheelVisualization';
import { FurniturePosterVisualization } from './furniture/FurniturePosterVisualization';
import { FurnitureQueueTileVisualization } from './furniture/FurnitureQueueTileVisualization';
import { FurnitureResettingAnimatedVisualization } from './furniture/FurnitureResettingAnimatedVisualization';
import { FurnitureRoomBackgroundVisualization } from './furniture/FurnitureRoomBackgroundVisualization';
import { FurnitureScoreBoardVisualization } from './furniture/FurnitureScoreBoardVisualization';
import { FurnitureSoundBlockVisualization } from './furniture/FurnitureSoundBlockVisualization';
import { FurnitureVisualization } from './furniture/FurnitureVisualization';
import { FurnitureVisualizationData } from './furniture/FurnitureVisualizationData';
import { FurnitureVoteCounterVisualization } from './furniture/FurnitureVoteCounterVisualization';
import { FurnitureVoteMajorityVisualization } from './furniture/FurnitureVoteMajorityVisualization';
import { FurnitureWaterAreaVisualization } from './furniture/FurnitureWaterAreaVisualization';
import { ObjectVisualizationType } from './ObjectVisualizationType';
import { PetVisualization } from './pet/PetVisualization';
import { PetVisualizationData } from './pet/PetVisualizationData';
import { RoomVisualization } from './room/RoomVisualization';
import { RoomVisualizationData } from './room/RoomVisualizationData';
import { TileCursorVisualization } from './room/TileCursorVisualization';

export class ObjectVisualizationFactory implements IRoomObjectVisualizationFactory
{
    private _visualizationDatas: Map<string, IObjectVisualizationData>;

    constructor()
    {
        this._visualizationDatas = new Map();
    }

    public getVisualization(type: string): IRoomObjectSpriteVisualization
    {
        const visualization = this.getVisualizationType(type);

        if(!visualization) return null;

        return new visualization();
    }

    public getVisualizationType(type: string): typeof RoomObjectSpriteVisualization
    {
        if(!type) return null;

        let visualization: typeof RoomObjectSpriteVisualization = null;

        switch(type)
        {
            case ObjectVisualizationType.ROOM:
                visualization = RoomVisualization;
                break;
            case ObjectVisualizationType.TILE_CURSOR:
                visualization = TileCursorVisualization;
                break;
            case ObjectVisualizationType.USER:
            case ObjectVisualizationType.BOT:
            case ObjectVisualizationType.RENTABLE_BOT:
                visualization = AvatarVisualization;
                break;
            case ObjectVisualizationType.PET_ANIMATED:
                visualization = PetVisualization;
                break;
            case ObjectVisualizationType.FURNITURE_STATIC:
                visualization = FurnitureVisualization;
                break;
            case ObjectVisualizationType.FURNITURE_ANIMATED:
                visualization = FurnitureAnimatedVisualization;
                break;
            case ObjectVisualizationType.FURNITURE_RESETTING_ANIMATED:
                visualization = FurnitureResettingAnimatedVisualization;
                break;
            case ObjectVisualizationType.FURNITURE_BG:
                visualization = FurnitureRoomBackgroundVisualization;
                break;
            case ObjectVisualizationType.FURNITURE_BADGE_DISPLAY:
                visualization = FurnitureBadgeDisplayVisualization;
                break;
            case ObjectVisualizationType.FURNITURE_BB:
                visualization = FurnitureBBVisualization;
                break;
            case ObjectVisualizationType.FURNITURE_BOTTLE:
                visualization = FurnitureBottleVisualization;
                break;
            case ObjectVisualizationType.FURNITURE_COUNTER_CLOCK:
                visualization = FurnitureCounterClockVisualization;
                break;
            case ObjectVisualizationType.FURNITURE_FIREWORKS:
                visualization = FurnitureFireworksVisualization;
                break;
            case ObjectVisualizationType.FURNITURE_GUILD_CUSTOMIZED:
                visualization = FurnitureGuildCustomizedVisualization;
                break;
            case ObjectVisualizationType.FURNITURE_HABBOWHEEL:
                visualization = FurnitureHabboWheelVisualization;
                break;
            case ObjectVisualizationType.FURNITURE_POSTER:
                visualization = FurniturePosterVisualization;
                break;
            case ObjectVisualizationType.FURNITURE_QUEUE_TILE:
                visualization = FurnitureQueueTileVisualization;
                break;
            case ObjectVisualizationType.FURNITURE_SCORE_BOARD:
                visualization = FurnitureScoreBoardVisualization;
                break;
            case ObjectVisualizationType.FURNITURE_SOUNDBLOCK:
                visualization = FurnitureSoundBlockVisualization;
                break;
            case ObjectVisualizationType.FURNITURE_VOTE_COUNTER:
                visualization = FurnitureVoteCounterVisualization;
                break;
            case ObjectVisualizationType.FURNITURE_VOTE_MAJORITY:
                visualization = FurnitureVoteMajorityVisualization;
                break;
            case ObjectVisualizationType.FURNITURE_WATER_AREA:
                visualization = FurnitureWaterAreaVisualization;
                break;
        }

        if(!visualization)
        {
            console.log(`Invalid Visualization: ${ type }`);

            return null;
        }

        return visualization;
    }

    public getVisualizationData(type: string, visualizationType: string, ...args: any[]): IObjectVisualizationData
    {
        const existing = this._visualizationDatas.get(type);

        if(existing) return existing;

        let visualizationData: IObjectVisualizationData = null;

        let save = true;

        switch(visualizationType)
        {
            case ObjectVisualizationType.FURNITURE_STATIC:
            case ObjectVisualizationType.FURNITURE_GIFT_WRAPPED:
            case ObjectVisualizationType.FURNITURE_BB:
            case ObjectVisualizationType.FURNITURE_BG:
            case ObjectVisualizationType.FURNITURE_STICKIE:
            case ObjectVisualizationType.FURNITURE_BUILDER_PLACEHOLDER:
                visualizationData = new FurnitureVisualizationData();
                break;
            case ObjectVisualizationType.FURNITURE_ANIMATED:
            case ObjectVisualizationType.FURNITURE_RESETTING_ANIMATED:
            case ObjectVisualizationType.FURNITURE_POSTER:
            case ObjectVisualizationType.FURNITURE_HABBOWHEEL:
            case ObjectVisualizationType.FURNITURE_VAL_RANDOMIZER:
            case ObjectVisualizationType.FURNITURE_BOTTLE:
            case ObjectVisualizationType.FURNITURE_PLANET_SYSTEM:
            case ObjectVisualizationType.FURNITURE_QUEUE_TILE:
            case ObjectVisualizationType.FURNITURE_PARTY_BEAMER:
            case ObjectVisualizationType.FURNITURE_COUNTER_CLOCK:
            case ObjectVisualizationType.FURNITURE_WATER_AREA:
            case ObjectVisualizationType.FURNITURE_SCORE_BOARD:
            case ObjectVisualizationType.FURNITURE_FIREWORKS:
            case ObjectVisualizationType.FURNITURE_GIFT_WRAPPED_FIREWORKS:
            case ObjectVisualizationType.FURNITURE_GUILD_CUSTOMIZED:
            case ObjectVisualizationType.FURNITURE_GUILD_ISOMETRIC_BADGE:
            case ObjectVisualizationType.FURNITURE_VOTE_COUNTER:
            case ObjectVisualizationType.FURNITURE_VOTE_MAJORITY:
            case ObjectVisualizationType.FURNITURE_SOUNDBLOCK:
            case ObjectVisualizationType.FURNITURE_BADGE_DISPLAY:
            case ObjectVisualizationType.FURNITURE_EXTERNAL_IMAGE:
            case ObjectVisualizationType.FURNITURE_YOUTUBE:
            case ObjectVisualizationType.TILE_CURSOR:
                visualizationData = new FurnitureAnimatedVisualizationData();
                break;
            case ObjectVisualizationType.FURNITURE_MANNEQUIN:
                //_local_5 = FurnitureMannequinVisualizationData;
                break;
            case ObjectVisualizationType.ROOM:
                visualizationData   = new RoomVisualizationData();
                save                = false;
                break;
            case ObjectVisualizationType.USER:
            case ObjectVisualizationType.BOT:
            case ObjectVisualizationType.RENTABLE_BOT:
                visualizationData = new AvatarVisualizationData();
                break;
            case ObjectVisualizationType.PET_ANIMATED:
                visualizationData = new PetVisualizationData();
                break;
        }

        if(!visualizationData) return null;

        if(!visualizationData.initialize(...args))
        {
            visualizationData.dispose();

            return null;
        }

        if(save) this._visualizationDatas.set(type, visualizationData);

        return visualizationData;
    }
}