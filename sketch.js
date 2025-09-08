let video;
let headTopX, headTopY;
let theta;
let maxDepth = 0;
let growthSpeed = 3; 
let a;
let growthFactor = 0;
let treeGrowing = false;
let MAX_ALLOWED_DEPTH = 12;

function setup() {
  createCanvas(windowWidth, windowHeight);

  let constraints = {
    video: { facingMode: "user" },
    audio: false
  };
  video = createCapture(constraints);
  video.size(width, height);
  video.hide();

  frameRate(30);
}

function draw() {
  background(0);

  image(video, 0, 0, width, height);

  video.loadPixels();

  let detectedX = -1;
  let detectedY = -1;

  // 从上往下扫描每一行中心列像素
  let centerX = int(video.width / 2);
  for (let y = 0; y < video.height; y++) {
    let index = (y * video.width + centerX) * 4;
    let r = video.pixels[index + 0];
    let g = video.pixels[index + 1];
    let b = video.pixels[index + 2];
    let brightness = (r + g + b) / 3;

    if (brightness < 80) { // 阈值判断
      detectedX = centerX;
      detectedY = y;
      break; // 找到第一个暗点就停止
    }
  }

  // 如果找到头顶并且树没有在生长
  if (detectedY > 0 && !treeGrowing) {
    headTopX = map(detectedX, 0, video.width, 0, width);
    headTopY = map(detectedY, 0, video.height, 0, height);

    fill(255, 0, 0);
    noStroke();
   // ellipse(headTopX, headTopY, 10, 10);

    // 启动树生长
    treeGrowing = true;
    maxDepth = 0;
    growthFactor = 0;
    a = random(0.2, 0.35) * 90;
    theta = radians(a);
  }

  // 绘制树
  if (treeGrowing) {
    stroke(255);

    if (frameCount % growthSpeed === 0 && maxDepth < MAX_ALLOWED_DEPTH) {
      maxDepth++;
      growthFactor = 0;
    }

    growthFactor = min(growthFactor + 0.02, 1);

    push();
    translate(headTopX, headTopY);
    branch(330, 1);
    pop();

    // 树长完 → 允许再次检测生长点
    if (maxDepth === MAX_ALLOWED_DEPTH && growthFactor === 1) {
      treeGrowing = false;
    }
  }
}

function branch(h, depth) {
  if (depth > maxDepth) return;

  let len = h * (depth === maxDepth ? growthFactor : 1);

  let alpha = depth === maxDepth ? map(growthFactor, 0, 1, 50, 255) : 255;
  stroke(40,180,40, alpha);
  strokeWeight(1.5);
  line(0, 0, 0, -len);
  translate(0, -len);

  h *= 0.66;
  if (h > 2) {
    push();
    rotate(theta);
    branch(h, depth + 1);
    pop();

    push();
    rotate(-theta);
    branch(h, depth + 1);
    pop();
  }
}
