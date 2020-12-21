import { ILegacyExternalInterface } from './ILegacyExternalInterface';

export class LegacyExternalInterface implements ILegacyExternalInterface
{
	public call<K extends keyof typeof window.FlashExternalInterface>(
		method: K,
		...params: Parameters<typeof window.FlashExternalInterface[K]>
	): ReturnType<typeof window.FlashExternalInterface[K]> | undefined
	{
		if(!('FlashExternalInterface' in window)) return undefined;

		const fn = window.FlashExternalInterface[method] as Function;

		return typeof fn !== 'undefined' ? fn(...params) : undefined;
	}

	public callGame<K extends keyof typeof window.FlashExternalGameInterface>(
		method: K,
		...params: Parameters<typeof window.FlashExternalGameInterface[K]>
	): ReturnType<typeof window.FlashExternalGameInterface[K]> | undefined
	{
		if(!('FlashExternalGameInterface' in window)) return undefined;

		const fn = window.FlashExternalGameInterface[method] as Function;

		return typeof fn !== 'undefined' ? fn(...params) : undefined;
	}
}
