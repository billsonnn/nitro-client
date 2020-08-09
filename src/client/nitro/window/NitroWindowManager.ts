import { NitroManager } from '../../core/common/NitroManager';
import { MouseEventType } from '../ui/MouseEventType';
import { INitroWindowManager } from './INitroWindowManager';
import { WindowTemplates } from './WindowTemplates';

export class NitroWindowManager extends NitroManager implements INitroWindowManager
{
    private _window: HTMLDivElement;
    private _desktops: Map<string, HTMLElement>;
    private _templates: WindowTemplates;

    private _mouseX: number;
    private _mouseY: number;

    constructor()
    {
        super();

        this._window    = null;
        this._desktops  = new Map();
        this._templates = new WindowTemplates();

        this._mouseX    = 0;
        this._mouseY    = 0;

        this.setupWindow();
    }

    public onDispose(): void
    {
        for(let desktop of this._desktops.values()) desktop && desktop.remove();

        this._desktops = null;

        if(this._window)
        {
            this._window.remove();

            this._window = null;
        }
    }

    private setupWindow(): void
    {
        if(this._window) return;

        this._window = (this.htmlToElement(`<div class="nitro-window-container"></div>`) as HTMLDivElement);

        document.body.appendChild(this._window);
    }

    public getDesktop(roomId: string = null): HTMLElement
    {
        if(!roomId) roomId = this.roomId;
        
        const existing = this._desktops.get(roomId);

        if(!existing) return null;

        return existing;
    }

    public addDesktop(roomId: string, desktop: HTMLElement): void
    {
        let existing = this._desktops.get(roomId);

        if(existing)
        {
            existing.remove();
        }

        existing = desktop;

        this._desktops.set(roomId, desktop);

        this._window.appendChild(desktop);
    }

    public removeDesktop(roomId: string): void
    {
        const existing = this._desktops.get(roomId);

        if(!existing) return;

        this._desktops.delete(roomId);

        if(existing.parentElement) existing.parentElement.removeChild(existing);
    }

    public getTemplate(name: string): string
    {
        if(!name || !this._templates) return null;

        return this._templates.getTemplate(name);
    }

    public renderElement(template: string, view: {}): HTMLElement
    {
        if(!template) return;

        //const element = this.htmlToElement(Mustache.render(template, view));

        const element = this.htmlToElement(template);

        //this.centerElement(element);
        this.makeDraggable(element);

        return element;
    }

    private makeDraggable(element: HTMLElement): void
    {
        if(!element) return;

        const draggableElement = element.getElementsByClassName('drag-handler')[0] as HTMLElement;

        if(!draggableElement) return;
        
        draggableElement.onmousedown = this.onMouseEvent.bind(this);
    }

    public centerElement(element: HTMLElement): void
    {
        element.style.top = `calc(50% - ${ (element.clientHeight / 2) }px)`;
        element.style.left = `calc(50% - ${ (element.clientWidth / 2) }px)`;
    }

    private onMouseEvent(event: MouseEvent): void
    {
        if(!event) return;

        const target    = event.target as HTMLDivElement;
        const parent    = target.parentElement;

        switch(event.type)
        {
            case MouseEventType.MOUSE_MOVE:
                event.preventDefault();

                const offsetX   = (event.clientX - this._mouseX);
                const offsetY   = (event.clientY - this._mouseY);

                parent.style.left   = ((parent.offsetLeft + offsetX + 'px'));
                parent.style.top    = ((parent.offsetTop + offsetY + 'px'));
                break;
            case MouseEventType.MOUSE_DOWN:
                target.onmouseup    = this.onMouseEvent.bind(this);
                target.onmousemove  = this.onMouseEvent.bind(this);
                break;
            case MouseEventType.MOUSE_UP:
                this._mouseX    = 0;
                this._mouseY    = 0;
                
                target.onmouseup    = null;
                target.onmousemove  = null;
                return;
        }

        this._mouseX    = event.clientX;
        this._mouseY    = event.clientY;
    }

    public htmlToElement(html: string): HTMLElement
    {
        const element = document.createElement('template');

        html = html.trim();

        element.innerHTML = html;

        return (element.content.firstChild as HTMLElement);
    }

    public get window(): HTMLDivElement
    {
        return this._window;
    }

    public get roomId(): string
    {
        return 'hard_coded_room_id';
    }
}