import {Vector2, Vector3, Object3D} from 'three';
import {BaseComponent} from '../components/BaseComponent';

export class BaseEntity extends Object3D{

	protected components:BaseComponent[] = [];

	constructor()
	{
		super();
	}

	addComponent(cmp:BaseComponent)
	{
		cmp.onAdded(this);
		this.components.push(cmp);
	}

	doUpdate(deltaTime:number)
	{

	}

	addToParent(parent:Object3D)
	{
		parent.add(this);
	}

	removeFromParent()
	{
		return super.removeFromParent();
	}


	setPosition(pos:Vector2|Vector3)
	{
		if (pos instanceof Vector2)
			this.position.set(pos.x, pos.y, this.position.z);
		else
			this.position.copy(pos);
	}

	setPositionXY(x:number,y:number)
	{
		this.position.set(x, y, this.position.z);
	}

	getPosition()
	{
		return this.position;
	}

	setVisible(val:boolean)
	{
		this.visible = val;
	}

	setRotation(angle:number)
	{
		this.rotation.z = angle;
	}

	setScale(scale:number)
	{
		this.scale.setScalar(scale);
	}

	setRenderOrder(index:number)
	{
		this.renderOrder = index;
	}

}