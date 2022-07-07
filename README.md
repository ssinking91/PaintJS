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

<br/>

---

<br/>

5.  ✔️ 캔버스(canvas)를 이용한 직사각형 그리기

    👉 fillRect(x, y, width, height) : 색칠된 직사각형을 그림

    👉 strokeRect(x, y, width, height) : 직사각형 윤곽선을 그림

    👉 clearRect(x, y, width, height) : 특정 부분을 지우는 직사각형이며, 이 지워진 부분은 완전히 투명해 짐

    (1) 직사각형 도형 예제

    ```javascript
    function draw() {
      var canvas = document.getElementById("canvas");
      if (canvas.getContext) {
        var ctx = canvas.getContext("2d");

        ctx.fillRect(25, 25, 100, 100);
        ctx.clearRect(45, 45, 60, 60);
        ctx.strokeRect(50, 50, 50, 50);
      }
    }
    ```

<br/>

---

<br/>

6.  ✔️ 캔버스(canvas)를 이용한 원 그리기

    👉 arc(x, y, radius, startAngle, endAngle, clockwise)

    - x, y : 원을 그리게 될 가운데 위치

    - radius : 반지름 값

    - startAngle : angle 시작점

    - endAngle : angle 끝나는 점

    - clockwise : 옵션값. 시계 또는 반시계 방향을 결정함(기본값 false인 시계 방향)

    ⭐ angle값에 따른 위치 알아보기

    - startAngle과 endAngle은 원을 그릴때 시작하는 값과 끝 값을 나타냅니다. 아래 이미지는 angle값에 따른 위치를 나타내는데 시작점은 0 그리고 끝나는 지점은 Math.PI \* 2입니다.

    - 참고로 위 스크린샷처럼 맨 위의 12 방향은 0이 아니라 Math.PI _ 1.5의 값을 가지게됩니다. 그렇기때문에 12시 방향에서 시작하려면 0값이 아니라 Math.PI _ 1.5를 시작점으로 설정하여야합니다. 이 부분이 혼동되기 쉬운 부분입니다. 동그란 원을 그린다면 문제가 될게 없지만 예를들어 12시에서 3시 방향까지 이어지는 원의 일부를 그린다면 다음처럼 시작과 끝을 설정해야합니다.

    - startAngle : Math.PI \* 1.5
    - endAngle : Math.PI \* 2

    ```javascript
    function draw() {
      var canvas = document.getElementById("canvas");
      if (canvas.getContext) {
        var ctx = canvas.getContext("2d");

        ctx.beginPath();
        ctx.arc(50, 50, 20, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    ```

[ 더 알아보기 ](<https://webisfree.com/2018-06-07/[html5]-%EC%BA%94%EB%B2%84%EC%8A%A4(canvas)%EC%97%90-%EC%9B%90-%EA%B7%B8%EB%A6%AC%EA%B8%B0>)
