const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");
const colors = document.getElementsByClassName("jsColor");
const range = document.getElementById("jsRange");
const paintBtn = document.getElementById("jsPaint");
const eraseBtn = document.getElementById("jsErase");
const rectBtn = document.getElementById("jsRect");
const circleBtn = document.getElementById("jsCircle");
const textBtn = document.getElementById("jsText");
const saveBtn = document.getElementById("jsSave");
const preBtn = document.getElementById("jsPre");
const nextBtn = document.getElementById("jsNext");
const imageBtn = document.getElementById("jsImage");

const canvasWrap = document.getElementById("jsWrap");

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

// let mode = "brush";
// let shape;

let mode = "brush";
let shape = "text";

let dragRect = {
  sx: 0,
  sy: 0,
  width: 0,
  height: 0,
};

let dragArc = {
  sx: 0,
  sy: 0,
  radius: 0,
  startAngle: 0,
  endAngle: 2 * Math.PI,
};

let imageData;

const imageDataArr = [];
const textArr = [];

let painting = false;
let filling = false;
let isTextarea = false;
let isTextModify = false;
let TextModifyIndex;

/////////////////////////////////////

//Function to dynamically add an input box:
function addTextarea(
  preText,
  textarea_x,
  textarea_y,
  textarea_width,
  textarea_height
) {
  if (isTextarea) {
    return;
  }
  console.log(TextModifyIndex);
  console.log(preText, textarea_x, textarea_y, textarea_width, textarea_height);

  let Textarea = document.createElement("textarea");

  if (isTextModify) {
    console.log(preText);

    ctx.beginPath();
    ctx.clearRect(textarea_x, textarea_y, textarea_width, textarea_height);

    Textarea.id = `drawTextBox`;
    Textarea.value = preText;
    Textarea.style.left = `${textarea_x}px`;
    Textarea.style.top = `${textarea_y}px`;
    Textarea.style.width = `${textarea_width}px`;
    Textarea.style.height = `${textarea_height}px`;
    Textarea.style.border = `1px dashed rgba(0, 0, 0, 0.5)`;
    Textarea.style.font = `${font_size()}px sans-serif`;
    Textarea.style.color = INITIAL_COLOR;
    Textarea.style.zIndex = `10`;
    Textarea.style.outline = `none`;
    Textarea.style.overflow = `hidden`;
    Textarea.style.backgroundColor = `transparent`;
  } else {
    Textarea.id = `drawTextBox`;
    Textarea.style.left = `${textarea_x}px`;
    Textarea.style.top = `${textarea_y}px`;
    Textarea.style.width = `${textarea_width}px`;
    Textarea.style.height = `${textarea_height}px`;
    Textarea.style.border = `1px dashed rgba(0, 0, 0, 0.5)`;
    Textarea.style.font = `${font_size()}px sans-serif`;
    Textarea.style.zIndex = `10`;
    Textarea.style.outline = `none`;
    Textarea.style.overflow = `hidden`;
    Textarea.style.backgroundColor = `transparent`;
  }

  // Textarea.style.resize = `none`;
  Textarea.setAttribute(`spellcheck`, `false`);

  Textarea.onkeyup = handleTextareaEnter;

  canvasWrap.appendChild(Textarea);

  Textarea.focus();

  isTextarea = true;
}

//Key handler for input box:
function handleTextareaEnter(e) {
  let keyCode = e.keyCode;

  if (keyCode === 27 || this.value === "\n") {
    textArr.pop();
    canvasWrap.removeChild(this);
    isTextarea = false;
    isTextModify = false;
    return;
  } else if (keyCode === 13) {
    if (isTextModify) {
      textArr[TextModifyIndex].textBoxWidth = parseFloat(this.style.width);
      textArr[TextModifyIndex].text = this.value;

      drawText(
        ctx,
        this.value,
        textArr[TextModifyIndex].start_X,
        textArr[TextModifyIndex].start_Y,
        textArr[TextModifyIndex].textBoxWidth,
        textArr[TextModifyIndex].font,
        textArr[TextModifyIndex].text_color,
        (spacing = 1.2)
      );

      textArr.pop();
      isTextModify = false;
    } else {
      textArr[textArr.length - 1].textBoxWidth = parseFloat(this.style.width);
      textArr[textArr.length - 1].text = this.value;

      drawText(
        ctx,
        textArr[textArr.length - 1].text,
        textArr[textArr.length - 1].start_X,
        textArr[textArr.length - 1].start_Y,
        textArr[textArr.length - 1].textBoxWidth,
        textArr[textArr.length - 1].font,
        textArr[textArr.length - 1].text_color,
        (spacing = 1.2)
      );
    }

    canvasWrap.removeChild(this);
    isTextarea = false;

    console.log(textArr);
  }
}

