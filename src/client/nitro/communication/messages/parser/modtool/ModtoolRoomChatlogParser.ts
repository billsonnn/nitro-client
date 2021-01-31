import { IMessageDataWrapper } from '../../../../../core/communication/messages/IMessageDataWrapper';
import { IMessageParser } from '../../../../../core/communication/messages/IMessageParser';

export class ModtoolRoomChatlogParser implements IMessageParser
{
	private _id: number;
	private _name: string;

	public flush(): boolean
	{
	    this._id   = null;
	    this._name = null;
	    return true;
	}

	public parse(wrapper: IMessageDataWrapper): boolean
	{
	    if(!wrapper) return false;

	    wrapper.readByte();
	    wrapper.readShort();
	    wrapper.readString();
	    wrapper.readByte();
	    this._name = wrapper.readString();
	    wrapper.readString();
	    wrapper.readByte();
        this._id   = wrapper.readInt();
	    return true;
	}

	public get id(): number
	{
	    return this._id;
	}
}
