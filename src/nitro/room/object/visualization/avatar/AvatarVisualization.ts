import { NitroConfiguration } from '../../../../../NitroConfiguration';
import { IRoomObjectSprite } from '../../../../../room/object/visualization/IRoomObjectSprite';
import { IObjectVisualizationData } from '../../../../../room/object/visualization/IRoomObjectVisualizationData';
import { PlayableVisualization } from '../../../../../room/object/visualization/PlayableVisualization';
import { RoomObjectSpriteVisualization } from '../../../../../room/object/visualization/RoomObjectSpriteVisualization';
import { Direction } from '../../../../../room/utils/Direction';
import { AvatarAction } from '../../../../avatar/actions/AvatarAction';
import { AvatarImage } from '../../../../avatar/AvatarImage';
import { AnimationAction } from '../../../../avatar/structure/animation/AnimationAction';
import { AvatarBodyPart } from '../../../../avatar/structure/AvatarBodyPart';
import { NitroInstance } from '../../../../NitroInstance';
import { RoomObjectModelKey } from '../../RoomObjectModelKey';
import { ExpressionAdditionFactory } from './additions/ExpressionAdditionFactory';
import { FloatingIdleZ } from './additions/FloatingIdleZ';
import { IAvatarAddition } from './additions/IAvatarAddition';
import { TypingBubble } from './additions/TypingBubble';
import { AvatarVisualizationData } from './AvatarVisualizationData';

export class AvatarVisualization extends RoomObjectSpriteVisualization
{
    private static FLOATING_IDLE_Z_ID: number   = 1;
    private static TYPING_BUBBLE_ID: number     = 2;
    private static EXPRESSION_ID: number        = 3;

    protected _data: AvatarVisualizationData;

    private _avatarImage: AvatarImage;
    private _shadow: IRoomObjectSprite;
    private _isAvatarReady: boolean;
    private _needsUpdate: boolean;

    private _figure: string;
    private _direction: number;
    private _headDirection: number;
    private _posture: string;
    private _postureParameter: string;
    private _talk: boolean;
    private _expression: number;
    private _sleep: boolean;
    private _blink: boolean;
    private _gesture: number;
    private _sign: number;
    private _dance: number;
    private _effect: number;
    private _carryObject: number;
    private _useObject: number;
    private _ownUser: boolean;

    private _additions: { [index: string]: IAvatarAddition };

    constructor()
    {
        super();

        this._data              = null;

        this._avatarImage       = null;
        this._shadow            = null;
        this._isAvatarReady     = null;
        this._needsUpdate       = false;

        this._figure            = null;
        this._direction         = -1;
        this._headDirection     = -1;
        this._posture           = '';
        this._postureParameter  = '';
        this._talk              = false;
        this._expression        = 0;
        this._sleep             = false;
        this._blink             = false;
        this._gesture           = 0;
        this._sign              = -1;
        this._dance             = 0;
        this._effect            = 0;
        this._carryObject       = 0;
        this._useObject         = 0;
        this._ownUser           = false;

        this._additions         = {};

        this._selfContained     = true;
    }

    public initialize(data: IObjectVisualizationData): boolean
    {
        if(!(data instanceof AvatarVisualizationData)) return false;
        
        this._data  = data;

        super.initialize(data);

        if(this._selfContainer) this._selfContainer.interactive = true;

        return true;
    }

    public onDispose(): void
    {
        if(this._avatarImage) this._avatarImage.dispose();

        this._shadow = null;
        
        super.onDispose();
    }

    public onUpdate(): void
    {
        const frameCount = Math.round(this.totalTimeRunning / PlayableVisualization.FPS_TIME_MS);

        if(this.frameCount === frameCount) return;

        this.frameCount = frameCount;

        super.onUpdate();

        let needsUpdate = false;

        const modelUpdated = this.updateModel();

        if(!this._avatarImage)
        {
            this._avatarImage = this._data.createAvatarImage(this._figure);

            this.sortParts();

            this._avatarImage.structure.downloadFigure(this._avatarImage.figure, () =>
            {
                this.createShadow();

                this._isAvatarReady = true;
                this._needsUpdate   = true;
            });
        }

        if(modelUpdated)
        {
            this.updateActions();

            needsUpdate = true;
        }

        this.updateObject();

        this.updateAdditions();

        if(this._isAvatarReady && (needsUpdate || this._needsUpdate))
        {
            this._needsUpdate = false;

            this.updateSprites();
        }
    }

