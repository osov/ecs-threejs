import { Vector2 } from 'three';
import {BaseSystem} from './BaseSystem';


const Vector2Int = {
    zero:new Vector2(0,0),
    up:new Vector2(0, 1),
    down:new Vector2(0, -1),
    left:new Vector2(-1, 0),
    right:new Vector2(1, 0),
}

export class Grid2D<T> extends BaseSystem{

    private grid:{[k:string]:Set<T>} = {};
    private neighbourOffsets:Vector2[] = [];

    constructor()
    {
        super();
        this.neighbourOffsets.push(
            Vector2Int.up,
            Vector2Int.up.clone().add(Vector2Int.left),
            Vector2Int.up.clone().add( Vector2Int.right),
            Vector2Int.left,
            Vector2Int.zero,
            Vector2Int.right,
            Vector2Int.down,
            Vector2Int.down.clone().add(Vector2Int.left),
            Vector2Int.down.clone().add(Vector2Int.right)
        );

    }

    private getKey(position:Vector2)
    {
        return Math.floor(position.x) + "-"+Math.floor(position.y);
    }

    add(position:Vector2, value:T)
    {
        const key = this.getKey(position);
        if (this.grid[key] === undefined)
        {
            this.grid[key] = new Set<T>();
        }
        this.grid[key].add(value);
    }

    removeFromPosition(value:T, position:Vector2)
    {
        const key = this.getKey(position);
        if (this.grid[key] === undefined)
            return false;
        return this.grid[key].delete(value);
    }

    remove(value:T)
    {
        for (var k in this.grid)
        {
            var it = this.grid[k];
            if (it.delete(value))
                return true;
        }
        return false;
    }

    getAt(position:Vector2)
    {
        const key = this.getKey(position);
        return this.grid[key];
    }

    getWithNeighbours(position:Vector2)
    {
        var set = new Set<T>();
        for (let index = 0; index < this.neighbourOffsets.length; index++) {
            const offset = this.neighbourOffsets[index];
            var curSet = this.getAt(position.clone().add(offset));
            if (curSet !== undefined)
                set = new Set([...set, ...curSet]);
        }
        return set;
    }

    clear()
    {
        for (var k in this.grid)
        {
            var it = this.grid[k];
            it.clear();
        }
    }


}