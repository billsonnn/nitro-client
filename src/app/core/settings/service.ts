import { Injectable } from '@angular/core';

@Injectable()
export class SettingsService
{
    private _isReady: boolean;
    private _avatarEditorVisible: boolean;
    private _navigatorVisible: boolean;
    private _catalogVisible: boolean;
    private _inventoryVisible: boolean;
    private _friendlistVisible: boolean;
    private _achievementsVisible: boolean;
    private _meMenuVisible: boolean;

    constructor()
    {
        this._isReady               = false;
        this._avatarEditorVisible   = false;
        this._navigatorVisible      = false;
        this._catalogVisible        = false;
        this._inventoryVisible      = false;
        this._friendlistVisible     = false;
        this._achievementsVisible   = false;
        this._meMenuVisible         = false;
    }

    public showAvatarEditor(): void
    {
        this._avatarEditorVisible = true;
    }

    public hideAvatarEditor(): void
    {
        this._avatarEditorVisible = false;
    }

    public showNavigator(): void
    {
        this._navigatorVisible = true;
    }

    public hideNavigator(): void
    {
        this._navigatorVisible = false;
    }

    public toggleAvatarEditor(): void
    {
        this._avatarEditorVisible = !this._avatarEditorVisible;
    }

    public toggleNavigator(): void
    {
        this._navigatorVisible = !this._navigatorVisible;
    }

    public showCatalog(): void
    {
        this._catalogVisible = true;
    }

    public hideCatalog(): void
    {
        this._catalogVisible = false;
    }

    public toggleCatalog(): void
    {
        this._catalogVisible = !this._catalogVisible;
    }

    public showInventory(): void
    {
        this._inventoryVisible = true;
    }

    public hideInventory(): void
    {
        this._inventoryVisible = false;
    }

    public toggleInventory(): void
    {
        this._inventoryVisible = !this._inventoryVisible;
    }

    public showFriendList(): void
    {
        this._friendlistVisible = true;
    }

    public hideFriendList(): void
    {
        this._friendlistVisible = false;
    }

    public toggleFriendList(): void
    {
        this._friendlistVisible = !this._friendlistVisible;
    }

    public showAchievements(): void
    {
        this._achievementsVisible = true;
    }

    public hideAchievements(): void
    {
        this._achievementsVisible = false;
    }

    public toggleAchievements(): void
    {
        this._achievementsVisible = !this._achievementsVisible;
    }

    public showMeMenu(): void
    {
        this._meMenuVisible = true;
    }

    public hideMeMenu(): void
    {
        this._meMenuVisible = false;
    }

    public toggleMeMenu(): void
    {
        this._meMenuVisible = !this._meMenuVisible;
    }

    public get avatarEditorVisible(): boolean
    {
        return this._avatarEditorVisible;
    }

    public get navigatorVisible(): boolean
    {
        return this._navigatorVisible;
    }

    public get catalogVisible(): boolean
    {
        return this._catalogVisible;
    }

    public get inventoryVisible(): boolean
    {
        return this._inventoryVisible;
    }

    public get friendListVisible(): boolean
    {
        return this._friendlistVisible;
    }

    public get achievementsVisible(): boolean
    {
        return this._achievementsVisible;
    }

    public get meMenuVisible(): boolean
    {
        return this._meMenuVisible;
    }

    public set isReady(isReady: boolean)
    {
        this._isReady = isReady;
    }

    public get isReady(): boolean
    {
        return this._isReady;
    }
}