import {SceneManager, SceneType} from "../scene/SceneManager";

export class GameManager {
    constructor(private sceneManager: SceneManager) {
        this.init();
    }

    init() {
        this.startGame();
    }

    startGame() {
        // this.sceneManager.loadScene(SceneType.MainScene);
        this.sceneManager.loadScene(SceneType.LoadingScreen);
    }

    changeScene(key: SceneType) {
        this.sceneManager.loadScene(key);
    }

    get currentSceneType() {
        return this.sceneManager.getCurrentSceneType();
    }
}