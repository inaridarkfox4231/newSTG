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
    this.currentScene = this.scenes.title;
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
  keyAction(code){ /* キーイベント */}
	clickAction(){ /* マウスクリックイベント */ }
	update(){}
	draw(){}
}

// --------------------------------------------------------------------------------------- //
// TitleScene.

class TitleScene extends Scene{
  constructor(_node){
    super(_node);
    this.name = "title";
    createTitleScene(this.gr);
  }
  keyAction(code){}
	clickAction(){}
  update(){
    // タイトルアニメーションとかですかね
  }
  draw(){
    image(this.gr, 0, 0);
  }
}

// --------------------------------------------------------------------------------------- //
// Global functions for TitleScene.

function createTitleScene(gr){
  const SCALE = min(CANVAS_W, CANVAS_H);
  gr.background(220);
  gr.textSize(SCALE * 0.06);
  gr.textAlign(CENTER, CENTER);
  gr.fill(0);
  gr.text("ここにタイトル", CANVAS_W * 0.5, CANVAS_H * 0.4);
  gr.text("--- クリックするとプレイ画面に遷移 ---", CANVAS_W * 0.5, CANVAS_H * 0.6);
}

// --------------------------------------------------------------------------------------- //
// PlayScene.

class PlayScene extends Scene{
  constructor(_node){
    super(_node);
    this.name = "play";
  }
}

// --------------------------------------------------------------------------------------- //
// ClearScene.

class ClearScene extends Scene{
  constructor(_node){
    super(_node);
    this.name = "clear";
  }
}

// --------------------------------------------------------------------------------------- //
// GameoverScene.

class GameoverScene extends Scene{
  constructor(_node){
    super(_node);
    this.name = "gameover";
  }
}

// --------------------------------------------------------------------------------------- //
// System.（PlaySceneの中身）

class System{

}

// --------------------------------------------------------------------------------------- //
// preloading.

function preload(){
  // 種類ごとに処理を分けた方がいいかも
}

// --------------------------------------------------------------------------------------- //
// Main.

function setup(){
  createCanvas(CANVAS_W, CANVAS_H);
  myGame = new Game();
  myGame.createScenes(); // シーンを作る
}

function draw(){
  myGame.update();
  myGame.draw();
  myGame.shift();
}


// --------------------------------------------------------------------------------------- //
// Utility.（使い方をわかりやすく明記）

// --------------------------------------------------------------------------------------- //
// Interaction.（クリックやキー入力の関数）

function keyPressed(){
  myGame.currentScene.keyAction(keyCode);
	return false;
}

function mouseClicked(){
	myGame.currentScene.clickAction();
	return false;
}