//Draw the text onto canvas:
function drawText(
  ctx,
  text,
  x,
  y,
  textBoxWidth,
  font,
  text_color,
  spacing = 1.2
) {
  let line = "";
  let fontSize = font_size();
  let currentY = y;
  let drawTextBoxWidth = 0;
  let drawTextBoxHeight = 0;
  let cnt = 0;

  console.log("drawtext 시작");

  ctx.textAlign = "start";
  ctx.textBaseline = "top";
  ctx.font = font;
  ctx.fillStyle = text_color;

  for (let i = 0; i < text.length; i++) {
    let tempLine = line + text[i];
    let tempWidth = ctx.measureText(tempLine).width;

    if (tempWidth < textBoxWidth) {
      line = tempLine;
    } else {
      ctx.fillText(line, x, currentY);

      line = text[i];

      currentY += fontSize * spacing;

      if (cnt === 0) drawTextBoxWidth = tempWidth;
      drawTextBoxHeight += fontSize * spacing;

      cnt++;
    }
  }

  drawTextBoxHeight += fontSize;

  //text
  ctx.fillText(line, x, currentY);

  isTextModify
    ? ((textArr[TextModifyIndex].textBoxWidth = drawTextBoxWidth),
      (textArr[TextModifyIndex].textBoxHeight = drawTextBoxHeight))
    : ((textArr[textArr.length - 1].textBoxWidth = drawTextBoxWidth),
      (textArr[textArr.length - 1].textBoxHeight = drawTextBoxHeight));

  // ctx.strokeRect(x, y, drawTextBoxWidth, drawTextBoxHeight);
  console.log(textArr);
}

/////////////////////////////////////

// text 줄바꿈
// function drawTextBox(
//   ctx,
//   text,
//   x,
//   y,
//   textBoxWidth,
//   font,
//   text_color,
//   spacing = 1.1
// ) {
//   let line = "";
//   let fontSize = font_size();
//   let currentY = y;
//   let textBoxpadding;
//   let cnt = 0;
//   let rectPadding_1 = 10;
//   let rectPadding_2 = rectPadding_1 / 2;

//   ctx.textAlign = "start";
//   ctx.textBaseline = "top";
//   ctx.font = font;
//   ctx.fillStyle = text_color;

//   for (let i = 0; i < text.length; i++) {
//     let tempLine = line + text[i];
//     let tempWidth = ctx.measureText(tempLine).width;

//     // console.log(tempLine, tempWidth);

//     if (tempWidth < textBoxWidth - rectPadding_2) {
//       line = tempLine;
//       if (cnt === 0) textBoxpadding = (textBoxWidth - tempWidth) / 2;
//     } else {
//       cnt = 1;
//       ctx.fillText(line, x + textBoxpadding, currentY);

//       line = text[i];

//       currentY += fontSize * spacing;
//     }
//   }

//   //text
//   ctx.fillText(line, x + textBoxpadding, currentY);

//   // Rectangle
//   ctx.strokeRect(
//     x - rectPadding_2,
//     y - rectPadding_2,
//     textBoxWidth + rectPadding_1,
//     currentY - y + fontSize * spacing + rectPadding_1
//   );
// }

