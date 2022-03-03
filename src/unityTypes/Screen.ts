
export class Screen {
    public static instance:Screen; 

    public static get width(){
        return window.innerWidth;
    }

    public static get height(){
        return window.innerHeight;
    }
}