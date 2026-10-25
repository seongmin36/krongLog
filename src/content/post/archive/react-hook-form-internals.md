---
title: "RHF 동작원리"
date: 2026-04-03T18:28:47+09:00
icon: "lucide:atom"
tags: ["배움일기","React"]
---

---

어제에 이어 금일은 Rhf와 zod에 대해 다루어 보았습니다.

zod 스키마와 Rhf가 얼마나 편리하고 간단하게 큰 역할을 수행하는지 알게 되었습니다.

제가 예전에 봤던 글이 있었는데요,

'새로운 것을 어떻게 쓰느냐?'도 중요하지만, '새로운 걸 버틸만큼 어떻게 탄탄하게 구조화했냐?'가 더 중요하다고 합니다.

이게 무슨 말이냐면,

실제로 회사에서는 규모가 크면 클수록 업데이트에 대해 호전적이지는 않다고 합니다. 하지만, 심각한 보안, 최적화 문제를 맞닥뜨리거나 좋은 기능이 있다면 버전업을 할 상황이 오겠죠.

그런 상황에서는 확실히 프로젝트의 구조에 대해 깊게 알고 설계하는지가 중요합니다.

지금 아무렇지 않게 사용하는 npm 패키지나 라이브러리는 꾸준한 업데이트가 진행되고 있고, 그 '잦은 변화를 어떻게 레거시 코드에 녹여들도록 설계하였고, 할 것인가?'

'그러한 새로운 업데이트를 기존 코드는 얼마나 버틸 수 있나?' 특히 대규모 서비스라면 더욱 그렇습니다.

즉, `npm update`라는 shell 명령어 하나만으로 서비스 자체가 뒤집어질 수도 있는 심각한 문제를 얼마나 방어하고 있느냐 이 말인거죠.

이 얘기를 한 이유는 새로운 것에 대한 거부감은 줄이고, 그것에 대해 꾸준히 탐구하는 호기심을 가져보는 것이 중요하다는 것을 뼈저리게 느꼈습니다.

결국 현실적으로는 면접에서 '무엇을?'보다는 '어떻게?', '왜?'가 더 힘든 답변을 요구하니까요.

따라서 오늘은 Rhf를 좀 더 깊게, 세부 동작 원리를 살펴보도록 하겠습니다.

<strong>RHF(React Hook Form)</strong>

Rhf는 폼 상태를 한 곳에서 관리하면서도, 리렌더링은 최소화하는 것을 목표로 설계된 라이브러리입니다.

Rhf은 내부적으로 Proxy기반 state subscription 시스템을 갖고 있습니다.

**Proxy기반**이란, 객체의 get, set같은 동작을 가로채서 어떤 값이 읽혔는지, 바뀌었는지를 감지합니다.

**state subscription**은 모든 변화를 한꺼번에 감지하는게 아니라 특정 state를 구독하고있는 컴포넌트만 업데이트 합니다. 마치 이벤트 리스너가 호출되는 것과 비슷하죠.

위 과정이 Rhf 최적화의 핵심입니다.

이때 Rhf 내부에서 각 필드는 다음 두 가지 방식으로 관리됩니다.

*   mountedFields : 현재 화면에 마운트된 필드 목록
    
*   formValues : 현재 폼 전체의 값 스냅샷
    

이렇게 '화면에 올라와 있는지', '값이 존재하는지'를 분리하여 rhf는 동적 폼(조건부 렌더링, 스텝 폼 등)에서도 유연하게 동작하는 것입니다.

### useForm()이 호출되면 내부에서는 대략 이런 일이 일어납니다.

1.  <strong>초기 formState(Proxy 구독 대상)를 React State로 만든다.</strong>
    

    const [formState, updateFormState] = useState({
      isDirty: false,
      isValidating: false,
      isLoading: ...,
      isSubmitted: false,
      isSubmitting: false,
      isSubmitSuccessful: false,
      isValid: false,
      errors: props.errors || {},
      disabled: props.disabled || false,
      defaultValues: ...,
      ...
    });

이 formState는 실제 데이터를 들고 있는 객체입니다. 여기에는 Proxy가 아직 얹혀있지 않습니다.

2.  <strong>createFormControl(props)로 내부 control 객체를 만든다.</strong>
    

*   control의 내부에는
    
    *   \_formState
        
    *   defaultValues_,_ fields, subjects, proxyFormState, ...
        
    *   각종 메서드 (register, updateValid, updateFieldArray, reset 등)
        

을 갖고있습니다.

즉, control은 폼 전체의 내부 상태와 로직을 다 들고있는 '진짜 스토어(store 저장소)'역할인 것이죠.

3.  <strong>useSubscrbe()로 control의 state subject를 구독한다.</strong>
    

    useSubscribe({
      subject: control._subjects.state,
      next: (value) => {
        updateFormState({ ...control._formState });
      },
    });
    

`control._subjects.state`는 내부 상태가 바뀔 때마다 구독자에게 알립니다.

Rhf 내부의 여러 곳에서 control.\_subjects.state.next(...)를 호춣하면, 이 훅이 updateFormState(formState를 업데이트 하는 세터함수)를 호출해서 React state인 formState를 갱신하는 것이죠.

