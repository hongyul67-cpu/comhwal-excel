/* 컴활 1급 실기 스프레드시트 - 함수 연습소 엔진 */
'use strict';

var PROBS = window.XL_PROBLEMS || [];
var $ = function (id) { return document.getElementById(id); };
function show(id) { $(id).classList.remove('hidden'); }
function hide(id) { $(id).classList.add('hidden'); }
function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

/* fixed=true  → 수업용 '함께 풀기'. 문제 순서를 절대 섞지 않아 모든 PC에서 N번 문제가 같다.
   fixed=false → 학생 개인 연습. 매번 섞어서 출제. */
var state = { cat: '전체', queue: [], idx: 0, correct: 0, answered: false, done: 0, startTime: 0,
              fixed: false, marked: {}, uiMode: 'class' };

/* ---------- 셀 주소 도우미 ---------- */
function colLetter(c) { var s = ''; c++; while (c > 0) { var m = (c - 1) % 26; s = String.fromCharCode(65 + m) + s; c = Math.floor((c - 1) / 26); } return s; }
function parseRef(ref) { var m = /^\$?([A-Za-z]{1,3})\$?([0-9]+)$/.exec(ref); var col = 0, L = m[1].toUpperCase(); for (var i = 0; i < L.length; i++) col = col * 26 + (L.charCodeAt(i) - 64); return { c: col - 1, r: parseInt(m[2], 10) - 1 }; }

/* ---------- 시작 화면 ---------- */
function categories() {
  var set = {}; PROBS.forEach(function (p) { set[p.cat] = 1; });
  return ['전체'].concat(Object.keys(set));
}
function renderStart() {
  hide('practice'); hide('result'); show('start');
  ['catChipsC', 'catChips'].forEach(function (boxId) {
    var box = $(boxId); if (!box) return;
    box.innerHTML = '';
    categories().forEach(function (c) {
      var n = c === '전체' ? PROBS.length : PROBS.filter(function (p) { return p.cat === c; }).length;
      var el = document.createElement('div');
      el.className = 'chip' + (c === state.cat ? ' on' : '');
      el.textContent = c + ' (' + n + ')';
      el.onclick = function () { state.cat = c; renderStart(); };
      box.appendChild(el);
    });
  });
}
function pickMode(m) {
  state.uiMode = m;
  [['mcClass', 'class'], ['mcPractice', 'practice']].forEach(function (x) {
    var el = $(x[0]); if (el) el.classList.toggle('on', m === x[1]);
  });
  [['classPanel', 'class'], ['practicePanel', 'practice']].forEach(function (x) {
    if ($(x[0])) (m === x[1] ? show : hide)(x[0]);
  });
}

/* ---------- 연습 진행 ---------- */
/* 수업용: 교재(데이터) 순서 그대로 — 섞지 않는다 */
function startClass() { startPractice(true); }
function startPractice(fixed) {
  state.fixed = (fixed === true);
  var pool = state.cat === '전체' ? PROBS : PROBS.filter(function (p) { return p.cat === state.cat; });
  state.queue = state.fixed ? pool.slice() : shuffle(pool);
  state.idx = 0; state.correct = 0; state.done = 0; state.marked = {}; state.startTime = Date.now();
  if (!state.queue.length) return;
  hide('start'); hide('result'); show('practice');
  renderProblem();
}
function quitPractice() { renderStart(); }

function renderProblem() {
  var p = state.queue[state.idx];
  state.answered = false;
  $('progLabel').textContent = (state.idx + 1) + ' / ' + state.queue.length;
  $('pgFill').style.width = (state.idx / state.queue.length * 100) + '%';
  $('scoreLabel').textContent = state.correct + '점';
  $('catTag').textContent = p.cat;
  $('pTitle').textContent = p.title;
  $('pPrompt').innerHTML = p.prompt;
  $('fb').innerHTML = '';
  renderSheet(p);
  var fx = $('fx'); fx.value = ''; fx.disabled = false;
  $('toolBtns').innerHTML =
    (state.fixed ? '<button class="btn ghost" onclick="prevProblem()"' + (state.idx === 0 ? ' disabled' : '') + '>← 이전</button>' : '') +
    '<button class="btn green" onclick="checkAnswer()">확인</button>' +
    '<button class="btn sec" onclick="showHint()">💡 힌트</button>' +
    '<button class="btn ghost" onclick="showModel()">모범답안</button>' +
    '<button class="btn ghost" onclick="skipProblem()">' + (state.fixed ? '다음 →' : '건너뛰기 →') + '</button>' +
    (state.fixed ? jumpSelectHtml() : '');
  updateLive();
  setTimeout(function () { fx.focus(); }, 40);
}

