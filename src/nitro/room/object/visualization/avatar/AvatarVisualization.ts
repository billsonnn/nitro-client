import { GraphicAsset } from '../../../../../core/asset/GraphicAsset';
import { AlphaTolerance } from '../../../../../room/object/enum/AlphaTolerance';
import { RoomObjectSpriteType } from '../../../../../room/object/enum/RoomObjectSpriteType';
import { IRoomObject } from '../../../../../room/object/IRoomObject';
import { IRoomObjectModel } from '../../../../../room/object/IRoomObjectModel';
import { IObjectVisualizationData } from '../../../../../room/object/visualization/IRoomObjectVisualizationData';
import { RoomObjectSpriteVisualization } from '../../../../../room/object/visualization/RoomObjectSpriteVisualization';
import { IRoomGeometry } from '../../../../../room/utils/IRoomGeometry';
import { AvatarAction } from '../../../../avatar/enum/AvatarAction';
import { AvatarSetType } from '../../../../avatar/enum/AvatarSetType';
import { IAvatarEffectListener } from '../../../../avatar/IAvatarEffectListener';
import { IAvatarImage } from '../../../../avatar/IAvatarImage';
import { IAvatarImageListener } from '../../../../avatar/IAvatarImageListener';
import { NitroInstance } from '../../../../NitroInstance';
import { RoomObjectVariable } from '../../RoomObjectVariable';
import { ExpressionAdditionFactory } from './additions/ExpressionAdditionFactory';
import { FloatingIdleZAddition } from './additions/FloatingIdleZAddition';
import { IAvatarAddition } from './additions/IAvatarAddition';
import { TypingBubbleAddition } from './additions/TypingBubbleAddition';
import { AvatarVisualizationData } from './AvatarVisualizationData';

export class AvatarVisualization extends RoomObjectSpriteVisualization implements IAvatarImageListener, IAvatarEffectListener
{
    private static AVATAR: string                   = 'avatar';
    private static FLOATING_IDLE_Z_ID: number       = 1;
    private static TYPING_BUBBLE_ID: number         = 2;
    private static EXPRESSION_ID: number            = 3;
    private static OWN_USER_ID: number              = 4;
    private static UPDATE_TIME_INCREASER: number    = 41;
    private static OFFSET_MULTIPLIER: number        = 1000;
    private static AVATAR_LAYER_ID: number       = 0;
    private static SHADOW_LAYER_ID: number          = 1;
    private static _Str_17502: number               = 97;
    private static _Str_11587: number               = 2;
    private static _Str_14491: number               = 2;
    private static _Str_18338: number[]             = [0, 0, 0];
    private static _Str_18169: number               = 3;
    private static _Str_9540: number                = 0;
    private static _Str_12370: number               = 1000;
    private static _Str_11358: number               = -0.01;
    private static _Str_17708: number               = 0.001;
    private static _Str_9235: number                = -0.409;

    protected _data: AvatarVisualizationData;

    private _avatarImage: IAvatarImage;
    private _cachedAvatars: Map<string, IAvatarImage>;
    private _cachedAvatarEffects: Map<string, IAvatarImage>;
    private _shadow: GraphicAsset;
    private _lastUpdate: number;
    private _isDisposed: boolean;

    private _figure: string;
    private _gender: string;
    private _direction: number;
    private _headDirection: number;
    private _posture: string;
    private _postureParameter: string;
    private _canStandUp: boolean;
    private _postureOffset: number;
    private _verticalOffset: number;
    private _angle: number;
    private _headAngle: number;
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

    private _Str_8935: boolean;
    private _Str_17860: boolean;
    private _Str_1222: boolean;
    private _Str_16697: number;
    private _Str_12697: number;
    private _Str_14276: number;

    private _isAvatarReady: boolean;
    private _needsUpdate: boolean;
    private _geometryUpdateCounter: number;

    private _additions: Map<number, IAvatarAddition>;

