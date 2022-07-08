const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");
const colors = document.getElementsByClassName("jsColor");
const range = document.getElementById("jsRange");
const fillBtn = document.getElementById("jsFill");
const paintBtn = document.getElementById("jsPaint");
const eraseBtn = document.getElementById("jsErase");
const rectBtn = document.getElementById("jsRect");
const circleBtn = document.getElementById("jsCircle");
const textBtn = document.getElementById("jsText");
const saveBtn = document.getElementById("jsSave");
const preBtn = document.getElementById("jsPre");
const nextBtn = document.getElementById("jsNext");

const INITIAL_COLOR = "#2c2c2c";
const CANVAS_SIZE = 700;

canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

ctx.fillStyle = "transparent";
ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

let color = INITIAL_COLOR;
let lineWidth = 2.5;
let text_lineWidth;

let font_size = () => {
  if (canvas.width > 1200) return 22;
  if (canvas.width > 992) return 20;
  if (canvas.width > 768) return 18;
  if (canvas.width > 480) return 16;
};

let painting = false;
let filling = false;

let mode = "brush";
let shape;

const lineArr = [];
const rectArr = [];
const arcArr = [];
const textArr = [];

let imageData;

// text 줄바꿈
function drawTextBox(
  ctx,
  text,
  x,
  y,
  textBoxWidth,
  spacing = 1.2,
  font,
  text_color
) {
  let line = "";
  let fontSize = font_size();
  let currentY = y;
  let textBoxpadding;
  let cnt = 0;
  let rectPadding_1 = 10;
  let rectPadding_2 = rectPadding_1 / 2;

  ctx.textAlign = "start";
  ctx.textBaseline = "top";
  ctx.font = font;
  ctx.fillStyle = text_color;

  for (let i = 0; i < text.length; i++) {
    let tempLine = line + text[i];
    let tempWidth = ctx.measureText(tempLine).width;

    // console.log(tempLine, tempWidth);

    if (tempWidth < textBoxWidth - rectPadding_2) {
      line = tempLine;
      if (cnt === 0) textBoxpadding = (textBoxWidth - tempWidth) / 2;
    } else {
      cnt = 1;
      ctx.fillText(line, x + textBoxpadding, currentY);

      line = text[i];

      currentY += fontSize * spacing;
    }
  }

  //text
  ctx.fillText(line, x + textBoxpadding, currentY);

  // Rectangle
  ctx.strokeRect(
    x - rectPadding_2,
    y - rectPadding_2,
    textBoxWidth + rectPadding_1,
    currentY - y + fontSize * spacing + rectPadding_1
  );
}

// 커서 이미지 변경
function changeCursor(mode) {
  if (mode === "fill") {
    canvas.style.cursor = "url(brush-fill.svg), auto";
  } else if (mode === "brush") {
    canvas.style.cursor = "url(pencil-fill.svg), auto";
  } else if (mode === "erase") {
    canvas.style.cursor = "url(eraser-fill.svg), auto";
  } else if (mode === "drag") {
    if (shape === "rect") canvas.style.cursor = "url(square.svg), auto";
    else if (shape === "circle") canvas.style.cursor = "url(circle.svg), auto";
    else if (shape === "text") canvas.style.cursor = "url(text.svg), auto";
  } else {
    canvas.style.cursor = "auto";
  }
}

/////////////////////////////////// 데스크탑 ///////////////////////////////////

