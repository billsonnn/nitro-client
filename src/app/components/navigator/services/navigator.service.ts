import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { IMessageEvent } from '../../../../client/core/communication/messages/IMessageEvent';
import { NavigatorCategoriesEvent } from '../../../../client/nitro/communication/messages/incoming/navigator/NavigatorCategoriesEvent';
import { NavigatorCollapsedEvent } from '../../../../client/nitro/communication/messages/incoming/navigator/NavigatorCollapsedEvent';
import { NavigatorEventCategoriesEvent } from '../../../../client/nitro/communication/messages/incoming/navigator/NavigatorEventCategoriesEvent';
import { NavigatorLiftedEvent } from '../../../../client/nitro/communication/messages/incoming/navigator/NavigatorLiftedEvent';
import { NavigatorMetadataEvent } from '../../../../client/nitro/communication/messages/incoming/navigator/NavigatorMetadataEvent';
import { NavigatorOpenRoomCreatorEvent } from '../../../../client/nitro/communication/messages/incoming/navigator/NavigatorOpenRoomCreatorEvent';
import { NavigatorSearchesEvent } from '../../../../client/nitro/communication/messages/incoming/navigator/NavigatorSearchesEvent';
import { NavigatorSearchEvent } from '../../../../client/nitro/communication/messages/incoming/navigator/NavigatorSearchEvent';
import { NavigatorSettingsEvent } from '../../../../client/nitro/communication/messages/incoming/navigator/NavigatorSettingsEvent';
import { RoomDoorbellAcceptedEvent } from '../../../../client/nitro/communication/messages/incoming/room/access/doorbell/RoomDoorbellAcceptedEvent';
import { RoomDoorbellEvent } from '../../../../client/nitro/communication/messages/incoming/room/access/doorbell/RoomDoorbellEvent';
import { RoomDoorbellRejectedEvent } from '../../../../client/nitro/communication/messages/incoming/room/access/doorbell/RoomDoorbellRejectedEvent';
import { RoomEnterErrorEvent } from '../../../../client/nitro/communication/messages/incoming/room/access/RoomEnterErrorEvent';
import { RoomForwardEvent } from '../../../../client/nitro/communication/messages/incoming/room/access/RoomForwardEvent';
import { RoomInfoEvent } from '../../../../client/nitro/communication/messages/incoming/room/data/RoomInfoEvent';
import { RoomInfoOwnerEvent } from '../../../../client/nitro/communication/messages/incoming/room/data/RoomInfoOwnerEvent';
import { RoomCreatedEvent } from '../../../../client/nitro/communication/messages/incoming/room/engine/RoomCreatedEvent';
import { UserInfoEvent } from '../../../../client/nitro/communication/messages/incoming/user/data/UserInfoEvent';
import { DesktopViewComposer } from '../../../../client/nitro/communication/messages/outgoing/desktop/DesktopViewComposer';
import { NavigatorCategoriesComposer } from '../../../../client/nitro/communication/messages/outgoing/navigator/NavigatorCategoriesComposer';
import { NavigatorInitComposer } from '../../../../client/nitro/communication/messages/outgoing/navigator/NavigatorInitComposer';
import { NavigatorSearchComposer } from '../../../../client/nitro/communication/messages/outgoing/navigator/NavigatorSearchComposer';
import { NavigatorSettingsComposer } from '../../../../client/nitro/communication/messages/outgoing/navigator/NavigatorSettingsComposer';
import { RoomInfoComposer } from '../../../../client/nitro/communication/messages/outgoing/room/data/RoomInfoComposer';
import { NavigatorCategoryDataParser } from '../../../../client/nitro/communication/messages/parser/navigator/NavigatorCategoryDataParser';
import { NavigatorSearchResultList } from '../../../../client/nitro/communication/messages/parser/navigator/utils/NavigatorSearchResultList';
import { NavigatorTopLevelContext } from '../../../../client/nitro/communication/messages/parser/navigator/utils/NavigatorTopLevelContext';
import { RoomEnterErrorParser } from '../../../../client/nitro/communication/messages/parser/room/access/RoomEnterErrorParser';
import { RoomDataParser } from '../../../../client/nitro/communication/messages/parser/room/data/RoomDataParser';
import { ToolbarIconEnum } from '../../../../client/nitro/enums/ToolbarIconEnum';
import { NitroToolbarEvent } from '../../../../client/nitro/events/NitroToolbarEvent';
import { Nitro } from '../../../../client/nitro/Nitro';
import { RoomSessionEvent } from '../../../../client/nitro/session/events/RoomSessionEvent';
import { SettingsService } from '../../../core/settings/service';
import { AlertService } from '../../alert/services/alert.service';
import { NavigatorMainComponent } from '../components/main/main.component';
import { INavigatorSearchFilter } from '../components/search/INavigatorSearchFilter';

