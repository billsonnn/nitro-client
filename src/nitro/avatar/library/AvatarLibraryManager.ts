export class AvatarLibraryManager
{
    private _libraries: { [index: string]: string };

    constructor()
    {
        this._libraries = {};
    }

    public parseFigureMap(data: any): void
    {
        if(!data) return null;

        this._libraries = {};

        for(let lib of data.lib)
        {
            const libraryName = lib['$'].id;

            if(!libraryName) continue;

            for(let part of lib.part)
            {
                const partLookup = this.convertToLookup(part['$'].type, parseInt(part['$'].id));

                this._libraries[partLookup] = libraryName;
            }
        }
    }

    private convertToLookup(type: string, id: number): string
    {
        return type + ':' + id;
    }

    public findLibrary(type: string, partId: number): string
    {
        if(!partId || !type) return null;

        const partLookup = this.convertToLookup(type, partId);

        const existing = this._libraries[partLookup];

        if(!existing) return null;

        return existing;
    }
}