    protected updateObject(): boolean
    {
        if(!this.object) return false;

        if(this.updateObjectCounter === this.object.updateCounter) return false;

        const position = this.object.getScreenPosition();

        if(this._selfContainer)
        {
            if(position.x !== this._selfContainer.x || position.y !== this._selfContainer.y)
            {
                const additionalZ = 4 + (this._ownUser ? .99999 : 0);

                this._selfContainer.x       = position.x - NitroConfiguration.TILE_WIDTH;
                this._selfContainer.y       = position.y;
                this._selfContainer.zIndex  = position.depth + additionalZ;
            }
        }
        
        this.setDirection(this.object.position.direction)

        this.updateObjectCounter = this.object.updateCounter;

        return true;
    }

    protected updateModel(): boolean
    {
        if(!this.object) return false;

        const model = this.object.model;

        if(!model) return false;

        if(this.updateModelCounter === model.updateCounter) return false;

        let needsUpdate = false;

        const talk = model.getValue(RoomObjectModelKey.FIGURE_TALK);

        if(talk !== this._talk)
        {
            this._talk = talk;

            needsUpdate = true;
        }

        const expression = model.getValue(RoomObjectModelKey.FIGURE_EXPRESSION);

        if(expression !== this._expression)
        {
            this._expression = expression;

            needsUpdate = true;
        }

        const sleep = model.getValue(RoomObjectModelKey.FIGURE_SLEEP) > 0;

        if(sleep !== this._sleep)
        {
            this._sleep = sleep;

            needsUpdate = true;
        }

        const blink = model.getValue(RoomObjectModelKey.FIGURE_BLINK) > 0;

        if(blink !== this._blink)
        {
            this._blink = blink;

            needsUpdate = true;
        }

        const gesture = model.getValue(RoomObjectModelKey.FIGURE_GESTURE) || 0;

        if(gesture !== this._gesture)
        {
            this._gesture = gesture;

            needsUpdate = true;
        }

        const posture = model.getValue(RoomObjectModelKey.FIGURE_POSTURE);

        if(posture !== this._posture)
        {
            this._posture = posture;

            if(this._shadow)
            {
                if(this._posture === 'lay' || this._posture === 'sit') this._shadow.visible = false;
                else this._shadow.visible = true;
            }

            this.sortParts();

            needsUpdate = true;
        }

        const postureParameter = model.getValue(RoomObjectModelKey.FIGURE_POSTURE_PARAMETER);

        if(postureParameter !== this._postureParameter)
        {
            this._postureParameter = postureParameter;

            needsUpdate = true;
        }

        const dance = model.getValue(RoomObjectModelKey.FIGURE_DANCE) || 0;

        if(dance !== this._dance)
        {
            this._dance = dance;

            needsUpdate = true;
        }

        const effect = model.getValue(RoomObjectModelKey.FIGURE_EFFECT) || 0;

        if(effect !== this._effect)
        {
            this._effect = effect;

            needsUpdate = true;
        }

        let sign = model.getValue(RoomObjectModelKey.FIGURE_SIGN) as number;

        if(sign === null) sign = -1;

        if(this._sign !== sign)
        {
            this._sign = sign;

            needsUpdate = true;
        }

        const carryObject = model.getValue(RoomObjectModelKey.FIGURE_CARRY_OBJECT) || 0;

        if(carryObject !== this._carryObject)
        {
            this._carryObject = carryObject;

            needsUpdate = true;
        }

        const useObject = model.getValue(RoomObjectModelKey.FIGURE_USE_OBJECT) || 0;

        if(useObject !== this._useObject)
        {
            this._useObject = useObject;

            needsUpdate = true;
        }

        const headDirection = model.getValue(RoomObjectModelKey.HEAD_DIRECTION);

        if(headDirection !== this._headDirection)
        {
            this._headDirection = headDirection;

            needsUpdate = true;
        }

        const ownUser = model.getValue(RoomObjectModelKey.OWN_USER) > 0;

        if(ownUser !== this._ownUser)
        {
            this._ownUser = ownUser;

            needsUpdate = true;
        }

        if((this._carryObject > 0) && (useObject > 0))
        {
            if(this._useObject !== this._carryObject)
            {
                this._useObject = this._carryObject;

                needsUpdate = true;
            }
        }
        else
        {
            if(this._useObject !== 0)
            {
                this._useObject = 0;

                needsUpdate = true;
            }
        }

        let idleAddition = this.getAddition(AvatarVisualization.FLOATING_IDLE_Z_ID);

        if(this._sleep)
        {
            if(!idleAddition) idleAddition = this.addAddition(new FloatingIdleZ(AvatarVisualization.FLOATING_IDLE_Z_ID, this));

            needsUpdate = true;
        }
        else
        {
            if(idleAddition) this.removeAddition(AvatarVisualization.FLOATING_IDLE_Z_ID);
        }

        const isTyping = model.getValue(RoomObjectModelKey.FIGURE_IS_TYPING) > 0;

        let typingAddition = this.getAddition(AvatarVisualization.TYPING_BUBBLE_ID);

        if(isTyping)
        {
            if(!typingAddition) typingAddition = this.addAddition(new TypingBubble(AvatarVisualization.TYPING_BUBBLE_ID, this));

            needsUpdate = true;
        }
        else
        {
            if(typingAddition) this.removeAddition(AvatarVisualization.TYPING_BUBBLE_ID);
        }

        let expressionAddition = this.getAddition(AvatarVisualization.EXPRESSION_ID);

        if(this._expression > 0)
        {
            if(!expressionAddition)
            {
                expressionAddition = ExpressionAdditionFactory.getExpressionAddition(AvatarVisualization.EXPRESSION_ID, this._expression, this);

                if(expressionAddition) this.addAddition(expressionAddition);
            }

            needsUpdate = true;
        }
        else
        {
            if(expressionAddition) this.removeAddition(AvatarVisualization.EXPRESSION_ID);
        }

        if(this.updateFigure(model.getValue(RoomObjectModelKey.FIGURE))) needsUpdate = true;

        this.updateModelCounter = model.updateCounter;

        return needsUpdate;
    }