// textarea 클릭시 이전 textarea 생성
function preTextareaCreate(x, y) {
  const textArrIndex = textArr.findIndex(
    ({ start_X, start_Y, textBoxWidth, textBoxHeight }) => {
      return (
        start_X < x &&
        x < start_X + textBoxWidth &&
        start_Y < y &&
        y < start_Y + textBoxHeight
      );
    }
  );

  return textArrIndex;
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

// 이벤트 취소
function cancel() {
  console.log("////////////////////////// cancel //////////////////////////");
  if (painting) {
    if (mode === "brush") {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.putImageData(imageData, 0, 0);
    } else if (mode === "drag" && shape === "rect") {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.putImageData(imageData, 0, 0);
    } else if (mode === "drag" && shape === "circle") {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.putImageData(imageData, 0, 0);
    } else if (mode === "drag" && shape === "text") {
      if (!isTextModify) {
        textArr.pop();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.putImageData(imageData, 0, 0);
      }
      console.log(textArr);
    }

    painting = false;
  }
}

/////////////////////////////////// 데스크탑 ///////////////////////////////////

function handleMouseDown(event) {
  painting = true;
  // document.body.style.overflow = "hidden"; // 스크롤 방지
  const { offsetX, offsetY } = event;

  // console.log(offsetX, offsetY);

  if (mode === "drag") {
    if (painting && shape === "rect") {
      dragRect.sx = offsetX;
      dragRect.sy = offsetY;
    } else if (painting && shape === "circle") {
      dragArc.sx = offsetX;
      dragArc.sy = offsetY;
    } else if (painting && shape === "text") {
      let dragText = {
        text: "",
        start_X: offsetX,
        start_Y: offsetY,
        textBoxWidth: 0,
        textBoxHeight: 0,
        text_color: color,
        textBox_color: "#2c2c2c",
        text_lineWidth: lineWidth,
        // font: `bold ${font_size()}px Roboto`,
        font: `${font_size()}px sans-serif`,
      };

      textArr.push(dragText);
    }
  }

  imageData = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
}

function handleMouseUp(event) {
  // document.body.style.overflow = "unset"; // 스크롤 방지 해제

  const { offsetX, offsetY } = event;

  if (mode === "brush" || mode === "erase") {
    if (painting) {
      imageData = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    }
  } else if (mode === "drag") {
    if (painting && shape === "rect") {
      // 클릭시 영역 선택 방지
      if (dragRect.sx === offsetX || dragRect.sy === offsetY) {
        cancel();
        return;
      }

      imageData = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    }
    if (painting && shape === "circle") {
      // 클릭시 영역 선택 방지
      if (dragArc.sx === offsetX || dragArc.sy === offsetY) {
        cancel();
        return;
      }

      imageData = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    }
    if (painting && shape === "text") {
      if (
        (textArr[textArr.length - 1].start_X === offsetX &&
          textArr[textArr.length - 1].start_Y === offsetY) ||
        (textArr[textArr.length - 1].textBoxWidth < 0 &&
          textArr[textArr.length - 1].textBoxHeight < 0)
      ) {
        if (
          preTextareaCreate(
            textArr[textArr.length - 1].start_X,
            textArr[textArr.length - 1].start_Y
          ) >= 0
        ) {
          TextModifyIndex = preTextareaCreate(
            textArr[textArr.length - 1].start_X,
            textArr[textArr.length - 1].start_Y
          );

          const x = textArr[textArr.length - 1].start_X;
          const y = textArr[textArr.length - 1].start_Y;

          const preTextarea = textArr.filter(
            ({ start_X, start_Y, textBoxWidth, textBoxHeight }) => {
              return (
                start_X < x &&
                x < start_X + textBoxWidth &&
                start_Y < y &&
                y < start_Y + textBoxHeight
              );
            }
          );
          painting = false;
          isTextModify = true;

          addTextarea(
            preTextarea[0].text,
            preTextarea[0].start_X,
            preTextarea[0].start_Y,
            preTextarea[0].textBoxWidth,
            preTextarea[0].textBoxHeight
          );

          return;
        }

        cancel();

        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.putImageData(imageData, 0, 0);

      addTextarea(
        textArr[textArr.length - 1].text,
        textArr[textArr.length - 1].start_X,
        textArr[textArr.length - 1].start_Y,
        textArr[textArr.length - 1].textBoxWidth,
        textArr[textArr.length - 1].textBoxHeight
      );
    }

    // imageData = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  }
  painting = false;
  // console.log(textArr);
}

/////////////////////////////////// handleMouseMove
// 마우스 클릭 후 그리기
function handleMouseMove(event) {
  const { offsetX, offsetY } = event;

  changeCursor(mode);

  if (mode === "brush") {
    if (!painting) {
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY);
    } else {
      ctx.lineWidth = lineWidth;

      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();
    }
  } else if (mode === "erase") {
    if (!painting) {
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY);
    } else {
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
        dragRect.width = offsetX - dragRect.sx;
        dragRect.height = offsetY - dragRect.sy;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.putImageData(imageData, 0, 0);

        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = lineWidth;

        ctx.strokeRect(
          dragRect.sx,
          dragRect.sy,
          dragRect.width,
          dragRect.height
        );
      }
    } else if (shape === "circle") {
      if (painting) {
        dragArc.radius = getDistance(dragArc.sx, dragArc.sy, offsetX, offsetY);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.putImageData(imageData, 0, 0);

        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = lineWidth;

        ctx.beginPath();

        ctx.arc(
          dragArc.sx,
          dragArc.sy,
          dragArc.radius,
          dragArc.startAngle,
          dragArc.endAngle
        );

        ctx.stroke();
      }
    } else if (shape === "text") {
      if (!painting) {
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
      } else {
        console.log(isTextModify, painting);
        if (!isTextModify) {
          textArr[textArr.length - 1].textBoxWidth =
            offsetX - textArr[textArr.length - 1].start_X;

          textArr[textArr.length - 1].textBoxHeight =
            offsetY - textArr[textArr.length - 1].start_Y;

          const rectSx = textArr[textArr.length - 1].start_X;
          const rectSy = textArr[textArr.length - 1].start_Y;
          const rectWidth = offsetX - textArr[textArr.length - 1].start_X;
          const rectHeight = offsetY - textArr[textArr.length - 1].start_Y;

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.putImageData(imageData, 0, 0);

          if (textArr.length > 0) {
            ctx.strokeStyle = textArr[textArr.length - 1].textBox_color;
            // ctx.fillStyle = textArr[textArr.length - 1].text_color;
            // ctx.lineWidth = textArr[textArr.length - 1].text_lineWidth;
            ctx.lineWidth = 0.5;

            ctx.setLineDash([1, 2]);
            ctx.strokeRect(rectSx, rectSy, rectWidth, rectHeight);

            ctx.lineWidth = lineWidth;
            ctx.setLineDash([]);
          }
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

function handleTouchStart(event) {
  painting = true;

  document.body.style.overflow = "hidden"; // 스크롤 방지

  const clientRect = event.target.getBoundingClientRect();

  const x = event.touches[0].clientX - clientRect.left;
  const y = event.touches[0].clientY - clientRect.top + document.body.scrollTop;

  ctx.beginPath();
  ctx.moveTo(x, y);

  if (mode === "drag") {
    if (painting && shape === "rect") {
      dragRect.sx = x;
      dragRect.sy = y;
    } else if (painting && shape === "circle") {
      dragArc.sx = x;
      dragArc.sy = y;
    }
  }

  imageData = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
}

function handleTouchEnd(event) {
  document.body.style.overflow = "unset"; // 스크롤 방지 해제
  imageData = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  painting = false;
}

// 터치 후 그리기
// 데스크탑 페이지의 경우, x: e.offsetX, y: e.offsetY로 쉽게 마우스의 좌표를 알 수 있었음
// 하지만 모바일 페이지에서는 다른 방법으로 구해야 함
function handleTouchMove(event) {
  document.body.style.overflow = "hidden"; // 스크롤 방지
  const clientRect = event.target.getBoundingClientRect();
  const x = event.touches[0].clientX - clientRect.left;
  const y = event.touches[0].clientY - clientRect.top + document.body.scrollTop;

  if (mode === "brush") {
    ctx.lineWidth = lineWidth;

    ctx.lineTo(x, y);
    ctx.stroke();
  } else if (mode === "erase") {
    ctx.clearRect(
      x - ctx.lineWidth / 2,
      y - ctx.lineWidth / 2,
      ctx.lineWidth * 5,
      ctx.lineWidth * 5
    );
  } else if (mode === "drag") {
    if (shape === "rect") {
      dragRect.width = x - dragRect.sx;
      dragRect.height = y - dragRect.sy;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.putImageData(imageData, 0, 0);

      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = lineWidth;

      ctx.strokeRect(dragRect.sx, dragRect.sy, dragRect.width, dragRect.height);
    } else if (shape === "circle") {
      if (painting) {
        dragArc.radius = getDistance(dragArc.sx, dragArc.sy, x, y);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.putImageData(imageData, 0, 0);

        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = lineWidth;

        ctx.beginPath();

        ctx.arc(
          dragArc.sx,
          dragArc.sy,
          dragArc.radius,
          dragArc.startAngle,
          dragArc.endAngle
        );

        ctx.stroke();
      }
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

// PaintBtn 클릭
function handlePaintClick() {
  mode = "brush";
}

// EraseBtn 클릭
function handleEraseClick() {
  mode = "erase";
}

function handleRectBtnClick() {
  mode = "drag";
  shape = "rect";
}

function handleCircleBtnClick() {
  mode = "drag";
  shape = "circle";
}

function handleTextBtnClick() {
  mode = "drag";
  shape = "text";
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

function handleImageClick(event) {
  // console.dir(event.target);
  const file = event.target.files[0];
  const url = URL.createObjectURL(file);
  console.log(url);
  const fileImage = new Image(); // => <img src="" />
  fileImage.src = url;
  fileImage.onload = function () {
    ctx.drawImage(fileImage, 0, 0, canvas.width, canvas.height);
  };
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
  canvasWrap.addEventListener("mouseleave", cancel);

  // 데스크탑
  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mouseup", handleMouseUp);

  // contextmenu : 마우스 오른쪽 메뉴 선택 이벤트
  canvas.addEventListener("contextmenu", handleCM);

  // 모바일
  canvas.addEventListener("touchmove", handleTouchMove);
  canvas.addEventListener("touchstart", handleTouchStart);
  canvas.addEventListener("touchend", handleTouchEnd);
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

if (imageBtn) {
  imageBtn.addEventListener("change", handleImageClick);
}

if (preBtn) {
  preBtn.addEventListener("click", handlePreClick);
}

if (nextBtn) {
  nextBtn.addEventListener("click", handleNextClick);
}