    constructor()
    {
        super();

        this._data                  = null;

        this._avatarImage           = null;
        this._cachedAvatars         = new Map();
        this._cachedAvatarEffects   = new Map();
        this._shadow                = null;
        this._lastUpdate            = -1000;
        this._isDisposed            = false;

        this._figure                = null;
        this._gender                = null;
        this._direction             = -1;
        this._headDirection         = -1;
        this._posture               = '';
        this._postureParameter      = '';
        this._canStandUp            = false;
        this._postureOffset         = 0;
        this._verticalOffset        = 0;
        this._angle                 = -1;
        this._headAngle             = -1;
        this._talk                  = false;
        this._expression            = 0;
        this._sleep                 = false;
        this._blink                 = false;
        this._gesture               = 0;
        this._sign                  = -1;
        this._dance                 = 0;
        this._effect                = 0;
        this._carryObject           = 0;
        this._useObject             = 0;
        this._ownUser               = false;

        this._Str_8935              = false;
        this._Str_17860             = false;
        this._Str_1222              = false;
        this._Str_16697             = 2;
        this._Str_12697             = 0;
        this._Str_14276             = 0;

        this._isAvatarReady         = false;
        this._needsUpdate           = false;
        this._geometryUpdateCounter = -1;

        this._additions             = new Map();
    }

    public initialize(data: IObjectVisualizationData): boolean
    {
        if(!(data instanceof AvatarVisualizationData)) return false;
        
        this._data  = data;

        this.setSpriteCount(AvatarVisualization._Str_11587)

        super.initialize(data);

        return true;
    }

    public dispose(): void
    {
        super.dispose();

        if(this._avatarImage) this._avatarImage.dispose();

        this._shadow = null;

        this._isDisposed = true;
    }

