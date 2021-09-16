// ゲームテンプレート2
// 自作STGを落とすための第一歩（のような何か）

// 最初から作り直し。
// bulletLang3を読み込んであるので自由に使えます。

// PauseSceneはそのうち作るのでとりあえずいいです。

// 2021/09/16/AM11:20
// 割と簡単に移植できましたね・・まあパターンの作り方をいじるとかjsonに落とした方がいいんじゃないかとか
// 背景はあらかじめダウンロードするかもしくはアニメーションにするかそこら辺の設定（スクロール？）
// 課題もやってみたいことも山積みですがとりあえず形はできました。
// 2019年12月の自分優秀すぎる・・負けてられない、こっちは積み上げてきた歴史があるんだから生かさないと。
// 当たっても死なない障害物とか？んー・・。

// ポーズは画像をもらってそれを背景として利用しつつ上下キーで選択肢を選んで実行する感じね。画面は停止。
// それはsystemがupdateされなければいいだけの話なので。ただキー入力が・・キー入力できちゃうので、
// bulletLang3の方ちょっといじってsystemがポーズの場合にキー入力を無効にする処置が必要かもしれない。
// つまりポーズ中に上下キー押してポーズ解除したときにプレイヤーが動いちゃって・・動かないか。
// よく考えたらキー入力の効果を反映させるためのメソッドもsystemのupdate内で行われるから問題ない。変更なしでヨシ！！

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
const K_SHIFT = 16; // シフトキー。
const K_CTRL = 17; // コントロールキー。今回はこれをポーズに使う。

// INFはsystem内で使う
const INF = Infinity; // 長いので
// パターンのデフォルトだけどまあそのうち・・うん、
const DEFAULT_PATTERN_INDEX = 0;
// フラグ
const IS_IN_BATTLE = 0;
const IS_CLEAR = 1;
const IS_GAMEOVER = 2;


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
    this.scenes.pause = new PauseScene(this);
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
    if(code === K_ENTER){ this.setNextScene("play"); }
  }
	clickAction(){
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
  gr.text("title", CANVAS_W * 0.5, CANVAS_H * 0.45);
  gr.text("press enter...", CANVAS_W * 0.5, CANVAS_H * 0.55);
}

// --------------------------------------------------------------------------------------- //
// PlayScene.

class PlayScene extends Scene{
  constructor(_node){
    super(_node);
    this.name = "play";
    this._system = createSystem(CANVAS_W, CANVAS_H, 1024);
    // ここでパターンを生成する感じ。
    this.generatePattern();
  }
  generatePattern(){
    let weaponData = [];
    let weaponCapacity = 0;

    // プレイヤーの攻撃パターン作成
    // デフォルト。黒い弾丸をいっぱい。
    weaponData[weaponCapacity++] = {
      action:{
        main:[{shotDistance:["set", 25]}, {shotAction:"go"}, {catch:"a"}, {nway:{count:4, interval:40}},
              {wait:4}, {loop:INF, back:"a"}],
  		  go:[{direction:["set", -90]}]
      }
    };

  	// 武器を追加するならこの辺になんか書く
  	// fire命令がスペースキーを押している間だけ次の命令に進むようになっている仕組み。

  	// 鞭
  	weaponData[weaponCapacity++] = {
  		color:"blue",
  		action:{
  			main:[{deco:{color:"blue", shape:"rectSmall"}}, {catch:"a"}, {radial:{count:6}},
  						{wait:3}, {shotDirection:["add", [-15, 15]]}, {loop:INF, back:"a"}]
  		}
  	}

  	// ばらばらショット
  	weaponData[weaponCapacity++] = {
  		color:"green",
  		action:{
  			main:[{deco:{color:"green", shape:"starSmall"}}, {catch:"a"}, {fire:""}, {shotDirection:["set", [0, 360]]}, {wait:1}, {loop:INF, back:"a"}]
  		}
  	}

  	// 思いつかない

    this._system.createPlayer(weaponData);

    // 新しいcircularの実験中。FALさんの4を書き直し。
    // shotDirectionの初期設定は撃ちだした瞬間の進行方向。
    this._system.addPatternSeed({
      x:0.5, y:0.3, shotSpeed:10, collisionFlag:ENEMY, bgColor:"white", color:"green",
      action:{
        main:[{shotAction:"sweeping"}, {deco:{color:"black", shape:"rectSmall"}}, {radial:{count:4}}],
        sweeping:[{speed:["set", 0.001, 30]}, {move:"circular", bearing:-3},
                  {bind:true}, {shotDirection:["rel", 0]},
                  {shotSpeed:["set", 4]}, {deco:{color:"red", shape:"rectSmall"}},
                  {catch:"a"}, {fire:""}, {wait:1}, {shotDirection:["add", 12]}, {loop:INF, back:"a"}]
      }
    });
  }
  prepare(_scene = undefined){
    // ここでパターンを読み込む感じ。

  	// マニュアル作らないといけないわね
  	// 順繰りに次のパターンが現れるようにしたらゲームっぽくなりそうだけどね
  	// あとは背景工夫したいわね
  	// bgColorのところでなんかやって・・
  	// drawで引数渡すところでローディングした背景画像を渡してそれを・・

  	// systemの初期化でいくつか画像用意してそれを使うとかでいいんじゃない。で、色名の代わりにプリセット0とか1とかで指定する感じで。
  	// それが嫌ならこっちで画像を個別に作ってmySystemに登録できる仕組みを整えるのもありね。setupでこっちでいろいろやる。

    this._system.setPattern(DEFAULT_PATTERN_INDEX);
  }
  keyAction(code){
    // CTRLキーでポーズに遷移する予定
    // シフトキーでショットチェンジ（予定）
    if(code === K_SHIFT){
      this._system.player.shiftPattern();
    }
  }
  clickAction(){
  }
  update(){
    // 何か、する？
    // thisを渡すのはシーンの遷移をさせるためではないかと（知るか）
    this._system.update(this);
    const flag = this._system.getFinishFlag();
    if(flag === IS_CLEAR){ this.setNextScene("clear"); }
    if(flag === IS_GAMEOVER){ this.setNextScene("gameover"); }
  }
  draw(){
    clear();
    this._system.draw(this.gr);
    image(this.gr, 0, 0);
  }
}

