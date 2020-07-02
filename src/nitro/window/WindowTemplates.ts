export class WindowTemplates
{
    public static CONTEXT_MENU: string                  = 'context_menu';
    public static CONTEXT_MENU_BUTTON: string           = 'context_menu_button';
    public static CONTEXT_MENU_AVATAR_VIEW: string      = 'context_menu_avatar_view';
    public static CONTEXT_MENU_OWN_AVATAR_VIEW: string  = 'context_menu_own_avatar_view';

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
    }
}