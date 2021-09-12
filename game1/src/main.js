// ゲームテンプレート2

// とりあえず弾幕避けゲーム（シンプルに）
// パターン増やすためのアップデート大変そう・・
// 最初から複数パターンを意識して作った方がいいかも

// --------------------------------------------------------------------------------------- //
// Global.

let myGame;

// --------------------------------------------------------------------------------------- //
// Constants.（各種定数）

// キャンバスサイズ
const CANVAS_W = 480;
const CANVAS_H = 640;

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
  prepare(_scene = undefined){ /* 遷移時に必ず実行される。前のシーンの情報を元に何かする */ }
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
    this.prepare(); // ノードステートなので・・ロゴが入るならここには何も書かないかも。
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
  gr.text("--- クリックする ---", CANVAS_W * 0.5, CANVAS_H * 0.6);
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
// とりあえず簡潔に。3秒以内に10回クリックするだけの簡単なゲーム。
// 弾幕を一定時間よけ続けるとか、
// 自動生成された迷路を潜り抜けるとか、
// いろいろね。シューティングでもいいし。

class System{
  constructor(){
    this.gr = createGraphics(CANVAS_W, CANVAS_H);
    this.graphicPreparation();
  }
  graphicPreparation(){
    const SCALE = min(CANVAS_W, CANVAS_H);
    this.gr.textSize(SCALE * 0.06);
    this.gr.textAlign(CENTER, CENTER);
    this.gr.noStroke();
  }
  initialize(){
  }
  keyAction(_play){

  }
  clickAction(_play){
  }
  update(_play){
  }
  draw(){
    clear();
    image(this.gr, 0, 0);
  }
}

// --------------------------------------------------------------------------------------- //
// Player.
// 十字キーで動かす。弾をかわす。ステージ最初にライフ設定60で、当たっている間減り続ける感じ。
// 当たっているときにパーティクルを出す。つまり当たっている時間の累計が60になったらアウトね。ブリンクは無し。

class Player{
  constructor(){

  }
}

// --------------------------------------------------------------------------------------- //
// Bullet.
// 弾丸。画像貼り付けでバリエーション。もしくは図形が回転する感じで。もしくは連続アニメーションでもいいかも（4フレームx8枚とか）
// 円判定。プレーヤーにあたっても消滅しない。バリエーションはまた別のカテゴリーで。。

class Bullet{
  constructor(){
    
  }
}

// --------------------------------------------------------------------------------------- //
// Pattern.

// --------------------------------------------------------------------------------------- //
// CollisionSystem.
// プレイヤーとブレットの円判定。プレイヤーとブレットだけなので総当たりでいいですね。
// まあ後回しかな・・

// --------------------------------------------------------------------------------------- //
// Particle.

// これひとつで複数のパーティクルの出現モーションになってる
// 連続して発生することを考慮してarrayってわけね
// 改良点としては三角形とかバリエーション作るあたりかな。。星形も難しくなさそう。
// 確かそういうバリエーション考えたけど本質的でないってことで後回しにした記憶。
class Particle{
	constructor(x, y, size, _color, life = 60, speed = 4, count = 20){
    this.color = {r:red(_color), g:green(_color), b:blue(_color)};
		this.center = {x:x, y:y};
		this.size = size;
		this.life = life;
		this.speed = speed;
		this.count = count + random(-5, 5);
		this.rotationAngle = 0;
		this.rotationSpeed = 4;
		this.moveSet = [];
		this.prepareMoveSet();
		this.alive = true;
	}
	prepareMoveSet(){
		for(let i = 0; i < this.count; i++){
			this.moveSet.push({x:0, y:0, speed:this.speed + random(-2, 2), direction:random(360)});
		}
	}
	update(){
		if(!this.alive){ return; }
		this.moveSet.forEach((z) => {
			z.x += z.speed * cos(z.direction);
			z.y += z.speed * sin(z.direction);
			z.speed *= 0.9;
		})
		this.rotationAngle += this.rotationSpeed;
		this.life--;
		if(this.life === 0){ this.alive = false; }
	}
	draw(){
		if(!this.alive){ return; }
		stroke(this.color.r, this.color.g, this.color.b, this.life * 4);
		const c = cos(this.rotationAngle) * this.size;
		const s = sin(this.rotationAngle) * this.size;
		this.moveSet.forEach((z) => {
			const cx = this.center.x + z.x;
			const cy = this.center.y + z.y;
      quad(cx + c, cy + s, cx - s, cy + c, cx - c, cy - s, cx + s, cy - c);
		})
	}
  eject(){
    if(!this.alive){ this.vanishAction(); }
  }
  vanishAction(){
    this.belongingArray.remove(this);
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
    this.gr.text("クリックしてください", CANVAS_W * 0.5, CANVAS_H * 0.55);
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
    this.gr.text("クリックしてください", CANVAS_W * 0.5, CANVAS_H * 0.55);
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
// まあ基本的にはアセットを配置する形の方がいいんでしょうね。サンプル作るなら図形描画でいいんだけど。

function preload(){
  // 種類ごとに処理を分けた方がいいかも
}

// --------------------------------------------------------------------------------------- //
// Main.

function setup(){
  createCanvas(CANVAS_W, CANVAS_H);
  angleMode(DEGREES); // 度数法でおねがい。
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

// Simple Cross Reference Array.
// 改造する前のやつ。
// add:要素を追加する。追加時に要素に所属配列への参照が付与される。
// addMulti:要素を複数まとめて追加する。
// remove:要素側から配列からの離脱をさせる
// loop:特定の処理をすべての要素に対して行う。具体的には要素としてのクラスのメソッド名・・
// これ引数があってもできるようにすべきかなぁ。改良する必要性・・arg使えばできそう。
// loopReverse:削除などの処理をまとめて行う場合はこちら
// clear:配列を空にする。初期化などの際に使う。
class SimpleCrossReferenceArray extends Array{
	constructor(){
    super();
	}
  add(element){
    this.push(element);
    element.belongingArray = this; // 所属配列への参照
  }
  addMulti(elementArray){
    // 複数の場合
    elementArray.forEach((element) => { this.add(element); })
  }
  remove(element){
    let index = this.indexOf(element, 0);
    this.splice(index, 1); // elementを配列から排除する
  }
  loop(methodName){
		if(this.length === 0){ return; }
    // methodNameには"update"とか"display"が入る。まとめて行う処理。
		for(let i = 0; i < this.length; i++){
			this[i][methodName]();
		}
  }
	loopReverse(methodName){
		if(this.length === 0){ return; }
    // 逆から行う。排除とかこうしないとエラーになる。もうこりごり。
		for(let i = this.length - 1; i >= 0; i--){
			this[i][methodName]();
		}
  }
	clear(){
		this.length = 0;
	}
}

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
