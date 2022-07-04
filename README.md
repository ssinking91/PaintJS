### ✨ paintjs

Painting Board made with VanillaJS

<br/>

---

<br/>

### [Canvas](https://developer.mozilla.org/ko/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes#%EA%B7%B8%EB%A6%AC%EB%93%9C)

1.  ✔️ offsetX, clientX, pageX, screenX의 차이

    (1) offsetX, offsetY

        - 위 메서드는 이벤트 대상이 기준이 됩니다. ( 화면 중간에 있는 박스 내부에서 클릭한 위치를 찾을 때 해당 박스의 왼쪽 모서리 좌표가 0이됩니다. 화면의 기준이 아닙니다)

        - 전체 문서를 기준으로 합니다(스크롤 화면 포함)

        - offsetX : 이벤트 대상 객체에서의 상대적 마우스 x좌표 위치를 반환합니다.

        - offsetY : 이벤트 대상 객체에서의 상대적 마우스 y좌표 위치를 반환합니다.

    (2) clientX, clientY

        - 위 메서드는 클라이언트 영역 내의 가로,세로 좌표를 제공합니다. 여기서 클라이언트 영역은 현재 보이는 브라우저 화면이 기준이 됩니다.

        - clientX : 브라우저 페이지에서의 X좌표 위치를 반환하나 스크롤은 무시하고 해당 페이지의 상단을 0으로 측정합니다.

        - clientY : 브라우저 페이지에서의 Y좌표 위치를 반환하나 스크롤은 무시하고 해당 페이지의 상단을 0으로 측정합니다.

    (3) pageX, pageY

        - 위 메서드는 전체 문서를 기준으로 x,y 좌표를 반환 합니다. 스크롤 화면을 포함해서 측정합니다.

        - pageX : 브라우저 페이지에서의 x좌표 위치를 반환합니다.

        - pageY : 브라우저 페이지에서의 Y좌표 위치를 반환합니다.

    (4) screenX, screenY

        - 위 메서드는 모니터 화면을 기준으로 좌표를 제공합니다. 여기서 중요한 점은 브라우저 화면이 아니라 자신의 모니터 화면 전체를 기준으로 좌표를 측정한다는 점입니다.

        - screenX : 전체 모니터 스크린에서의 x좌표 위치를 반환합니다.

        - screenY :전체 모니터 스크린에서의 y좌표 위치를 반환합니다.

<br/>

---

<br/>

2.  ✔️ 캔버스(Canvas) 기본 사용법

    (1) `<canvas>`요소 `width, height` 크기 지정 - CSS 크기 지정이 초기 캔버스의 비율을 고려하지 않으면 왜곡되어 나타남.

    ```html
    <canvas id="tutorial" width="150" height="150"></canvas>

    // img태그 사용
    <canvas id="clock" width="150" height="150">
      <img src="images/clock.png" width="150" height="150" alt="" />
    </canvas>
    ```

    (2) 렌더링 컨텍스트 - `<canvas>` 엘리먼트는 고정 크기의 드로잉 영역을 생성하고 하나 이상의 렌더링 컨텍스(rendering contexts)를 노출하여, 출력할 컨텐츠를 생성하고 다루게 됨

    (3) 캔버스는 처음에 비어있음. 무언가를 표시하기 위해서, 어떤 스크립트가 랜더링 컨텍스트에 접근하여 그리도록 할 필요가 있음.

    (4) `<canvas>` 요소는 `getContext()` 메서드를 이용해서, 랜더링 컨텍스트와 (렌더링 컨텍스트의) 그리기 함수들을 사용할 수 있음. `getContext()` 메서드는 렌더링 컨텍스트 타입을 지정하는 하나의 파라메터를 가짐.

    ```javascript
    var canvas = document.getElementById("tutorial");
    var ctx = canvas.getContext("2d");
    ```

<br/>

---

<br/>

3.  ✔️ 캔버스(canvas)를 이용한 도형 그리기

    👉 경로 그리기

    (1) 경로를 생성

        1) beginPath() : 새로운 경로를 생성

    (2) 그리기 명령어를 사용하여 경로상에 그림

        2-1) moveTo(x, y) : 펜을  x와 y 로 지정된 좌표로 옮김

        2-2) lineTo(x, y) : 현재의 드로잉 위치에서 x와 y로 지정된 위치까지 선을 그림

    (3) 경로가 한번 만들어졌다면, 경로를 렌더링 하기 위해서 윤곽선을 그리거나 도형 내부를 채울수 있음

        3-1) stroke() : 윤곽선을 이용하여 도형을 그림(선 색 채우기)

        3-2) fill() : 경로의 내부를 채워서 내부가 채워진 도형을 그림(도형 색 채우기)

<br/>

👀 참고 : 현재 열린 path가 비어있는 경우 ( beginPath() 메소드를 사용한 직 후, 혹은캔버스를 새로 생성한 직후), 첫 경로 생성 명령은 실제 동작에 상관 없이 moveTo()로 여겨지게 됩니다. 그렇기 때문에 경로를 초기화한 직후에는 항상 명확하게 시작 위치를 설정해 두는것이 좋음

<br/>

👀 참고 : fill() 메소드 호출 시, 열린 도형은 자동으로 닫히게 되므로 closePath()메소드를 호출하지 않아도 됩니다. 이것은 stroke() 메소드에는 적용되지 않음

<br/>

👀 참고 : closePath() : 현재 점 위치와 시작점 위치를 직선으로 이어서 도형을 닫음. 이미 도형이 닫혔거나 한 점만 존재한다면, 이 메소드는 아무것도 하지 않음

<br/>

---

<br/>

4.  ✔️ 캔버스(canvas)를 이용한 도형 지우기

    👉 clearRect(x, y, width, height)

    (1) 전체 캔버스 지우기

    ```javascript
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ```

    (2) 캔버스의 일부 지우기

    ```javascript
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    // Draw yellow background
    ctx.beginPath();
    ctx.fillStyle = "#ff6";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw blue triangle
    ctx.beginPath();
    ctx.fillStyle = "blue";
    ctx.moveTo(20, 20);
    ctx.lineTo(180, 20);
    ctx.lineTo(130, 130);
    ctx.closePath();
    ctx.fill();

    // Clear part of the canvas
    ctx.clearRect(10, 10, 120, 100);
    ```