// --------------------------------------------------------------------------------------- //
// System.（PlaySceneの中身）
// こちらに書くことはない。

// --------------------------------------------------------------------------------------- //
// PauseScene.
// おいおいね・・・

class PauseScene extends Scene{
  constructor(_node){
    super(_node);
    this.name = "pause";
  }
  prepare(_scene = undefined){ /* 遷移時に必ず実行される。前のシーンの情報を元に何かする */ }
  keyAction(code){ /* キーイベント */}
	clickAction(){ /* マウスクリックイベント */ }
	update(){}
	draw(){}
}

// --------------------------------------------------------------------------------------- //
// ClearScene.
// playから受け取った画像を・・んー。どうするかな。
// わざわざ分ける必要ない？Systemのそのまま使ったうえで、グレーかけて文字表示するみたいなのでもいいかも。
// つまりplayからsystemを譲り受けてそれそのまま描画したうえで・・
// んー、いいや。文字表示するだけでいいや。そこまであっちには含めたくないからこっちで描画したいというわけ。

class ClearScene extends Scene{
  constructor(_node){
    super(_node);
    this.name = "clear";
    this.grPlay = createGraphics(CANVAS_W, CANVAS_H);
    this._system;
  }
  prepare(_scene = undefined){
    // _sceneはplayで確定なのでsystemやgrなどを譲り受ける
    // それを自らのgrに落としてそのうえでテキストを・・って感じ
    const SCALE = min(CANVAS_W, CANVAS_H);
    this.gr.textSize(SCALE * 0.06);
    this.gr.fill(0);
    this.gr.textAlign(CENTER, CENTER);
    this.grPlay = _scene.gr;
    this._system = _scene._system;
  }
  keyAction(code){
    if(code === K_ENTER){ this.setNextScene("title"); }
  }
  clickAction(){
  }
  update(){
    // 特に・・アニメーションあるなら？そういうのを？花火とか。
    this._system.update();
  }
  draw(){
    clear();
    this._system.draw(this.grPlay);
    this.gr.image(this.grPlay, 0, 0);
    this.gr.text("clear!", CANVAS_W * 0.5, CANVAS_H * 0.45);
    this.gr.text("press enter...", CANVAS_W * 0.5, CANVAS_H * 0.55);
    image(this.gr, 0, 0);
  }
}

// --------------------------------------------------------------------------------------- //
// GameoverScene.

class GameoverScene extends Scene{
  constructor(_node){
    super(_node);
    this.name = "gameover";
    this.grPlay = createGraphics(CANVAS_W, CANVAS_H);
    this._system;
  }
  prepare(_scene = undefined){
    // だいたい同じような感じですかね・・変化を加えたいならなんかいじるかもだけど。
    const SCALE = min(CANVAS_W, CANVAS_H);
    this.gr.textSize(SCALE * 0.06);
    this.gr.fill(0);
    this.gr.textAlign(CENTER, CENTER);
    this.grPlay = _scene.gr;
    this._system = _scene._system;
  }
  keyAction(code){
    if(code === K_ENTER){ this.setNextScene("title"); }
  }
  clickAction(){
  }
  update(){
    // 特に・・アニメーションあるなら？そういうのを？花火とか。
    this._system.update();
  }
  draw(){
    clear();
    this._system.draw(this.grPlay);
    this.gr.image(this.grPlay, 0, 0);
    this.gr.text("gameover...", CANVAS_W * 0.5, CANVAS_H * 0.45);
    this.gr.text("press enter!", CANVAS_W * 0.5, CANVAS_H * 0.55);
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
  angleMode(DEGREES);
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
