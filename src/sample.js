let result = [];
let t, c;

function ease1(p){
  return 3*p*p - 2*p*p*p;
}

function ease2(p, g){
  if(p < 0.5){
    return 0.5 * pow(2*p, g);
  }else{
    return 1 - 0.5 * pow(2*(1 - p), g);
  }
}

function softplus(q, p){
  let qq = q+p;
  if(qq <= 0){
    return 0;
  }
  if(qq >= 2*p){
    return qq - p;
  }
  return qq*qq/(4*p);
}

let mn = 0.5 * Math.sqrt(3);
let ia = Math.atan(Math.sqrt(0.5));

//////////////////////////////////////////////////////////////////////////////

let samplesPerFrame = 6;
let numFrames = 100;
let shutterAngle = 2.3;

let n = 32;
let w = 20;

function pos(i, j){
  return new p5.Vector(map(i, 0, n-1, -width/2 + w, width/2 - w), map(j, 0, n-1, -height/2 + w, height/2 - w));
}

function directionPath(pa, i, j){
  if(pa == 1){
    let type = ((i/2) + (j/2)) % 2;
    let a = i % 2;
    let b = j % 2;
    if(type == 0){
      if(a==0 && b==0) return new p5.Vector(i+1, j);
      if(a==1 && b==0) return new p5.Vector(i, j+1);
      if(a==1 && b==1) return new p5.Vector(i-1, j);
      if(a==0 && b==1) return new p5.Vector(i, j-1);
    }else{
      if(a==0 && b==0) return new p5.Vector(i,j+1);
      if(a==1 && b==0) return new p5.Vector(i-1,j);
      if(a==1 && b==1) return new p5.Vector(i,j-1);
      if(a==0 && b==1) return new p5.Vector(i+1,j);
    }
  }else if(pa == 0){
    let midi = (n-1) * 0.5;
    let midj = (n-1) * 0.5;
    let angle = atan2(j - midi, i - midi);
    let eps = 0.001;
    let d = max(abs(midi - i), abs(midj - j));
    if(round(d) % 2 == 0){
      if((angle >= -HALF_PI - QUARTER_PI - eps) && (angle <= -HALF_PI + QUARTER_PI - eps)){ return new p5.Vector(i+1, j); }
      else if((angle >= -HALF_PI + QUARTER_PI - eps) && (angle <= QUARTER_PI - eps)){ return new p5.Vector(i, j+1); }
      else if((angle >= QUARTER_PI - eps) && (angle <= HALF_PI + QUARTER_PI - eps)){ return new p5.Vector(i-1, j); }
      else{ return new p5.Vector(i, j-1); }
    }else{
      if((angle >= -HALF_PI - QUARTER_PI + eps)&&(angle <= -HALF_PI + QUARTER_PI + eps)){ return new p5.Vector(i-1, j); }
      else if((angle >= -HALF_PI + QUARTER_PI + eps)&&(angle <= QUARTER_PI + eps)){ return new p5.Vector(i, j-1); }
      else if((angle >= QUARTER_PI + eps)&&(angle <= QUARTER_PI + HALF_PI + eps)){ return new p5.Vector(i+1, j); }
      else{ return new p5.Vector(i, j+1); }
    }
  }else if(pa == 2){
// たぶんだけど32x32を16分割してそれぞれについてぐるぐるさせているんだと思うよ。
  }
}






// function that defines the patterns (next grid position from previous grid position)
PVector directionPath(int pa,int i,int j)
{
  if(pa==1)
  {
    int type = ((i/2) + (j/2))%2;
    int a = i%2;
    int b = j%2;
    if(type==0)
    {
      if(a==0&&b==0) return new PVector(i+1,j);
      if(a==1&&b==0) return new PVector(i,j+1);
      if(a==1&&b==1) return new PVector(i-1,j);
      if(a==0&&b==1) return new PVector(i,j-1);
    }
    else
    {
      if(a==0&&b==0) return new PVector(i,j+1);
      if(a==1&&b==0) return new PVector(i-1,j);
      if(a==1&&b==1) return new PVector(i,j-1);
      if(a==0&&b==1) return new PVector(i+1,j);
    }
  }
  else if(pa==0)
  {
    float midi = float(n-1)/2.0;
    float midj = float(n-1)/2.0;
    float angle = atan2(j-midj,i-midi);
    float eps=0.001;
    float d = max(abs(midi-i),abs(midj-j));
    if(round(d)%2==0){
      if((angle>=-HALF_PI-QUARTER_PI-eps)&&(angle<=-HALF_PI+QUARTER_PI-eps)) return new PVector(i+1,j);
      if((angle>=-HALF_PI+QUARTER_PI-eps)&&(angle<=QUARTER_PI-eps)) return new PVector(i,j+1);
      if((angle>=QUARTER_PI-eps)&&(angle<=QUARTER_PI+HALF_PI-eps)) return new PVector(i-1,j);
      else return new PVector(i,j-1);
    }
    else
    {
      if((angle>=-HALF_PI-QUARTER_PI+eps)&&(angle<=-HALF_PI+QUARTER_PI+eps)) return new PVector(i-1,j);
      if((angle>=-HALF_PI+QUARTER_PI+eps)&&(angle<=QUARTER_PI+eps)) return new PVector(i,j-1);
      if((angle>=QUARTER_PI+eps)&&(angle<=QUARTER_PI+HALF_PI+eps)) return new PVector(i+1,j);
      else return new PVector(i,j+1);
    }
  }
  else if(pa==2)
  {
    int sz = 8;
    int type = ((i/sz) + (j/sz))%2;
    int a = i%sz;
    int b = j%sz;
    float mida = float(sz-1)/2.0;
    float midb = float(sz-1)/2.0;
    float angle = atan2(b-midb,a-mida);
    float eps=0.001;
    float d = max(abs(mida-a),abs(midb-b));
    if(round(d)%2==(type+1)%2){
      if((angle>=-HALF_PI-QUARTER_PI-eps)&&(angle<=-HALF_PI+QUARTER_PI-eps)) return new PVector(i+1,j);
      if((angle>=-HALF_PI+QUARTER_PI-eps)&&(angle<=QUARTER_PI-eps)) return new PVector(i,j+1);
      if((angle>=QUARTER_PI-eps)&&(angle<=QUARTER_PI+HALF_PI-eps)) return new PVector(i-1,j);
      else return new PVector(i,j-1);
    }
    else
    {
      if((angle>=-HALF_PI-QUARTER_PI+eps)&&(angle<=-HALF_PI+QUARTER_PI+eps)) return new PVector(i-1,j);
      if((angle>=-HALF_PI+QUARTER_PI+eps)&&(angle<=QUARTER_PI+eps)) return new PVector(i,j-1);
      if((angle>=QUARTER_PI+eps)&&(angle<=QUARTER_PI+HALF_PI+eps)) return new PVector(i+1,j);
      else return new PVector(i,j+1);
    }
  }
  return new PVector(0,0);
}

