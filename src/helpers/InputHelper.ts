import { EventBus } from "../systems/EventBus";
import { Vector2 } from "three";

export enum TouchPhase {
    Began = 0, // A finger touched the screen.
    Moved = 1, // A finger moved on the screen.
    Stationary = 2, //  A finger is touching the screen but hasn't moved.
    Ended = 3, // A finger was lifted from the screen. This is the final phase of a touch.
    Canceled = 4 // The system cancelled tracking for the touch.
}

export interface TouchData {
    position: Vector2;
    pointerId: number;
    phase: TouchPhase;
}

export interface PointerEventData{
    button:number;
    position:Vector2;
}

export interface IPointerDownHandler {
	OnPointerDown(pointerEventData: PointerEventData): void;
}
export interface IPointerUpHandler {
	OnPointerUp(pointerEventData: PointerEventData): void;
}

export interface IDragHandler {
	OnDrag(pointerEventData: PointerEventData): void;
}

export class Input {
    private _touches: { [key: string]: TouchData } = {};
    private _mousePos:Vector2 = new Vector2();
    private container:HTMLElement;
    private static instance: Input;

    public static getInstance(): Input {
        if (!Input.instance)
            Input.instance = new Input();
        return Input.instance;
    }

    private constructor() {
        document.addEventListener('pointerdown', this.onPointerDown.bind(this), false);
        document.addEventListener('pointermove', this.onPointerMove.bind(this), false);
        document.addEventListener('pointerup', this.onPointerUp.bind(this), false);
        document.addEventListener('pointercancel', this.onPointerCancel.bind(this), false);
        window.addEventListener('resize', this.onResize.bind(this), false);
    }

    init(el: HTMLElement) {
        this.container = el;
        el.addEventListener('webkitfullscreenchange', this.onFullsSreenChange.bind(this));
        el.addEventListener('mozfullscreenchange', this.onFullsSreenChange.bind(this));
        el.addEventListener('fullscreenchange', this.onFullsSreenChange.bind(this));
    }

    protected onFullsSreenChange(event: Event) {
        EventBus.dispatchEvent('onFullsSreenChange', {});
    }

    protected onResize(event: UIEvent) {
        EventBus.dispatchEvent('onResize', {});
    }

    private onPointerDown(event: PointerEvent) {
        this._touches[event.pointerId] = {
            pointerId: event.pointerId,
            phase: TouchPhase.Began,
            position: new Vector2(event.offsetX, event.offsetY)
        };
        this.setPointers(event.offsetX, event.offsetY);
        EventBus.dispatchEvent<PointerEventData>('onPointerDown', { button: event.button, position: this._mousePos.clone() });
    }

    private onPointerMove(event: PointerEvent) {
        if (!this._touches[event.pointerId])
            this._touches[event.pointerId] = {
                pointerId: event.pointerId,
                position: new Vector2(event.offsetX, event.offsetY),
                phase: TouchPhase.Moved
            };
        this._touches[event.pointerId].phase = TouchPhase.Moved;
        this._touches[event.pointerId].position.set(event.offsetX, event.offsetY);
        this.setPointers(event.offsetX, event.offsetY);
        EventBus.dispatchEvent<PointerEventData>('onPointerMove', { button: event.button, position: this._mousePos.clone() });
    }

    private onPointerUp(event: PointerEvent) {
        this._touches[event.pointerId].phase = TouchPhase.Ended;
        delete this._touches[event.pointerId];
        this.setPointers(event.offsetX, event.offsetY);
        EventBus.dispatchEvent<PointerEventData>('onPointerUp', { button: event.button, position: this._mousePos.clone() });
    }

    private onPointerCancel(event: PointerEvent) {
        this._touches[event.pointerId].phase = TouchPhase.Canceled;
        this.setPointers(event.offsetX, event.offsetY);
        EventBus.dispatchEvent<PointerEventData>('onPointerCancel', { button: event.button, position: this._mousePos.clone() });
        delete this._touches[event.pointerId];
    }

    protected setPointers(x = 0, y = 0)
	{
        y = Input.ScreenSize.y - y;
		this._mousePos.set(x, y);
	}

    public static get touchCount(): number {
        return Object.keys(Input.getInstance()._touches).length;
    }

    public static get ScreenSize():Vector2{
        let instance = Input.getInstance();
        return new Vector2(instance.container.clientWidth, instance.container.clientHeight);
    }

    public static get mousePos():Vector2{
        return this.getInstance()._mousePos;
    }

    public static GetTouch(index: number) {

    }

    public static isTouchMode() {
        return ('ontouchstart' in window);
    }
}
