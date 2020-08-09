import { AfterViewInit, Directive, ElementRef, NgZone, OnDestroy } from '@angular/core';

@Directive({
    selector: '[bringToTop]'
})
export class BringToTopDirective implements AfterViewInit, OnDestroy
{
    private static LAST_Z_INDEX: number = 425;
  
    private target: HTMLElement = null;
  
    constructor(
        private elementRef: ElementRef,
        private zone: NgZone) {}
  
    public ngAfterViewInit(): void
    {
        const element = (this.elementRef.nativeElement as HTMLElement);

        if(!element) return;

        this.target = element;

        this.setupEvents();

        this.bringToTop();
    }
  
    public ngOnDestroy(): void
    {
        this.zone.runOutsideAngular(() =>
        {
            if(!this.target) return;

            this.target.removeEventListener('mousedown', this.bringToTop.bind(this));
        });
    }

    private setupEvents(): void
    {
        this.zone.runOutsideAngular(() =>
        {
            if(!this.target) return;

            this.target.addEventListener('mousedown', this.bringToTop.bind(this));
        });
    }

    private bringToTop(event: MouseEvent = null): void
    {
        if(!this.target) return;

        let zIndex = parseInt(this.target.style.zIndex);

        if(BringToTopDirective.LAST_Z_INDEX === null)
        {
            BringToTopDirective.LAST_Z_INDEX = zIndex;
        }
        else
        {
            if(zIndex === BringToTopDirective.LAST_Z_INDEX) return;
            
            zIndex = (BringToTopDirective.LAST_Z_INDEX + 1);

            this.target.style.zIndex = (zIndex.toString());

            BringToTopDirective.LAST_Z_INDEX = zIndex;
        }
    }
}