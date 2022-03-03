import { BaseEntity } from "../entitys/BaseEntity";

export type GameObject = BaseEntity & {fakeMarker?:boolean};

export interface Text{
    setText(text:string):void;
    setColor(color:string):void;
    text:string;
}

export interface ImageSet{
    SetImageIndex(index:number):void;
}

export interface SpriteRenderer{
    setColor(color:string):void;
}

export interface Image{
    setColor(color:string):void;
}


export class JsonUtility{

    public static FromJson<T>(str:string)
    {
        return JSON.parse(str) as T;
    } 
}