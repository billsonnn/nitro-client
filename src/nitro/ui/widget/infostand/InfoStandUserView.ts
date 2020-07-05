import { WindowTemplates } from '../../../window/WindowTemplates';
import { RoomWidgetUserInfostandUpdateEvent } from '../events/RoomWidgetUserInfostandUpdateEvent';
import { InfoStandWidget } from './InfoStandWidget';

export class InfoStandUserView 
{
    protected static _Str_6292: number = 0xFFFFFF;
    protected static _Str_6801: number = 9552639;

    private _Str_4882: number = 5;
    private _Str_14702: number = 3;
    private _Str_17178: number = 0xAAAAAA;
    private _Str_18971: number = 0xFFFFFF;
    private _Str_25347: number = 2000;
    private _Str_14746: number = 50;
    private _Str_13324: number = 23;
    private _Str_26389: number = 100;

    protected _widget: InfoStandWidget;
    protected _window: HTMLElement;
    protected _profileLinkElement: HTMLElement;
    // protected _Str_2373:IItemListWindow;
    // protected _Str_20844:IItemListWindow;
    // private _Str_2341:IBorderWindow;
    // private _Str_3306:TagListRenderer;
    // private _Str_2919:IBorderWindow;
    // private _Str_19966: number;
    // protected _Str_4966:IRegionWindow;

    constructor(k: InfoStandWidget, _arg_2: string)
    {
        this._widget                = k;
        this._window                = null;
        this._profileLinkElement    = null;

        this.createWindow(_arg_2);
    }

    public dispose(): void
    {
        // if (this._Str_4966)
        // {
        //     this._Str_4966.dispose();
        //     this._Str_4966 = null;
        // }
        this._widget = null;
        //this._window.dispose();
        this._window = null;
        // this._Str_3306.dispose();
        // this._Str_3306 = null;
        // this._Str_9682();
    }

    public get window(): HTMLElement
    {
        return this._window;
    }

    protected updateWindow(): void
    {
        // if (((this._Str_2373 == null) || (this._Str_2341 == null)))
        // {
        //     return;
        // }
        // this._Str_2373.height = this._Str_2373._Str_2614.height;
        // this._Str_2341.height = (this._Str_2373.height + 20);
        // this._window.width = this._Str_2341.width;
        // this._window.height = this._window._Str_2614.height;
        // this._widget._Str_10301();
    }

    protected createWindow(k: string): void
    {
        this._window = this._widget.windowManager.renderElement(this.getTemplate(), {});

        if(!this._window) return;

        this._window.style.display = 'none';

        this._window.classList.add(k);

        if(this._widget.mainContainer) this._widget.mainContainer.appendChild(this._window);

        const closeElement = (this._window.querySelector('[data-tag="close"]') as HTMLElement);

        if(closeElement)
        {
            closeElement.onclick = event => this.onCloseHandler(event);
        }

        // var _local_5: number;
        // while (_local_5 < 5)
        // {
        //     _local_4 = this._Str_2341.findChildByName(("badge_" + _local_5));
        //     if (_local_4 == null)
        //     {
        //     }
        //     else
        //     {
        //         _local_4.addEventListener(WindowMouseEvent.OVER, this._Str_18818);
        //         _local_4.addEventListener(WindowMouseEvent.OUT, this._Str_16035);
        //     }
        //     _local_5++;
        // }
        // _local_4 = this._Str_2341.findChildByName("badge_group");
        // if (_local_4 != null)
        // {
        //     _local_4.addEventListener(WindowMouseEvent.CLICK, this._Str_23155);
        //     _local_4.addEventListener(WindowMouseEvent.OVER, this._Str_12867);
        //     _local_4.addEventListener(WindowMouseEvent.OUT, this._Str_23279);
        // }
        // var _local_6:IWindow = this._Str_2341.findChildByName("avatar_image_profile_link");
        // if (_local_6 != null)
        // {
        //     _local_6.procedure = this._Str_21251;
        // }
    }

    // private _Str_23155(k:WindowMouseEvent): void
    // {
    //     if (this._widget.userData.groupId < 0)
    //     {
    //         return;
    //     }
    //     var _local_2:* = (this._widget.userData.type == RoomWidgetUpdateInfostandUserEvent.OWN_USER);
    //     var _local_3:RoomWidgetGetBadgeDetailsMessage = new RoomWidgetGetBadgeDetailsMessage(_local_2, this._widget.userData.groupId);
    //     this._widget.messageListener.processWidgetMessage(_local_3);
    // }

