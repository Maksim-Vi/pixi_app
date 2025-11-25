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

        const container = document.querySelector('#game-container') as HTMLElement;

        if (!container) {
            alert("Container not found!");
            return;
        }

        this.container = container;
        this.app = new PIXI.Application({
            width: Math.min(this.gameSize.width, LOGIC_WIDTH),
            height: Math.min(this.gameSize.height, LOGIC_HEIGHT),
            autoDensity: true,
            backgroundColor: 0x0,
            antialias: window.innerWidth > 1080,
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

        const gameContainer = document.getElementById('game-container');
        if (!gameContainer) return;

        const width = gameContainer.clientWidth;
        const height = gameContainer.clientHeight;

        const resolution = Math.min(window.devicePixelRatio || 1, 2);
        this.app.renderer.resolution = resolution;
        this.app.renderer.resize(width, height);

        const scale = Math.min(width / LOGIC_WIDTH, height / LOGIC_HEIGHT);

        this.app.stage.scale.set(scale);

        const offsetX = (width - LOGIC_WIDTH * scale) / 2;
        const offsetY = (height - LOGIC_HEIGHT * scale) / 2;
        this.app.stage.position.set(offsetX, offsetY);

        GameModel.setParams(this.app, this.app.stage);
        GlobalDispatcher.dispatch("RESIZE_APP")
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

        uiFpsContainer.x = GameModel.right - uiFpsContainer.width - 200;
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