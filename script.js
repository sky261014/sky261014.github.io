// 1. 타이핑 효과
const words = ["웹 · 앱 만들기 시작!", "나만의 홈페이지 만들기", "AI와 함께 코딩하기"];
const typing = document.getElementById("typing");
let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function type() {
  const word = words[wordIndex];
  typing.textContent = word.slice(0, charIndex);

  if (!deleting && charIndex < word.length) {
    charIndex++;
  } else if (deleting && charIndex > 0) {
    charIndex--;
  } else {
    deleting = !deleting;
    if (!deleting) wordIndex = (wordIndex + 1) % words.length;
    setTimeout(type, deleting ? 1500 : 300);
    return;
  }
  setTimeout(type, deleting ? 50 : 120);
}
type();

// 2. 브라우저 일러스트 안에 코드가 써지는 효과
const codeLines = [
  '<!-- 나의 첫 홈페이지 -->',
  '<!DOCTYPE html>      <!-- 웹 문서 선언 -->',
  '<html lang="ko">     <!-- 한국어 페이지 -->',
  '<body>               <!-- 화면에 보이는 곳 -->',
  '  <h1>안녕하세요!</h1>  <!-- 큰 제목 -->',
  '  <p>바이브코딩 첫날입니다.</p>',
  '  <button>시작하기</button>',
  '</body>',
  '</html>',
];
const codeBox = document.getElementById("code");
const fullCode = codeLines.join("\n");
let codeIndex = 0;

