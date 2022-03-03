interface floatMarker{isFloat?:true;}
export type float = number & floatMarker;

export function noTranslit() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {};
}