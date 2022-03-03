import { mtRandInt } from "../core/utils";

export class Random {

    public static Range(inclusiv:number, exclusive:number)
    {
        return mtRandInt(inclusiv, exclusive - 1);
    }

    
}