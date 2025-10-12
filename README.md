# pixi_app

-Game Flow
1. Game – Entry point; creates RootInstaller, DIContainer, and Application.
2. RootInstaller – Adds GameInstaller.
3. GameInstaller – Creates and adds GameManager and SceneInstaller.
4. SceneInstaller – Creates and adds all game scenes.
5. GameManager – Launches the initial game scene.
6. SceneManager – Manages all scenes.
7. Scenes:
   ◦ MainScene
   ◦ AceOfShadowsScene
   ◦ MagicWordsScene
   ◦ PhoenixFlameScreen
   ◦ GuessCardGameScreen