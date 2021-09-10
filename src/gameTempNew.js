// ゲームテンプレート2
// 自作STGを落とすための第一歩（のような何か）

// できるだけ汎用性を意識して・・

// それともakashicの方でもうちょっと頑張って見るべきかな・・

// とりあえずできました。

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
  prepare(_scene = undefined){ /* 前のシーンの情報を元に何かする */ }
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
    this.prepare();
  }
  prepare(_scene = undefined){
    createTitleScene(this.gr);
  }
  keyAction(code){
  }
	clickAction(){
    this.setNextScene("play");
  }
  update(){
    // タイトルアニメーションとかですかね。
    // その場合背景とは別にイメージを用意してそっちを更新しつつレイヤーごとに描画ってなると思う。
    // そっちをテンプレにすべきかどうか思案。というか背景が更新される形？んんん・・
  }
  draw(){
    clear();
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
    this._system = new System();
  }
  prepare(_scene = undefined){
    this._system.initialize(); // 適当
  }
  keyAction(){
    this._system.keyAction(this);
  }
  clickAction(){
    this._system.clickAction(this);
  }
  update(){
    // 何か、する？
    // thisを渡すのはシーンの遷移をさせるためではないかと（知るか）
    this._system.update(this);
  }
  draw(){
    this._system.draw();
  }
}

// --------------------------------------------------------------------------------------- //
// System.（PlaySceneの中身）

class System{
  constructor(){
    this.gr = createGraphics(CANVAS_W, CANVAS_H);
    this.graphicPreparation();
    this.goal = 10;
    this.count = 0;
    this.rest = 300;
  }
  graphicPreparation(){
    const SCALE = min(CANVAS_W, CANVAS_H);
    this.gr.textSize(SCALE * 0.06);
    this.gr.textAlign(CENTER, CENTER);
    this.gr.noStroke();
  }
  initialize(){
    this.count = 0;
    this.rest = 180;
  }
  keyAction(_play){

  }
  clickAction(_play){
    this.count++;
    if(this.count === this.goal){ _play.setNextScene("clear"); }
  }
  update(_play){
    this.rest--;
    if(this.rest === 0){ _play.setNextScene("gameover"); }
  }
  draw(){
    clear();
    this.gr.background(255, 220, 220);
    this.gr.fill(0);
    this.gr.text("3秒以内に10回クリック出来ればクリア！", CANVAS_W * 0.5, CANVAS_H * 0.2);
    this.gr.text("できなかったらゲームオーバーです。", CANVAS_W * 0.5, CANVAS_H * 0.3);
    this.gr.text("rest:", CANVAS_W * 0.3, CANVAS_H * 0.4);
    this.gr.fill(0, 0, 255);
    this.gr.rect(CANVAS_W * 0.3, CANVAS_H * 0.45, this.rest, CANVAS_H * 0.05);
    this.gr.fill(128);
    for(let i = 0; i < this.goal; i++){
      this.gr.rect(CANVAS_W * (0.3 + i * 0.04), CANVAS_H * 0.55, CANVAS_W * 0.03, CANVAS_H * 0.05);
    }
    this.gr.fill(0, 128, 255);
    for(let i = 0; i < this.count; i++){
      this.gr.rect(CANVAS_W * (0.3 + i * 0.04), CANVAS_H * 0.55, CANVAS_W * 0.03, CANVAS_H * 0.05);
    }
    image(this.gr, 0, 0);
  }
}

// --------------------------------------------------------------------------------------- //
// ClearScene.

class ClearScene extends Scene{
  constructor(_node){
    super(_node);
    this.name = "clear";
  }
  prepare(){
    this.gr.background(200, 255, 200);
    const SCALE = min(CANVAS_W, CANVAS_H);
    this.gr.textSize(SCALE * 0.06);
    this.gr.fill(0);
    this.gr.textAlign(CENTER, CENTER);
    this.gr.text("クリアおめでとう！", CANVAS_W * 0.5, CANVAS_H * 0.45);
    this.gr.text("タイトル画面に戻るにはクリックしてください", CANVAS_W * 0.5, CANVAS_H * 0.55);
  }
  keyAction(){

  }
  clickAction(){
    this.setNextScene("title");
  }
  update(){
    // 特に・・アニメーションあるなら？そういうのを？花火とか。
  }
  draw(){
    clear();
    image(this.gr, 0, 0);
  }
}

// --------------------------------------------------------------------------------------- //
// GameoverScene.

class GameoverScene extends Scene{
  constructor(_node){
    super(_node);
    this.name = "gameover";
  }
  prepare(){
    this.gr.background(200, 200, 255);
    const SCALE = min(CANVAS_W, CANVAS_H);
    this.gr.textSize(SCALE * 0.06);
    this.gr.fill(0);
    this.gr.textAlign(CENTER, CENTER);
    this.gr.text("ゲームオーバー...", CANVAS_W * 0.5, CANVAS_H * 0.45);
    this.gr.text("タイトル画面に戻るにはクリックしてください", CANVAS_W * 0.5, CANVAS_H * 0.55);
  }
  keyAction(){

  }
  clickAction(){
    this.setNextScene("title");
  }
  update(){
    // 特に・・アニメーションあるなら？そういうのを？花火とか。
  }
  draw(){
    clear();
    image(this.gr, 0, 0);
  }
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