@Injectable()
export class NavigatorService implements OnDestroy
{
    public static SEARCH_FILTERS: INavigatorSearchFilter[] = [
        {
            name: 'anything',
            query: null
        },
        {
            name: 'room.name',
            query: 'roomname'
        },
        {
            name: 'owner',
            query: 'owner'
        },
        {
            name: 'tag',
            query: 'tag'
        },
        {
            name: 'group',
            query: 'group'
        }
    ];

    private _component: NavigatorMainComponent;
    private _topLevelContexts: NavigatorTopLevelContext[];
    private _topLevelContext: NavigatorTopLevelContext;
    private _categories: NavigatorCategoryDataParser[];
    private _filter: INavigatorSearchFilter;
    private _lastSearchResults: NavigatorSearchResultList[];
    private _lastSearch: string;

    private _messages: IMessageEvent[] = [];

    private _isSearching: boolean;
    private _isLoaded: boolean;
    private _isLoading: boolean;

    constructor(
        private _alertService: AlertService,
        private _settingsService: SettingsService,
        private _ngZone: NgZone)
    {
        this._component         = null;
        this._topLevelContexts  = [];
        this._topLevelContext   = null;
        this._categories        = [];
        this._filter            = NavigatorService.SEARCH_FILTERS[0];
        this._lastSearchResults = [];
        this._lastSearch        = '';

        this._isSearching       = false;
        this._isLoaded          = false;
        this._isLoading         = false;

        this.registerMessages();
    }

    public ngOnDestroy(): void
    {
        this.unregisterMessages();
    }