    // private _Str_12867(k:WindowMouseEvent): void
    // {
    //     if (this._widget.userData.groupId < 0)
    //     {
    //         return;
    //     }
    //     this._Str_13311();
    //     if (k.window == null)
    //     {
    //         return;
    //     }
    //     this._Str_2919.findChildByName("name").caption = this._widget.userData.groupName;
    //     this._Str_2919.findChildByName("description").caption = "${group.badgepopup.body}";
    //     var _local_2:Rectangle = new Rectangle();
    //     k.window.getGlobalRectangle(_local_2);
    //     this._Str_2919.x = (_local_2.left - this._Str_2919.width);
    //     this._Str_2919.y = (_local_2.top + ((_local_2.height - this._Str_2919.height) / 2));
    // }

    // private _Str_23279(k:WindowMouseEvent): void
    // {
    //     this._Str_9682();
    // }

    // private _Str_18818(k:WindowMouseEvent): void
    // {
    //     var _local_5:ITextWindow;
    //     if (k.window == null)
    //     {
    //         return;
    //     }
    //     var _local_2: number = int(k.window.name.replace("badge_", ""));
    //     if (_local_2 < 0)
    //     {
    //         return;
    //     }
    //     var _local_3:Array = this._widget.userData.badges;
    //     if (_local_3 == null)
    //     {
    //         return;
    //     }
    //     if (_local_2 >= _local_3.length)
    //     {
    //         return;
    //     }
    //     var _local_4: string = this._widget.userData.badges[_local_2];
    //     if (_local_4 == null)
    //     {
    //         return;
    //     }
    //     this._Str_13311();
    //     _local_5 = (this._Str_2919.getChildByName("name") as ITextWindow);
    //     if (_local_5 != null)
    //     {
    //         _local_5.text = this._widget.localizations.getBadgeName(_local_4);
    //     }
    //     _local_5 = (this._Str_2919.getChildByName("description") as ITextWindow);
    //     if (_local_5 != null)
    //     {
    //         _local_5.text = this._widget.localizations.getBadgeDesc(_local_4);
    //     }
    //     var _local_6:Rectangle = new Rectangle();
    //     k.window.getGlobalRectangle(_local_6);
    //     this._Str_2919.x = (_local_6.left - this._Str_2919.width);
    //     this._Str_2919.y = (_local_6.top + ((_local_6.height - this._Str_2919.height) / 2));
    // }

    // private _Str_16035(k:WindowMouseEvent): void
    // {
    //     this._Str_9682();
    // }

    // private _Str_13311(): void
    // {
    //     if (this._Str_2919 != null)
    //     {
    //         return;
    //     }
    //     var k:XmlAsset = (this._widget.assets.getAssetByName("badge_details") as XmlAsset);
    //     if (k == null)
    //     {
    //         return;
    //     }
    //     this._Str_2919 = (this._widget.windowManager.buildFromXML((k.content as XML)) as IBorderWindow);
    //     if (this._Str_2919 == null)
    //     {
    //         throw (new Error("Failed to construct window from XML!"));
    //     }
    // }

    // private _Str_9682(): void
    // {
    //     if (this._Str_2919 != null)
    //     {
    //         this._Str_2919.dispose();
    //         this._Str_2919 = null;
    //     }
    // }

    private onCloseHandler(k: MouseEvent): void
    {
        this._widget.close();
    }

    public set name(k: string)
    {
        if(!this._profileLinkElement)
        {
            this._profileLinkElement = (this._window.querySelector('[data-tag="profile-link"]') as HTMLElement);

            if(!this._profileLinkElement) return;
        }

        const element = (this._profileLinkElement.querySelector('[data-tag="name-text"]') as HTMLElement);

        if(!element) return;

        element.innerText = k;
    }

    // public set realName(k: string): void
    // {
    //     var _local_2:ITextWindow = (this._Str_2373.getListItemByName("realname_text") as ITextWindow);
    //     if (_local_2 == null)
    //     {
    //         return;
    //     }
    //     if (k.length == 0)
    //     {
    //         _local_2.text = "";
    //     }
    //     else
    //     {
    //         this._widget.localizations.registerParameter("infostand.text.realname", "realname", k);
    //         _local_2.text = this._widget.localizations.getLocalization("infostand.text.realname");
    //     }
    //     _local_2.height = (_local_2.textHeight + this._Str_4882);
    //     _local_2.visible = (k.length > 0);
    // }

    public _Str_7907(figure: string): void
    {
        const image = this._widget.handler.getUserImage(figure);

        if(image)
        {
            const element = (this._window.querySelector('[data-tag="image"]'));

            if(element)
            {
                element.innerHTML = null;
                
                element.appendChild(image);
            }
        }
    }

