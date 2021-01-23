import { AfterViewInit, Directive, ElementRef, Input, NgZone, OnDestroy, ViewContainerRef } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';

@Directive({
    selector: '[draggable]'
})
export class DraggableDirective implements AfterViewInit, OnDestroy
{
    private static POS_MEMORY = new Map();

    @Input()
    public dragHandle: string = '.drag-handler';

    @Input()
    public dragTarget: string;

    @Input()
    public center: boolean = true;

    @Input()
    public noMemory: boolean = false;
  
    private _name: string           = null;
    private _target: HTMLElement    = null;
    private _handle: HTMLElement    = null;
    private _delta                  = { x: 0, y: 0 };
    private _offset                 = { x: 0, y: 0 };
    private _destroy                = new Subject<void>();
  
    constructor(
        private _viewContainerRef: ViewContainerRef,
        private _elementRef: ElementRef,
        private _ngZone: NgZone)
    {}
  
    public ngAfterViewInit(): void
    {
        this._name = this._viewContainerRef['_hostTNode']['classesWithoutHost'];
        
        const element = (this._elementRef.nativeElement as HTMLElement);

        if(!element) return;

        this._handle = this.dragHandle ? element.querySelector(this.dragHandle) : element;
        this._target = this.dragTarget ? element.querySelector(this.dragTarget) : element;

        if(this._handle)
        {
            this._handle.classList.add('header-draggable');

            this._handle.parentElement.classList.add('header-draggable');
        }

        if(this.center)
        {
            element.style.top = `calc(50vh - ${ (element.offsetHeight / 2) }px)`;
            element.style.left = `calc(50vw - ${ (element.offsetWidth / 2) }px)`;
        }

        const memory = DraggableDirective.POS_MEMORY.get(this._name);

        if(memory)
        {
            this._offset.x  = memory.offset.x;
            this._offset.y  = memory.offset.y;
            this._delta.x   = memory.delta.x;
            this._delta.y   = memory.delta.y;

            this.translate();
        }

        this.setupEvents();
    }
  
    public ngOnDestroy(): void
    {
        if(this._handle)
        {
            this._handle.classList.remove('header-draggable');

            this._handle.parentElement.classList.remove('header-draggable');
        }
        
        this._destroy.next();
    }

    private setupEvents(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            const mousedown$  = fromEvent(this._handle, 'mousedown');
            const mousemove$  = fromEvent(document, 'mousemove');
            const mouseup$    = fromEvent(document, 'mouseup');
    
            const mousedrag$ = mousedown$
                .pipe(
                    switchMap((event: MouseEvent) =>
                    {
                        const startX = event.clientX;
                        const startY = event.clientY;
            
                        return mousemove$
                            .pipe(
                                map((event: MouseEvent) =>
                                {
                                    event.preventDefault();

                                    this._delta = {
                                        x: event.clientX - startX,
                                        y: event.clientY - startY
                                    };
                                }),
                                takeUntil(mouseup$)
                            );
                    }),
                    takeUntil(this._destroy)
                );
    
            mousedrag$.subscribe(() =>
            {
                if(this._delta.x === 0 && this._delta.y === 0) return;
        
                this.translate();
            });
    
            mouseup$
                .pipe(
                    takeUntil(this._destroy)
                );
                
            mouseup$.subscribe(() =>
            {
                this._offset.x  += this._delta.x;
                this._offset.y  += this._delta.y;
                this._delta      = { x: 0, y: 0 };

                if(!this.noMemory)
                {
                    DraggableDirective.POS_MEMORY.set(this._name, {
                        offset: {
                            x: this._offset.x,
                            y: this._offset.y
                        },
                        delta: {
                            x: this._delta.x,
                            y: this._delta.y
                        }
                    });
                }
            });
        });
    }
  
    private translate(): void
    {
        this._target.style.transform = `translate(${this._offset.x + this._delta.x}px, ${this._offset.y + this._delta.y}px)`;
    }
}