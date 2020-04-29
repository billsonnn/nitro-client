import Mustache from 'mustache';
import { NitroManager } from '../../core/common/NitroManager';
import { MouseEventType } from '../ui/MouseEventType';
import { INitroWindowManager } from './INitroWindowManager';

export class NitroWindowManager extends NitroManager implements INitroWindowManager
{
    private _window: HTMLDivElement;

    private _mouseX: number;
    private _mouseY: number;

    constructor()
    {
        super();

        this._window    = null;

        this._mouseX    = 0;
        this._mouseY    = 0;

        this.setupWindow();
    }

    public onDispose(): void
    {
        if(this._window)
        {
            this._window.remove();

            this._window = null;
        }
    }

    private setupWindow(): void
    {
        if(this._window) return;

        this._window = document.createElement('div');

        this._window.className = 'nitro-widget-container';

        document.body.append(this._window);

        this.resize();
    }

    public resize(): void
    {
        if(!this._window) return;

        this._window.style.width    = '100%';
        this._window.style.height   = '100%';
    }

    public createElement(): HTMLDivElement
    {
        const element = document.createElement('div');

        if(!element) return null;

        this.addElement(element);

        return element;
    }

    public renderElement(element: HTMLElement, template: string, view: {}): void
    {
        if(!element || !template) return;

        element.innerHTML = Mustache.render(template, view);

        const child = element.children[0] as HTMLElement;

        if(child)
        {
            this.centerElement(child);
            this.makeDraggable(child);
        }
    }

    private makeDraggable(element: HTMLElement): void
    {
        if(!element) return;

        const header = element.getElementsByClassName('drag-handler')[0] as HTMLElement;

        if(header) element = header;
        
        element.onmousedown = this.onMouseEvent.bind(this);
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

    private addElement(element: HTMLElement): void
    {
        if(this._window)
        {
            this._window.append(element);

            return;
        }

        document.body.append(element);
    }
}