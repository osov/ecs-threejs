import * as tmp from "./SystemLanguage";
const _SystemLanguage = tmp.SystemLanguage;

type SystemLanguage = number & {fakeMarker?:true};

export class Application{

    public static get systemLanguage():SystemLanguage{
        return _SystemLanguage.Russian;
    }

}