    // public _Str_12782(k: string, _arg_2: boolean): void
    // {
    //     var _local_3:IWindowContainer = (this._Str_2373.getListItemByName("motto_container") as IWindowContainer);
    //     if (!_local_3)
    //     {
    //         return;
    //     }
    //     var _local_4:IWindow = _local_3.findChildByName("changemotto.image");
    //     var _local_5:ITextWindow = (_local_3.findChildByName("motto_text") as ITextWindow);
    //     var _local_6:IWindowContainer = (this._Str_2373.getListItemByName("motto_spacer") as IWindowContainer);
    //     if (((_local_5 == null) || (_local_6 == null)))
    //     {
    //         return;
    //     }
    //     if (k == null)
    //     {
    //         k = "";
    //     }
    //     if (_arg_2)
    //     {
    //         _local_4.visible = true;
    //         if (k == "")
    //         {
    //             k = this._widget.localizations.getLocalization("infostand.motto.change");
    //             _local_5.textColor = this._Str_17178;
    //         }
    //         else
    //         {
    //             _local_5.textColor = this._Str_18971;
    //         }
    //         _local_5.enable();
    //     }
    //     else
    //     {
    //         _local_4.visible = false;
    //         _local_5.textColor = this._Str_18971;
    //         _local_5.disable();
    //     }
    //     if (!this._widget.config.getBoolean("infostand.motto.change.enabled"))
    //     {
    //         _local_5.disable();
    //     }
    //     _local_5.text = k;
    //     _local_5.height = Math.min((_local_5.textHeight + this._Str_4882), this._Str_14746);
    //     _local_5.height = Math.max(_local_5.height, this._Str_13324);
    //     _local_3.height = (_local_5.height + this._Str_14702);
    //     if (_arg_2)
    //     {
    //         _local_5.addEventListener(WindowKeyboardEvent.WINDOW_EVENT_KEY_UP, this._Str_23735);
    //         _local_5.addEventListener(WindowMouseEvent.CLICK, this._Str_20920);
    //     }
    //     else
    //     {
    //         _local_5.removeEventListener(WindowKeyboardEvent.WINDOW_EVENT_KEY_UP, this._Str_20920);
    //     }
    //     this.updateWindow();
    // }

    // public set activityPoints(k: number): void
    // {
    //     if (!this._widget.handler._Str_7745)
    //     {
    //         return;
    //     }
    //     var _local_2:ITextWindow = (this._Str_2373.getListItemByName("score_value") as ITextWindow);
    //     if (_local_2 == null)
    //     {
    //         return;
    //     }
    //     _local_2.text = String(k);
    // }

    // public set _Str_3249(k: number): void
    // {
    //     var _local_6: string;
    //     var _local_2:ITextWindow = (this._Str_2373.getListItemByName("handitem_txt") as ITextWindow);
    //     var _local_3:IWindowContainer = (this._Str_2373.getListItemByName("handitem_spacer") as IWindowContainer);
    //     if (((_local_2 == null) || (_local_3 == null)))
    //     {
    //         return;
    //     }
    //     if (((k > 0) && (k < 999999)))
    //     {
    //         _local_6 = this._widget.localizations.getLocalization(("handitem" + k), ("handitem" + k));
    //         this._widget.localizations.registerParameter("infostand.text.handitem", "item", _local_6);
    //     }
    //     _local_2.height = (_local_2.textHeight + this._Str_4882);
    //     var _local_4: boolean = _local_2.visible;
    //     var _local_5: boolean = ((k > 0) && (k < 999999));
    //     _local_2.visible = _local_5;
    //     _local_3.visible = _local_5;
    //     if (_local_5 != _local_4)
    //     {
    //         this._Str_2373.arrangeListItems();
    //     }
    //     this.updateWindow();
    // }

    // public set xp(k: number): void
    // {
    //     var _local_2:ITextWindow = (this._Str_2373.getListItemByName("xp_text") as ITextWindow);
    //     var _local_3:IWindowContainer = (this._Str_2373.getListItemByName("xp_spacer") as IWindowContainer);
    //     if (((_local_2 == null) || (_local_3 == null)))
    //     {
    //         return;
    //     }
    //     this._widget.localizations.registerParameter("infostand.text.xp", "xp", k.toString());
    //     _local_2.height = (_local_2.textHeight + this._Str_4882);
    //     var _local_4: boolean = _local_2.visible;
    //     var _local_5:* = (k > 0);
    //     _local_2.visible = _local_5;
    //     _local_3.visible = _local_5;
    //     if (_local_5 != _local_4)
    //     {
    //         this._Str_2373.arrangeListItems();
    //     }
    //     this.updateWindow();
    // }