function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// 한 줄을 코드 부분과 한글 설명(주석) 부분으로 나눠서 색칠하기
function colorizeLine(line) {
  const escaped = escapeHtml(line);
  const commentStart = escaped.indexOf("&lt;!--");
  const code = commentStart === -1 ? escaped : escaped.slice(0, commentStart);
  const comment = commentStart === -1 ? "" : escaped.slice(commentStart);

  const coloredCode = code
    .replace(/("[^"]*")/g, '<span class="str">$1</span>')
    .replace(/(&lt;\/?[a-zA-Z0-9!]+)/g, '<span class="tag">$1</span>')
    .replace(/(&gt;)/g, '<span class="tag">$1</span>');

  return coloredCode + (comment ? `<span class="cmt">${comment}</span>` : "");
}

function colorize(text) {
  return text.split("\n").map(colorizeLine).join("\n");
}

function typeCode() {
  codeBox.innerHTML = colorize(fullCode.slice(0, codeIndex));
  if (codeIndex < fullCode.length) {
    codeIndex++;
    setTimeout(typeCode, 35);
  } else {
    setTimeout(() => {
      codeIndex = 0;
      typeCode();
    }, 3000);
  }
}
typeCode();

// 3. 수업 시작일로부터 D+ 계산
const startDate = new Date(2026, 9, 14); // 월은 0부터 시작 (9 = 10월)
const today = new Date();
today.setHours(0, 0, 0, 0);
const days = Math.max(0, Math.floor((today - startDate) / 86400000));
document.getElementById("dday").textContent = days === 0 ? "D-DAY 🎉" : `D+${days}`;

// 4. 체크리스트 (브라우저에 저장)
const items = document.querySelectorAll("#checklist li");
const ringFill = document.getElementById("ringFill");
const percent = document.getElementById("percent");
const RING_LENGTH = 2 * Math.PI * 52;

function load() {
  try {
    return JSON.parse(localStorage.getItem("vibe-checklist")) || {};
  } catch {
    return {};
  }
}

function save(state) {
  try {
    localStorage.setItem("vibe-checklist", JSON.stringify(state));
  } catch {}
}

const state = load();

function updateProgress() {
  const done = document.querySelectorAll("#checklist li.checked").length;
  const value = Math.round((done / items.length) * 100);
  ringFill.style.strokeDashoffset = RING_LENGTH * (1 - value / 100);
  percent.textContent = value + "%";
  return value;
}

items.forEach((item) => {
  if (state[item.dataset.id]) item.classList.add("checked");

  item.addEventListener("click", () => {
    item.classList.toggle("checked");
    state[item.dataset.id] = item.classList.contains("checked");
    save(state);
    if (updateProgress() === 100) celebrate();
  });
});
updateProgress();

// 100% 완료 시 축하 효과
function celebrate() {
  const emojis = ["☁️", "💙", "✨", "🎉", "🩵"];
  for (let i = 0; i < 40; i++) {
    const el = document.createElement("div");
    el.className = "confetti";
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = Math.random() * 100 + "vw";
    el.style.animationDuration = 2 + Math.random() * 2 + "s";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }
}

// 5. 커리큘럼 (다음에 배울 것)
const lessons = [
  {
    no: "2차시", emoji: "🧱", category: "web",
    title: "HTML 기초 구조 익히기",
    summary: "웹 페이지의 뼈대를 만드는 태그를 배워요.",
    points: ["head / body 구조 이해하기", "제목, 문단, 목록 태그", "이미지와 링크 넣기", "header · main · footer 시맨틱 태그"],
  },
  {
    no: "3차시", emoji: "🎨", category: "web",
    title: "CSS로 예쁘게 꾸미기",
    summary: "색상, 글꼴, 여백으로 디자인을 입혀요.",
    points: ["선택자와 속성 기초", "색상 · 폰트 · 그림자", "박스 모델 (margin, padding)", "Flexbox와 Grid 레이아웃"],
  },
  {
    no: "4차시", emoji: "📱", category: "web",
    title: "반응형 웹 만들기",
    summary: "PC, 태블릿, 휴대폰 어디서나 잘 보이게!",
    points: ["viewport 설정", "미디어 쿼리(@media)", "모바일 우선 디자인", "햄버거 메뉴 만들기"],
  },
  {
    no: "5차시", emoji: "⚡", category: "web",
    title: "JavaScript 기초",
    summary: "버튼을 누르면 반응하는 페이지를 만들어요.",
    points: ["변수와 함수", "클릭 이벤트 다루기", "HTML 요소 바꾸기 (DOM)", "간단한 퀴즈 · 계산기 만들기"],
  },
  {
    no: "6차시", emoji: "🤖", category: "ai",
    title: "Claude와 바이브코딩",
    summary: "말로 설명하면 AI가 코드를 만들어 줘요.",
    points: ["좋은 프롬프트 작성법", "원하는 디자인 설명하기", "오류를 AI와 함께 고치기", "코드를 읽고 이해하는 습관"],
  },
  {
    no: "7차시", emoji: "🧩", category: "ai",
    title: "나만의 홈페이지 기획",
    summary: "어떤 홈페이지를 만들지 직접 설계해요.",
    points: ["주제와 대상 정하기", "메뉴 구조 그리기", "색상 · 분위기 정하기", "Claude로 첫 화면 만들기"],
  },
  {
    no: "8차시", emoji: "🐙", category: "deploy",
    title: "Git & GitHub 사용하기",
    summary: "내 코드를 안전하게 저장하고 기록해요.",
    points: ["저장소(Repository) 만들기", "commit과 push", "변경 기록 확인하기", "README 작성하기"],
  },
  {
    no: "9차시", emoji: "🌐", category: "deploy",
    title: "GitHub Pages로 배포",
    summary: "내 홈페이지를 인터넷에 공개해요.",
    points: ["GitHub Pages 설정", "나만의 주소(URL) 받기", "수정하고 다시 배포하기", "친구에게 공유하기"],
  },
  {
    no: "10차시", emoji: "📲", category: "deploy",
    title: "웹을 앱처럼 만들기",
    summary: "휴대폰 홈 화면에 설치되는 웹앱(PWA)!",
    points: ["앱 아이콘과 이름 정하기", "manifest 파일 이해하기", "홈 화면에 추가하기", "앱 같은 화면 구성"],
  },
  {
    no: "11차시", emoji: "🏆", category: "deploy",
    title: "최종 프로젝트 발표",
    summary: "완성한 홈페이지를 발표하고 피드백해요.",
    points: ["최종 점검과 다듬기", "발표 자료 준비", "서로 피드백 주고받기", "앞으로의 학습 계획 세우기"],
  },
];

const lessonBox = document.getElementById("lessons");

lessons.forEach((lesson, i) => {
  const item = document.createElement("article");
  item.className = "lesson";
  item.dataset.category = lesson.category;
  item.innerHTML = `
    <button class="lesson-head">
      <span class="lesson-no">${lesson.no}</span>
      <span class="lesson-emoji">${lesson.emoji}</span>
      <span class="lesson-title">
        <strong>${lesson.title}</strong>
        <small>${lesson.summary}</small>
      </span>
      ${i === 0 ? '<span class="next-badge">다음 수업</span>' : ""}
      <span class="arrow">▾</span>
    </button>
    <div class="lesson-body">
      <ul>${lesson.points.map((p) => `<li>${p}</li>`).join("")}</ul>
    </div>
  `;
  item.querySelector(".lesson-head").addEventListener("click", () => {
    item.classList.toggle("open");
  });
  lessonBox.appendChild(item);
});

// 다음 수업은 처음부터 펼쳐두기
lessonBox.firstElementChild.classList.add("open");

// 탭 메뉴
const tabBtns = document.querySelectorAll("#tabs button");
tabBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.dataset.filter;
    document.querySelectorAll(".lesson").forEach((item) => {
      item.classList.toggle("hide", filter !== "all" && item.dataset.category !== filter);
    });
  });
});

// 6. 모바일 햄버거 메뉴
const hamburger = document.getElementById("hamburger");
const gnb = document.getElementById("gnb");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  gnb.classList.toggle("open");
});
gnb.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("open");
    gnb.classList.remove("open");
  });
});

// 7. 스크롤 관련 효과
const header = document.getElementById("header");
const toTop = document.getElementById("toTop");
const navLinks = gnb.querySelectorAll("a");
const sections = document.querySelectorAll("main section[id]");

window.addEventListener("scroll", () => {
  const y = window.scrollY;
  header.classList.toggle("scrolled", y > 10);
  toTop.classList.toggle("show", y > 500);

  // 현재 보고 있는 섹션의 메뉴에 표시
  let current = "home";
  sections.forEach((section) => {
    if (y >= section.offsetTop - 120) current = section.id;
  });
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === "#" + current);
  });
});

toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// 스크롤하면 내용이 부드럽게 나타나기
const revealTargets = document.querySelectorAll(".section-head, .feature, .today-grid, .tabs, .lesson-list, .board");
revealTargets.forEach((el) => el.classList.add("reveal"));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("show");
  });
}, { threshold: 0.1 });
revealTargets.forEach((el) => observer.observe(el));
