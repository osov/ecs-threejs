interface floatMarker{isFloat?:true;}
export type float = number & floatMarker;

export interface Text{
    setText(text:string):void;
    text:string;
}

export interface ImageSet{
    setImage(index:number):void;
}

export interface SpriteRenderer{
    setColor(color:string):void;
}

export function noTranslit() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {};
}

export class JsonUtility{

    public static FromJson<T>(str:string)
    {
        return JSON.parse(str) as T;
    } 
}