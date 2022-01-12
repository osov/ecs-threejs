import {EventDispatcher} from 'three';
import {BaseEntity} from '../entitys/BaseEntity';

export class BaseComponent extends EventDispatcher{

	protected entity:BaseEntity;

	constructor()
	{
		super();
	}

	onAddedComponent(entity:BaseEntity)
	{
		this.entity = entity;
	}

	onRemoveComponent()
	{

	}

	doUpdate(deltaTime:number)
	{

	}

}