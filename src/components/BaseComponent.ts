import {EventDispatcher} from 'three';
import {BaseEntity} from '../entitys/BaseEntity';

export class BaseComponent extends EventDispatcher{

	protected entity:BaseEntity;

	constructor()
	{
		super();
	}

	onAdded(entity:BaseEntity)
	{
		this.entity = entity;
	}

	onRemoved()
	{

	}

	doUpdate(deltaTime:number)
	{

	}

}