import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { IMessageEvent } from '../../../client/core/communication/messages/IMessageEvent';
import { NavigatorCategoriesEvent } from '../../../client/nitro/communication/messages/incoming/navigator/NavigatorCategoriesEvent';
import { NavigatorCollapsedEvent } from '../../../client/nitro/communication/messages/incoming/navigator/NavigatorCollapsedEvent';
import { NavigatorEventCategoriesEvent } from '../../../client/nitro/communication/messages/incoming/navigator/NavigatorEventCategoriesEvent';
import { NavigatorLiftedEvent } from '../../../client/nitro/communication/messages/incoming/navigator/NavigatorLiftedEvent';
import { NavigatorMetadataEvent } from '../../../client/nitro/communication/messages/incoming/navigator/NavigatorMetadataEvent';
import { NavigatorSearchesEvent } from '../../../client/nitro/communication/messages/incoming/navigator/NavigatorSearchesEvent';
import { NavigatorSearchEvent } from '../../../client/nitro/communication/messages/incoming/navigator/NavigatorSearchEvent';
import { NavigatorSettingsEvent } from '../../../client/nitro/communication/messages/incoming/navigator/NavigatorSettingsEvent';
import { RoomForwardEvent } from '../../../client/nitro/communication/messages/incoming/room/access/RoomForwardEvent';
import { RoomInfoEvent } from '../../../client/nitro/communication/messages/incoming/room/data/RoomInfoEvent';
import { RoomInfoOwnerEvent } from '../../../client/nitro/communication/messages/incoming/room/data/RoomInfoOwnerEvent';
import { RoomCreatedEvent } from '../../../client/nitro/communication/messages/incoming/room/engine/RoomCreatedEvent';
import { UserInfoEvent } from '../../../client/nitro/communication/messages/incoming/user/data/UserInfoEvent';
import { NavigatorCategoriesComposer } from '../../../client/nitro/communication/messages/outgoing/navigator/NavigatorCategoriesComposer';
import { NavigatorInitComposer } from '../../../client/nitro/communication/messages/outgoing/navigator/NavigatorInitComposer';
import { NavigatorSearchComposer } from '../../../client/nitro/communication/messages/outgoing/navigator/NavigatorSearchComposer';
import { NavigatorSettingsComposer } from '../../../client/nitro/communication/messages/outgoing/navigator/NavigatorSettingsComposer';
import { RoomInfoComposer } from '../../../client/nitro/communication/messages/outgoing/room/data/RoomInfoComposer';
import { NavigatorCategoryDataParser } from '../../../client/nitro/communication/messages/parser/navigator/NavigatorCategoryDataParser';
import { NavigatorSearchResultList } from '../../../client/nitro/communication/messages/parser/navigator/utils/NavigatorSearchResultList';
import { NavigatorTopLevelContext } from '../../../client/nitro/communication/messages/parser/navigator/utils/NavigatorTopLevelContext';
import { RoomDataParser } from '../../../client/nitro/communication/messages/parser/room/data/RoomDataParser';
import { Nitro } from '../../../client/nitro/Nitro';
import { RoomSessionEvent } from '../../../client/nitro/session/events/RoomSessionEvent';
import { SettingsService } from '../../core/settings/service';
import { INavigatorSearchFilter } from './search/INavigatorSearchFilter';

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

    private _messages: IMessageEvent[] = [];

    private _topLevelContexts: NavigatorTopLevelContext[];
    private _topLevelContext: NavigatorTopLevelContext;
    private _categories: NavigatorCategoryDataParser[];
    private _filter: INavigatorSearchFilter;
    private _lastSearchResults: NavigatorSearchResultList[];
    private _lastSearch: string;

    private _isSearching: boolean;
    private _isLoaded: boolean;
    private _isLoading: boolean;

    constructor(
        private _settingsService: SettingsService,
        private _ngZone: NgZone)
    {
        this._topLevelContexts  = [];
        this._topLevelContext   = null;
        this._categories        = [];
        this._filter            = NavigatorService.SEARCH_FILTERS[0];
        this._lastSearchResults = [];
        this._lastSearch        = null;

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
                new RoomCreatedEvent(this.onRoomCreatedEvent.bind(this)),
                new NavigatorCategoriesEvent(this.onNavigatorCategoriesEvent.bind(this)),
                new NavigatorCollapsedEvent(this.onNavigatorCollapsedEvent.bind(this)),
                new NavigatorEventCategoriesEvent(this.onNavigatorEventCategoriesEvent.bind(this)),
                new NavigatorLiftedEvent(this.onNavigatorLiftedEvent.bind(this)),
                new NavigatorMetadataEvent(this.onNavigatorMetadataEvent.bind(this)),
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

                this.createSession(parser.data.id);
            }
            else
            {
                // update room data with new data
            }
        }
    }

    private onRoomCreatedEvent(event: RoomCreatedEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this.createSession(parser.roomId);
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
        console.log(event);
    }

    private onNavigatorEventCategoriesEvent(event: NavigatorEventCategoriesEvent): void
    {
        console.log(event);
    }

    private onNavigatorLiftedEvent(event: NavigatorLiftedEvent): void
    {
        console.log(event);
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
        });
    }

    private onNavigatorSearchesEvent(event: NavigatorSearchesEvent): void
    {
        console.log(event);
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
        console.log(event);
    }

    public goToRoom(roomId: number): void
    {
        Nitro.instance.communication.connection.send(new RoomInfoComposer(roomId, false, true));
    }

    private createSession(roomId: number, password: string = null): void
    {
        Nitro.instance.roomSessionManager.createSession(roomId, password);
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

        (this.isLoaded && this.search());
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

        if(!this._filter) this._filter = NavigatorService.SEARCH_FILTERS[0];
        
        const query = ((this._filter && this._filter.query) ? this._filter.query + ':' : '');

        this._lastSearch = (query + (value || ''));

        this.sendSearch(this._topLevelContext.code, this._lastSearch);
    }

    public clearSearch(): void
    {
        if(!this._lastSearchResults || !this._lastSearchResults.length) return;

        this._lastSearchResults = [];
        this._lastSearch        = null;
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