function clickStartPainting(event) {
  painting = true;
  // document.body.style.overflow = "hidden"; // 스크롤 방지
  const { offsetX, offsetY } = event;

  console.log(offsetX, offsetY);

  if (mode === "brush") {
    if (painting) {
      let linePath = {
        path: [],
        sX: offsetX,
        sY: offsetY,
        line_color: color,
        line_lineWidth: lineWidth,
      };

      lineArr.push(linePath);
    }
  } else if (mode === "drag") {
    if (painting && shape === "rect") {
      let dragRect = {
        start_X: offsetX,
        start_Y: offsetY,
        width: 0,
        height: 0,
        rect_color: color,
        rect_lineWidth: lineWidth,
      };

      rectArr.push(dragRect);
    } else if (painting && shape === "circle") {
      let dragArc = {
        start_X: offsetX,
        start_Y: offsetY,
        radius: 0,
        startAngle: 0,
        endAngle: 2 * Math.PI,
        arc_color: color,
        arc_lineWidth: lineWidth,
      };

      arcArr.push(dragArc);
    } else if (painting && shape === "text") {
      console.log(font_size());
      let dragText = {
        text: "",
        start_X: offsetX,
        start_Y: offsetY,
        textBoxWidth: 0,
        text_color: color,
        text_lineWidth: lineWidth,
        font: `bold ${font_size()}px Roboto`,
      };

      textArr.push(dragText);
      console.log(textArr);
    }
  }

  imageData = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
}

function clickStopPainting(event) {
  // document.body.style.overflow = "unset"; // 스크롤 방지 해제

  const { offsetX, offsetY } = event;

  if (mode === "brush") {
    if (painting) {
      if (
        lineArr[lineArr.length - 1].sX === offsetX ||
        lineArr[lineArr.length - 1].sY === offsetY
      ) {
        cancel();
        return;
      }
    }
  }
  if (mode === "drag") {
    if (painting && shape === "rect") {
      // 클릭시 영역 선택 방지
      if (
        rectArr[rectArr.length - 1].start_X === offsetX ||
        rectArr[rectArr.length - 1].start_Y === offsetY
      ) {
        cancel();
        return;
      }
    }
    if (painting && shape === "circle") {
      // 클릭시 영역 선택 방지
      if (
        arcArr[arcArr.length - 1].start_X === offsetX ||
        arcArr[arcArr.length - 1].start_Y === offsetY
      ) {
        cancel();
        return;
      }
    }
    if (painting && shape === "text") {
      const content = prompt("✔️내용은 무엇인가요?");

      if (!content) {
        cancel();
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.putImageData(imageData, 0, 0);

      textArr[textArr.length - 1].text = content;

      drawTextBox(
        ctx,
        textArr[textArr.length - 1].text,
        textArr[textArr.length - 1].start_X,
        textArr[textArr.length - 1].start_Y,
        textArr[textArr.length - 1].textBoxWidth,
        (spacing = 1.2),
        textArr[textArr.length - 1].font,
        textArr[textArr.length - 1].text_color
      );
    }
  }

  imageData = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  painting = false;

  console.log(lineArr, rectArr, arcArr, textArr);
}

// onMouseLeave 이벤트 : 이벤트 요소 영역 밖으로 이동시
function cancel() {
  if (painting) {
    if (mode === "brush") {
      lineArr.pop();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.putImageData(imageData, 0, 0);
    }
    if (mode === "drag" && shape === "rect") {
      rectArr.pop();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.putImageData(imageData, 0, 0);
    } else if (mode === "drag" && shape === "circle") {
      arcArr.pop();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.putImageData(imageData, 0, 0);
    } else if (mode === "drag" && shape === "text") {
      textArr.pop();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.putImageData(imageData, 0, 0);
      console.log(textArr);
    }

    painting = false;
  }
}

// 마우스 클릭 후 그리기
function onMouseMove(event) {
  const { offsetX, offsetY } = event;

  changeCursor(mode);

  if (mode === "fill" || mode === "brush") {
    if (!painting) {
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY);
    } else {
      ctx.lineWidth = lineWidth;

      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();

      lineArr[lineArr.length - 1].path.push({
        line_X: offsetX,
        line_Y: offsetY,
      });
    }
  } else if (mode === "erase") {
    if (painting) {
      ctx.clearRect(
        offsetX - ctx.lineWidth / 2,
        offsetY - ctx.lineWidth / 2,
        ctx.lineWidth * 5,
        ctx.lineWidth * 5
      );
    }
  } else if (mode === "drag") {
    if (shape === "rect") {
      if (!painting) {
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
      } else {
        rectArr[rectArr.length - 1].width =
          offsetX - rectArr[rectArr.length - 1].start_X;

        rectArr[rectArr.length - 1].height =
          offsetY - rectArr[rectArr.length - 1].start_Y;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.putImageData(imageData, 0, 0);

        if (rectArr.length > 0) {
          rectArr.forEach((rect) => {
            ctx.strokeStyle = rect.rect_color;
            ctx.fillStyle = rect.rect_color;
            ctx.lineWidth = rect.rect_lineWidth;

            ctx.strokeRect(rect.start_X, rect.start_Y, rect.width, rect.height);
          });
        }
      }
    } else if (shape === "circle") {
      if (painting) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.putImageData(imageData, 0, 0);

        const sX = arcArr[arcArr.length - 1].start_X;
        const sY = arcArr[arcArr.length - 1].start_Y;

        arcArr[arcArr.length - 1].radius = getDistance(
          sX,
          sY,
          offsetX,
          offsetY
        );

        if (arcArr.length > 0) {
          arcArr.forEach((arc) => {
            ctx.strokeStyle = arc.arc_color;
            ctx.fillStyle = arc.arc_color;
            ctx.lineWidth = arc.arc_lineWidth;

            ctx.beginPath();

            ctx.arc(
              arc.start_X,
              arc.start_Y,
              arc.radius,
              arc.startAngle,
              arc.endAngle
            );

            ctx.stroke();
          });
        }
      }
    } else if (shape === "text") {
      if (!painting) {
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
      } else {
        textArr[textArr.length - 1].textBoxWidth =
          offsetX - textArr[textArr.length - 1].start_X;

        const rectSx = textArr[textArr.length - 1].start_X;
        const rectSy = textArr[textArr.length - 1].start_Y;
        const rectWidth = offsetX - textArr[textArr.length - 1].start_X;
        const rectHeight = offsetY - textArr[textArr.length - 1].start_Y;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.putImageData(imageData, 0, 0);

        if (textArr.length > 0) {
          ctx.strokeStyle = textArr[textArr.length - 1].text_color;
          ctx.fillStyle = textArr[textArr.length - 1].text_color;
          ctx.lineWidth = textArr[textArr.length - 1].text_lineWidth;

          ctx.strokeRect(rectSx, rectSy, rectWidth, rectHeight);
        }
      }
    }
  }
}

