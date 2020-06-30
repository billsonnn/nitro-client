export class WindowTemplates
{
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
            'avatar_info_view',
            `<div class="nitro-widget nitro-widget-avatar-info-view">
                <div class="avatar-info-name"></div>
            </div>`);
    }
}