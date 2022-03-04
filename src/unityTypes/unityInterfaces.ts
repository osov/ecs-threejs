import { Vector2, Vector3 } from "three";
import { BaseEntity } from "../entitys/BaseEntity";
import { MonoBehaviour } from "../main";

export type GameObject = MonoBehaviour & {fakeMarker?:boolean};

export interface Text{
    setText(text:string):void;
    setColor(color:string):void;
    text:string;
}

export interface RectTransform{
    setAnchoredPosition(pos:Vector2):void;
    DOAnchorPos(pos:Vector2, time:number):void;
    DOScale(pos:Vector3, time:number):void;
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