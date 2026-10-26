---
title: "LeetCode 2011. Final Value of Variable After Performing Operations"
date: 2026-03-18T11:15:14+09:00
icon: "lucide:copy"
tags: ["알고리즘", "LeetCode"]
---

---

오늘 오전에는 알고리즘 수업이 있었고, 저희가 풀었던 문제는 다음과 같습니다.

문제 링크 : [https://leetcode.com/problems/final-value-of-variable-after-performing-operations/](https://leetcode.com/problems/final-value-of-variable-after-performing-operations/)

**문제 설명**

단 네 가지 연산과 하나의 변수 **X**만 존재하는 프로그래밍 언어가 있습니다.

- **++X**와 <strong>X++</strong>는 변수 X의 값을 1 증가시킵니다.
- **\--X**와 <strong>X--</strong>는 변수 X의 값을 1 감소시킵니다.

처음에 **X**의 값은 **0**입니다.
연산들이 담긴 문자열 배열 `operations`가 주어질 때, 모든 연산을 수행한 후의 **최종 X 값**을 반환하세요.

강사님께서는

1.  `eval()`을 활용한 해결 방법 (성능 문제로 지양)
2.  `includes()`를 활용한 해결 방법
3.  참조 타입인 Object를 이용한 해결 방법

이렇게 3가지 해결 방법을 구체적으로 설명해주셨습니다.

오늘 제가 해결했던 방식은

- for문을 -> `reduce()` 메서드로,
- if문을 -> <strong>3항 연산자 ( ? : )</strong>로 해결했던 경험을 말씀드리겠습니다.

우선 `reduce()`란 무엇일까요?
`reduce()`는 배열의 각 요소를 순회하며 callback 함수의 실행 값을 누적하여 하나의 결과값을 반환하는 메서드입니다.
그래서 이 `reduce()`메서드로 어떻게 해결할 수 있을까요?

우선 문제에서 주어지는 **Input**은 operations = \["--X", "X++", "X++", "X--"\]로 배열 형태로 있습니다.
따라서 for문으로 각 요소를 탐색할 수 있지만, `reduce()`로도 탐색이 가능합니다.

`reduce()`의 각 파라미터 내부의 인수로는

- **accumulator** \- accumulator는 callback함수의 반환값을 누적합니다.
- **currentValue** \- 배열의 현재 요소
- index(선택) - 배열의 현재 요소의 인덱스
- array(선택) - 호출한 배열

로 이루어져 있습니다.

두 번째로는 '<strong>삼항 연산자</strong>'라는 개념인데요,

**삼항 연산자**란 무엇일까요?
**삼항 연산자**는 세 개의 피연산자를 사용하여 if-else 문을 한 줄로 간결하게 표현하는 조건 연산자입니다.
구조는 다음과 같이 <strong>조건 ? 참\_값 : 거짓\_값;</strong>으로 이루어져 있습니다.

한 번 이 두 개의 메서드와 논리 연산자를 통해서 오늘의 문제를 해결해보겠습니다.

```ts
/**
 * @param {string[]} operations
 * @return {number}
 */
function finalValueAfterOperations(operations) {
  return operations.reduce(
    (count, operation) => (operation[1] === "+" ? ++count : --count),
    0,
  );
}
```

한 줄로 깔끔하게 구현이 되었는데, 사실 한 줄로 구현했다고 해서 절대적으로 잘 짠 코드라고 보기는 어렵다고 생각합니다.
하지만 여러 방식을 사용하면서 다양한 해결 방법을 익히는 과정은 중요하다고 생각합니다.

코드에 대한 상세 설명은 다음과 같습니다.

1.  operations 배열을 아규먼트 인자로 받는다.
2.  `reduce()` 메서드에서 (count, operation) => { } 으로 콜백 함수를 선언한다.
3.  내부 로직에서는 operation에서 \[1\] : 2번째 요소의 값을 읽습니다 ( "X--", "++X" 둘 다 1번(2번째) 인덱스가 '-' or '+' )
4.  삼항 연산자를 활용하여 "++X" | "X++"라면 ++count 아니라면 --count(전위 연산자).
5.  위 과정을 operations의 요소가 없어질 때까지 반복하여 결과를 반환한다.

여기서 정말 중요한 점이 있는데요,
count++, count--(후위 연산자)를 사용하면 안되나요? 라는 의문이 생길 수 있습니다. **안됩니다.**

그 이유는 `reduce()`는 콜백 함수의 count에 삼항 연산자 결과값을 누적시키는데, 후위 연산자를 사용하면 이전 값이 갱신이 안돼서 0이 계속 반환됩니다.

정리하자면,

- `reduce()`는 배열을 하나의 값으로 응축할 때 강력하다.
- `operation[1]`은 인덱스 접근이라 연산 속도가 매우 빠르다.
- `reduce()` 내부에서 쓸 때는 반환값이 곧 다음 단계의 누적값이 되므로, 반드시 전위 연산자(++count, --count)를 사용해야 한다!

오늘 배운 내용과 해결 방식을 알려드렸는데요, 많은 분들께 도움이 되는 내용이 되었으면 좋겠습니다. 감사합니다.
