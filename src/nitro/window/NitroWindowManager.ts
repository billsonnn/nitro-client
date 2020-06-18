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

        this._window = (this.htmlToElement(`<div class="nitro-window-container"></div>`) as HTMLDivElement);

        document.body.append(this._window);
    }

    public renderElement(template: string, view: {}): HTMLElement
    {
        if(!template) return;

        const element = this.htmlToElement(Mustache.render(template, view));

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
}