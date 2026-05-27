# 폰트 원본 (pyftsubset 입력)

카카오에서 제공하는 **전체 용량 woff2**를 이 폴더에 아래 이름으로 넣습니다.  
저작권·배포 정책에 따라 이 폴더의 원본 파일은 레포에서 제외될 수 있습니다(`.gitignore`).

파일 이름:

- `KakaoBigSans-Regular.woff2`
- `KakaoBigSans-Bold.woff2`
- `KakaoBigSans-ExtraBold.woff2`
- `KakaoSmallSans-Light.woff2`

그다음 레포 루트에서:

```bash
pnpm font:subset
```

결과물은 상위 디렉터리 `public/fonts/*.subset.woff2`에 생성되며, `src/styles/global.css`의 `@font-face`가 해당 경로를 사용합니다.
