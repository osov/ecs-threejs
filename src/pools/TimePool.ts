import {BasePool, ItPool, ItData} from './BasePool';

interface ItDataEx<T> extends ItData<T>{
	freeTime:number;
}

export class TimePool<T> extends BasePool<ItPool> {

	private delayTime:number;

	constructor(src:ItPool, startCount = 1, delayTime = 0.5)
	{
		super(src, startCount);
		this.delayTime = delayTime;
	}

	protected now()
	{
		return Date.now();
	}

	get()
	{
		if (this.freeList.length == 0)
		{
			this.addNew(true);
			(this.freeList[0] as ItDataEx<ItPool>).freeTime = 0;
		}
		const now = this.now();
		for (var i = 0; i < this.freeList.length; ++i)
		{
			var it = this.freeList[i] as ItDataEx<ItPool>;
			if (it.freeTime <= now)
			{
				this.freeList.splice(i,1);
				return it.entity;
			}
		}
		return this.addNew(false);
	}

	put(e:ItPool, checkFree = true)
	{
		var result = super.put(e, checkFree);
		if (!result)
			return result;
		(result as ItDataEx<ItPool>).freeTime = this.now() + this.delayTime;
		return result;
	}


}
