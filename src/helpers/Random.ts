import { mtRand } from "../core/utils";

export class Random {
    public static instance:Random; 

    public static Range(inclusiv:number, exclusive:number)
    {
        return mtRand(inclusiv, exclusive - 1);
    }

    
}