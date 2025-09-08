let video;
let headTop = null;
let locked = false;

let stem = null;
let flowerRadius = 0;
let blooming = false;
let finished = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  let constraints = {
    video: { facingMode: "user" },
    audio: false
  };
  video = createCapture(constraints);
  video.size(width, height);
  video.hide();
}

function draw() {
  image(video, 0, 0, width, height);

  if (!locked) {
    detectHeadTop();
  }

  if (stem) {
    drawStem();

    if (!blooming && stem.y2 < height * 0.2) {
      blooming = true; // 到顶后开始开花
    }
  }

  if (blooming && !finished) {
    drawFlower(stem.x2, stem.y2);

    // 如果花基本覆盖满屏，结束这一轮
    if (flowerRadius > max(width, height) * 0.6) {
      finished = true;
      resetFlower();
    }
  }
}

// ------------------- 人头检测 -------------------
function detectHeadTop() {
  video.loadPixels();
  let centerX = int(video.width / 2);
  let headTopY = -1;

  for (let y = 0; y < video.height; y++) {
    let idx = (y * video.width + centerX) * 4;
    let r = video.pixels[idx];
    let g = video.pixels[idx + 1];
    let b = video.pixels[idx + 2];
    let brightness = (r + g + b) / 3;

    if (brightness < 80) {
      headTopY = y;
      break;
    }
  }

  if (headTopY > 0) {
    headTop = {
      x: width / 2,
      y: map(headTopY, 0, video.height, 0, height)
    };

    fill(255, 0, 0);
    noStroke();
    ellipse(headTop.x, headTop.y, 6, 6);

    locked = true;
    stem = { x1: headTop.x, y1: headTop.y, x2: headTop.x, y2: headTop.y, len: 200 };
  }
}

// ------------------- 绘制茎 -------------------
function drawStem() {
  stroke(34, 139, 34);
  strokeWeight(8);
  line(stem.x1, stem.y1, stem.x2, stem.y2);

  // 慢慢往上长
  if (!blooming) {
    stem.y2 -= 2;
  }
}

// ------------------- 绘制花 -------------------
function drawFlower(x, y) {
  flowerRadius += 2; // 每帧扩大半径

  noFill();
  strokeWeight(2);

  for (let angle = 0; angle < TWO_PI; angle += PI / 12) {
    let r = flowerRadius * (1 + 0.2 * sin(frameCount * 0.05 + angle * 3));
    let x2 = x + cos(angle) * r;
    let y2 = y + sin(angle) * r;

    stroke(255, 100 + 100 * sin(angle * 5), 150 + 50 * cos(angle * 3), 180);
    line(x, y, x2, y2);
  }

  // 花心
  noStroke();
  fill(255, 200, 0, 200);
  ellipse(x, y, 20, 20);
}

// ------------------- 重置，准备下一轮 -------------------
function resetFlower() {
  setTimeout(() => {
    stem = null;
    flowerRadius = 0;
    blooming = false;
    finished = false;
    locked = false; // 解锁，重新寻找头顶
  }, 1000); // 给一点停顿时间
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  video.size(windowWidth, windowHeight);
}

