interface NumData{
	id:number;
	freeTime:number;
}

export class NumberPool{

	private maxVal:number;
	private lastId:number;
	private freeList:NumData[] = [];

	constructor(maxVal:number)
	{
		this.maxVal = maxVal;
	}

	protected now()
	{
		return Date.now();
	}

	private addNew()
	{
		if (this.lastId + 1 > this.maxVal )
			console.warn("Выход за границу", this.maxVal);
		this.lastId += 1;
		this.lastId = this.lastId % this.maxVal;
		return this.lastId;
	}

	get()
	{
		if (this.freeList.length == 0)
			return this.addNew();
		const now = this.now();
		for (var i = 0; i < this.freeList.length; ++i)
		{
			var it = this.freeList[i];
			if (it.freeTime <= now)
			{
				this.freeList.splice(i,1);
				return it.id;
			}
		}
		return this.addNew();
	}

	put(id:number, timeLock:number = 0)
	{
		var data = {id:id, freeTime:this.now() + timeLock * 1000};
		for (var i = 0; i < this.freeList.length; ++i)
		{
			var it = this.freeList[i];
			if (it.id == id)
			{
				console.error("Элемент уже существует в свободных:", id);
				return;
			}
		}
		this.freeList.push(data);
	}
}