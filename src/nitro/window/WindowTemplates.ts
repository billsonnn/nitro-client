export class WindowTemplates
{
    public static CONTEXT_MENU: string                      = 'context_menu';
    public static CONTEXT_MENU_BUTTON: string               = 'context_menu_button';
    public static CONTEXT_MENU_AVATAR_VIEW: string          = 'context_menu_avatar_view';
    public static CONTEXT_MENU_OWN_AVATAR_VIEW: string      = 'context_menu_own_avatar_view';
    public static INFOSTAND_MENU: string                    = 'infostand_menu';
    public static INFOSTAND_MENU_USER_VIEW: string          = 'infostand_menu_user_view';
    public static INFOSTAND_MENU_FURNI_VIEW: string         = 'infostand_menu_furni_view';

    private _templates: Map<string, string>;

    constructor()
    {
        this._templates = new Map();

        this.registerTemplates();
    }

    public getTemplate(name: string): string
    {
        return (this._templates.get(name) || null);
    }

    private registerTemplate(name: string, template: string): void
    {
        this._templates.set(name, template);
    }

    private registerTemplates(): void
    {
        this.registerTemplate(
            WindowTemplates.CONTEXT_MENU,
            `<div class="nitro-widget nitro-widget-context-menu">
                <div class="widget-header">
                    <div class="header-title">{{ username }}</div>
                </div>
                <div class="widget-pointer"></div>
            </div>`);

        this.registerTemplate(
            WindowTemplates.CONTEXT_MENU_BUTTON,
            `<div class="button-item">
                <div class="item-name" data-tag="{{ itemName }}">{{ itemNameLocalized }}</div>
            </div>`);

        this.registerTemplate(
            WindowTemplates.CONTEXT_MENU_AVATAR_VIEW,
            `<div class="nitro-widget nitro-widget-context-menu avatar-menu">
                <div class="widget-header">
                    <div class="header-title">{{ username }}</div>
                </div>
                <div class="widget-body">
                    <div class="button-container"></div>
                </div>
                <div class="widget-pointer"></div>
            </div>`);

        this.registerTemplate(
            WindowTemplates.CONTEXT_MENU_OWN_AVATAR_VIEW,
            `<div class="nitro-widget nitro-widget-context-menu own-avatar-menu">
                <div class="widget-header">
                    <div class="header-title">{{ username }}</div>
                </div>
                <div class="widget-body">
                    <div class="button-container"></div>
                </div>
                <div class="widget-pointer"></div>
            </div>`);

        this.registerTemplate(
            WindowTemplates.INFOSTAND_MENU,
            `<div class="infostand-container"></div>`);

        this.registerTemplate(
            WindowTemplates.INFOSTAND_MENU_USER_VIEW,
            `<div class="container-view">
                <div class="nitro-widget nitro-widget-infostand infostand-user-view">
                    <div class="widget-header">
                        <div class="profile-link" data-tag="profile-link">
                            <div class="header-title" data-tag="name-text"></div>
                        </div>
                        <div class="header-close" data-tag="close"><i class="fas fa-times"></i></div>
                    </div>
                    <div class="widget-body">
                        <div class="image-container" data-tag="image"></div>
                    </div>
                </div>
            </div>`);

        this.registerTemplate(
            WindowTemplates.INFOSTAND_MENU_FURNI_VIEW,
            `<div class="container-view">
                <div class="nitro-widget nitro-widget-infostand infostand-furni-view">
                    <div class="widget-header">
                        <div class="header-title" data-tag="name-text"></div>
                        <div class="header-close" data-tag="close"><i class="fas fa-times"></i></div>
                    </div>
                    <div class="widget-body">
                        <div class="image-container" data-tag="image"></div>
                        <div class="furni-description" data-tag="desc-text"></div>
                        <div class="profile-link" data-tag="profile-link">
                            <i class="fas fa-user"></i>
                            <div class="furni-owner" data-tag="owner-text"></div>
                        </div>
                    </div>
                </div>
                <div class="btn-group nitro-widget-infostand-buttons" data-tag="buttons">
                    <button type="button" class="btn btn-destiny" data-tag="move">move</button>
                    <button type="button" class="btn btn-destiny" data-tag="rotate">rotate</button>
                    <button type="button" class="btn btn-destiny" data-tag="pickup">pickup</button>
                    <button type="button" class="btn btn-destiny" data-tag="use">use</button>
                </div>
            </div>`);
    }
}