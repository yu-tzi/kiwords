
export default function Sketch(p) {

  let c = 50;
  let x = [];
  let y = [];
  let colorX = 0
  let colorY = 0
 
  p.setup = function(){
    p.createCanvas(3000, 800);
    
    for (var i = 0; i < c; i++) {
      x[i] = p.random(-100, p.windowWidth);
      y[i] = p.random(-100, 700);
    }
  }

  p.draw = function () {
    p.background(13, 14, 19);
    p.stroke(colorX, 150, colorY);//white line
    p.noFill();//以下不填滿
    for (var j = 0; j < c; j++) {
      for (var k = j + 1; k < c; k++) {
        var d = p.int(p.dist(x[j], y[j], x[k], y[k]));
        //兩任意點的距離 //把前一個點跟後一個點連起來
        //點的 0,1,2,3,4,5 是按照 setup 的 random 挑位置
        if (d < 200) {//如果距離沒有太遠，把兩邊合起來
          p.line(x[j], y[j], x[k], y[k]);
        }
      }
    }

    p.randomSeed(60);
    colorX = p.map(p.mouseX, 0, p.windowWidth, 0, 255, true)
    colorY = p.map(p.mouseY, 0, p.windowHeight, 0, 255, true)
    p.fill(colorX, 150, colorY);

    p.noStroke();//線條藏起來
    for (var i = 0; i < c; i++) {
      p.ellipse(x[i], y[i], 7, 7);
      x[i] = x[i] + (p.random(-0.1, 0.1))
      y[i] = y[i] + (p.random(-0.1, 0.1))
    }
    
  }
}