    private updateAdditions(): void
    {
        for(let key in this._additions)
        {
            const addition = this._additions[key];

            if(!addition) continue;

            addition.update();

            addition.animate();
        }
    }

    protected setDirection(direction: number): void
    {
        if(direction === this._direction) return;

        this._direction = direction;

        this.sortParts();

        this._needsUpdate = true;
    }
    
    private sortParts(): void
    {
        if(!this._avatarImage) return;

        let direction = this._direction;

        if(this._posture === 'lay') direction = direction === Direction.NORTH ? Direction.SOUTH : Direction.EAST;
        
        this._avatarImage.figure.sortParts(this._posture, direction);
    }

    private createShadow(): void
    {
        if(this._shadow) return;

        const asset = NitroInstance.instance.core.asset.getAsset('hh_human_body');

        if(!asset) return;

        const assetName = this.getSpriteAssetName(asset.name, RoomObjectModelKey.STD, AvatarBodyPart.SHADOW, 1, 0, 0);
        const assetData = asset.assets[assetName];

        if(!assetData) return;

        let sprite = this.getSprite(assetName);

        if(!sprite)
        {
            sprite = this.createAndAddSprite(assetName, assetName + '.png');

            if(!sprite) return;
        }
            
        sprite.x            = -assetData.x;
        sprite.y            = -assetData.y + 1;
        sprite.alpha        = 0.2;
        sprite.visible      = true;
        sprite.doesntHide   = true;

        this._shadow = sprite;
    }

    private updateActions(): boolean
    {
        if(!this._avatarImage) return false;

        this._avatarImage.resetActions();

        this._avatarImage.appendAction(AvatarAction.POSTURE, this._posture);

        if(this._gesture > 0) this._avatarImage.appendAction(AvatarAction.GESTURE, AvatarAction.getGesture(this._gesture));
        if(this._dance > 0) this._avatarImage.appendAction(AvatarAction.DANCE, this._dance);
        if(this._sign > -1) this._avatarImage.appendAction(AvatarAction.SIGN, this._sign);
        if(this._carryObject > 0) this._avatarImage.appendAction(AvatarAction.CARRY_OBJECT, this._carryObject);
        if(this._useObject > 0) this._avatarImage.appendAction(AvatarAction.USE_OBJECT, this._useObject);
        if(this._talk) this._avatarImage.appendAction(AvatarAction.TALK);
        if(this._sleep || this._blink) this._avatarImage.appendAction(AvatarAction.SLEEP);

        if(this._expression > 0)
        {
            const expression = AvatarAction.getExpression(this._expression);

            if(expression !== '')
            {
                switch(expression)
                {
                    case AvatarAction.DANCE:
                        this._avatarImage.appendAction(AvatarAction.DANCE, 2);
                        break;
                    default:
                        this._avatarImage.appendAction(expression);
                        break;
                }
            }
        }

        if(this._effect > 0) this._avatarImage.appendAction(AvatarAction.EFFECT, this._effect);

        return this._avatarImage.updateActions();
    }

