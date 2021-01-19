import { AfterViewInit, Component, ElementRef, Input, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DisplayObject } from 'pixi.js';
import { Nitro } from '../../../../client/nitro/Nitro';
import { RoomPreviewer } from '../../../../client/nitro/room/preview/RoomPreviewer';
import { IRoomRenderingCanvas } from '../../../../client/room/renderer/IRoomRenderingCanvas';

@Component({
    selector: '[nitro-room-preview-component]',
    template: '<img class="room-preview-image" #previewImage />'
})
export class RoomPreviewComponent implements OnInit, OnDestroy, AfterViewInit
{
    @ViewChild('previewImage')
    public previewImage: ElementRef<HTMLImageElement>;

    @Input()
    public roomPreviewer: RoomPreviewer = null;

    @Input()
    public width: number = 1;

    @Input()
    public height: number = 1;

    public renderingCanvas: IRoomRenderingCanvas = null;
    public displayObject: DisplayObject = null;
    public imageUrl: string = null;
    public isRunning: boolean = false;

    constructor(
        private _elementRef: ElementRef<HTMLDivElement>,
        private ngZone: NgZone) 
    {}

    public ngOnInit(): void
    {
        if(!this.roomPreviewer) return;
        
        if(this.width === 1) this.width 	= this._elementRef.nativeElement.offsetWidth;
        if(this.height === 1) this.height	= this._elementRef.nativeElement.offsetHeight;

        this._elementRef.nativeElement.style.minWidth = (this._elementRef.nativeElement.offsetWidth + 'px');
        this._elementRef.nativeElement.style.minHeight = (this._elementRef.nativeElement.offsetHeight + 'px');
    }

    public ngOnDestroy(): void
    {
        this.stop();
    }

    public ngAfterViewInit(): void
    {
        if(this.roomPreviewer)
        {
            this.displayObject 		= this.roomPreviewer.getRoomCanvas(this.width, this.height);
            this.renderingCanvas	= this.roomPreviewer.getRenderingCanvas();
        }

        this.start();
    }

    public start(): void
    {
        if(this.isRunning) return;

        this.ngZone.runOutsideAngular(() =>
        {
            this.previewImageElement.addEventListener('click', this.onClick.bind(this));

            Nitro.instance.ticker.add(this.update, this);
        });

        this.isRunning = true;
    }

    public stop(): void
    {
        if(!this.isRunning) return;

        this.ngZone.runOutsideAngular(() =>
        {
            this.previewImageElement.removeEventListener('click', this.onClick.bind(this));

            Nitro.instance.ticker.remove(this.update, this);
        });

        this.isRunning = false;
    }

    public update(time: number): void
    {
        if(this.roomPreviewer && this.renderingCanvas && this.displayObject)
        {
            this.roomPreviewer.updatePreviewRoomView();
            
            if(this.renderingCanvas.canvasUpdated)
            {
                const imageUrl = Nitro.instance.renderer.extract.base64(this.displayObject);

                this.previewImageElement.src = imageUrl;
            }
        }
    }

    public onClick(event: MouseEvent): void
    {
        if(!event || !this.isRunning || !this.roomPreviewer) return;

        if(event.shiftKey)
        {
            this.roomPreviewer.changeRoomObjectDirection();
        }
        else
        {
            this.roomPreviewer.changeRoomObjectState();
        }
    }

    public get previewImageElement(): HTMLImageElement
    {
        return ((this.previewImage && this.previewImage.nativeElement) || null);
    }
}