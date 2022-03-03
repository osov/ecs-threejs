
export class PlayerPrefs {

    public static DeleteAll() {
    }

    public static GetString(key: string, defaultValue: string = '') {
        var v = localStorage[key];
        if (v === undefined)
            return defaultValue;
        else
            return v + '';
    }

    public static GetInt(key: string, defaultValue: number = 0) {
        var v = localStorage[key];
        if (v === undefined)
            return defaultValue;
        else
            return parseInt(v);
    }

    public static SetString(key: string, value: string) {
        localStorage[key] = value;
    }

    public static SetInt(key: string, value: number) {
        localStorage[key] = value;
    }



}