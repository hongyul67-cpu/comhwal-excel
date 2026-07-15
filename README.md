# 컴활 1급 실기 · 함수 연습소 (스프레드시트)

컴퓨터활용능력 **1급 실기**의 계산작업(함수)을 **실제 엑셀처럼 직접 입력**하며 연습하는 웹앱입니다.

## 핵심
- 미니 스프레드시트 그리드의 **노란 셀에 들어갈 수식을 직접 타이핑**
- 내장 **수식 엔진이 실제로 계산**해서 채점 — 서로 다른 수식이어도 **결과값이 같으면 정답**
- 오답 시 **모범답안 + 힌트** 제공
- 카테고리별 연습(논리·통계·조건부·찾기참조·문자열·배열수식 등)

## 지원 함수(엔진)
IF·AND·OR·NOT·IFERROR, SUM·AVERAGE·MAX·MIN·MEDIAN, COUNT·COUNTA·COUNTBLANK,
COUNTIF·SUMIF·AVERAGEIF·SUMPRODUCT, ROUND·ROUNDUP·ROUNDDOWN·INT·MOD·TRUNC·ABS·POWER,
LEFT·RIGHT·MID·LEN·UPPER·LOWER·TRIM·CONCATENATE, VLOOKUP·HLOOKUP·INDEX·MATCH·CHOOSE,
RANK·RANK.EQ·LARGE·SMALL, 그리고 배열수식(`=SUM((조건)*범위)` 등).

## 문제 추가
`data/problems.js`의 배열에 `{ grid, target, prompt, answer, hint }`를 추가하면 됩니다.
`answer`(모범답안)를 엔진으로 계산한 값과 학생 입력을 비교하므로, 정답값을 따로 적을 필요가 없습니다.

## 결과 제출 (선생님용)
`result-collector` 방식. 학생에게 아래 형태 링크로 배포하면 결과가 구글시트로 모입니다.
```
https://hongyul67-cpu.github.io/comhwal-excel/?rc=<AppsScript exec URL>&cls=1,2,3&max=40
```

## 실행
`index.html`을 열면 됩니다.
