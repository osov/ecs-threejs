export interface ItPool{
	makeInstance(): ItPool;
}

export interface ItData<T>{
	entity:T;
}

export class BasePool<T extends ItPool>{
	protected source:T;
	protected maxCount:number;
	protected freeList:ItData<T>[] = [];

	constructor(src:T, startCount = 1)
	{
		this.source = src;
		for (var i = 0; i < startCount; ++i)
			this.addNew(true);
	}

	protected addNew(toPool:boolean)
	{
		var copy = this.source.makeInstance();
		if (toPool)
			this.put(copy as T, false);
		return copy;
	}

	get()
	{
		if (this.freeList.length == 0)
			this.addNew(true);
		var tmp = this.freeList.splice(0,1);
		var item = tmp[0];
		return item.entity;
	}

	protected checkExists(e:T)
	{
		for (var i = 0; i < this.freeList.length; ++i)
		{
			var it = this.freeList[i];
			if (it.entity == e)
				return true;
		}
		return false;
	}

	put(e:T, checkFree = true)
	{
		if (checkFree && this.checkExists(e))
		{
			console.warn("Объект уже в списке", e);
			return false;
		}
		var data = {entity:e};
		this.freeList.push(data);
		return data;
	}

}


