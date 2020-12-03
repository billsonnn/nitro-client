import { Component, Input, NgZone, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { AdvancedMap } from '../../../../client/core/utils/AdvancedMap';
import { AvatarScaleType } from '../../../../client/nitro/avatar/enum/AvatarScaleType';
import { AvatarSetType } from '../../../../client/nitro/avatar/enum/AvatarSetType';
import { IAvatarImageListener } from '../../../../client/nitro/avatar/IAvatarImageListener';
import { Nitro } from '../../../../client/nitro/Nitro';

@Component({
	selector: 'nitro-avatar-image',
	template: `
	<img *ngIf="avatarUrl" class="avatar-image" [src]="avatarUrl" [ngStyle]="{ 'transform': 'scale(' + scale + ')'}" />`
})
export class AvatarImageComponent implements OnInit, OnChanges, OnDestroy, IAvatarImageListener
{
	private static MAX_CACHE_SIZE: number = 10;

	@Input()
	public figure: string = '';

	@Input()
	public gender: string = 'M';

	@Input()
	public headOnly: boolean = false;

	@Input()
	public direction: number = 0;

	@Input()
	public scale: number = 1;

	private _avatarImageCache: AdvancedMap<string, string> = new AdvancedMap();

	public avatarUrl: string	= null;
	public disposed: boolean	= false;
	public needsUpdate: boolean	= true;

	constructor(
		private _ngZone: NgZone) {}

	public ngOnInit(): void
	{
		if(this.needsUpdate) this.buildAvatar();
	}

	public ngOnDestroy(): void
	{
		this.dispose();
	}

	public ngOnChanges(changes: SimpleChanges): void
	{
		const figureChange = changes.figure;

		if(figureChange)
		{
			if(figureChange.previousValue !== figureChange.currentValue) this.needsUpdate = true;
		}

		const genderChange = changes.gender;

		if(genderChange)
		{
			if(genderChange.previousValue !== genderChange.currentValue) this.needsUpdate = true;
		}

		const headOnlyChange = changes.headOnly;

		if(headOnlyChange)
		{
			if(headOnlyChange.previousValue !== headOnlyChange.currentValue) this.needsUpdate = true;
		}

		const directionChange = changes.direction;

		if(directionChange)
		{
			if(directionChange.previousValue !== directionChange.currentValue) this.needsUpdate = true;
		}

		if(this.needsUpdate) this.buildAvatar();
	}

	public dispose(): void
	{
		if(this.disposed) return;
	}

	public resetFigure(figure: string): void
	{
		this._avatarImageCache.remove(this.getAvatarBuildString());

		this.buildAvatar();
	}

	private buildAvatar(): void
	{
		let avatarUrl: string = null;

		this._ngZone.runOutsideAngular(() =>
		{
			this.needsUpdate = false;

			const imageUrl = this.getUserImageUrl();

			if(imageUrl)
			{
				this._ngZone.run(() => (this.avatarUrl = imageUrl));
			}
		});
	}

	private getUserImageUrl(): string
    {
		const build = this.getAvatarBuildString();

        let existing = this._avatarImageCache.getValue(build);

        if(!existing)
        {
            const avatarImage = Nitro.instance.avatar.createAvatarImage(this.figure, AvatarScaleType.LARGE, this.gender, this, null);

            if(avatarImage)
            {
				let setType = AvatarSetType.FULL;
	
				if(this.headOnly) setType = AvatarSetType.HEAD;

                avatarImage.setDirection(setType, this.direction);
                
                const image = avatarImage.getCroppedImage(setType);

				if(image) existing = image.src;

                avatarImage.dispose();
            }

			if(existing) this.putInCache(build, existing);
        }

        return existing;
	}

	private putInCache(build: string, url: string): void
	{
		if(this._avatarImageCache.length === AvatarImageComponent.MAX_CACHE_SIZE) this._avatarImageCache.remove(this._avatarImageCache.getKey(0));

		this._avatarImageCache.add(build, url);
	}
	
	public getAvatarBuildString(): string
	{
		return (`${ this.figure }:${ this.gender }:${ this.direction }:${ this.headOnly }`);
	}
}