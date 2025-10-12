import { Container } from "pixi.js";
import {Model} from "./Model";

export abstract class View<M extends Model> extends Container {

    protected _model: M;

    public setModel(model: M){
        this._model = model;
    }

    abstract create(): void;
    abstract destroyView(): void;
}