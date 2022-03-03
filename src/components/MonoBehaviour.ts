import { Object3D } from 'three';
import { BaseEntity } from '../entitys/BaseEntity';
import { PointerEventData } from '../unityTypes/Input';
import { EventBus } from '../systems/EventBus';

export class MonoBehaviour extends Object3D {
	public gameObject: MonoBehaviour; // удобнее хранить именно 
	protected registerEvents: string[] = [];
	protected registeredCallbacks: any[] = [];

	constructor() {
		super();
	}

	protected Awake() {

	}

	protected Start() {

	}

	
	// текущий объект - компонент, инициализируем его
	onAddedComponent(entity: BaseEntity) {
		this.gameObject = entity;
		this.subcscribeEvents();
		this.Awake();
		this.Start();
	}

	onRemoveComponent() {
		for (let i = 0; i < this.registeredCallbacks.length; i++) {
			let eventName = this.registerEvents[i];
			let cb = this.registeredCallbacks[i];
			EventBus.unSubscribeEventEntity<PointerEventData>(eventName, this.gameObject, cb);
		}
	}

	// вызываем подпись на события
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

	// предполагается что в наследуемых компонентах этот код есть, удобно при написании своих компонентов
	doUpdate(deltaTime:number)
	{
	}

	// получить компонент или считать только свойства
	GetComponent<T>(name: string = '') {
		// для интерфейсов типа SpriteRenderer и т.п.
		if (this.gameObject.userData[name] === undefined)
			return this.gameObject as unknown as T;
		// для хранения данных
		return this.gameObject.userData[name] as T;
	}

}