export class RoomToolRoom {

	private _id: number;
	private _name: string;
	private _ownerName: string;

	constructor(id: number, name: string, ownerName: string) {
		this._id = id;
		this._name = name;
		this._ownerName = ownerName;
	}

	get id(): number
	{
		return this._id;
	}

	get name(): string
	{
		return this._name;
	}

	get ownerName(): string
	{
		return this._ownerName;
	}
}