    public update(geometry: IRoomGeometry, time: number, update: boolean, skipUpdate: boolean): void
    {
        if(!this.object || !geometry || !this._data) return;

        if(time < (this._lastUpdate + AvatarVisualization.UPDATE_TIME_INCREASER)) return;

        this._lastUpdate += AvatarVisualization.UPDATE_TIME_INCREASER;

        if((this._lastUpdate + AvatarVisualization.UPDATE_TIME_INCREASER) < time) this._lastUpdate = (time - AvatarVisualization.UPDATE_TIME_INCREASER);

        const model     = this.object.model;
        const scale     = geometry.scale;
        const effect    = +this._effect;

        let didScaleUpdate  = false;
        let didEffectUpdate = false;
        let otherUpdate     = false;
        let objectUpdate    = false;

        const updateModel = this.updateModel(model, scale);

        if((updateModel || (scale !== this._scale)) || !this._avatarImage)
        {
            if(scale !== this._scale)
            {
                didScaleUpdate = true;

                this.updateScale(scale);
            }

            if(effect !== this._effect) didEffectUpdate = true;

            if((didScaleUpdate || !this._avatarImage) || didEffectUpdate)
            {
                this._avatarImage = this.createAvatarImage(scale, this._effect);

                if(!this._avatarImage) return;

                otherUpdate = true;

                const sprite = this.getSprite(AvatarVisualization.AVATAR_LAYER_ID);

                if((sprite && this._avatarImage) && this._avatarImage.isPlaceholder())
                {
                    sprite.alpha = 150;
                }

                else if(sprite)
                {
                    sprite.alpha = 255;
                }
            }

            if(!this._avatarImage) return;

            if(didEffectUpdate && this._avatarImage._Str_677) this._avatarImage._Str_833();

            this.updateShadow(scale);

            objectUpdate = this.updateObject(this.object, geometry, update, true);

            this.processActionsForAvatar(this._avatarImage);

            if(this._additions)
            {
                let index = this._Str_16697;

                for(let addition of this._additions.values())
                {
                    addition.update(this.getSprite(index++), scale);
                }
            }

            this._scale = scale;
        }
        else
        {
            objectUpdate = this.updateObject(this.object, geometry, update);
        }

        if(this._additions)
        {
            let index = this._Str_16697;

            for(let addition of this._additions.values())
            {
                if(addition.animate(this.getSprite(index++))) this.updateSpriteCounter++;
            }
        }

        const update1 = ((objectUpdate || updateModel) || didScaleUpdate);
        const update2 = ((this._Str_1222 || (this._Str_12697 > 0)) && update);

        if(update1) this._Str_12697 = AvatarVisualization._Str_14491;

        if(update1 || update2)
        {
            this.updateSpriteCounter++;

            this._Str_12697--;
            this._Str_14276--;

            if(((((this._Str_14276 <= 0) || didScaleUpdate) || updateModel) || otherUpdate))
            {
                this._avatarImage._Str_953(1);

                this._Str_14276 = AvatarVisualization._Str_14491;
            }
            else
            {
                return;
            }

            let _local_20 = this._avatarImage._Str_781();

            if(!_local_20 || (_local_20.length < 3)) _local_20 = AvatarVisualization._Str_18338;

            const sprite = this.getSprite(AvatarVisualization._Str_9540);

            if(sprite)
            {
                const highlightEnabled = (this.object.model.getValue(RoomObjectVariable.FIGURE_HIGHLIGHT_ENABLE) === 1);

                const avatarImage = this._avatarImage.getImage(AvatarSetType.FULL, highlightEnabled);

                if(avatarImage)
                {
                    sprite.texture = NitroInstance.instance.renderer.generateTexture(avatarImage, 1, 1);
                }

                if(sprite.texture)
                {
                    sprite.offsetX = ((((-1 * scale) / 2) + _local_20[0]) - ((sprite.texture.width - scale) / 2));
                    sprite.offsetY = (((-(sprite.texture.height) + (scale / 4)) + _local_20[1]) + this._postureOffset);
                }

                if(this._Str_8935)
                {
                    if(this._Str_17860) sprite.relativeDepth = -0.5;
                    else sprite.relativeDepth = (AvatarVisualization._Str_9235 + _local_20[2]);
                }
                else
                {
                    sprite.relativeDepth = (AvatarVisualization._Str_11358 + _local_20[2]);
                }

                if(this._ownUser)
                {
                    sprite.relativeDepth -= AvatarVisualization._Str_17708;
                    sprite.spriteType = RoomObjectSpriteType._Str_10494;
                }
                else
                {
                    sprite.spriteType = RoomObjectSpriteType._Str_11629;
                }
            }

            const typingBubble = this.getAddition(AvatarVisualization.TYPING_BUBBLE_ID) as TypingBubbleAddition;

            if(typingBubble)
            {
                if(!this._Str_8935) typingBubble.relativeDepth = ((AvatarVisualization._Str_11358 - 0.01) + _local_20[2]);
                else typingBubble.relativeDepth = ((AvatarVisualization._Str_9235 - 0.01) + _local_20[2]);
            }

            this._Str_1222 = this._avatarImage._Str_899();

            let _local_21   = AvatarVisualization._Str_11587;
            let direction   = this._avatarImage.getDirection();

            for(let spriteData of this._avatarImage._Str_754())
            {
                if(spriteData.id === AvatarVisualization.AVATAR)
                {
                    const sprite = this.getSprite(AvatarVisualization._Str_9540);

                    if(sprite)
                    {
                        const layerData = this._avatarImage._Str_607(spriteData);

                        let offsetX = spriteData._Str_809(direction);
                        let offsetY = spriteData._Str_739(direction);

                        if(layerData)
                        {
                            offsetX += layerData.dx;
                            offsetY += layerData.dy;
                        }

                        if(scale < 48)
                        {
                            offsetX /= 2;
                            offsetY /= 2;
                        }

                        if(!this._canStandUp)
                        {
                            sprite.offsetX += offsetX;
                            sprite.offsetY += offsetY;
                        }
                    }
                }
                else
                {
                    const sprite = this.getSprite(_local_21);

                    if(sprite)
                    {
                        sprite.alpha    = AlphaTolerance._Str_9268;
                        sprite.visible  = true;

                        const layerData = this._avatarImage._Str_607(spriteData);

                        let frameNumber = 0;
                        let offsetX     = spriteData._Str_809(direction);
                        let offsetY     = spriteData._Str_739(direction);
                        let offsetZ     = spriteData._Str_839(direction);
                        let dd          = 0;

                        if(spriteData._Str_949) dd = direction;

                        if(layerData)
                        {
                            frameNumber = layerData._Str_891;
                            offsetX    += layerData.dx;
                            offsetY    += layerData.dy;
                            dd         += layerData.dd;
                        }

                        if(scale < 48)
                        {
                            offsetX /= 2;
                            offsetY /= 2;
                        }

                        if(dd < 0) dd += 8;
                        else
                        {
                            if(dd > 7) dd -= 8;
                        }

                        const assetName = ((((((this._avatarImage._Str_797() + "_") + spriteData.member) + "_") + direction) + "_") + frameNumber);

                        const asset = this._avatarImage.getAsset(assetName);

                        if(!asset) continue;

                        sprite.texture  = asset.texture;
                        sprite.offsetX  = ((-(asset.offsetX) - (scale / 2)) + offsetX);
                        sprite.offsetY  = (-(asset.offsetY) + offsetY);

                        if(spriteData._Str_767)
                        {
                            sprite.offsetY += ((this._verticalOffset * scale) / (2 * AvatarVisualization._Str_12370));
                        }
                        else
                        {
                            sprite.offsetY += this._postureOffset;
                        }

                        if(this._Str_8935)
                        {
                            sprite.relativeDepth = (AvatarVisualization._Str_9235 - ((0.001 * this.totalSprites) * offsetZ));
                        }
                        else
                        {
                            sprite.relativeDepth = (AvatarVisualization._Str_11358 - ((0.001 * this.totalSprites) * offsetZ));
                        }

                        if(spriteData.ink === 33) sprite.blendMode = PIXI.BLEND_MODES.ADD;
                    }

                    _local_21++;
                }
            }
        }
    }

