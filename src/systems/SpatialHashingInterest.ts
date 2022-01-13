import { Vector2 } from 'three';
import {BaseSystem} from './BaseSystem';
import {Grid2D} from './Grid2D';

interface ItemInfo{
    get2dPosition():Vector2
}

interface ItemList{
    [k:string]:ItemInfo
}; 

export class SpatialHashingInterest extends BaseSystem{

    public visRange:number;
    public resolution:number;
    private grid:Grid2D<ItemInfo> = new Grid2D<ItemInfo>();

    constructor(visRange:number = 30)
    {
        super();
        this.visRange = visRange;
        this.resolution = this.visRange / 3;
    }

    projectToGrid(position:Vector2)
    {
        return new Vector2(Math.floor(position.x / this.resolution), Math.floor(position.y / this.resolution));
    }

    update(items:ItemList)
    {
        this.grid.clear();
        for (var k in items)
        {
            this.add(items[k]);
        }
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
        this.grid.add(position, item);
    }

    remove(item:ItemInfo)
    {
       var projected = this.projectToGrid(item.get2dPosition());
        return this.grid.removeFromPosition(item, projected);
    }



}
