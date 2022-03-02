import {Vector2, Vector3, Object3D} from 'three';
import {MonoBehaviour} from '../components/MonoBehaviour';

export interface WrapConfig{
	worldWrap?:boolean;
	worldSize?:Vector2;
}

export class BaseEntity extends MonoBehaviour{
	
	public prefabName:string;
	public wrapConfig:WrapConfig;
	protected components:{[k:string]:MonoBehaviour} = {};
	protected velocity:Vector2 = new Vector2();
	public idEntity:number = -1;
	public addTime:number = -1;

	constructor()
	{
		super();
		this.gameObject = this;
	}

	onAdd(wrapConfig:WrapConfig)
	{
		this.wrapConfig = wrapConfig;
		this.addTime = Date.now();
	}

	onAdded()
	{

	}

	onRemove()
	{
		this.doReset();
	}

	protected doReset()
	{
		this.idEntity = -1;
		this.position.set(0,0,0);
		this.velocity.set(0,0);
		this.components = {};
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
		if ('isVector2' in pos)
			this.position.set(pos.x, pos.y, this.position.z);
		else
			this.position.copy(pos);
	}

	setPositionXY(x:number,y:number)
	{
		this.position.set(x, y, this.position.z);
	}

	setPositionZ(z:number)
	{
		this.position.z = z;
	}

	getPosition()
	{
		return this.position;
	}

	get2dPosition()
	{
		return new Vector2(this.position.x, this.position.y);
	}

	setVelocity(v:Vector2)
	{
		this.velocity.copy(v);
	}

	getVelocity()
	{
		return this.velocity;
	}

	setVisible(val:boolean)
	{
		this.visible = val;
	}

	setRotationRad(angle:number)
	{
		this.rotation.z = angle;
	}

	setRotationDeg(angle:number)
	{
		this.rotation.z = angle / 180 * Math.PI;
	}

	getRotationRad()
	{
		return this.rotation.z;
	}

	getRotationDeg()
	{
		return this.rotation.z / Math.PI * 180;
	}

	setScale(scale:number)
	{
		this.scale.setScalar(scale);
	}

	setScaleXY(x:number, y:number)
	{
		this.scale.set(x,y, this.scale.z);
	}

	setRenderOrder(index:number)
	{
		this.renderOrder = index;
	}

	addComponent(cmp:MonoBehaviour, name:string = '')
	{
		if (name == '')
			name = cmp.constructor.name;
		if (this.components[name] !== undefined)
			console.warn("Компонент с таким имененем существует:", name, cmp);
		cmp.onAddedComponent(this);
		this.components[name] = cmp;
	}

	getComponent(name:string)
	{
		return this.components[name];
	}

	private updateComponents(deltaTime:number)
	{
		for (var name in this.components)
		{
			var cmp = this.components[name];
			cmp.doUpdate(deltaTime);
		}
	}

	doUpdate(deltaTime:number)
	{
		this.updateComponents(deltaTime);
	}

	

	destroy()
	{

	}


}