    private createAvatarImage(scale: number, effectId: number): IAvatarImage
    {
        let cachedImage: IAvatarImage   = null;
        let imageName                   = 'avatarImage' + scale.toString();

        if(!effectId)
        {
            cachedImage = this._cachedAvatars.get(imageName);
        }
        else
        {
            imageName += '-' + effectId;

            cachedImage = this._cachedAvatarEffects.get(imageName);
        }

        if(!cachedImage)
        {
            cachedImage = this._data.createAvatarImage(this._figure, scale, this._gender, this, this);

            if(cachedImage)
            {
                if(!effectId)
                {
                    this._cachedAvatars.set(imageName, cachedImage);
                }

                else
                {
                    if(this._cachedAvatarEffects.size >= AvatarVisualization._Str_18169)
                    {
                        // remove 1
                    }

                    this._cachedAvatarEffects.set(imageName, cachedImage);
                }
            }
        }

        return cachedImage;
    }

    protected updateObject(object: IRoomObject, geometry: IRoomGeometry, update: boolean, _arg_4: boolean = false): boolean
    {
        if((!_arg_4 && (this.updateObjectCounter === object.updateCounter)) && (this._geometryUpdateCounter === geometry.updateId)) return false;

        let someUpdate      = update;
        let direction       = (object.getDirection().x - geometry.direction.x);
        let headDirection   = this._headDirection;

        direction = (((direction % 360) + 360) % 360);
        
        if((this._posture === 'sit') && this._canStandUp) direction -= ((direction % 90) - 45);

        if(this._posture === 'float') headDirection = direction;
        else headDirection -= geometry.direction.x;

        headDirection = (((headDirection % 360) + 360) % 360);

        if((this._posture === 'sit') && this._canStandUp) headDirection -= ((headDirection % 90) - 45);

        if((direction !== this._angle) || _arg_4)
        {
            someUpdate = true;

            this._angle = direction;

            direction = (direction - (135 - 22.5));
            direction = ((direction + 360) % 360);

            this._avatarImage._Str_880(AvatarSetType.FULL, direction);
        }

        if((headDirection !== this._headAngle) || _arg_4)
        {
            someUpdate = true;

            this._headAngle = headDirection;

            if(this._headAngle !== this._angle)
            {
                headDirection = (headDirection - (135 + 22.5));
                headDirection = ((headDirection + 360) % 360);

                this._avatarImage._Str_880(AvatarSetType.HEAD, headDirection);
            }
        }

        this._geometryUpdateCounter = geometry.updateId;

        this.updateObjectCounter = this.object.updateCounter;

        return someUpdate;
    }