int L = 3;
int P = 3;
float transitionTime = 0.3;
float iterationsPerCycle = 2000;
int numberOfRepeats = 4;
float time = 0;

class Move
{
  int start_i;
  int start_j;
  int type;
  float startTime,endTime;
  PVector endPos;

  PVector [] path = new PVector[L];

  Move(PVector startPos,int type_,float tm)
  {
    start_i = round(startPos.x);
    start_j = round(startPos.y);
    type = type_;
    startTime = tm;
    endTime = startTime+transitionTime;

    int curi = start_i;
    int curj = start_j;
    for(int k=0;k<L;k++)
    {
      path[k] = new PVector(curi,curj);
      PVector v = directionPath(type,curi,curj);
      curi = round(v.x);
      curj = round(v.y);
    }
    endPos = path[L-1];
  }

  PVector unMappedPosition(float tm)
  {
    float p = constrain(map(tm,startTime,endTime,0,1),0,1);
    float q = ease(p,1.8);
    float ind = 0.999999*q*(L-1);
    int ind1 = floor(ind);
    int ind2 = ind1+1;
    float frac = ind-ind1;

    PVector v1 = path[ind1];
    PVector v2 = path[ind2];

    PVector u = v1.copy().lerp(v2,frac);

    return u;
  }
}

float triggerer(PVector pos,int dM)
{
  return  0.03*dist(pos.x,pos.y,float(n-1)/2.0,float(n-1)/2.0)+1.0*dM/P;
}

class Particle
{
  boolean isMoving = false;
  int doneMoves = 0;
  PVector currentPos;

  Particle(PVector pos_)
  {
    currentPos = pos_;
  }

  Move currentMove;
  ArrayList<PVector> positions = new ArrayList<PVector>();

  void update()
  {
    if(!isMoving && time>=triggerer(currentPos,doneMoves))
    {
      currentMove = new Move(currentPos,doneMoves%P,time);
      isMoving = true;
      doneMoves++;
    }
    else if(isMoving && time>=currentMove.endTime)
    {
      isMoving = false;
      currentPos = currentMove.endPos;
    }

    if(!isMoving)
    {
      positions.add(currentPos);
    }
    else
    {
      positions.add(currentMove.unMappedPosition(time));
      //println("+");
    }
  }

  void show()
  {
    float t2 = (t+(numberOfRepeats-1))*0.9999999;
    float ifl = iterationsPerCycle*t2;
    int i1 = floor(ifl);
    int i2 = i1+1;
    float lp = ifl-i1;

    PVector v1 = positions.get(i1);
    PVector v2 = positions.get(i2);

    PVector u = v1.copy().lerp(v2,lp);

    PVector mapped = pos(u.x,u.y);

    stroke(255);
    //strokeWeight(5.0);
    //point(mapped.x,mapped.y);
    strokeWeight(1.5);
    fill(0);
    ellipse(mapped.x,mapped.y,7,7);

    point(mapped.x,mapped.y);
  }
}

Particle [][] array = new Particle[n][n];

void simulate()
{
  float timeStep = 1.0/iterationsPerCycle;
  for(int k=0;k<iterationsPerCycle*numberOfRepeats+100;k++)
  {
    if(k%10==0) println("k:",k);
    for(int i=0;i<n;i++)
    {
      for(int j=0;j<n;j++)
      {
        array[i][j].update();
      }
    }
    time += timeStep;
  }
}

void setup(){
  size(600,600,P2D);
  result = new int[width*height][3];

  for(int i=0;i<n;i++)
  {
    for(int j=0;j<n;j++)
    {
      array[i][j] = new Particle(new PVector(i,j));
    }
  }

  simulate();
}



void draw(){
  background(0);

  translate(width/2,height/2);

  for(int i=0;i<n;i++)
  {
    for(int j=0;j<n;j++)
    {
      array[i][j].show();
    }
  }

}