// 드래그 원 반지름 구하기
function getDistance(ax, ay, zx, zy) {
  const dis_x = ax - zx;
  const dix_y = ay - zy;
  dist = Math.sqrt(Math.abs(dis_x * dis_x) + Math.abs(dix_y * dix_y));
  return dist;
}
/////////////////////////////////// 모바일 ///////////////////////////////////

function touchStartPainting(event) {
  painting = true;
  document.body.style.overflow = "hidden"; // 스크롤 방지

  const x = event.touches[0].clientX - event.target.offsetLeft;
  const y =
    event.touches[0].clientY -
    event.target.offsetTop +
    document.documentElement.scrollTop;

  ctx.beginPath();
  ctx.moveTo(x, y);
}

function touchStopPainting() {
  painting = false;
  document.body.style.overflow = "unset"; // 스크롤 방지 해제
}

// 터치 후 그리기
// 데스크탑 페이지의 경우, x: e.offsetX, y: e.offsetY로 쉽게 마우스의 좌표를 알 수 있었음
// 하지만 모바일 페이지에서는 다른 방법으로 구해야 함
function onTouchMove(event) {
  console.log(event);
  const x = event.touches[0].clientX - event.target.offsetLeft;
  const y =
    event.touches[0].clientY -
    event.target.offsetTop +
    document.documentElement.scrollTop;

  if (mode === "fill" || mode === "brush") {
    if (painting) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  } else if (mode === "erase") {
    if (painting) {
      ctx.clearRect(
        x - ctx.lineWidth / 2,
        y - ctx.lineWidth / 2,
        ctx.lineWidth * 5,
        ctx.lineWidth * 5
      );
    }
  }
}

