declare global
{
	interface Window
	{
		FlashExternalInterface?:
		{
			legacyTrack?: (
				category: string,
				action: string,
				data: unknown[]
			) => void;
			logDebug?: (...params: string[]) => void;
			disconnect?: (reasonCode: number, reasonString: string) => void;
			logout?: () => void;
			openWebPageAndMinimizeClient?: (pageUrl: string) => void;
		};

		FlashExternalGameInterface?:
		{
			showGame?: (url: string) => void;
			hideGame?: () => void;
		};
	}
}

export interface ILegacyExternalInterface
{
    call<K extends keyof typeof window.FlashExternalInterface>(
		method: K,
		...params: Parameters<typeof window.FlashExternalInterface[K]>
	): ReturnType<typeof window.FlashExternalInterface[K]> | undefined;

	callGame<K extends keyof typeof window.FlashExternalGameInterface>(
		method: K,
		...params: Parameters<typeof window.FlashExternalGameInterface[K]>
	): ReturnType<typeof window.FlashExternalGameInterface[K]> | undefined;
}
