import { MonoBehaviour } from "../components/MonoBehaviour";
import { BaseEntity } from "../entitys/BaseEntity";
import { PointerEventData } from "../unityTypes/Input";

type CallbackHandler<T> = (args: T) => void;

export interface IEntityEventSubscribed {
    type: string;
    entity: MonoBehaviour;
}

export class EventBus {

    private static instance: EventBus;
    private listeners: { [k: string]: CallbackHandler<any>[] } = {};

    public static getInstance(): EventBus {
        if (!EventBus.instance)
            EventBus.instance = new EventBus();
        return EventBus.instance;
    }

    private constructor() {

    }

    public static dispatchEvent<T>(type: string, args: T) {
        let instance = EventBus.getInstance();
        let list = instance.listeners[type];
        if (list === undefined || list.length == 0)
            return false;
        for (let i = 0; i < list.length; i++) {
            const h = list[i];
            h(args);
        }
        return true;
    }

    public static getEntityPrefixEvent(type: string, entity: MonoBehaviour) {
        return type + '-' + entity.id; // todo убрал idEntity т.к. если сущность берется с пула, то еще не имеет idEntity и события не будет.
    }

    public static dispatchEventEntity<T>(type: string, entity: MonoBehaviour, args: T) {
        return this.dispatchEvent(this.getEntityPrefixEvent(type, entity), args);
    }


    public static subscribeEvent<T>(type: string, cb: CallbackHandler<T>) {
        let instance = EventBus.getInstance();
        let list = instance.listeners[type];
        if (list === undefined)
            list = instance.listeners[type] = [];
        list.push(cb);
        return true;
    }

    public static subscribeEventEntity<T>(type: string, entity: MonoBehaviour, cb: CallbackHandler<T>) {
        this.subscribeEvent(this.getEntityPrefixEvent(type, entity), cb);
        this.dispatchEvent<IEntityEventSubscribed>('entitySubscribeEvent', { type, entity });
        return true;
    }


    public static unSubscribeEvent<T>(type: string, cb: CallbackHandler<T>) {
        let instance = EventBus.getInstance();
        let list = instance.listeners[type];
        if (list === undefined || list.length == 0)
            return;
        for (let i = 0; i < list.length; i++) {
            const it = list[i];
            if (it == cb) {
                list.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    public static unSubscribeEventEntity<T>(type: string, entity: MonoBehaviour, cb: CallbackHandler<T>) {
        return this.unSubscribeEvent(this.getEntityPrefixEvent(type, entity), cb);
    }

    public static InjectEvent(event: string) {
        const eventList: { [k: string]: string } = {
            'IPointerDownHandler': 'onPointerDown',
            'IPointerUpHandler': 'onPointerUp',
            'IDragHandler': 'onDrag'
        };
        return function _DecoratorName<T extends { new(...args: any[]): {} }>(constr: T) {
            return class extends constr {
                constructor(...args: any[]) {
                    super(...args);
                    if (eventList[event] == undefined)
                        console.warn('Событие не найдено:', event);
                    else {
                        let eventName = eventList[event];
                        (this as any).registerEvents.push(eventName);
                    }
                }
            }
        }
    }
}