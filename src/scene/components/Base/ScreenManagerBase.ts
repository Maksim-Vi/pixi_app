import {Manager} from "../../../core/mvc/Manager";

export abstract class ScreenManagerBase extends Manager {
    abstract loadScene(): void
    abstract hideScene(): void
}