/* 수업용 — 원하는 문제 번호로 바로 이동 (선생님이 "12번 볼게요" 할 때) */
function jumpSelectHtml() {
  var opts = state.queue.map(function (p, i) {
    return '<option value="' + i + '"' + (i === state.idx ? ' selected' : '') + '>' +
      (i + 1) + '. ' + escapeHtml(p.title) + '</option>';
  }).join('');
  return '<div class="spacer"></div><select class="jump" onchange="jumpTo(this.value)">' + opts + '</select>';
}
function jumpTo(i) {
  i = parseInt(i, 10);
  if (isNaN(i) || i < 0 || i >= state.queue.length) return;
  state.idx = i; renderProblem();
}
function prevProblem() { if (state.idx > 0) { state.idx--; renderProblem(); } }
function escapeHtml(x) {
  return String(x).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderSheet(p) {
  var g = p.grid;
  var cols = 0; g.forEach(function (row) { cols = Math.max(cols, row.length); });
  var tgt = parseRef(p.target);
  var html = '<tr><th></th>';
  for (var c = 0; c < cols; c++) html += '<th>' + colLetter(c) + '</th>';
  html += '</tr>';
  for (var r = 0; r < g.length; r++) {
    html += '<tr><td class="rowh">' + (r + 1) + '</td>';
    for (var c2 = 0; c2 < cols; c2++) {
      var v = g[r][c2];
      var isT = (r === tgt.r && c2 === tgt.c);
      var isNum = (typeof v === 'number');
      var cls = isT ? 'tcell' : (isNum ? 'num' : '');
      var disp = isT ? '?' : (v === null || v === undefined ? '' : v);
      html += '<td class="' + cls + '"' + (isT ? ' id="tcell"' : '') + '>' + disp + '</td>';
    }
    html += '</tr>';
  }
  $('sheet').innerHTML = html;
}

/* ---------- 노란 칸 실시간 결과 ----------
 * 학생이 입력줄에 치는 동안 그 수식을 실제로 계산해 노란 셀에 그대로 보여 준다.
 * (아래 정답만 뜨면 "진짜 작동하는지" 알 수 없다는 피드백 → 엑셀처럼 셀에 값이 뜨게)
 * 괄호·따옴표가 아직 안 닫혔거나 함수 이름을 치는 중이면 오류 대신 '…'으로 조용히 넘어간다. */
function looksIncomplete(f) {
  var depth = 0, q = false;
  for (var i = 0; i < f.length; i++) {
    var ch = f.charAt(i);
    if (ch === '"') { q = !q; continue; }
    if (q) continue;
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
  }
  if (q || depth > 0) return true;
  if (/[,(+\-*/^&<>=:]$/.test(f)) return true;
  // 함수 이름을 치는 중(=IF, =SUM …). 셀 주소(=B2)는 완성으로 본다.
  if (/[A-Za-z_.]$/.test(f) && !/\$?[A-Za-z]{1,3}\$?[0-9]+$/.test(f)) return true;
  return false;
}
function setCell(cls, html) {
  var td = $('tcell');
  if (!td) return;
  td.className = 'tcell' + (cls ? ' ' + cls : '');
  td.innerHTML = html;
}
/* 계산이 안 되면 값 대신 '오류'라고 분명히 보여 준다 — 숫자가 왜 안 나오는지 바로 알게 */
function cellError(msg) {
  setCell('err', '<div class="cv">⚠ 오류</div>' +
    (msg ? '<div class="cv2 errcode">' + escapeHtml(msg) + '</div>' : ''));
}
function updateLive() {
  if (state.answered) return;                 // 채점 뒤에는 결과를 고정해 둔다
  var p = state.queue[state.idx];
  if (!p || !$('tcell')) return;
  var raw = ($('fx').value || '').trim();
  if (!raw) { setCell('', '?'); return; }
  if (raw.charAt(0) !== '=') { setCell('lit', escapeHtml(raw)); return; }
  if (raw.length === 1) { setCell('typing', '…'); return; }
  var r = XLEngine.evaluate(raw, p.grid);
  if ('error' in r) {
    if (looksIncomplete(raw)) setCell('typing', '…');
    else cellError(r.error);
    return;
  }
  setCell('live', escapeHtml(fmt(r.value)));
}
/* 채점 결과를 셀에 남긴다 — 틀리면 내 값 아래에 정답 값도 같이 */
function paintGraded(myVal, modelVal, ok) {
  var my = '<div class="cv">' + escapeHtml(fmt(myVal)) + '</div>';
  if (ok) { setCell('good', my); return; }
  setCell('bad', my + '<div class="cv2">정답 ' + escapeHtml(fmt(modelVal)) + '</div>');
}

/* ---------- 채점 ---------- */
function valEqual(a, b) {
  if (typeof a === 'number' && typeof b === 'number') return Math.abs(a - b) < 1e-9;
  // 숫자 문자열 허용
  var na = Number(a), nb = Number(b);
  if (!isNaN(na) && !isNaN(nb) && String(a).trim() !== '' && String(b).trim() !== '') return Math.abs(na - nb) < 1e-9;
  return String(a).trim() === String(b).trim();
}
function checkAnswer() {
  if (state.answered) { nextProblem(); return; }
  var p = state.queue[state.idx];
  var raw = $('fx').value.trim();
  if (!raw) { flash('수식을 입력하세요. (예: =IF(...))', 'no'); return; }
  /* 답을 값으로 그냥 적어 버리면(예: =15) 결과값이 같아 정답 처리되던 것을 막는다.
     함수 연습이 목적이므로 셀 참조(A2, B2:B5)나 함수 호출( SUM( ... )이 하나도 없으면 채점하지 않는다.
     "다른 수식이어도 결과가 맞으면 정답" 규칙은 그대로 둔다. */
  var body = raw.replace(/^=/, '');
  var hasRef = /\$?[A-Za-z]{1,3}\$?\d+/.test(body);       /* A2, $B$5 같은 셀 주소 */
  var hasFunc = /[A-Za-z]{2,}\s*\(/.test(body);           /* SUM( , IF( 같은 함수 */
  if (!hasRef && !hasFunc) {
    flash('값을 그대로 적으면 안 돼요. <b>셀 주소나 함수</b>를 써서 수식으로 만들어 보세요. (예: =SUM(B2:B5))', 'no');
    return;
  }
  var stu = XLEngine.evaluate(raw, p.grid);
  var model = XLEngine.evaluate(p.answer, p.grid);
  if ('error' in stu) {
    cellError(stu.error);
    flash('<b>❌ 수식 오류:</b> ' + stu.error + '<br>괄호·따옴표·쉼표를 확인해 보세요. (노란 칸에도 오류가 그대로 나옵니다)', 'no');
    return;
  }
  var ok = !('error' in model) && valEqual(stu.value, model.value);
  state.answered = true;
  state.done++;
  var fx = $('fx'); fx.disabled = true;
  var modelVal = ('error' in model) ? '-' : model.value;
  paintGraded(stu.value, modelVal, ok);
  if (ok) {
    /* 수업용은 앞뒤로 오갈 수 있어 같은 문제를 두 번 맞혀도 점수가 중복되지 않게 한다 */
    if (!state.marked[state.idx]) { state.marked[state.idx] = 1; state.correct++; }
    $('scoreLabel').textContent = state.correct + '점';
    finish('<b>✅ 정답!</b> 노란 칸에 나온 계산 결과: <b>' + fmt(stu.value) + '</b>', 'ok', p);
  } else {
    finish('<b>❌ 오답</b> · 내 결과: <b>' + fmt(stu.value) + '</b> (정답 결과: <b>' + fmt(modelVal) + '</b>)', 'no', p);
  }
}
/* 셀에 보여 줄 값 — 엑셀처럼 깔끔한 숫자로 만든다.
   자바스크립트 계산은 0.1*0.2 가 0.020000000000000004 처럼 나오는데,
   학생 눈에는 "숫자가 이상하게 나온다"로 보이므로 찌꺼기를 잘라 낸다.
   채점(valEqual)은 원래 값으로 하므로 여기서 반올림해도 정답 판정은 달라지지 않는다. */
function fmt(v) {
  if (v === '' || v === null || v === undefined) return '(빈 문자열)';
  if (v === true) return 'TRUE';
  if (v === false) return 'FALSE';
  if (typeof v === 'number') {
    if (!isFinite(v)) return String(v);
    if (Math.floor(v) === v && Math.abs(v) < 1e15) return String(v);
    var r = Number(v.toPrecision(12));                 // 부동소수점 찌꺼기 제거
    var dec = (String(r).split('.')[1] || '').length;
    if (dec > 6) r = Number(r.toFixed(6));             // 너무 긴 소수는 6자리까지만 보여 준다
    return String(r);
  }
  return String(v);
}
function flash(msg, cls) { $('fb').innerHTML = '<div class="feedback ' + cls + '">' + msg + '</div>'; }
function finish(msg, cls, p) {
  var last = state.idx === state.queue.length - 1;
  $('fb').innerHTML = '<div class="feedback ' + cls + '">' + msg +
    '<div style="margin-top:8px">모범답안 <span class="ansline">' + p.answer + '</span></div>' +
    (p.hint ? '<div style="margin-top:6px;color:var(--tx2)">💡 ' + p.hint + '</div>' : '') +
    '<div class="row" style="margin-top:12px"><button class="btn" onclick="nextProblem()">' +
    (last ? '결과 보기 →' : '다음 문제 →') + '</button></div></div>';
}
function nextProblem() {
  if (state.idx < state.queue.length - 1) { state.idx++; renderProblem(); }
  else showResult();
}
function skipProblem() {
  if (state.answered) { nextProblem(); return; }
  state.done++;
  nextProblem();
}
function showHint() {
  var p = state.queue[state.idx];
  flash('💡 ' + (p.hint || '힌트가 없습니다.'), 'ok');
}
function showModel() {
  var p = state.queue[state.idx];
  var m = XLEngine.evaluate(p.answer, p.grid);
  var mv = ('error' in m) ? '-' : fmt(m.value);
  $('fb').innerHTML = '<div class="feedback ok">모범답안 <span class="ansline">' + p.answer + '</span>' +
    '<div style="margin-top:6px">이 수식을 넣으면 노란 칸에 <b>' + escapeHtml(mv) + '</b> 이(가) 나옵니다.</div>' +
    (p.hint ? '<div style="margin-top:6px;color:var(--tx2)">💡 ' + p.hint + '</div>' : '') +
    '<div style="margin-top:6px;color:var(--tx2);font-size:13px">입력줄에 직접 따라 쳐 보고 [확인]을 눌러 보세요.</div></div>';
}

/* ---------- 결과 ---------- */
function showResult() {
  hide('practice'); show('result');
  var n = state.queue.length, c = state.correct;
  var pct = Math.round(c / n * 100);
  /* 랭킹전 — 채점 후 RP 정산 */
  if (window.RankKit) RankKit.award(pct, '컴활 1급 실기 함수');
  var emoji = pct >= 90 ? '🏆' : pct >= 70 ? '🎉' : pct >= 40 ? '👍' : '💪';
  var msg = pct >= 90 ? '완벽해요!' : pct >= 70 ? '잘했어요!' : pct >= 40 ? '조금만 더!' : '연습이 필요해요';
  state.durationSec = Math.round((Date.now() - state.startTime) / 1000);
  $('result').innerHTML =
    '<div class="result pcard">' +
      '<div class="big">' + emoji + '</div>' +
      '<div class="score">' + c + ' / ' + n + '</div>' +
      '<div style="color:var(--tx2);margin-top:4px">정답률 ' + pct + '% · ' + msg + '</div>' +
      submitBtnHtml() +
      '<div class="rbtns">' +
        '<button class="btn sec" onclick="renderStart()">범위 다시 선택</button>' +
        '<button class="btn" onclick="startPractice(' + (state.fixed ? 'true' : 'false') + ')">다시 풀기</button>' +
      '</div>' +
    '</div>';
}

/* ---------- 결과 제출(collector) ---------- */
function submitEnabled() { return !!(window.ResultCollector && ResultCollector.config && ResultCollector.config.endpoint); }
function submitBtnHtml() {
  
  return '<div class="row" style="justify-content:center;margin:14px 0 4px">' +
    '<button class="btn green" id="xlSubmit" onclick="submitResult()">📤 선생님께 결과 제출</button></div>';
}
function submitGuide() {
  alert(['이 링크로는 제출이 되지 않아요.', '',
    '선생님이 나눠 준 제출용 링크(주소 뒤에 ?rc=... 가 붙은 링크)로',
    '들어와야 반·번호를 입력하고 결과를 보낼 수 있습니다.', '',
    '연습은 지금 이대로 계속 하셔도 됩니다.'].join(String.fromCharCode(10)));
}
function submitResult() {
  if (!submitEnabled()) { submitGuide(); return; }
  var n = state.queue.length, c = state.correct;
  // 시트 탭은 하나로 — 분류는 mode 로 (규약 §1 ①)
  ResultCollector.config.tool = '컴활 1급 실기-스프레드시트';
  ResultCollector.open({
    score: Math.round(c / n * 100),
    correct: c, total: n,
    durationSec: state.durationSec,
    labels: { score: '정답률', correct: '맞힘', total: '문항수' },
    mode: '스프레드시트 실기 — ' + (state.fixed ? '함께 풀기(수업)' : '랜덤 연습') + ' · ' + (state.cat || '전체'),
    extra: ['함수·수식 작성'],
  });
}

/* ---------- 입력할 때마다 노란 칸 갱신 ---------- */
function bindLive() {
  var fx = $('fx');
  if (fx && !fx.__live) { fx.__live = 1; fx.addEventListener('input', updateLive); }
}
document.addEventListener('DOMContentLoaded', bindLive);
bindLive();

/* ---------- Enter 키 ---------- */
document.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && !$('practice').classList.contains('hidden')) {
    if (document.activeElement === $('fx')) { e.preventDefault(); checkAnswer(); }
  }
});

/* ---------- init ---------- */
renderStart();
