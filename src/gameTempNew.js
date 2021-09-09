// ゲームテンプレート2
// 自作STGを落とすための第一歩（のような何か）

// できるだけ汎用性を意識して・・

// --------------------------------------------------------------------------------------- //
// Global.

let myGame;

// --------------------------------------------------------------------------------------- //
// Constants.（各種定数）

// キャンバスサイズ
const CANVAS_W = 640;
const CANVAS_H = 480;

// KEYCODE定数
const K_ENTER = 13;
const K_RIGHT = 39;
const K_LEFT = 37;
const K_UP = 38;
const K_DOWN = 40;
const K_SPACE = 32;

// --------------------------------------------------------------------------------------- //
// Game.（Sceneを統括する。切り替えなどを行う。）

class Game{
  constructor(){
    this.scenes = {};
    this.currentScene = undefined;
  }
  createScenes(){
    // thisはnodeとして格納されすべてのSceneはnode経由で他のSceneを参照できる（必要に応じて）
    this.scenes.title = new TitleScene(this);
    this.scenes.play = new PlayScene(this);
    this.scenes.clear = new ClearScene(this);
    this.scenes.gameover = new GameoverScene(this);
  }
  getScene(sceneName){
    if(sceneName === ""){ return undefined; }
    return this.scenes[sceneName];
  }
  setScene(nextScene){
    this.currentScene.setNextScene("");
    nextScene.prepare(this.currentScene); // 次のSceneに準備をさせる
    this.currentScene = nextScene;
  }
  update(){
    this.currentScene.update();
  }
  draw(){
    this.currentScene.draw();
  }
  shift(){
    // シーンの切り替えは毎フレームdrawの直後に行う
    const nextScene = this.currentScene.getNextScene();
    if(nextScene !== undefined){
      this.setScene(nextScene);
    }
  }
}

// --------------------------------------------------------------------------------------- //
// Scene.

class Scene{
  constructor(_node){
    this.node = _node;
    this.name = "";
    this.gr = createGraphics(CANVAS_W, CANVAS_H);
    this.nextScene = undefined;
  }
  getNextScene(){ return this.nextScene; }
  setNextScene(sceneName){ this.nextScene = this.node.getScene(sceneName); }
  prepare(_scene){ /* 前のシーンの情報を元に何かする */ }
  keyAction(code){} // キーイベント
	clickAction(){} // マウスクリックイベント
	update(){}
	draw(){}
}

// --------------------------------------------------------------------------------------- //
// TitleScene.

// --------------------------------------------------------------------------------------- //
// PlayScene.

// --------------------------------------------------------------------------------------- //
// ClearScene.

// --------------------------------------------------------------------------------------- //
// GameoverScene.

// --------------------------------------------------------------------------------------- //
// System.

class System{

}

// --------------------------------------------------------------------------------------- //
// preloading.

function preload(){

}

// --------------------------------------------------------------------------------------- //
// Main.

function setup(){
  myGame = new Game();
  myGame.createScenes(); // シーンを作る
}

function draw(){

}


// --------------------------------------------------------------------------------------- //
// Utility.（使い方をわかりやすく明記）
