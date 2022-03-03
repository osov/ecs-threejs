import { Vector2 } from 'three';
import {BaseSystem} from '../systems/BaseSystem';
import {Grid2D} from './Grid2D';

export interface ItemInfo{
    get2dPosition():Vector2;
    idEntity:number;
}

interface ItemList{
    [k:string]:ItemInfo
}; 

export class SpatialHashingInterest extends BaseSystem{

    public visRange:number;
    public resolution:number;
    private grid:Grid2D<ItemInfo>;

    constructor(visRange:number = 30, worldWrap:boolean = false, worldSize:Vector2 = new Vector2())
    {
        super();
        this.visRange = visRange;
        this.resolution = this.visRange / 3;
        this.grid = new Grid2D<ItemInfo>(worldWrap, worldSize, this.resolution);
    }

    projectToGrid(position:Vector2)
    {
        return new Vector2(Math.floor(position.x / this.resolution), Math.floor(position.y / this.resolution));
    }

    isVisible(position:Vector2, it:ItemInfo)
    {
        var projected = this.projectToGrid(position);
        var itProjected = this.projectToGrid(it.get2dPosition());
        return projected.sub(itProjected).lengthSq() <= 2;
    }

    getVisibleList(position:Vector2)
    {
        var current = this.projectToGrid(position);
        return this.grid.getWithNeighbours(current);
    }

    add(item:ItemInfo)
    {
        var position = this.projectToGrid(item.get2dPosition());
        return this.grid.add(position, item);
    }

    remove(item:ItemInfo)
    {
        return this.grid.remove(item);
    }

    update(item:ItemInfo)
    {
        this.remove(item);
        return this.add(item);
    }

    updateList(items:ItemList)
    {
        for (var k in items)
            this.update(items[k]);
    }

    updateFull(items:ItemList)
    {
        this.grid.clear();
        for (var k in items)
            this.add(items[k]);
    }
}