    private registerMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionEvent.CREATED, this.onRoomSessionEvent.bind(this));

            this._messages = [
                new UserInfoEvent(this.onUserInfoEvent.bind(this)),
                new RoomForwardEvent(this.onRoomForwardEvent.bind(this)),
                new RoomInfoOwnerEvent(this.onRoomInfoOwnerEvent.bind(this)),
                new RoomInfoEvent(this.onRoomInfoEvent.bind(this)),
                new RoomEnterErrorEvent(this.onRoomEnterErrorEvent.bind(this)),
                new RoomCreatedEvent(this.onRoomCreatedEvent.bind(this)),
                new RoomDoorbellEvent(this.onRoomDoorbellEvent.bind(this)),
                new RoomDoorbellAcceptedEvent(this.onRoomDoorbellAcceptedEvent.bind(this)),
                new RoomDoorbellRejectedEvent(this.onRoomDoorbellRejectedEvent.bind(this)),
                new NavigatorCategoriesEvent(this.onNavigatorCategoriesEvent.bind(this)),
                new NavigatorCollapsedEvent(this.onNavigatorCollapsedEvent.bind(this)),
                new NavigatorEventCategoriesEvent(this.onNavigatorEventCategoriesEvent.bind(this)),
                new NavigatorLiftedEvent(this.onNavigatorLiftedEvent.bind(this)),
                new NavigatorMetadataEvent(this.onNavigatorMetadataEvent.bind(this)),
                new NavigatorOpenRoomCreatorEvent(this.onNavigatorOpenRoomCreatorEvent.bind(this)),
                new NavigatorSearchesEvent(this.onNavigatorSearchesEvent.bind(this)),
                new NavigatorSearchEvent(this.onNavigatorSearchEvent.bind(this)),
                new NavigatorSettingsEvent(this.onNavigatorSettingsEvent.bind(this)),
            ];

            for(let message of this._messages) Nitro.instance.communication.registerMessageEvent(message);
        });
    }

    public unregisterMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            Nitro.instance.roomSessionManager.events.removeEventListener(RoomSessionEvent.CREATED, this.onRoomSessionEvent.bind(this));

            for(let message of this._messages) Nitro.instance.communication.removeMessageEvent(message);

            this._messages = [];
        });
    }

    private onRoomSessionEvent(event: RoomSessionEvent): void
    {
        if(!event) return;

        switch(event.type)
		{
			case RoomSessionEvent.CREATED:
				this._ngZone.run(() => this._settingsService.hideNavigator());
				return;
        }
    }

    private onUserInfoEvent(event: UserInfoEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        Nitro.instance.communication.connection.send(new NavigatorCategoriesComposer());
        Nitro.instance.communication.connection.send(new NavigatorSettingsComposer());
    }

    private onRoomForwardEvent(event: RoomForwardEvent): void
    {
        if(!(event instanceof RoomForwardEvent)) return;

        const parser = event.getParser();

        if(!parser) return;

        Nitro.instance.communication.connection.send(new RoomInfoComposer(parser.roomId, false, true));
    }

    private onRoomInfoOwnerEvent(event: RoomInfoOwnerEvent): void
    {
        if(!(event instanceof RoomInfoOwnerEvent)) return;

        const parser = event.getParser();

        if(!parser) return;

        Nitro.instance.communication.connection.send(new RoomInfoComposer(parser.roomId, true, false));

        Nitro.instance.externalInterface.call('legacyTrack', 'navigator', 'private', [parser.roomId]);
    }

    private onRoomInfoEvent(event: RoomInfoEvent): void
    {
        if(!(event instanceof RoomInfoEvent)) return;

        const parser = event.getParser();

        if(!parser) return;

        if(parser.roomEnter)
        {
            // if an ad needs to display, do it here
            // refresh the room info window / display it
        }
        else
        {
            if(parser.roomForward)
            {
                if(parser.data.ownerName !== Nitro.instance.sessionDataManager.userName)
                {
                    switch(parser.data.doorMode)
                    {
                        case RoomDataParser.DOORBELL_STATE:
                            console.log('DOORBELL');
                            return;
                        case RoomDataParser.PASSWORD_STATE:
                            console.log('PASSWORD');
                            return;
                    }
                }

                this.goToRoom(parser.data.roomId);
            }
            else
            {
                // update room data with new data
            }
        }
    }

    private onRoomEnterErrorEvent(event: RoomEnterErrorEvent): void
    {
        if(!(event instanceof RoomEnterErrorEvent)) return;

        const parser = event.getParser();

        if(!parser) return;

        switch(parser.reason)
        {
            case RoomEnterErrorParser.FULL_ERROR:
                this._ngZone.run(() => this._alertService.alert('${navigator.guestroomfull.text}', '${navigator.guestroomfull.title}'));
                break;
            case RoomEnterErrorParser.QUEUE_ERROR:
                this._ngZone.run(() => this._alertService.alert('${room.queue.error.title}', '${room.queue.error. ' + parser.parameter + '}'));
                break;
            case RoomEnterErrorParser.BANNED:
                this._ngZone.run(() => this._alertService.alert('${navigator.banned.title}', '${navigator.banned.text}'));
                break;
            default:
                this._ngZone.run(() => this._alertService.alert('${room.queue.error.title}', '${room.queue.error.title}'));
                break;

        }

        Nitro.instance.communication.connection.send(new DesktopViewComposer());

        const toolbarEvent = new NitroToolbarEvent(NitroToolbarEvent.TOOLBAR_CLICK);

        toolbarEvent.iconName = ToolbarIconEnum.HOTEL_VIEW;

        Nitro.instance.roomEngine.events.dispatchEvent(toolbarEvent);
    }

    private onRoomCreatedEvent(event: RoomCreatedEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this.goToRoom(parser.roomId);
    }

    private onRoomDoorbellEvent(event: RoomDoorbellEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        if(!parser.userName || (parser.userName.length === 0))
        {
            this._ngZone.run(() => (this._component && this._component.openRoomDoorbell(null, true)));
        }
    }

    private onRoomDoorbellAcceptedEvent(event: RoomDoorbellAcceptedEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        if(!parser.userName || (parser.userName.length === 0))
        {
            this._ngZone.run(() => (this._component && this._component.closeRoomDoorbell()));
        }
    }

    private onRoomDoorbellRejectedEvent(event: RoomDoorbellRejectedEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        if(!parser.userName || (parser.userName.length === 0))
        {
            this._ngZone.run(() => (this._component && this._component.openRoomDoorbell(null, false, true)));
        }
    }

    private onNavigatorCategoriesEvent(event: NavigatorCategoriesEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() => this._categories = parser.categories);
    }

    private onNavigatorCollapsedEvent(event: NavigatorCollapsedEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;
    }

    private onNavigatorEventCategoriesEvent(event: NavigatorEventCategoriesEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;
    }

    private onNavigatorLiftedEvent(event: NavigatorLiftedEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;
    }

    private onNavigatorMetadataEvent(event: NavigatorMetadataEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() =>
        {
            this._topLevelContexts  = parser.topLevelContexts;
            this._isLoaded          = true;
            this._isLoading         = false;

            if(this._topLevelContexts.length > 0) this.setCurrentContext(this._topLevelContexts[0]);

            this.clearSearch();
        });
    }

    private onNavigatorOpenRoomCreatorEvent(event: NavigatorOpenRoomCreatorEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        if(!this._component) return;

        this._ngZone.run(() => this._component.openRoomCreator());
    }

    private onNavigatorSearchesEvent(event: NavigatorSearchesEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;
    }

    private onNavigatorSearchEvent(event: NavigatorSearchEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        const resultSet = parser.result;

        if(!resultSet) return;

        this._ngZone.run(() =>
        {
            this.setCurrentContextByCode(resultSet.code);

            this._lastSearchResults = resultSet.results;
            this._isSearching       = false;
        });
    }

    private onNavigatorSettingsEvent(event: NavigatorSettingsEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;
    }

    public goToRoom(roomId: number, password: string = null): void
    {
        Nitro.instance.roomSessionManager.createSession(roomId, password);
    }

    public goToPrivateRoom(roomId: number): void
    {
        Nitro.instance.communication.connection.send(new RoomInfoComposer(roomId, false, true));
    }

    public getContextByCode(code: string): NavigatorTopLevelContext
    {
        if(!code) return null;

        for(let context of this._topLevelContexts)
        {
            if(!context || (context.code !== code)) continue;

            return context;
        }

        return null;
    }

    public setCurrentContext(context: NavigatorTopLevelContext, search: boolean = true): void
    {
        if(!context || (this._topLevelContext === context)) return;

        this._topLevelContext = context;
    }

    public setCurrentContextByCode(code: string, search: boolean = true): void
    {
        if(!code) return;

        const topLevelContext = this.getContextByCode(code);

        if(!topLevelContext) return;

        this.setCurrentContext(topLevelContext, search);
    }

    public setCurrentFilter(filter: INavigatorSearchFilter): void
    {
        if(!filter || (this._filter === filter)) return;

        this._filter = filter;
    }

    public search(value: string = null): void
    {
        if(!this._topLevelContext || this._isSearching) return;

        if(!this._filter) this.setCurrentFilter(NavigatorService.SEARCH_FILTERS[0]);

        const query = ((this._filter && this._filter.query) ? this._filter.query + ':' : '');

        let search = value;

        if(search === null) search = this._lastSearch;

        this._lastSearch = (search || '');

        this.sendSearch(this._topLevelContext.code, (query + this._lastSearch));
    }

    public clearSearch(): void
    {
        this.setCurrentFilter(NavigatorService.SEARCH_FILTERS[0]);
        
        this._lastSearch = null;

        (this.isLoaded && this.search());
    }

    private sendSearch(code: string, query: string): void
    {
        if(!code) return;

        this._isSearching = true;

        this._ngZone.runOutsideAngular(() => Nitro.instance.communication.connection.send(new NavigatorSearchComposer(code, query)));
    }

    public loadNavigator(): void
    {
        if(this._isLoaded || this._isLoading) return;

        this._isLoading = true;

        this._ngZone.runOutsideAngular(() => Nitro.instance.communication.connection.send(new NavigatorInitComposer()));
    }

    public openRoomDoorbell(room: RoomDataParser): void
    {
        if(!room || !this._component) return;

        this._component.openRoomDoorbell(room);
    }

    public openRoomPassword(room: RoomDataParser): void
    {
        if(!room || !this._component) return;

        this._component.openRoomPassword(room);
    }

    public get component(): NavigatorMainComponent
    {
        return this._component;
    }

    public set component(component: NavigatorMainComponent)
    {
        this._component = component;
    }

    public get topLevelContexts(): NavigatorTopLevelContext[]
    {
        return this._topLevelContexts;
    }

    public get topLevelContext(): NavigatorTopLevelContext
    {
        return this._topLevelContext;
    }

    public get categories(): NavigatorCategoryDataParser[]
    {
        return this._categories;
    }

    public get filter(): INavigatorSearchFilter
    {
        return this._filter;
    }

    public get lastSearch(): string
    {
        return this._lastSearch;
    }

    public set lastSearch(value: string)
    {
        this._lastSearch = value;
    }

    public get lastSearchResults(): NavigatorSearchResultList[]
    {
        return this._lastSearchResults;
    }

    public get isSearching(): boolean
    {
        return this._isSearching;
    }

    public get isLoaded(): boolean
    {
        return this._isLoaded;
    }

    public get isLoading(): boolean
    {
        return this._isLoading;
    }
}