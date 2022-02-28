import { EventDispatcher } from 'three';
import { BaseEntity } from '../entitys/BaseEntity';
import { PointerEventData } from '../helpers/InputHelper';
import { EventBus } from '../systems/EventBus';

export class MonoBehaviour extends EventDispatcher {
	public static mType:string;
	protected gameObject: BaseEntity;
	protected registerEvents: string[] = [];
	protected registeredCallbacks:any[] = [];
	constructor() {
		super();
	}

	protected Start(){

	}

	onAddedComponent(entity: BaseEntity) {
		this.gameObject = entity;
		this.subcscribeEvents();
		this.Start();
	}

	protected subcscribeEvents() {
		if (this.registerEvents.length == 0)
			return;
		for (let i = 0; i < this.registerEvents.length; i++) {
			const eventName = this.registerEvents[i];
			let methodName = eventName.charAt(0).toUpperCase() + eventName.slice(1);
			let cb = (this as any)[methodName].bind(this);
			this.registeredCallbacks.push(cb);
			EventBus.subscribeEventEntity<PointerEventData>(eventName, this.gameObject, cb);
		}

	}

	onRemoveComponent() {
		for (let i = 0; i < this.registeredCallbacks.length; i++) {
			let eventName = this.registerEvents[i];
			let cb = this.registeredCallbacks[i];
			EventBus.unSubscribeEventEntity<PointerEventData>(eventName, this.gameObject, cb);
		}
	}

	doUpdate(deltaTime: number) {

	}

	protected GetChild(index:number){
		return this.gameObject.children[index] as BaseEntity;
	}

}