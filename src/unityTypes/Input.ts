import { EventBus } from "../systems/EventBus";
import { Vector2 } from "three";
import {Screen} from "./Screen";

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
    pointerId: number;
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

export interface KeyboardDown{
    keyCode:number;
    key:string;
}

export class Input {
    private _touches: { [key: string]: TouchData } = {};
    private _mousePos:Vector2 = new Vector2();
    public static instance: Input;

    public constructor() {
        Input.instance = this;
        document.addEventListener('pointerdown', this.onPointerDown.bind(this), false);
        document.addEventListener('pointermove', this.onPointerMove.bind(this), false);
        document.addEventListener('pointerup', this.onPointerUp.bind(this), false);
        document.addEventListener('pointercancel', this.onPointerCancel.bind(this), false);
        document.addEventListener('keydown', this.onKeyDown.bind(this), false);
        window.addEventListener('resize', this.onResize.bind(this), false);
        var viewer = document.getElementById("viewer");
        if (viewer != null)
            this.initFullScreenEvents(viewer);
    }

    private initFullScreenEvents(el: HTMLElement) {
        el.addEventListener('webkitfullscreenchange', this.onFullsSreenChange.bind(this));
        el.addEventListener('mozfullscreenchange', this.onFullsSreenChange.bind(this));
        el.addEventListener('fullscreenchange', this.onFullsSreenChange.bind(this));
    }

    private onKeyDown(e:KeyboardEvent)
    {
        EventBus.dispatchEvent<KeyboardDown>('onKeyboardDown', {key: e.key, keyCode:e.keyCode});
    }

    private onFullsSreenChange(event: Event) {
        EventBus.dispatchEvent('onFullsSreenChange', {});
    }

    private onResize(event: UIEvent) {
        EventBus.dispatchEvent('onResize', {});
    }

    private onPointerDown(event: PointerEvent) {
        this._touches[event.pointerId] = {
            pointerId: event.pointerId,
            phase: TouchPhase.Began,
            position: new Vector2(event.offsetX, event.offsetY)
        };
        this.setPointers(event.offsetX, event.offsetY);
        EventBus.dispatchEvent<PointerEventData>('onPointerDown', { button: event.button, position: this._mousePos.clone(), pointerId: event.pointerId });
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
        EventBus.dispatchEvent<PointerEventData>('onPointerMove', { button: event.button, position: this._mousePos.clone(), pointerId: event.pointerId });
    }

    private onPointerUp(event: PointerEvent) {
        this._touches[event.pointerId].phase = TouchPhase.Ended;
        delete this._touches[event.pointerId];
        this.setPointers(event.offsetX, event.offsetY);
        EventBus.dispatchEvent<PointerEventData>('onPointerUp', { button: event.button, position: this._mousePos.clone(), pointerId: event.pointerId });
    }

    private onPointerCancel(event: PointerEvent) {
        this._touches[event.pointerId].phase = TouchPhase.Canceled;
        this.setPointers(event.offsetX, event.offsetY);
        EventBus.dispatchEvent<PointerEventData>('onPointerCancel', { button: event.button, position: this._mousePos.clone(), pointerId: event.pointerId });
        delete this._touches[event.pointerId];
    }

    private setPointers(x = 0, y = 0)
	{
        y = Screen.height - y;
		this._mousePos.set(x, y);
	}

    public static get touchCount(): number {
        return Object.keys(Input.instance._touches).length;
    }

    public static get mousePosition():Vector2{
        return Input.instance._mousePos;
    }

    public static GetTouch(index: number) {

    }

    public static isTouchMode() {
        return ('ontouchstart' in window);
    }
}
