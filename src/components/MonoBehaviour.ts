import { EventDispatcher, Object3D } from 'three';
import { BaseEntity } from '../entitys/BaseEntity';
import { PointerEventData } from '../helpers/InputHelper';
import { EventBus } from '../systems/EventBus';

export class MonoBehaviour extends Object3D {
	public static mType: string;
	protected gameObject: BaseEntity;
	protected registerEvents: string[] = [];
	protected registeredCallbacks: any[] = [];


	constructor() {
		super();
	}

	protected Start() {

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
			//console.log(eventName, this.gameObject)
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

	GetChild(index: number) {
		if (this.children.length == 0) {
			console.error("Нету дочерних элементов:", index);
			return this as unknown as BaseEntity;
		}
		if (this.children.length - 1 < index) {
			console.error("Нету индекса дочернего элемента:", index);
			return this as unknown as BaseEntity;
		}
		var ch = this.children[index];
		return ch as BaseEntity;
	}

	GetComponent<T>(name: string = '') {
		// для интерфейсов типа SpriteRenderer и т.п.
		if (this.gameObject.userData[name] === undefined)
			return this.gameObject as unknown as T;
		// для хранения данных
		return this.gameObject.userData[name] as T;
	}

}