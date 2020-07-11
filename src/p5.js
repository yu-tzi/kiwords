

export default function sketch(p) {

  let c = 90;
  let x = [];
  let y = [];
  let colorX = 0
  let colorY = 0
  const Y_AXIS = 1;
  const X_AXIS = 2;
  let b1, b2;
 
  p.setup = function(){
    p.createCanvas(p.windowWidth, 900);

    b1 = p.color(101, 172, 189);
    b2 = p.color(131, 255, 204);
    
    for (var i = 0; i < c; i++) {
      x[i] = p.random(-100, p.windowWidth);
      y[i] = p.random(-100, 700);
    }
  }



  p.draw =function () {
    p.background(0);
    p.setGradient(0, 0, p.width, p.height, b1, b2, Y_AXIS);
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

  p.setGradient = function (x, y, w, h, c1, c2, axis) {
    
    p.noFill();
    if (axis === Y_AXIS) {
      // Top to bottom gradient
      for (let i = y; i <= y + h; i++) {
        //算出 y 軸結束點跟開始點的距離，用1來重新計算位置
        let inter = p.map(i, y, y + h, 0, 1);

        let c = p.lerpColor(c1, c2, inter);
        p.stroke(c);
        //一條一條線畫
        p.line(x, i, x + w, i);
      }
    } else if (axis === X_AXIS) {
      // Left to right gradient
      for (let i = x; i <= x + w; i++) {
        let inter = p.map(i, x, x + w, 0, 1);
        let c = p.lerpColor(c1, c2, inter);
        p.stroke(c);
        p.line(i, y, i, y + h);
      }
    }
  }

  p.windowResized=function() {
    p.resizeCanvas(p.windowWidth, 900);
  }
}