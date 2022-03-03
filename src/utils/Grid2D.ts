import { Vector2 } from 'three';
import { BaseSystem } from '../systems/BaseSystem';


const Vector2Int = {
    zero: new Vector2(0, 0),
    up: new Vector2(0, 1),
    down: new Vector2(0, -1),
    left: new Vector2(-1, 0),
    right: new Vector2(1, 0),
}

interface WorldInfo {
    w: number;
    h: number;
}

interface GridItem {
    idEntity: number;
}

export class Grid2D<T extends GridItem> extends BaseSystem {

    private grid: { [k: string]: Set<T> } = {};
    private items: { [k: number]: Set<T> } = {};
    private neighbourOffsets: Vector2[] = [];
    private worldWrap: boolean;
    private worldInfo: WorldInfo;

    constructor(worldWrap: boolean = false, worldSize: Vector2 = new Vector2(), resolution: number = 0) {
        super();
        this.neighbourOffsets.push(
            Vector2Int.up,
            Vector2Int.up.clone().add(Vector2Int.left),
            Vector2Int.up.clone().add(Vector2Int.right),
            Vector2Int.left,
            Vector2Int.zero,
            Vector2Int.right,
            Vector2Int.down,
            Vector2Int.down.clone().add(Vector2Int.left),
            Vector2Int.down.clone().add(Vector2Int.right)
        );
        this.worldWrap = worldWrap;
        this.getWorldData(worldSize, resolution);
    }

    getWorldData(worldSize: Vector2, resolution: number) {
        const w = Math.round(worldSize.x * 0.5 / resolution);
        const h = Math.round(worldSize.y * 0.5 / resolution);
        this.worldInfo = { w, h };
    }

    private getKey(position: Vector2) {
        var px = position.x;
        var py = position.y;
        /* if (px > this.worldInfo.w) {
            px = this.worldInfo.w;
        }
        if (px < -this.worldInfo.w) {
            px = -this.worldInfo.w;
        } */
        return Math.floor(px) + ":" + Math.floor(py);
    }

    add(position: Vector2, value: T) {
        const key = this.getKey(position);
        if (this.grid[key] === undefined) {
            this.grid[key] = new Set<T>();
        }
        this.grid[key].add(value);
        this.items[value.idEntity] = this.grid[key];
        return key;
    }

    removeFromStaticPosition(value: T, position: Vector2) {
        const key = this.getKey(position);
        delete this.items[value.idEntity];
        if (this.grid[key] === undefined)
            return false;
        return this.grid[key].delete(value);
    }

    remove(value: T) {
        var set = this.items[value.idEntity];
        if (set === undefined)
            return false;
        delete this.items[value.idEntity];
        return set.delete(value);
    }

    getAt(position: Vector2) {
        const key = this.getKey(position);
        return this.grid[key];
    }

    convertPos(pos: Vector2) {
        if (!this.worldWrap)
            return pos;
        if (pos.x >= this.worldInfo.w)
            pos.x = pos.x - this.worldInfo.w * 2;
        else if (pos.x < -this.worldInfo.w)
            pos.x = pos.x + this.worldInfo.w * 2;

        if (pos.y >= this.worldInfo.h)
            pos.y = pos.y - this.worldInfo.h * 2;
        else if (pos.y < -this.worldInfo.h)
            pos.y = pos.y + this.worldInfo.h * 2;
        return pos;

    }

    getWithNeighbours(position: Vector2) {
        var set = new Set<T>();
        for (let index = 0; index < this.neighbourOffsets.length; index++) {
            const offset = this.neighbourOffsets[index];
            const pos = this.convertPos(position.clone().add(offset));
            var curSet = this.getAt(pos);
            if (curSet !== undefined)
                set = new Set([...set, ...curSet]);
        }
        return set;
    }

    clear() {
        for (var k in this.grid) {
            var it = this.grid[k];
            it.clear();
        }
       this.items = {};
    }


}