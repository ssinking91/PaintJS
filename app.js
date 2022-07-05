const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");
const colors = document.getElementsByClassName("jsColor");
const range = document.getElementById("jsRange");
const fillBtn = document.getElementById("jsFill");
const paintBtn = document.getElementById("jsPaint");
const eraseBtn = document.getElementById("jsErase");
const rectBtn = document.getElementById("jsRect");
const saveBtn = document.getElementById("jsSave");

const INITIAL_COLOR = "#2c2c2c";
const CANVAS_SIZE = 700;

canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

// fillStyle = color : 도형을 채우는 색을 설정합니다.
// fillRect(x, y, width, height) : 색칠된 직사각형을 그립니다.
// strokeStyle = color : 도형의 윤곽선 색을 설정합니다.
// lineWidth = value : 이후 그려질 선의 두께를 설정합니다.

// ✔️ 경로 그리기
// 1. 경로를 생성합니다.
// 2. 그리기 명령어를 사용하여 경로상에 그립니다.
// 3. 경로가 한번 만들어졌다면, 경로를 렌더링 하기 위해서 윤곽선을 그리거나 도형 내부를 채울수 있습니다.

// 1. beginPath() : 새로운 경로를 생성
// 2-1. moveTo(x, y) : 펜을  x와 y 로 지정된 좌표로 옮김
// 2-2. lineTo(x, y) : 현재의 드로잉 위치에서 x와 y로 지정된 위치까지 선을 그림
// 3-1. stroke() : 윤곽선을 이용하여 도형을 그림
// 3-2. fill() : 경로의 내부를 채워서 내부가 채워진 도형을 그림

// 참고:  현재 열린 path가  비어있는 경우 ( beginPath() 메소드를 사용한 직 후, 혹은캔버스를 새로 생성한 직후), 첫 경로 생성 명령은 실제 동작에 상관 없이 moveTo()로 여겨지게 됩니다. 그렇기 때문에 경로를 초기화한 직후에는 항상 명확하게 시작 위치를 설정해 두는것이 좋습니다.
// 참고:  fill() 메소드 호출 시, 열린 도형은 자동으로 닫히게 되므로  closePath()메소드를 호출하지 않아도 됩니다. 이것은 stroke() 메소드에는 적용되지 않습니다.
// 참고:  closePath() : 현재 점 위치와 시작점 위치를 직선으로 이어서 도형을 닫음. 이미 도형이 닫혔거나 한 점만 존재한다면, 이 메소드는 아무것도 하지 않음
// 참고 : offsetX, offsetY => 이벤트 대상이 기준
//        - offsetX : 이벤트 대상 객체에서의 상대적 마우스 x좌표 위치를 반환
//        - offsetY : 이벤트 대상 객체에서의 상대적 마우스 y좌표 위치를 반환

ctx.fillStyle = "transparent";
ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;
ctx.lineWidth = 2.5;

let mode = "brush";
let painting = false;
let filling = false;
let shape = "rect";
let color = INITIAL_COLOR;
const dragArr = [];

// if (dragArr.length > 1) {
//   dragArr.forEach((rect) => {
//     ctx.strokeRect(rect.start_X, rect.start_Y, rect.width, rect.height);
//   });
// }
/////////////////////////////////// 데스크탑 ///////////////////////////////////

function clickStartPainting(event) {
  painting = true;
  document.body.style.overflow = "hidden"; // 스크롤 방지

  const { offsetX, offsetY } = event;

  if (mode === "drag") {
    if (painting && shape === "rect") {
      let dragRect = {
        start_X: offsetX,
        start_Y: offsetY,
        width: 0,
        height: 0,
        rect_strokeStyle: color,
      };

      dragArr.push(dragRect);
    }
  }
}

function clickStopPainting(event) {
  document.body.style.overflow = "unset"; // 스크롤 방지 해제

  const { offsetX, offsetY } = event;

  if (mode === "drag") {
    if (painting && shape === "rect") {
      const width = offsetX - dragArr[dragArr.length - 1].start_X;
      const height = offsetY - dragArr[dragArr.length - 1].start_Y;

      // 클릭시 영역 선택 방지
      if (
        dragArr[dragArr.length - 1].start_X === offsetX ||
        dragArr[dragArr.length - 1].start_Y === offsetY
      ) {
        cancel();
        return;
      }

      // drag width, height 추가
      dragArr[dragArr.length - 1].width = width;
      dragArr[dragArr.length - 1].height = height;

      if (dragArr.length >= 1) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        dragArr.forEach((rect) => {
          // strokeStyle = rect.rect_strokeStyle;
          ctx.strokeRect(rect.start_X, rect.start_Y, rect.width, rect.height);
        });
      }
    }
  }

  painting = false;
}

// onMouseLeave 이벤트 : 이벤트 요소 영역 밖으로 이동시
function cancel() {
  if (painting) {
    if (mode === "drag" && shape === "rect") {
      dragArr.pop();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dragArr.forEach((rect) => {
        strokeStyle = rect.rect_strokeStyle;
        ctx.strokeRect(rect.start_X, rect.start_Y, rect.width, rect.height);
      });
    }
    painting = false;
  }
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
  } else {
    canvas.style.cursor = "auto";
  }
}

// 마우스 클릭 후 그리기
function onMouseMove(event) {
  // console.log(event);
  const x = event.offsetX;
  const y = event.offsetY;

  changeCursor(mode);

  if (mode === "fill" || mode === "brush") {
    if (!painting) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else {
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
  } else if (mode === "drag") {
    if (shape === "rect") {
      if (!painting) {
        ctx.beginPath();
        ctx.moveTo(x, y);
      } else {
        ctx.fillStyle = color;
        ctx.fillRect(
          dragArr[dragArr.length - 1].start_X,
          dragArr[dragArr.length - 1].start_Y,
          x - dragArr[dragArr.length - 1].start_X,
          y - dragArr[dragArr.length - 1].start_Y
        );
        ctx.strokeRect(
          dragArr[dragArr.length - 1].start_X,
          dragArr[dragArr.length - 1].start_Y,
          x - dragArr[dragArr.length - 1].start_X,
          y - dragArr[dragArr.length - 1].start_Y
        );
      }
    }
  }
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
  ctx.lineWidth = size;
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

// Fill 일시 canvas 전체 색상 변경
function handleCanvasClick() {
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

if (saveBtn) {
  saveBtn.addEventListener("click", handleSaveClick);
}