    protected updateModel(model: IRoomObjectModel, scale: number): boolean
    {
        if(!model) return false;

        if(this.updateModelCounter === model.updateCounter) return false;

        let needsUpdate = false;

        const talk = (model.getValue(RoomObjectVariable.FIGURE_TALK) > 0);

        if(talk !== this._talk)
        {
            this._talk = talk;

            needsUpdate = true;
        }

        const expression = model.getValue(RoomObjectVariable.FIGURE_EXPRESSION);

        if(expression !== this._expression)
        {
            this._expression = expression;

            needsUpdate = true;
        }

        const sleep = (model.getValue(RoomObjectVariable.FIGURE_SLEEP) > 0);

        if(sleep !== this._sleep)
        {
            this._sleep = sleep;

            needsUpdate = true;
        }

        const blink = (model.getValue(RoomObjectVariable.FIGURE_BLINK) > 0);

        if(blink !== this._blink)
        {
            this._blink = blink;

            needsUpdate = true;
        }

        const gesture = model.getValue(RoomObjectVariable.FIGURE_GESTURE) || 0;

        if(gesture !== this._gesture)
        {
            this._gesture = gesture;

            needsUpdate = true;
        }

        const posture = model.getValue(RoomObjectVariable.FIGURE_POSTURE);

        if(posture !== this._posture)
        {
            this._posture = posture;

            needsUpdate = true;
        }

        const postureParameter = model.getValue(RoomObjectVariable.FIGURE_POSTURE_PARAMETER);

        if(postureParameter !== this._postureParameter)
        {
            this._postureParameter = postureParameter;

            needsUpdate = true;
        }

        const canStandUp = (model.getValue(RoomObjectVariable.FIGURE_CAN_STAND_UP) > 0);

        if(canStandUp !== this._canStandUp)
        {
            this._canStandUp = canStandUp;

            needsUpdate = true;
        }

        const verticalOffset = (model.getValue(RoomObjectVariable.FIGURE_VERTICAL_OFFSET) * AvatarVisualization.OFFSET_MULTIPLIER);

        if(verticalOffset !== this._verticalOffset)
        {
            this._verticalOffset = verticalOffset;

            needsUpdate = true;
        }

        const dance = model.getValue(RoomObjectVariable.FIGURE_DANCE) || 0;

        if(dance !== this._dance)
        {
            this._dance = dance;

            needsUpdate = true;
        }

        const effect = model.getValue(RoomObjectVariable.FIGURE_EFFECT) || 0;

        if(effect !== this._effect)
        {
            this._effect = effect;

            needsUpdate = true;
        }

        const carryObject = model.getValue(RoomObjectVariable.FIGURE_CARRY_OBJECT) || 0;

        if(carryObject !== this._carryObject)
        {
            this._carryObject = carryObject;

            needsUpdate = true;
        }

        const useObject = model.getValue(RoomObjectVariable.FIGURE_USE_OBJECT) || 0;

        if(useObject !== this._useObject)
        {
            this._useObject = useObject;

            needsUpdate = true;
        }

        const headDirection = model.getValue(RoomObjectVariable.HEAD_DIRECTION);

        if(headDirection !== this._headDirection)
        {
            this._headDirection = headDirection;

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
            if(!idleAddition) idleAddition = this.addAddition(new FloatingIdleZAddition(AvatarVisualization.FLOATING_IDLE_Z_ID, this));

            needsUpdate = true;
        }
        else
        {
            if(idleAddition) this.removeAddition(AvatarVisualization.FLOATING_IDLE_Z_ID);
        }

        const isTyping = model.getValue(RoomObjectVariable.FIGURE_IS_TYPING) > 0;

        let typingAddition = this.getAddition(AvatarVisualization.TYPING_BUBBLE_ID);

        if(isTyping)
        {
            if(!typingAddition) typingAddition = this.addAddition(new TypingBubbleAddition(AvatarVisualization.TYPING_BUBBLE_ID, this));

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

        this.updateScale(scale);

        const gender = model.getValue(RoomObjectVariable.GENDER);

        if(gender !== this._gender)
        {
            this._gender = gender;

            needsUpdate = true;
        }

        if(this.updateFigure(model.getValue(RoomObjectVariable.FIGURE))) needsUpdate = true;

        let sign = model.getValue(RoomObjectVariable.FIGURE_SIGN);

        if(sign === null) sign = -1;

        if(this._sign !== sign)
        {
            this._sign = sign;

            needsUpdate = true;
        }

        const ownUser = model.getValue(RoomObjectVariable.OWN_USER) > 0;

        if(ownUser !== this._ownUser)
        {
            this._ownUser = ownUser;

            needsUpdate = true;
        }

        this.updateModelCounter = model.updateCounter;

        return needsUpdate;
    }

    protected setDirection(direction: number): void
    {
        if(this._direction === direction) return;

        this._direction = direction;

        this._needsUpdate = true;
    }

    private updateScale(scale: number): void
    {
        if(scale < 48) this._blink = false;

        if((this._posture === 'sit') || (this._posture === 'lay'))
        {
            this._postureOffset = (scale / 2);
        }
        else
        {
            this._postureOffset = 0;
        }

        this._Str_17860 = false;
        this._Str_8935  = false;

        if(this._posture === 'lay')
        {
            this._Str_8935 = true;

            const _local_2 = parseInt(this._postureParameter);

            if(_local_2 < 0) this._Str_17860 = true;
        }
    }

    private processActionsForAvatar(avatar: IAvatarImage): void
    {
        if(!avatar) return;

        avatar._Str_913();

        avatar.appendAction(AvatarAction.POSTURE, this._posture, this._postureParameter);

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

        avatar._Str_962();

        this._Str_1222 = avatar._Str_899();

        let spriteCount = AvatarVisualization._Str_11587;

        for(let sprite of this._avatarImage._Str_754())
        {
            if(sprite.id !== AvatarVisualization.AVATAR) spriteCount++;
        }

        if(spriteCount !== this.totalSprites) this.setSpriteCount(spriteCount);

        this._Str_16697 = spriteCount;

        if(this._additions)
        {
            for(let addition of this._additions.values()) this.createSprite();
        }
    }

    private updateFigure(figure: string): boolean
    {
        if(this._figure === figure) return false;

        this._figure = figure;

        this.clearAvatar();

        return true;
    }

    public resetFigure(figure: string): void
    {
        this.clearAvatar();
    }

    public resetEffect(effect: number): void
    {
        this.clearAvatar();
    }

    private clearAvatar(): void
    {
        for(let avatar of this._cachedAvatars.values()) avatar && avatar.dispose();

        for(let avatar of this._cachedAvatarEffects.values()) avatar && avatar.dispose();

        this._cachedAvatars.clear();
        this._cachedAvatarEffects.clear();
        
        this._avatarImage = null;

        const sprite = this.getSprite(AvatarVisualization.AVATAR_LAYER_ID);
        
        if(sprite)
        {
            sprite.texture  = null;
            sprite.alpha    = 255;
        }
    }

    private getAddition(id: number): IAvatarAddition
    {
        if(!this._additions) return null;

        const existing = this._additions.get(id);

        if(!existing) return null;

        return existing;
    }

    private addAddition(addition: IAvatarAddition): IAvatarAddition
    {
        const existing = this.getAddition(addition.id)

        if(existing) return;

        this._additions.set(addition.id, addition);

        return addition;
    }

    private removeAddition(id: number): void
    {
        const addition = this.getAddition(id);

        if(!addition) return;

        this._additions.delete(addition.id);

        addition.dispose();
    }

    private updateShadow(scale: number): void
    {
        this._shadow = null;

        const sprite = this.getSprite(AvatarVisualization.SHADOW_LAYER_ID);

        if(!sprite) return;

        let hasShadow = (((this._posture === 'mv') || (this._posture === 'std')) || ((this._posture === 'sit') && this._canStandUp));

        if(this._effect === AvatarVisualization._Str_17502) hasShadow = false;

        if(hasShadow)
        {
            sprite.visible = true;

            if(!this._shadow || (scale !== this._scale))
            {
                let offsetX = 0;
                let offsetY = 0;

                if(scale < 48)
                {
                    sprite._Str_3582 = 'sh_std_sd_1_0_0';

                    this._shadow = this._avatarImage.getAsset(sprite._Str_3582);

                    offsetX = -8;
                    offsetY = ((this._canStandUp) ? 6 : -3);
                }
                else
                {
                    sprite._Str_3582 = 'h_std_sd_1_0_0';

                    this._shadow = this._avatarImage.getAsset(sprite._Str_3582);
                    
                    offsetX = -17;
                    offsetY = ((this._canStandUp) ? 10 : -7);
                }
            
                if(this._shadow)
                {
                    sprite.texture          = this._shadow.texture;
                    sprite.offsetX          = offsetX;
                    sprite.offsetY          = offsetY;
                    sprite.alpha            = 50;
                    sprite.relativeDepth    = 1;
                }
                else
                {
                    sprite.visible = false;
                }
            }
        }
        else
        {
            this._shadow = null;
            
            sprite.visible = false;
        }
    }

    public getAvatarRenderAsset(name: string): PIXI.Texture
    {
        return this._data ? this._data.getAvatarRendererAsset(name) : null;
    }

    public get direction(): number
    {
        return this._direction;
    }

    public get posture(): string
    {
        return this._posture;
    }

    public get angle(): number
    {
        return this._angle;
    }

    public get isDisposed(): boolean
    {
        return this._isDisposed;
    }
}