// 색상 변경
function handleColorClick(event) {
  color = event.target.style.backgroundColor;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
}

// 글씨 두께 변경
function handleRangeChange(event) {
  const size = event.target.value;
  lineWidth = size;
}

// Fill, Paint 변경
// function handleModeClick() {
//   if (filling === true) {
//     filling = false;
//     mode.innerText = "Fill";
//   } else {
//     filling = true;
//     mode.innerText = "Paint";
//   }
// }

// FillBtn 클릭
function handleFillClick() {
  filling = true;
  mode = "fill";
}

// PaintBtn 클릭
function handlePaintClick() {
  filling = false;
  mode = "brush";
}

// EraseBtn 클릭
function handleEraseClick() {
  filling = false;
  mode = "erase";
}

function handleRectBtnClick() {
  filling = false;
  mode = "drag";
  shape = "rect";
}

function handleCircleBtnClick() {
  filling = false;
  mode = "drag";
  shape = "circle";
}

function handleTextBtnClick() {
  filling = false;
  mode = "drag";
  shape = "text";
}

// Fill 일시 canvas 전체 색상 변경
function handleCanvasClick(event) {
  // console.log(event);
  if (filling) {
    // fillRect(x, y, width, height) : 색칠된 직사각형을 그립니다.
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  }
}

// canvas 그림 다운로드
function handleSaveClick() {
  // canvas.toDataURL() : 마우스 오른쪽 단추로 클릭해 메뉴를 열 때 발생.
  const image = canvas.toDataURL();
  const link = document.createElement("a");
  link.href = image;
  link.download = "PaintJS[🎨]";
  link.click();
}

// 마우스 우클릭 방지
function handleCM(event) {
  event.preventDefault();
}

// 이전으로 되돌리기
function handlePreClick(event) {
  event.preventDefault();
}

// 다음으로 되돌리기
function handleNextClick(event) {
  event.preventDefault();
}

if (canvas) {
  // 데스크탑
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mousedown", clickStartPainting);
  canvas.addEventListener("mouseup", clickStopPainting);
  canvas.addEventListener("mouseleave", cancel);
  canvas.addEventListener("click", handleCanvasClick);

  // contextmenu : 마우스 오른쪽 메뉴 선택 이벤트
  canvas.addEventListener("contextmenu", handleCM);

  // 모바일
  canvas.addEventListener("touchmove", onTouchMove);
  canvas.addEventListener("touchstart", touchStartPainting);
  canvas.addEventListener("touchend", touchStopPainting);
}

Array.from(colors).forEach((color) =>
  color.addEventListener("click", handleColorClick)
);

if (range) {
  range.addEventListener("input", handleRangeChange);
}

// Fill, Paint 변경
// if (mode) {
//   mode.addEventListener("click", handleModeClick);
// }

if (fillBtn) {
  fillBtn.addEventListener("click", handleFillClick);
}

if (paintBtn) {
  paintBtn.addEventListener("click", handlePaintClick);
}

if (eraseBtn) {
  eraseBtn.addEventListener("click", handleEraseClick);
}

if (rectBtn) {
  rectBtn.addEventListener("click", handleRectBtnClick);
}

if (circleBtn) {
  circleBtn.addEventListener("click", handleCircleBtnClick);
}

if (textBtn) {
  textBtn.addEventListener("click", handleTextBtnClick);
}

if (saveBtn) {
  saveBtn.addEventListener("click", handleSaveClick);
}

if (preBtn) {
  preBtn.addEventListener("click", handlePreClick);
}

if (nextBtn) {
  nextBtn.addEventListener("click", handleNextClick);
}
