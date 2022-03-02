import { Texture } from "three";

export interface TextureInfo{
    x:number;
    y:number;
    w:number;
    h:number;
}

export interface TexturesData{
    [k:string]:TextureInfo;
}

export class TextureAtlas {
    public static instance:TextureAtlas; 
    textures:{[k:string]:Texture} = {};

    constructor(texture:Texture, allData:TexturesData) {
        var image = texture.image;
        for (var name in allData)
        {
            var data = allData[name];
            let t = texture.clone();

             t.repeat.set(data.w / image.width, data.h / image.height);
             t.offset.x = ((data.x) / image.width);
             t.offset.y = (data.y / image.height); // 1 - (data.h / image.height) - (data.y / image.height);
             t.needsUpdate = true;
             this.textures[name] = t;
        }
        TextureAtlas.instance = this;
    }

    get(name:string) {
        return this.textures[name];
    }
}