
let video;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // 打开前置摄像头
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

  video.loadPixels();

  let centerX = int(video.width / 2);
  let headTopY = -1;

  // 从上往下扫描中心列的像素
  for (let y = 0; y < video.height; y++) {
    let index = (y * video.width + centerX) * 4;
    let r = video.pixels[index + 0];
    let g = video.pixels[index + 1];
    let b = video.pixels[index + 2];
    let brightness = (r + g + b) / 3;

    // 阈值判断（越暗说明可能是头发/头部）
    if (brightness < 80) {  
      headTopY = y;
      break;
    }
  }

  // 如果找到头部上缘，就画一个红点
  if (headTopY > 0) {
    fill(255, 0, 0);
    noStroke();
    ellipse(width / 2, map(headTopY, 0, video.height, 0, height), 10, 10);
  }
}