    public updateSprites(): void
    {
        this.hideSprites();
        
        if(!this._avatarImage) return;

        const parts = this._avatarImage.figure.figureParts;

        if(!parts) return;

        const totalParts = parts.length;

        if(!totalParts) return;

        const actions = this._avatarImage.validatedActions;

        if(!actions) return;

        const totalActions = actions.length;

        if(!totalActions) return;

        for(let i = 0; i < totalParts; i++)
        {
            const part = parts[i];

            if(!part) continue;

            let partId              = part.id;
            let bodyPart            = part.type;
            let direction           = AvatarBodyPart.HEAD_PARTS.indexOf(bodyPart) >= 0 ? this._headDirection : this._direction;
            let assetPartDefinition = RoomObjectModelKey.STD;
            let flipH               = false;
            let additionalX         = 0;
            let additionalY         = 0;
            let frameNumber         = 0;

            if(direction === Direction.NORTH_WEST && (bodyPart === AvatarBodyPart.FACE || bodyPart === AvatarBodyPart.EYES)) continue;

            const partDefinition = this._avatarImage.structure.getPartDefinition(bodyPart);

            if(!partDefinition) continue;

            let animation: AnimationAction = null;

            for(let j = totalActions - 1; j >= 0; j--)
            {
                const action = actions[j];

                if(!action) continue;

                const activePartSet = this._avatarImage.structure.getActivePartSet(action.definition.activePartSet);

                if(!activePartSet) continue;

                if(activePartSet.parts.indexOf(bodyPart) === -1) continue;

                if(action.definition.assetPartDefinition) assetPartDefinition = action.definition.assetPartDefinition;

                if(action.definition.preventHeadTurn && bodyPart === AvatarBodyPart.HEAD) direction = this._direction;

                animation = this._avatarImage.structure.getAnimation(action.id);

                if(animation)
                {
                    const offsets = animation.getAnimationOffset(this.frameCount, direction);

                    if(offsets)
                    {
                        for(let offset in offsets)
                        {
                            if(!offset) continue;

                            const point = offsets[offset];

                            if(!point) continue;

                            let partMatch: string[] = [];

                            if(offset === 'leftarm')         partMatch = AvatarBodyPart.LEFT_ARM_PARTS;
                            else if(offset === 'rightarm')   partMatch = AvatarBodyPart.RIGHT_ARM_PARTS;
                            else if(offset === 'torso')      partMatch = AvatarBodyPart.TORSO_PARTS;
                            else if(offset === 'head')       partMatch = AvatarBodyPart.HEAD_PARTS;

                            if(!partMatch) continue;

                            if(partMatch.indexOf(bodyPart) === -1) continue;

                            additionalX = point.x;
                            additionalY = point.y;

                            break;
                        }
                    }

                    const animationPart = animation.getPartForType(bodyPart);

                    if(animationPart)
                    {
                        const animationFrame = animationPart.getFrame(this.frameCount);
                        
                        if(animationFrame)
                        {
                            this._needsUpdate = true;
                            
                            if(animationFrame.assetPartDefinition) assetPartDefinition = animationFrame.assetPartDefinition;

                            frameNumber = animationFrame.number;
                        }
                    }
                }

                if(action.actionType === AvatarAction.POSTURE_LAY) direction = direction === Direction.NORTH ? Direction.SOUTH : Direction.EAST;

                break;
            }

            const isFlipped = direction >= Direction.SOUTH && direction <= Direction.WEST;

            if(isFlipped)
            {
                if((assetPartDefinition === 'wav' && (bodyPart === AvatarBodyPart.LEFT_HAND || bodyPart === AvatarBodyPart.LEFT_SLEEVE || bodyPart === AvatarBodyPart.LEFT_COAT_SLEEVE)) || (assetPartDefinition === 'drk' && (bodyPart === AvatarBodyPart.RIGHT_HAND || bodyPart === AvatarBodyPart.RIGHT_SLEEVE || bodyPart === AvatarBodyPart.RIGHT_COAT_SLEEVE)) || (assetPartDefinition === 'blw' && bodyPart === AvatarBodyPart.RIGHT_HAND) || ((assetPartDefinition === 'sig' || assetPartDefinition === 'respect') && bodyPart === AvatarBodyPart.LEFT_HAND) || bodyPart === AvatarBodyPart.RIGHT_HAND_ITEM || bodyPart === AvatarBodyPart.LEFT_HAND_ITEM || bodyPart === AvatarBodyPart.CHEST_PRINT) flipH = true;
                
                else
                {
                    if(direction === Direction.SOUTH) direction = Direction.EAST;

                    else if(direction === Direction.SOUTH_WEST) direction = Direction.NORTH_EAST;
                    
                    else if(direction === Direction.WEST) direction = Direction.NORTH;

                    if(partDefinition.flippedSetType) bodyPart = partDefinition.flippedSetType;
                }
            }

            let library = part.library;

            const asset = NitroInstance.instance.core.asset.getAsset(library);

            if(!asset) continue;

            let assetName = this.getSpriteAssetName(library, assetPartDefinition, bodyPart, partId, direction, frameNumber);
            let assetData = asset.assets[assetName];

            if(!assetData)
            {
                assetName = this.getSpriteAssetName(library, 'std', bodyPart, partId, direction, frameNumber);
                assetData = asset.assets[assetName];

                if(!assetData) continue;
            }

            let sprite = this.getSprite(assetName);

            if(!sprite)
            {
                let sourceName = assetName;

                if(assetData.source) sourceName = library + '_' + assetData.source;
    
                if(!sourceName) continue;
    
                sprite = this.createAndAddSprite(assetName, sourceName + '.png');
    
                if(!sprite) continue;

                if(bodyPart === AvatarBodyPart.EYES)
                {
                    sprite.tint = 0xFFFFFF;
                }
                else
                {
                    const color = this._avatarImage.figure.getColorForPart(partId, bodyPart);
                
                    if(color) sprite.tint = color;
                }
            }
            
            sprite.x        = -assetData.x + additionalX;
            sprite.y        = -assetData.y + additionalY;
            sprite.visible  = true;
            sprite.zIndex   = i;

            if(!this._isAvatarReady) sprite.alpha = 0.5;
            else sprite.alpha = 1;

            if(!(isFlipped && flipH) && (isFlipped || flipH))
            {
                sprite.scale.x  = -1;
                sprite.x *= -1;

                sprite.x += NitroConfiguration.TILE_REAL_WIDTH + 3;
            }
            else
            {
                sprite.scale.x = 1;
            }
        }
    }

