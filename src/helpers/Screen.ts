import { Input } from "./InputHelper";

export class Screen {
    public static instance:Screen; 

    public static get width(){
        return Input.ScreenSize.x;
    }

    public static get height(){
        return Input.ScreenSize.y;
    }
}