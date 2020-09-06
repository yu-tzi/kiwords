const Sketch = (p) => {
  const c = 50;
  let x = [];
  let y = [];
  let colorX = 0;
  let colorY = 0;

  p.setup = function () {
    p.createCanvas(3000, 800);

    for (let i = 0; i < c; i++) {
      x[i] = p.random(-100, p.windowWidth);
      y[i] = p.random(-100, 700);
    }
  };

  p.draw = function () {
    p.background(13, 14, 19);
    p.stroke(colorX, 150, colorY); //white line
    p.noFill(); //以下不填滿
    for (let j = 0; j < c; j++) {
      for (let k = j + 1; k < c; k++) {
        let d = p.int(p.dist(x[j], y[j], x[k], y[k]));
        if (d < 200) {
          p.line(x[j], y[j], x[k], y[k]);
        }
      }
    }

    p.randomSeed(60);
    colorX = p.map(p.mouseX, 0, p.windowWidth, 0, 255, true);
    colorY = p.map(p.mouseY, 0, p.windowHeight, 0, 255, true);
    p.fill(colorX, 150, colorY);

    p.noStroke(); //線條藏起來
    for (let i = 0; i < c; i++) {
      p.ellipse(x[i], y[i], 7, 7);
      x[i] = x[i] + p.random(-0.1, 0.1);
      y[i] = y[i] + p.random(-0.1, 0.1);
    }
  };
};

export default Sketch;
