import * as PIXI from "pixi.js";
import {Application, Container} from "pixi.js"
import {Installer} from "./di/Installer";
import {RootInstaller} from "../RootInstaller";
import { DIContainer } from "./di/DIContainer";

import '../assetsLoader/AssetsLoader'
import '../store/gameModel/GameModel'

import {registerAssets} from "../assetsLoader/registerAssets";
import AssetsLoader from "../assetsLoader/AssetsLoader";
import {DI} from "./di/DI";
import GameModel from "../store/gameModel/GameModel";
import WordsModel from "../store/wordsModel/WordsModel";
import {FPSDisplayer} from "../common/fps/FpsDisplayer";
import GlobalDispatcher from "../events/GlobalDispatcher";

export interface IGameSize {
    width: number;
    height: number;
}

interface IBaseSize {
    width: number,
    height: number,
    ratio: number
}

export const LOGIC_WIDTH = 1920;
export const LOGIC_HEIGHT = 1080;

PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.LINEAR;
PIXI.settings.ROUND_PIXELS = false;

export default class Game {
    protected screenWidth: number;
    protected screenHeight: number;

    protected gameSize: IGameSize;
    protected baseSize: IBaseSize;

    protected container: HTMLElement | null = null;
    protected app: Application | null = null;
    protected rootInstaller: Installer | null = null;
    private diContainer: DIContainer;

    private uiStage: Container;

    constructor() {
        this.screenWidth = LOGIC_WIDTH;
        this.screenHeight = LOGIC_HEIGHT;

        this.gameSize = {
            width: this.screenWidth,
            height: this.screenHeight
        };

        this.baseSize = {
            width: window.innerWidth,
            height: window.innerHeight,
            ratio: this.screenWidth / this.screenHeight
        };

        this.init();

        window.addEventListener("resize", this.onResize.bind(this));
    }

    protected async init() {

        registerAssets();
        await AssetsLoader.loadAll();
        await WordsModel.loadWordData()

        const container = document.querySelector('#game-container') as HTMLElement;

        if (!container) {
            alert("Container not found!");
            return;
        }

        this.container = container;
        this.app = new PIXI.Application({
            width: this.gameSize.width,
            height: this.gameSize.height,
            autoDensity: true,
            backgroundColor: 0x0,
            antialias: true,
            autoStart: true,
        });

        container.appendChild(this.app.view as unknown as HTMLCanvasElement);

        this.onResize();

        this.diContainer = new DIContainer();
        DI.init(this.diContainer, this.app);

        this.rootInstaller = new RootInstaller(this.diContainer, this.app);
        this.rootInstaller.install();

        this.setFps();
    }

    protected onResize() {
        if (!this.container || !this.app) return;

        const containerWidth = this.container.clientWidth;
        const containerHeight = this.container.clientHeight;

        const resolution = window.devicePixelRatio || 1;
        this.app.renderer.resolution = resolution;
        this.app.renderer.resize(containerWidth * resolution, containerHeight * resolution);

        const canvas = this.app.view as HTMLCanvasElement;
        canvas.style.width = `${containerWidth}px`;
        canvas.style.height = `${containerHeight}px`;

        this.scaleStage(this.app.stage, containerWidth / resolution, containerHeight / resolution);
        GameModel.setParams(this.app, this.app.stage);

        GlobalDispatcher.dispatch("RESIZE_APP")
    }

    scaleStage(stage: Container, containerWidth: number, containerHeight: number, mode: "width" | "height" | "fill" | "fit" = "fit") {
        // let scaleX = containerWidth / LOGIC_WIDTH;
        // let scaleY = containerHeight / LOGIC_HEIGHT;
        // let scale: number = Math.min(scaleX, scaleY);
        //
        // stage.scale.set(scale);

        const scaleX = containerWidth / LOGIC_WIDTH;
        const scaleY = containerHeight / LOGIC_HEIGHT;

        let scale: number;
        switch (mode) {
            case "width":
                scale = scaleX;
                break;
            case "height":
                scale = scaleY;
                break;
            case "fill":
                scale = Math.max(scaleX, scaleY);
                break;
            case "fit":
            default:
                scale = Math.min(scaleX, scaleY);
                break;
        }

        stage.scale.set(scale);

        const resolution = window.devicePixelRatio || 1;
        this.app.stage.position.set(
            (containerWidth / resolution - LOGIC_WIDTH * scale) / 2,
            (containerHeight / resolution - LOGIC_HEIGHT * scale) / 2
        );
    }

    setFps(){
        this.uiStage = new PIXI.Container();
        this.app.stage.addChild(this.uiStage as PIXI.DisplayObject);

        this.app.stage.on('childAdded', () => {
            this.app.stage.setChildIndex(this.uiStage as PIXI.DisplayObject, this.app.stage.children.length - 1);
        });

        const fpsDisplay = new FPSDisplayer();

        const uiFpsContainer = new PIXI.Container();

        uiFpsContainer.width = 500;
        uiFpsContainer.height = 500;

        uiFpsContainer.x = GameModel.right - uiFpsContainer.width - 400;
        uiFpsContainer.y = GameModel.top + 50;

        this.app.stage.addChild(uiFpsContainer as PIXI.DisplayObject);
        uiFpsContainer.addChild(fpsDisplay.text as PIXI.DisplayObject);

        this.app.ticker.add(() => {
            fpsDisplay.update();

            if (!this.app.stage.children.includes(uiFpsContainer as PIXI.DisplayObject)) {
                this.app.stage.addChild(uiFpsContainer as PIXI.DisplayObject);
            }

            const fpsIndex = this.app.stage.getChildIndex(uiFpsContainer as PIXI.DisplayObject);
            const topIndex = this.app.stage.children.length - 1;

            if (fpsIndex !== topIndex) {
                this.app.stage.setChildIndex(uiFpsContainer as PIXI.DisplayObject, topIndex);
            }
        });
    }

    play() {
        this.app?.ticker.start();
    }

    pause() {
        this.app?.ticker.stop();
    }

    public get application() {
        return this.app;
    }
}