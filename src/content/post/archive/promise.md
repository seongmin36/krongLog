---
title: "Promise"
date: 2026-04-09T18:01:31+09:00
icon: "lucide:timer"
tags: ["배움일기","JavaScript"]
---

---

금일에는 next.js의 api를 다루면서 배웠던 내용이 있죠.

바로 'Promise'객체인데요, 이 Promise는 프론트엔드에서 매우 중요한 개념 중 하나입니다.

예전에 JS에 Promise가 없던 시절에는 api를 비동기로 호출하기 위해서 콜백 함수를 사용하였습니다. 하나하나 다 구현하는 '**명령형 프로그래밍**' 방식을 사용했던 것이죠.

하지만, 이는 '페이팔(PayPal)'과 같은 복잡한 서비스에서 명확한 한계가 드러났는데요,

페이팔과 같은 결제 서비스는 다양한 조건들과 예외 처리를 고려해야하기 때문에 콜백이 무수히 많이 생성되었고, 이는 가독성, 유지보수성이 매우 떨어지게 됐죠. 이를 '**콜백 지옥**'이라고 합니다.

하지만 Promise가 콜백 지옥에서 벗어나는 구원자의 역할을 했습니다.

대표적으로 then()으로 성공 케이스의 콜백을 반환하고, catch()로 실패 케이스의 콜백을 반환하면서

'<strong>대기(Pending)</strong>', '<strong>이행(Fulfilled)</strong>', '<strong>거부(Rejected)</strong>' 이 3가지 케이스로 나눠 비동기 처리를 제어했습니다.

Promise가 탄생하면서 Promise에도 다양한 비동기 제어 패턴이 오늘날까지도 지속적으로 생겨나고 있는데요,

가장 대표적인 Promise 비동기 제어 패턴은 수업시간에 사용했던 '<strong>Promise.all()</strong>'입니다.

Promise.all()의 특징은 모든 처리 중에 '하나만 예외가 발생하더라도 모두 reject(거부)'됩니다.

언뜻보면 괜찮을 수도 있지만, 치명적인 단점이 있는데요,

예를 들어 두 가지의 데이터를 조회하기 위해 각각 다른 엔드포인트로 요청을 합니다.

A 요청은 제대로 실행되었지만, B 요청은 어떠한 에러로 인해서 요청에 실패하여 catch 되는 상황입니다.

Promise.all()은 B요청을 중단할 뿐만 아니라 A 요청도 같이 받을 수 없도록 처리합니다.

이럴 때는 Promise의 다른 비동기 제어 패턴인 <strong>Promise.allSettled()</strong>를 활용합니다.

Promise.allSettled()는 모든 Promise가 완료될 때까지 기다렸다가 각 프로미스의 결과(성공: fulfilled, 실패: rejected)를 배열로 반환합니다.

따라서 **일부 요청이 실패하더라도 성공한 요청의 결과는 그대로 활용할 수 있습니다.**

각 결과 객체는 **status** 필드를 가지며,

성공한 경우 `{ status: 'fulfilled', value: ... }`,

실패한 경우 `{ status: 'rejected', reason: ... }` 형태로 반환되므로, 개별 요청의 성공/실패를 독립적으로 분기 처리할 수 있습니다.

금일 배웠던 api 요청도 `/v2/pokemon/${id}`와 `/v2/pokemon-species/${id}`이 두 가지의 요청을 보냈기 때문에 <strong>Promise.allSettled()</strong>로 리팩토링을 해보았습니다.

```ts
try {
    const [resResult, speciesResult] = await Promise.allSettled([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, {
        next: { revalidate: 60 * 60 * 24 },
      }),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`, {
        next: { revalidate: 60 * 60 * 24 },
      }),
    ]);
    if (resResult.status === "rejected") {
      throw new Error(`포켓몬 데이터 요청이 실패했습니다. ${id}`);
    }
    if (!resResult.value.ok) {
      throw new Error(`포켓몬 데이터를 가져오는데 실패했습니다. ${id}`);
    }
    const data = pokemonApiSchema.parse(await resResult.value.json());
    let koName = "";
    if (speciesResult.status === "fulfilled" && speciesResult.value.ok) {
      const speciesData = pokemonSpeciesApiSchema.parse(
        await speciesResult.value.json(),
      );
      koName =
        speciesData.names.find((name) => name.language.name === "ko")?.name ??
        "";
    }
```

위 코드는 결국 api 요청 상태에 대한 세부 케이스를 정의한 상태입니다.

1.  status === 'rejected' : api 요청 자체에서 오류가 발생함.
    
2.  !value.ok : 서버는 클라이언트의 요청을 받았지만, 서버 로직상의 오류로 인한 4xx, 5xx 에러가 반환.
    

1번 케이스의 대표적인 원인은 네트워크 연결 실패, CORS 정책위반, timeout 등의 이유가 원인이 됩니다.

2번 케이스는 Promise는 fulfilled(성공) 상태이지만, 사용자의 잘못된 요청(4xx) 혹은 서버 자체 문제 (5xx)의 문제일 가능성이 큽니다.

주목할 점은 **speciesResult**의 처리 방식입니다. 본체 데이터(resResult)는 실패 시 throw하지만, species 데이터는 한국어 이름을 얻기 위한 **부가 정보**이므로 실패하더라도 koName을 빈 문자열로 두고 넘어갑니다. 이것이 `Promise.all()` 대신 `Promise.allSettled()`를 선택한 이유입니다.

두 요청의 중요도가 다르기 때문이죠.

이렇게 Promise에 대해 짧게나마 알아보았는데요, Promise와 더불어 비동기 처리를 공부해보니까 정말 알아야할 개념들이 많습니다.

Promise.race(), Promise.withResolvers(), Abort Controller, p-limit 등 앞으로도 프론트엔드의 많은 핵심 기술들을 차근차근 꾸준히 공부해보도록 노력하겠습니다.
