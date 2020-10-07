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
import { NavigatorCategoriesComposer } from '../../../client/nitro/communication/messages/outgoing/navigator/NavigatorCategoriesComposer';
import { NavigatorInitComposer } from '../../../client/nitro/communication/messages/outgoing/navigator/NavigatorInitComposer';
import { NavigatorSearchComposer } from '../../../client/nitro/communication/messages/outgoing/navigator/NavigatorSearchComposer';
import { NavigatorSearchResultList } from '../../../client/nitro/communication/messages/parser/navigator/utils/NavigatorSearchResultList';
import { NavigatorTopLevelContext } from '../../../client/nitro/communication/messages/parser/navigator/utils/NavigatorTopLevelContext';
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
    private _filter: INavigatorSearchFilter;
    private _lastSearchResults: NavigatorSearchResultList[];
    private _lastSearch: string;

    private _isSearching: boolean;
    private _isLoaded: boolean;
    private _isLoading: boolean;

    private _width: number;
    private _height: number;

    constructor(
        private settingsService: SettingsService,
        private ngZone: NgZone)
    {
        this._topLevelContexts  = [];
        this._topLevelContext   = null;
        this._filter            = NavigatorService.SEARCH_FILTERS[0];
        this._lastSearchResults = [];
        this._lastSearch        = null;

        this._isSearching       = false;
        this._isLoaded          = false;
        this._isLoading         = false;

        this._width             = 435;
        this._height            = 535;

        this.registerMessages();
    }

    public ngOnDestroy(): void
    {
        this.unregisterMessages();
    }

    private registerMessages(): void
    {
        this.ngZone.runOutsideAngular(() =>
        {
            Nitro.instance.roomSessionManager.events.addEventListener(RoomSessionEvent.CREATED, this.onRoomSessionEvent.bind(this));

            this._messages = [
                new NavigatorCategoriesEvent(this.onNavigatorCategoriesEvent.bind(this)),
                new NavigatorCollapsedEvent(this.onNavigatorCollapsedEvent.bind(this)),
                new NavigatorEventCategoriesEvent(this.onNavigatorEventCategoriesEvent.bind(this)),
                new NavigatorLiftedEvent(this.onNavigatorLiftedEvent.bind(this)),
                new NavigatorMetadataEvent(this.onNavigatorMetadataEvent.bind(this)),
                new NavigatorSearchesEvent(this.onNavigatorSearchesEvent.bind(this)),
                new NavigatorSearchEvent(this.onNavigatorSearchEvent.bind(this)),
                new NavigatorSettingsEvent(this.onNavigatorSettingsEvent.bind(this))
            ];

            for(let message of this._messages) Nitro.instance.communication.registerMessageEvent(message);
        });
    }

    public unregisterMessages(): void
    {
        this.ngZone.runOutsideAngular(() =>
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
				this.ngZone.run(() => this.settingsService.hideNavigator());
				return;
        }
    }

    private onNavigatorCategoriesEvent(event: NavigatorCategoriesEvent): void
    {
        console.log(event);
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

        this.ngZone.run(() =>
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

        this.ngZone.run(() =>
        {
            this.setCurrentContextByCode(resultSet.code);

            this._lastSearchResults = resultSet.results;
            this._isSearching       = false;

            console.log(this._lastSearchResults);
        });
    }

    private onNavigatorSettingsEvent(event: NavigatorSettingsEvent): void
    {
        console.log(event);
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

        this.ngZone.runOutsideAngular(() => Nitro.instance.communication.connection.send(new NavigatorSearchComposer(code, query)));
    }

    public loadNavigator(): void
    {
        if(this._isLoaded || this._isLoading) return;

        this._isLoading = true;

        this.ngZone.runOutsideAngular(() =>
        {
            Nitro.instance.communication.connection.send(new NavigatorInitComposer());
            Nitro.instance.communication.connection.send(new NavigatorCategoriesComposer());
        });
    }

    public get topLevelContexts(): NavigatorTopLevelContext[]
    {
        return this._topLevelContexts;
    }

    public get topLevelContext(): NavigatorTopLevelContext
    {
        return this._topLevelContext;
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

    public get width(): number
    {
        return this._width;
    }

    public get height(): number
    {
        return this._height;
    }
}