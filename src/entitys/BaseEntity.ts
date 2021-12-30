import {Vector2, Vector3, Object3D} from 'three';
import {BaseComponent} from '../components/BaseComponent';

export class BaseEntity extends Object3D{

	protected components:BaseComponent[] = [];

	constructor()
	{
		super();
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

	addComponent(cmp:BaseComponent)
	{
		cmp.onAdded(this);
		this.components.push(cmp);
	}

	private updateComponents(deltaTime:number)
	{
		for (var i = 0; i < this.components.length; ++i)
		{
			var cmp = this.components[i];
			cmp.doUpdate(deltaTime);
		}
	}

	doUpdate(deltaTime:number)
	{
		this.updateComponents(deltaTime);
	}


}