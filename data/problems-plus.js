/* 컴활 1급 실기 - 계산작업 보강 문제
 *
 * data/problems.js 다음에 로드되어 window.XL_PROBLEMS 뒤에 이어 붙는다.
 * 1급에서 실제로 많이 나오는데 기존 46문제에 얇던 유형을 채웠다.
 *   · 다중 조건(COUNTIFS/SUMIFS/AVERAGEIFS) — 1급 계산작업의 핵심
 *   · 데이터베이스 함수(DSUM/DAVERAGE/DCOUNT/DMAX/DMIN)
 *   · 배열 수식 · INDEX/MATCH · 문자열 심화 · 날짜/시간 · 통계 심화
 * 모범답안은 audit 스크립트로 실제 계산해 검증한다(값이 안 나오면 문제로 쓰지 않는다).
 */
(function () {
  var P = window.XL_PROBLEMS = window.XL_PROBLEMS || [];

  /* 여러 문제가 함께 쓰는 표 — 매번 다시 쓰지 않게 함수로 만들어 둔다 */
  function sales() {
    return [
      ['지점', '분기', '담당', '매출'],
      ['서울', '1분기', '김한별', 320],
      ['부산', '1분기', '이보람', 180],
      ['서울', '2분기', '김한별', 410],
      ['부산', '2분기', '정하늘', 250],
      ['서울', '1분기', '한겨울', 150],
      [null, null, null, null],
    ];
  }
  function scores() {
    return [
      ['이름', '반', '성별', '국어', '영어', '평균'],
      ['김한별', '1반', '남', 80, 90, 85],
      ['이보람', '2반', '여', 95, 85, 90],
      ['정하늘', '1반', '여', 60, 70, 65],
      ['한겨울', '2반', '남', 88, 92, 90],
      ['서지호', '1반', '남', 75, 65, 70],
      [null, null, null, null, null, null],
    ];
  }

  P.push(
    /* ───────── 다중 조건 (COUNTIFS · SUMIFS · AVERAGEIFS) ───────── */
    {
      id: 'cifs1', cat: '다중 조건(IFS)', title: '지점과 분기를 모두 만족하는 건수',
      grid: sales(), target: 'A7',
      prompt: "지점[A2:A6]이 <b>\"서울\"</b>이면서 분기[B2:B6]가 <b>\"1분기\"</b>인 건수를 [A7]에 구하시오.",
      answer: '=COUNTIFS(A2:A6,"서울",B2:B6,"1분기")',
      hint: 'COUNTIFS(범위1, 조건1, 범위2, 조건2) — 조건을 <b>모두</b> 만족하는 개수',
    },
    {
      id: 'cifs2', cat: '다중 조건(IFS)', title: '조건 두 개를 만족하는 합계',
      grid: sales(), target: 'A7',
      prompt: "지점이 <b>\"서울\"</b>이고 분기가 <b>\"2분기\"</b>인 매출[D2:D6]의 <b>합계</b>를 [A7]에 구하시오.",
      answer: '=SUMIFS(D2:D6,A2:A6,"서울",B2:B6,"2분기")',
      hint: 'SUMIFS는 <b>합계 범위가 맨 앞</b>에 옵니다. SUMIF와 순서가 반대예요.',
    },
    {
      id: 'cifs3', cat: '다중 조건(IFS)', title: '조건에 맞는 평균',
      grid: sales(), target: 'A7',
      prompt: "지점이 <b>\"서울\"</b>인 매출[D2:D6]의 <b>평균</b>을 [A7]에 구하시오. (AVERAGEIFS 사용)",
      answer: '=AVERAGEIFS(D2:D6,A2:A6,"서울")',
      hint: 'AVERAGEIFS(평균범위, 조건범위, 조건)',
    },
    {
      id: 'cifs4', cat: '다중 조건(IFS)', title: '숫자 조건 두 개',
      grid: sales(), target: 'A7',
      prompt: "매출[D2:D6]이 <b>200 이상 400 이하</b>인 건수를 [A7]에 구하시오.",
      answer: '=COUNTIFS(D2:D6,">=200",D2:D6,"<=400")',
      hint: '같은 범위를 두 번 써서 위·아래 조건을 겁니다.',
    },
    {
      id: 'cifs5', cat: '다중 조건(IFS)', title: '반과 성별을 모두 만족',
      grid: scores(), target: 'A7',
      prompt: "반[B2:B6]이 <b>\"1반\"</b>이고 성별[C2:C6]이 <b>\"남\"</b>인 학생의 국어[D2:D6] <b>합계</b>를 [A7]에 구하시오.",
      answer: '=SUMIFS(D2:D6,B2:B6,"1반",C2:C6,"남")',
      hint: 'SUMIFS(합계범위, 조건범위1, 조건1, 조건범위2, 조건2)',
    },
    {
      id: 'cifs6', cat: '다중 조건(IFS)', title: '조건에 맞는 것 중 최고',
      grid: scores(), target: 'A7',
      prompt: "반[B2:B6]이 <b>\"2반\"</b>인 학생의 영어[E2:E6] 중 <b>가장 높은 점수</b>를 [A7]에 구하시오.",
      answer: '=MAXIFS(E2:E6,B2:B6,"2반")',
      hint: 'MAXIFS(최대범위, 조건범위, 조건) · 최솟값은 MINIFS',
    },
    {
      id: 'cifs7', cat: '다중 조건(IFS)', title: '성으로 시작하는 조건',
      grid: scores(), target: 'A7',
      prompt: "이름[A2:A6]이 <b>\"김\"으로 시작</b>하고 반[B2:B6]이 <b>\"1반\"</b>인 학생 수를 [A7]에 구하시오.",
      answer: '=COUNTIFS(A2:A6,"김*",B2:B6,"1반")',
      hint: '<b>*</b> 는 글자 수에 상관없음. "김*" = 김으로 시작',
    },

    /* ───────── 데이터베이스 함수 ───────── */
    {
      id: 'dsum1', cat: '데이터베이스', title: 'DSUM으로 조건부 합계',
      grid: [
        ['지점', '분기', '매출'],
        ['서울', '1분기', 320],
        ['부산', '1분기', 180],
        ['서울', '2분기', 410],
        ['부산', '2분기', 250],
        [null, null, null],
        ['지점', null, null],
        ['서울', null, null],
      ],
      target: 'C6',
      prompt: "조건 범위 [A7:A8](지점=서울)을 이용해 <b>매출 합계</b>를 [C6]에 구하시오. (DSUM 사용)",
      answer: '=DSUM(A1:C5,3,A7:A8)',
      hint: 'DSUM(전체표, 계산할 열, 조건범위) · 열은 번호(3) 또는 "매출"로 씁니다.',
    },
    {
      id: 'davg1', cat: '데이터베이스', title: 'DAVERAGE로 조건부 평균',
      grid: [
        ['이름', '반', '점수'],
        ['김한별', '1반', 80],
        ['이보람', '2반', 95],
        ['정하늘', '1반', 60],
        ['한겨울', '2반', 88],
        [null, null, null],
        ['반', null, null],
        ['1반', null, null],
      ],
      target: 'C6',
      prompt: "조건 범위 [A7:A8](반=1반)을 이용해 <b>점수 평균</b>을 [C6]에 구하시오. (DAVERAGE 사용)",
      answer: '=DAVERAGE(A1:C5,"점수",A7:A8)',
      hint: '열 이름을 큰따옴표로 써도 되고 번호로 써도 됩니다.',
    },
    {
      id: 'dcount1', cat: '데이터베이스', title: 'DCOUNTA로 조건에 맞는 개수',
      grid: [
        ['이름', '부서', '급여'],
        ['김한별', '영업', 320],
        ['이보람', '기획', 280],
        ['정하늘', '영업', 350],
        ['한겨울', '영업', 300],
        [null, null, null],
        ['부서', null, null],
        ['영업', null, null],
      ],
      target: 'C6',
      prompt: "조건 범위 [A7:A8](부서=영업)에 맞는 <b>사람 수</b>를 [C6]에 구하시오. (DCOUNTA 사용)",
      answer: '=DCOUNTA(A1:C5,1,A7:A8)',
      hint: 'DCOUNT는 <b>숫자</b>가 든 셀만, DCOUNTA는 <b>비어 있지 않은</b> 셀을 셉니다.',
    },
    {
      id: 'dmax1', cat: '데이터베이스', title: 'DMAX로 조건부 최댓값',
      grid: [
        ['제품', '분류', '단가'],
        ['노트북', '전자', 1200],
        ['책상', '가구', 150],
        ['모니터', '전자', 300],
        ['의자', '가구', 80],
        [null, null, null],
        ['분류', null, null],
        ['가구', null, null],
      ],
      target: 'C6',
      prompt: "조건 범위 [A7:A8](분류=가구)에 맞는 <b>가장 비싼 단가</b>를 [C6]에 구하시오.",
      answer: '=DMAX(A1:C5,3,A7:A8)',
      hint: '가장 싼 값은 DMIN을 씁니다.',
    },
    {
      id: 'dcrit1', cat: '데이터베이스', title: '조건이 숫자일 때',
      grid: [
        ['이름', '부서', '급여'],
        ['김한별', '영업', 320],
        ['이보람', '기획', 280],
        ['정하늘', '영업', 350],
        ['한겨울', '기획', 300],
        [null, null, null],
        ['급여', null, null],
        ['>=300', null, null],
      ],
      target: 'C6',
      prompt: "급여가 <b>300 이상</b>인 사람의 급여 <b>합계</b>를 [C6]에 구하시오. (조건 범위 [A7:A8] 이용)",
      answer: '=DSUM(A1:C5,"급여",A7:A8)',
      hint: '조건 칸에 <b>&gt;=300</b> 처럼 부등호를 그대로 씁니다.',
    },

    /* ───────── 배열 수식 ───────── */
    {
      id: 'arr3', cat: '배열수식', title: '조건에 맞는 것의 평균 (배열)',
      grid: [
        ['지점', '매출'],
        ['서울', 320],
        ['부산', 180],
        ['서울', 400],
        ['부산', 260],
        [null, null],
      ],
      target: 'B6',
      prompt: "지점[A2:A5]이 <b>\"서울\"</b>인 매출[B2:B5]의 <b>평균</b>을 배열 수식으로 [B6]에 구하시오.",
      answer: '=SUM((A2:A5="서울")*B2:B5)/SUM((A2:A5="서울")*1)',
      hint: '조건을 곱해 합을 구하고, 조건 개수로 나눕니다.',
    },
    {
      id: 'arr4', cat: '배열수식', title: '두 조건을 만족하는 합계 (배열)',
      grid: [
        ['지점', '분기', '매출'],
        ['서울', '1분기', 320],
        ['부산', '1분기', 180],
        ['서울', '2분기', 400],
        ['서울', '1분기', 150],
        [null, null, null],
      ],
      target: 'C6',
      prompt: "지점이 <b>\"서울\"</b>이고 분기가 <b>\"1분기\"</b>인 매출의 <b>합계</b>를 배열 수식으로 [C6]에 구하시오.",
      answer: '=SUM((A2:A5="서울")*(B2:B5="1분기")*C2:C5)',
      hint: '조건끼리 곱하면 <b>그리고(AND)</b>가 됩니다.',
    },
    {
      id: 'arr5', cat: '배열수식', title: '가장 큰 값의 이름 찾기 (배열)',
      grid: [
        ['이름', '점수'],
        ['김한별', 80],
        ['이보람', 95],
        ['정하늘', 60],
        ['한겨울', 88],
        [null, null],
      ],
      target: 'B6',
      prompt: "점수[B2:B5]가 <b>가장 높은 사람의 이름</b>을 [B6]에 구하시오. (INDEX와 MATCH 이용)",
      answer: '=INDEX(A2:A5,MATCH(MAX(B2:B5),B2:B5,0))',
      hint: 'MATCH로 <b>몇 번째</b>인지 찾고, INDEX로 그 자리의 값을 꺼냅니다.',
    },
    {
      id: 'arr6', cat: '배열수식', title: '조건에 맞는 개수 (배열)',
      grid: [
        ['이름', '국어', '영어'],
        ['김한별', 80, 90],
        ['이보람', 95, 85],
        ['정하늘', 60, 70],
        ['한겨울', 88, 92],
        [null, null, null],
      ],
      target: 'C6',
      prompt: "국어와 영어가 <b>모두 85 이상</b>인 학생 수를 배열 수식으로 [C6]에 구하시오.",
      answer: '=SUM((B2:B5>=85)*(C2:C5>=85))',
      hint: '참(TRUE)은 1, 거짓(FALSE)은 0으로 계산됩니다.',
    },

    /* ───────── 찾기·참조 심화 ───────── */
    {
      id: 'idx2', cat: '찾기·참조', title: 'INDEX + MATCH로 가로세로 찾기',
      grid: [
        ['이름', '국어', '영어', '수학'],
        ['김한별', 80, 90, 70],
        ['이보람', 95, 85, 88],
        ['정하늘', 60, 70, 75],
        [null, null, null, null],
      ],
      target: 'B5',
      prompt: "<b>\"이보람\"</b>의 <b>수학</b> 점수를 [B5]에 구하시오. (INDEX와 MATCH 이용)",
      answer: '=INDEX(B2:D4,MATCH("이보람",A2:A4,0),MATCH("수학",B1:D1,0))',
      hint: 'INDEX(표, 몇 번째 행, 몇 번째 열) · 행과 열을 각각 MATCH로 찾습니다.',
    },
    {
      id: 'vlk3', cat: '찾기·참조', title: 'VLOOKUP과 IFERROR 함께',
      grid: [
        ['코드', '제품명'],
        ['A01', '노트북'],
        ['A02', '마우스'],
        ['A03', '모니터'],
        [null, null],
        ['A09', null],
      ],
      target: 'B6',
      prompt: "코드 [A6](A09)에 맞는 제품명을 표[A2:B4]에서 찾되, <b>없으면 \"미등록\"</b>을 [B6]에 표시하시오.",
      answer: '=IFERROR(VLOOKUP(A6,A2:B4,2,0),"미등록")',
      hint: 'IFERROR(수식, 오류일 때 보여 줄 값)',
    },
    {
      id: 'hlk2', cat: '찾기·참조', title: 'HLOOKUP 구간 조회',
      grid: [
        ['점수', 0, 60, 80, 90],
        ['등급', 'F', 'D', 'B', 'A'],
        [null, null, null, null, null],
        [85, null, null, null, null],
      ],
      target: 'B4',
      prompt: "점수 [A4](85)의 <b>등급</b>을 [B4]에 구하시오. (구간을 찾는 HLOOKUP)",
      answer: '=HLOOKUP(A4,B1:E2,2)',
      hint: '마지막 인수를 생략하거나 TRUE로 두면 <b>구간(근사값)</b>으로 찾습니다.',
    },
    {
      id: 'chs2', cat: '찾기·참조', title: 'CHOOSE로 번호에 맞는 값',
      grid: [
        ['이름', '구분코드', '구분'],
        ['김한별', 2, null],
      ],
      target: 'C2',
      prompt: "구분코드[B2]가 <b>1이면 \"정회원\", 2면 \"준회원\", 3이면 \"임시\"</b>가 되도록 [C2]에 표시하시오.",
      answer: '=CHOOSE(B2,"정회원","준회원","임시")',
      hint: 'CHOOSE(번호, 1번값, 2번값, 3번값 …)',
    },

    /* ───────── 문자열 심화 ───────── */
    {
      id: 'find2', cat: '문자열', title: 'FIND로 찾은 위치까지 잘라내기',
      grid: [
        ['메일주소', '아이디'],
        ['hanbyul@school.kr', null],
      ],
      target: 'B2',
      prompt: "메일주소[A2]에서 <b>@ 앞부분(아이디)</b>만 [B2]에 표시하시오.",
      answer: '=LEFT(A2,FIND("@",A2)-1)',
      hint: 'FIND로 @ 위치를 찾고, 그보다 <b>1 적은</b> 만큼 왼쪽에서 잘라냅니다.',
    },
    {
      id: 'find3', cat: '문자열', title: '@ 뒤의 도메인만',
      grid: [
        ['메일주소', '도메인'],
        ['hanbyul@school.kr', null],
      ],
      target: 'B2',
      prompt: "메일주소[A2]에서 <b>@ 뒷부분(도메인)</b>만 [B2]에 표시하시오.",
      answer: '=MID(A2,FIND("@",A2)+1,LEN(A2))',
      hint: 'MID(문자열, @위치+1, 넉넉한 길이)',
    },
    {
      id: 'rep2', cat: '문자열', title: 'REPLACE로 가운데 가리기',
      grid: [
        ['주민번호', '표시'],
        ['990101-1234567', null],
      ],
      target: 'B2',
      prompt: "주민번호[A2]의 <b>9번째부터 6글자</b>를 <b>\"******\"</b>로 바꿔 [B2]에 표시하시오.",
      answer: '=REPLACE(A2,9,6,"******")',
      hint: 'REPLACE(문자열, 시작위치, 바꿀 개수, 새 문자열)',
    },
    {
      id: 'cnt2', cat: '문자열', title: '이름과 직급을 붙여 표시',
      grid: [
        ['이름', '직급', '표시'],
        ['김한별', '과장', null],
      ],
      target: 'C2',
      prompt: "이름[A2]과 직급[B2]을 <b>\"김한별 과장\"</b>처럼 <b>가운데 공백을 넣어</b> [C2]에 표시하시오.",
      answer: '=A2&" "&B2',
      hint: '<b>&amp;</b> 로 이어 붙입니다. 공백도 " " 처럼 문자로 넣어야 해요.',
    },
    {
      id: 'val2', cat: '문자열', title: '문자로 된 숫자를 계산에 쓰기',
      grid: [
        ['수량(문자)', '단가', '금액'],
        ['15', 200, null],
      ],
      target: 'C2',
      prompt: "문자로 입력된 수량[A2]을 <b>숫자로 바꿔</b> 단가[B2]와 곱한 금액을 [C2]에 구하시오.",
      answer: '=VALUE(A2)*B2',
      hint: 'VALUE(문자) → 숫자',
    },

    /* ───────── 날짜·시간 ───────── */
    {
      id: 'days2', cat: '날짜', title: '두 날짜 사이의 일수',
      grid: [
        ['시작일', '종료일', '일수'],
        ['2026-03-02', '2026-03-20', null],
      ],
      target: 'C2',
      prompt: "시작일[A2]부터 종료일[B2]까지 <b>며칠</b>인지 [C2]에 구하시오.",
      answer: '=DAYS(B2,A2)',
      hint: 'DAYS(<b>끝나는 날</b>, 시작하는 날) — 순서에 주의',
    },
    {
      id: 'time2', cat: '날짜', title: '시각에서 "시"만 꺼내기',
      grid: [
        ['출근시각', '시'],
        ['08:35:20', null],
      ],
      target: 'B2',
      prompt: "출근시각[A2]에서 <b>시(hour)</b>만 [B2]에 표시하시오.",
      answer: '=HOUR(A2)',
      hint: '분은 MINUTE, 초는 SECOND',
    },
    {
      id: 'wd2', cat: '날짜', title: '주말인지 판정',
      grid: [
        ['날짜', '구분'],
        ['2026-03-07', null],
      ],
      target: 'B2',
      prompt: "날짜[A2]가 <b>토요일이나 일요일이면 \"주말\"</b>, 아니면 <b>\"평일\"</b>을 [B2]에 표시하시오. (WEEKDAY의 두 번째 인수 2 사용)",
      answer: '=IF(WEEKDAY(A2,2)>=6,"주말","평일")',
      hint: 'WEEKDAY(날짜, <b>2</b>)는 월요일이 1, 토요일 6, 일요일 7입니다.',
    },
    {
      id: 'ym2', cat: '날짜', title: '입사 연도와 근속 연수',
      grid: [
        ['이름', '입사일', '입사연도'],
        ['김한별', '2019-04-01', null],
      ],
      target: 'C2',
      prompt: "입사일[B2]에서 <b>연도</b>만 [C2]에 표시하시오.",
      answer: '=YEAR(B2)',
      hint: '월은 MONTH, 일은 DAY',
    },

    /* ───────── 통계 심화 ───────── */
    {
      id: 'mode2', cat: '통계', title: '가장 많이 나온 값',
      grid: [
        ['응답'],
        [3], [5], [3], [4], [3],
        [null],
      ],
      target: 'A7',
      prompt: "응답[A2:A6] 중 <b>가장 자주 나온 값</b>을 [A7]에 구하시오.",
      answer: '=MODE.SNGL(A2:A6)',
      hint: 'MODE.SNGL(범위) — 최빈값',
    },
    {
      id: 'stdev2', cat: '통계', title: '표준편차',
      grid: [
        ['점수'],
        [80], [90], [70], [100], [60],
        [null],
      ],
      target: 'A7',
      prompt: "점수[A2:A6]의 <b>표본 표준편차</b>를 [A7]에 구하시오.",
      answer: '=STDEV.S(A2:A6)',
      hint: '분산은 VAR.S를 씁니다.',
    },
    {
      id: 'lg2', cat: '통계', title: '상위 3개의 합계',
      grid: [
        ['매출'],
        [320], [180], [410], [250], [150],
        [null],
      ],
      target: 'A7',
      prompt: "매출[A2:A6] 중 <b>가장 큰 3개</b>의 합계를 [A7]에 구하시오.",
      answer: '=LARGE(A2:A6,1)+LARGE(A2:A6,2)+LARGE(A2:A6,3)',
      hint: 'LARGE(범위, 1) + LARGE(범위, 2) + LARGE(범위, 3)',
    },
    {
      id: 'rnk3', cat: '통계', title: '순위를 매기고 1등만 표시',
      grid: [
        ['이름', '점수', '표시'],
        ['김한별', 95, null],
        ['이보람', 88, null],
        ['정하늘', 70, null],
      ],
      target: 'C2',
      prompt: "점수[B2]의 순위가 <b>1위면 \"우승\"</b>, 아니면 <b>공백(\"\")</b>을 [C2]에 표시하시오. (범위 [B2:B4])",
      answer: '=IF(RANK.EQ(B2,$B$2:$B$4)=1,"우승","")',
      hint: '범위는 <b>$</b>로 고정해야 아래로 끌었을 때 안 밀립니다.',
    },
    {
      id: 'avga2', cat: '통계', title: '문자도 0으로 세는 평균',
      grid: [
        ['이름', '점수'],
        ['김한별', 80],
        ['이보람', 90],
        ['정하늘', '결시'],
        [null, null],
      ],
      target: 'B5',
      prompt: "점수[B2:B4]의 평균을 구하되, <b>문자(\"결시\")도 0으로 계산</b>해 [B5]에 표시하시오.",
      answer: '=AVERAGEA(B2:B4)',
      hint: 'AVERAGE는 문자를 <b>빼고</b> 계산하고, AVERAGEA는 <b>0으로</b> 계산합니다.',
    },

    /* ───────── 수학·반올림 ───────── */
    {
      id: 'prod2', cat: '수학·반올림', title: '여러 값을 모두 곱하기',
      grid: [
        ['단가', '수량', '할인율', '금액'],
        [200, 15, 0.9, null],
      ],
      target: 'D2',
      prompt: "단가[A2] × 수량[B2] × 할인율[C2]을 [D2]에 구하시오. (PRODUCT 사용)",
      answer: '=PRODUCT(A2:C2)',
      hint: 'PRODUCT(범위)는 범위 안의 숫자를 모두 곱합니다.',
    },
    {
      id: 'rnd3', cat: '수학·반올림', title: '천의 자리에서 올림',
      grid: [
        ['금액', '표시'],
        [1234567, null],
      ],
      target: 'B2',
      prompt: "금액[A2]을 <b>천의 자리에서 올림</b>해 [B2]에 표시하시오.",
      answer: '=ROUNDUP(A2,-3)',
      hint: '자릿수를 <b>음수</b>로 주면 정수 쪽으로 갑니다. -3은 천 단위.',
    },
    {
      id: 'int2', cat: '수학·반올림', title: '몫과 나머지로 나누어 담기',
      grid: [
        ['총개수', '한상자', '상자수', '남는개수'],
        [47, 6, null, null],
      ],
      target: 'C2',
      prompt: "총개수[A2]를 한상자[B2]씩 담을 때 <b>필요한 상자 수(남는 것 제외)</b>를 [C2]에 구하시오.",
      answer: '=INT(A2/B2)',
      hint: '남는 개수는 MOD(A2,B2)로 구합니다.',
    },
    {
      id: 'sp2', cat: '수학·반올림', title: 'SUMPRODUCT로 총 금액',
      grid: [
        ['품목', '단가', '수량'],
        ['노트', 1200, 3],
        ['펜', 800, 5],
        ['지우개', 500, 2],
        [null, null, null],
      ],
      target: 'C5',
      prompt: "단가[B2:B4]와 수량[C2:C4]을 각각 곱해 더한 <b>총 금액</b>을 [C5]에 구하시오.",
      answer: '=SUMPRODUCT(B2:B4,C2:C4)',
      hint: 'SUMPRODUCT(범위1, 범위2) = 짝끼리 곱해서 모두 더하기',
    },

    /* ───────── 논리 심화 ───────── */
    {
      id: 'lg3', cat: '논리(IF)', title: '조건 세 개를 중첩',
      grid: [
        ['이름', '점수', '등급'],
        ['김한별', 76, null],
      ],
      target: 'C2',
      prompt: "점수[B2]가 <b>90 이상 \"A\"</b>, <b>80 이상 \"B\"</b>, <b>70 이상 \"C\"</b>, 그 외는 <b>\"D\"</b>를 [C2]에 표시하시오.",
      answer: '=IF(B2>=90,"A",IF(B2>=80,"B",IF(B2>=70,"C","D")))',
      hint: '큰 조건부터 차례로 씁니다.',
    },
    {
      id: 'lg4', cat: '논리(IF)', title: 'AND와 OR를 같이',
      grid: [
        ['이름', '출석', '과제', '시험', '결과'],
        ['김한별', 18, 9, 55, null],
      ],
      target: 'E2',
      prompt: "출석[B2]이 <b>15 이상</b>이고, 과제[C2]가 <b>8 이상</b>이거나 시험[D2]이 <b>60 이상</b>이면 <b>\"이수\"</b>, 아니면 <b>\"미이수\"</b>를 [E2]에 표시하시오.",
      answer: '=IF(AND(B2>=15,OR(C2>=8,D2>=60)),"이수","미이수")',
      hint: 'AND 안에 OR를 넣어 묶습니다.',
    },
    {
      id: 'lg5', cat: '논리(IF)', title: '나눗셈 오류 막기',
      grid: [
        ['이름', '시도', '성공', '성공률'],
        ['김한별', 0, 0, null],
      ],
      target: 'D2',
      prompt: "성공[C2]÷시도[B2]를 백분율 정수로 구하되, <b>오류가 나면 0</b>을 [D2]에 표시하시오.",
      answer: '=IFERROR(ROUND(C2/B2*100,0),0)',
      hint: '0으로 나누면 #DIV/0! 오류가 납니다.',
    }
  );
})();