    // public _Str_17290(k:Array, _arg_2:Array=null): void
    // {
    //     var _local_3:IWindowContainer = (this._Str_2373.getListItemByName("tags_container") as IWindowContainer);
    //     var _local_4:IWindowContainer = (this._Str_2373.getListItemByName("tags_spacer") as IWindowContainer);
    //     if (((_local_3 == null) || (_local_4 == null)))
    //     {
    //         return;
    //     }
    //     if (k.length != 0)
    //     {
    //         _local_3.height = this._Str_3306._Str_23731(k, _local_3, _arg_2);
    //         _local_4.height = 1;
    //     }
    //     else
    //     {
    //         _local_3.height = 0;
    //         _local_4.height = 0;
    //     }
    //     this.updateWindow();
    // }

    // public _Str_5605(k: number, _arg_2: string): void
    // {
    //     var _local_3:_Str_2402 = (IWidgetWindow(this._Str_2341.findChildByName(("badge_" + k))).widget as _Str_2402);
    //     _local_3.badgeId = _arg_2;
    // }

    // public _Str_10630(): void
    // {
    //     var _local_2:_Str_2402;
    //     var k: number;
    //     while (k < 5)
    //     {
    //         _local_2 = (IWidgetWindow(this._Str_2341.findChildByName(("badge_" + k))).widget as _Str_2402);
    //         _local_2.badgeId = "";
    //         k++;
    //     }
    // }

    // public _Str_21116(): void
    // {
    //     var k:_Str_2402 = (IWidgetWindow(this._Str_2341.findChildByName("badge_group")).widget as _Str_2402);
    //     k.badgeId = "";
    // }

    // public _Str_16673(k: string): void
    // {
    //     var _local_2:_Str_2402 = (IWidgetWindow(this._Str_2341.findChildByName("badge_group")).widget as _Str_2402);
    //     _local_2.badgeId = k;
    // }

    // private _Str_25162(k:WindowMouseEvent): void
    // {
    //     var _local_2:ITextWindow = (k.target as ITextWindow);
    //     if (_local_2 == null)
    //     {
    //         return;
    //     }
    //     this._widget.messageListener.processWidgetMessage(new RoomWidgetRoomTagSearchMessage(_local_2.text));
    // }

    public update(k: RoomWidgetUserInfostandUpdateEvent): void
    {
        // this._Str_10630();
        // this._Str_21116();
        //this._Str_16673(k._Str_5235);
        // this._Str_17290([]);
        this._Str_11602(k);
    }

    // public _Str_25662(k:Map): void
    // {
    //     var _local_2: number;
    //     var _local_3: string;
    //     var _local_4:IWindow;
    //     var _local_5:_Str_4838;
    //     var _local_6: string;
    //     var _local_7:IWindow;
    //     if (((!(this._Str_2341)) || (!(this._widget))))
    //     {
    //         return;
    //     }
    //     for each (_local_2 in RelationshipStatusEnum._Str_15184)
    //     {
    //         _local_3 = RelationshipStatusEnum._Str_7401(_local_2);
    //         _local_4 = this._Str_2341.findChildByName(("relationship_" + _local_3));
    //         _local_5 = k.getValue(_local_2);
    //         if (_local_5)
    //         {
    //             _local_4.visible = (_local_5.friendCount > 0);
    //             _local_6 = (_local_3 + "_randomusername");
    //             _local_7 = this._Str_2341.findChildByName(_local_6);
    //             if (_local_7)
    //             {
    //                 _local_7.caption = _local_5._Str_20359;
    //                 _local_7.id = int(_local_5._Str_21077);
    //             }
    //             this._Str_2341.findChildByName((_local_3 + "_others")).visible = (_local_5.friendCount > 1);
    //             this._Str_2268.localizations.registerParameter((("infostand.relstatus." + _local_3) + ".others"), "amount", (_local_5.friendCount - 1).toString());
    //         }
    //         else
    //         {
    //             _local_4.visible = false;
    //         }
    //     }
    // }

    protected _Str_11602(k: RoomWidgetUserInfostandUpdateEvent): void
    {
        this.name = k.name;
        // this._Str_12782(k.motto, (k.type == RoomWidgetUpdateInfostandUserEvent.OWN_USER));
        // this.activityPoints = k.activityPoints;
        // this._Str_3249 = k._Str_3249;
        // this.xp = k.xp;
        this._Str_7907(k.figure);
    }