    protected getSpriteAssetName(library: string, action: string, bodyPart: string, partId: number = 1, direction: number = 0, frame: number = 0): string
    {
        return `${ library }_h_${ action }_${ bodyPart }_${ partId }_${ direction }_${ frame }`;
    }

    private updateFigure(figure: string): boolean
    {
        if(this._figure === figure) return false;

        this._figure = figure;

        this.resetFigure();

        return true;
    }

    private resetFigure(): void
    {
        if(!this._avatarImage) return;

        this.removeSprites();

        this._avatarImage.dispose();

        this._avatarImage   = null;
        this._shadow        = null;
        this._isAvatarReady = false;
    }

    private getAddition(id: number): IAvatarAddition
    {
        if(!this._additions) return null;

        const existing = this._additions[id.toString()];

        if(!existing) return null;

        return existing;
    }

    private addAddition(addition: IAvatarAddition): IAvatarAddition
    {
        if(!this._additions) return;

        const existing = this._additions[addition.id.toString()];

        if(existing) return;

        this._additions[addition.id.toString()] = addition;

        return addition;
    }

    private removeAddition(id: number): void
    {
        const addition = this.getAddition(id);

        if(!addition) return;

        addition.dispose();

        delete this._additions[id.toString()];
    }

    public get direction(): number
    {
        return this._direction;
    }

    public get posture(): string
    {
        return this._posture;
    }
}