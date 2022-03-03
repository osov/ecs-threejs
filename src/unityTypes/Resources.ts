import { ResourceSystem } from "../systems/ResourceSystem";

export interface TextAsset{
    text:string;
}

export class Resources{
    public static Load<T>(path:string){
        var tmp = ResourceSystem.instance.getTextData(path);
        var ret:TextAsset = {text:tmp};
        return  ret;
    }
}