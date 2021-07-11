// 移植しました
// bulletLang2ではupdateの中にすべての処理が内包されています
// 以上

const INF = Infinity; // 長いので
const DEFAULT_PATTERN_INDEX = 0;

let isLoop = true;

let mySystem; // これをメインに使っていく

// ---------------------------------------------------------------------------------------- //
// preload.

// ---------------------------------------------------------------------------------------- //
// setup.

function setup(){
  mySystem = createSystem(480, 600, 1024);
  createCanvas(AREA_WIDTH, AREA_HEIGHT);
  angleMode(DEGREES);
  textSize(16);

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

  mySystem.createPlayer(weaponData);

  // 新しいcircularの実験中。FALさんの4を書き直し。
  // shotDirectionの初期設定は撃ちだした瞬間の進行方向。
  mySystem.addPatternSeed({
    x:0.5, y:0.3, shotSpeed:10, collisionFlag:ENEMY, bgColor:"white", color:"green",
    action:{
      main:[{shotAction:"sweeping"}, {deco:{color:"black", shape:"rectSmall"}}, {radial:{count:4}}],
      sweeping:[{speed:["set", 0.001, 30]}, {move:"circular", bearing:-3},
                {bind:true}, {shotDirection:["rel", 0]},
                {shotSpeed:["set", 4]}, {deco:{color:"red", shape:"rectSmall"}},
                {catch:"a"}, {fire:""}, {wait:1}, {shotDirection:["add", 12]}, {loop:INF, back:"a"}]
    }
  })

	// マニュアル作らないといけないわね
	// 順繰りに次のパターンが現れるようにしたらゲームっぽくなりそうだけどね
	// あとは背景工夫したいわね
	// bgColorのところでなんかやって・・
	// drawで引数渡すところでローディングした背景画像を渡してそれを・・

	// systemの初期化でいくつか画像用意してそれを使うとかでいいんじゃない。で、色名の代わりにプリセット0とか1とかで指定する感じで。
	// それが嫌ならこっちで画像を個別に作ってmySystemに登録できる仕組みを整えるのもありね。setupでこっちでいろいろやる。

  mySystem.setPattern(DEFAULT_PATTERN_INDEX);
}

function draw(){
  mySystem.update(); // 更新、衝突判定、行動、排除処理
  mySystem.draw(); // 描画処理
}

// ---------------------------------------------------------------------------------------- //
// MainSystem.
// 結局Systemってステートの一種なので・・タイトルやセレクトもステート化してそれぞれ差し替えればいい
// つまりそれぞれにupdateやdrawを持たせてcurrentState.updateとかdrawってやればいいんじゃないですかね
// あとはそれらの間の受け渡しを作ればいいのです
// テトリスとかと一緒ですね

class MainSystem{
  constructor(){
  }
}


// ---------------------------------------------------------------------------------------- //
// KeyAction.

function keyTyped(){
  if(key === 'p'){
    if(isLoop){ noLoop(); isLoop = false; return; }
    else{ loop(); isLoop = true; return; }
  }
}

function keyPressed(){
  // シフトキーでショットチェンジ（予定）
  if(keyCode === SHIFT){
    mySystem.player.shiftPattern();
  }
}