최종적으로 useForm()은 control, formState(react state), **Proxy를 얹어 만든 formState 래퍼**를 포함한 객체를 리턴합니다.

### **formState Proxy**. 어떻게 동작할까요?

formState에 Proxy를 씌우는 핵심 함수는 `getProxyFormState`입니다. (이걸 이해하면 Rhf로 최적화하는 방법을 알게됩니다.)

이 함수의 핵심 역할은 총 두 가지가 있습니다.

*   전역 proxy 상태를 확인하는 **control\_.proxyFormState**
    
*   지역 proxy 상태를 확인하는 **localProxyFormState**
    

formStateProxy는 전역 proxy와 지역 proxy에 마킹하는 래퍼를 만들어주는 역할을 하는데요,

이게 무슨소리냐면,

사실 useForm()으로 전역 proxy만을 사용해서 폼 인스턴스를 생성해도 되지만, 같은 폼 인스턴스를 사용하는 경우, 혹은 폼 인스턴스 크기가 큰 경우 등에서는 useFormContext(), useFormState()과 같은 Rhf의 전용 훅들을 사용하는 것으로 최적화합니다.

<strong>useFormContext()</strong>는 같은 폼 인스턴스를 사용하는 경우 상태 관리의 역할, <strong>useFormState()</strong>는 특정 상태를 구독하는 컴포넌트의 조각만 리렌더링 시켜 최적화합니다.

이런 방식은 getProxyFormState의 내부 역할. 즉, 전역 proxy와 지역 proxy를 마킹하는 래퍼를 만들어주는 getProxyFormState 함수에서 일어납니다.

내부 동작을 살펴보자면,

*   우선 **전역 proxy**는 useForm(), useFormContext(), useFormState()훅 전부 사용되는데, <strong>어떤 formState키가 실제로 사용(접근)되었는지 기록하는 역할</strong>을 합니다.
    

쉽게 말하면, **control.\_proxyFormState**라는 변수의 내부 control 로직에서 '아무도 inValid를 안쓰는데 굳이 매 입력마다 비싼 validation을 계산을 줄여야지'와 같은 최적화 작업을 합니다.

*   **지역 proxy**는 어떤 컴포넌트를 다시 그려야 할지 **localProxyFormState** 변수에 등록합니다.
    

따라서 useFormState()훅에서는 이러한 전역 proxy의 control.\_proxyFormState 변수와 지역 proxy의 **localProxyFormState** 변수를 인자로 받아 마킹 후 래핑하는게 바로 **getProxyFormState함수**입니다.

`getProxyFormState(formState, control, localProxyState)`

이는 실제 코드에서

formState.isDirty를 불러오면 -> control.\_proxyFormState.isDirty = true -> control 내부 로직에서 'isDirty는 이제 사용 중이니 이 값은 관리 대상에 등록해야겠다'는 힌트로 쓰입니다.

그렇다면, 여기서 **상태가 바뀌었다는 것을 어떻게 눈치**챌까요?

### 상태가 바뀔 때 어떻게 눈치챌까요? : \_subjects와 \_subscribe 흐름

폼 상태가 실제로 바뀌는 타이밍은 대부분 '사용자 입력 -> onChange -> 내부 control 메서드 호출' 시점입니다.

조금 더 풀어보겠습니다.

1.  <strong>register('email')</strong>로 필드를 등록하면 Rhf는 해당 input(태그)의 onChange, onBlur, 등을 연결합니다.
    
2.  유저가 타이핑으로 **onChange**를 호출하고 내부 **control.\_updateFieldValue**같은 업데이트 메서드를 실행합니다.
    
3.  이 메서드에서 **control.\_formValues** 업데이트 후 dirty, touched, validation 트리거 등을 수행합니다. 그 결과 **control.\_formState**도 수정됩니다.
    
4.  상태가 바뀌면 <strong>contol.\_subject.state.next({ ... })</strong>를 호출합니다.
    
5.  useForm 내부의 useSubscribe가 이 이벤트를 받아 <strong>updateFormState({ ...control.\_formState })</strong>를 실행합니다.
    

즉, 실제 '진짜 상태'는 control.\_formState, \_formValues_,_ fields에 있는 것이죠.

react의 컴포넌트에서 보는 formState는 그 위에 씌워진 Proxy와 React state의 복제본인 셈입니다.

따라서 \_subject.state는 'control 내부 상태가 바뀌었으니까 React 쪽도 새로 그려라' 라고 알리는 채널입니다.

정리하자면, Rhf는 단순히 '폼을 편하게 만들게 해주는 라이브러리'가 아니라, **proxy기반의 state subscription과 control을 중심으로 한 내부 스토어 구조를 통해 '필요한 상태만 추적하고, 필요한 컴포넌트만 다시 그리는' 선택적 구독 모델**을 구현합니다.

이 구조를 이해하면, 왜 formState를 함부로 구조 분해하면 안 되는지, 언제 useFormState로 구독 범위를 좁혀 최적화를 해야하는지를 알 수 있습니다.

결국 라이브러리를 '어떻게 쓰느냐'를 넘어 <strong>'왜 이런 설계를 했는지'</strong>까지 이해하는 것이 앞으로 다른 상태 관리 도구나 폼 라이브러리를 선택하고 비교할 때도 큰 기준점이 될 것이라 생각합니다.