    // protected _Str_23735(k:WindowKeyboardEvent): void
    // {
    //     var _local_5:RoomWidgetChangeMottoMessage;
    //     var _local_6: number;
    //     var _local_7: number;
    //     var _local_2:IWindowContainer = (this._Str_2373.getListItemByName("motto_container") as IWindowContainer);
    //     if (!_local_2)
    //     {
    //         return;
    //     }
    //     var _local_3:ITextFieldWindow = (_local_2.findChildByName("motto_text") as ITextFieldWindow);
    //     var _local_4: string = _local_3.text;
    //     if (k.keyCode == Keyboard.ENTER)
    //     {
    //         _local_6 = getTimer();
    //         if ((((_local_6 - this._Str_19966) > this._Str_25347) && (!(_local_4 == this._widget.localizations.getLocalization("infostand.motto.change")))))
    //         {
    //             _local_7 = this._widget.userData.userId;
    //             _local_5 = new RoomWidgetChangeMottoMessage(_local_4);
    //             this._widget.messageListener.processWidgetMessage(_local_5);
    //             this._Str_19966 = _local_6;
    //             _local_3.textColor = this._Str_18971;
    //             _local_3.unfocus();
    //         }
    //     }
    //     else
    //     {
    //         _local_3.textColor = this._Str_17178;
    //     }
    //     _local_3.height = Math.min((_local_3.textHeight + this._Str_4882), this._Str_14746);
    //     _local_3.height = Math.max(_local_3.height, this._Str_13324);
    //     _local_2.height = (_local_3.height + this._Str_14702);
    // }

    // protected _Str_20920(k:WindowMouseEvent): void
    // {
    //     var _local_2:IWindowContainer = (this._Str_2373.getListItemByName("motto_container") as IWindowContainer);
    //     if (!_local_2)
    //     {
    //         return;
    //     }
    //     var _local_3:ITextWindow = (_local_2.findChildByName("motto_text") as ITextWindow);
    //     if (_local_3.text == this._widget.localizations.getLocalization("infostand.motto.change"))
    //     {
    //         _local_3.text = "";
    //     }
    //     _local_3.textColor = this._Str_17178;
    // }

    // protected _Str_2608(k:WindowMouseEvent): void
    // {
    //     var _local_2:RoomWidgetMessage;
    //     var _local_3: string;
    //     var _local_4:IWindow = (k.target as IWindow);
    //     switch (_local_4.name)
    //     {
    //         case "home_icon":
    //             _local_3 = RoomWidgetUserActionMessage.RWUAM_OPEN_HOME_PAGE;
    //             break;
    //     }
    //     if (_local_3 != null)
    //     {
    //         _local_2 = new RoomWidgetUserActionMessage(_local_3, this._widget.userData.userId);
    //         HabboTracking.getInstance().trackEventLog("InfoStand", "click", _local_3);
    //     }
    //     if (_local_2 != null)
    //     {
    //         this._widget.messageListener.processWidgetMessage(_local_2);
    //     }
    //     this.updateWindow();
    // }

    // protected _Str_21251(k:WindowEvent, _arg_2:IWindow): void
    // {
    //     var _local_3:ITextWindow;
    //     if (k.type == WindowMouseEvent.CLICK)
    //     {
    //         this._widget.messageListener.processWidgetMessage(new RoomWidgetOpenProfileMessage(RoomWidgetOpenProfileMessage.RWOPEM_OPEN_USER_PROFILE, this._widget.userData.userId, "infoStand_userView"));
    //     }
    //     if (_arg_2.name == "profile_link")
    //     {
    //         if (k.type == WindowMouseEvent.OVER)
    //         {
    //             _local_3 = (this._Str_4966.findChildByName("name_text") as ITextWindow);
    //             _local_3.textColor = _Str_6801;
    //         }
    //         if (k.type == WindowMouseEvent.OUT)
    //         {
    //             _local_3 = (this._Str_4966.findChildByName("name_text") as ITextWindow);
    //             _local_3.textColor = _Str_6292;
    //         }
    //     }
    // }

    // private _Str_18506(k:WindowEvent, _arg_2:IWindow): void
    // {
    //     if (((k.type == WindowMouseEvent.CLICK) && (_arg_2 is ITextLinkWindow)))
    //     {
    //         this._widget.handler.container.connection.send(new _Str_2553(_arg_2.id));
    //     }
    // }

    private getTemplate(): string
    {
        return this._widget.windowManager.getTemplate(WindowTemplates.INFOSTAND_MENU_USER_VIEW);
    }
}