# 테트리스

HTML, CSS, JavaScript만 사용하는 브라우저 테트리스 게임입니다.  
빌드 도구나 외부 라이브러리 없이 바로 실행할 수 있으며, 프론트엔드 입문 학습용으로 제작되었습니다.

## 프로젝트 구조

```
tetris/
├── index.html   # 화면 구조 (보드, 점수, 버튼, 조작법)
├── style.css    # 스타일
├── script.js    # 게임 로직
└── README.md    # 프로젝트 안내
```

## 실행 방법

### 방법 1: 브라우저에서 직접 열기

1. 프로젝트 폴더에서 `index.html`을 찾습니다.
2. 파일을 더블 클릭하거나 브라우저 창에 끌어다 놓습니다.
3. **시작** 버튼을 눌러 게임을 시작합니다.

### 방법 2: Live Server (VS Code / Cursor)

1. 이 프로젝트 폴더를 에디터에서 엽니다.
2. `index.html`을 우클릭한 뒤 **Open with Live Server**를 선택합니다.
3. 브라우저가 열리면 **시작** 버튼을 누릅니다.

### 방법 3: GitHub Pages (배포 후)

1. 저장소의 **Settings → Pages**로 이동합니다.
2. **Build and deployment → Source**에서 `Deploy from a branch`를 선택합니다.
3. Branch를 `main`, Folder를 `/ (root)`로 설정 후 **Save**합니다.
4. 배포가 완료되면 `https://<사용자명>.github.io/<저장소명>/` 에서 플레이할 수 있습니다.

## 조작법

**시작** 또는 **재시작** 버튼을 눌러 게임을 시작한 뒤 키보드로 조작합니다.

| 키 | 동작 |
|---|---|
| `ArrowLeft` (←) | 왼쪽 이동 |
| `ArrowRight` (→) | 오른쪽 이동 |
| `ArrowDown` (↓) | 한 칸 빠르게 내리기 (soft drop) |
| `ArrowUp` (↑) | 블록 회전 |
| `Space` | 즉시 바닥까지 낙하 (hard drop) |

- 벽·고정 블록과 충돌하는 이동·회전은 적용되지 않습니다.
- 회전 후 충돌하면 회전이 취소됩니다.

## 구현 기능

| 기능 | 설명 |
|---|---|
| 게임 보드 | 10열 × 20행 CSS Grid 보드 |
| 테트로미노 | I, O, T, S, Z, J, L 7종 블록 |
| 자동 낙하 | 일정 간격(800ms)으로 블록이 아래로 이동 |
| 충돌 판정 | 벽·바닥·고정 블록과의 충돌 검사 (`canMove`) |
| 블록 고정 | 더 이상 내려갈 수 없을 때 보드에 고정 |
| 키보드 조작 | 좌우 이동, 회전, soft/hard drop |
| 라인 삭제 | 가득 찬 한 줄을 삭제하고 위 블록을 내림 |
| 점수 | 삭제한 줄 수에 따라 점수 누적 |
| 게임 오버 | 새 블록을 스폰할 수 없을 때 종료 |
| 재시작 | 보드·점수·타이머·상태 초기화 후 재개 |

### 점수 규칙

| 삭제한 줄 수 | 획득 점수 |
|---|---|
| 1줄 | 100 |
| 2줄 | 300 |
| 3줄 | 500 |
| 4줄 | 800 |

### 게임 오버

- 새 블록이 스폰 위치에 놓일 수 없으면 게임 오버입니다.
- 자동 낙하가 멈추고 키보드 조작이 비활성화됩니다.
- **재시작** 버튼으로 다시 플레이할 수 있습니다.

## 품질 점검 방법

프로젝트에 포함된 Cursor 명령으로 점검할 수 있습니다.

| 명령 | 용도 |
|---|---|
| `/review-structure` | HTML/CSS/JS 역할 분리, 초보자 친화성 |
| `/code-review` | 코드 품질·중복·버그 가능성 |
| `/review-game-logic` | 게임 로직·충돌·라인 삭제 |
| `/qa-playtest` | QA 시나리오 기반 기능 점검 |
| `/bug-hunt` | 잠재 버그 탐색 |

### 수동 스모크 테스트 (배포 전 최소 확인)

1. `index.html`을 브라우저에서 열고 개발자 도구(F12) **Console**에 에러가 없는지 확인합니다.
2. **시작** 클릭 → 블록 자동 낙하 확인
3. `←` `→` `↑` `↓` `Space` 조작 확인
4. 한 줄을 가득 채워 라인 삭제·점수 증가 확인
5. **재시작** 클릭 → 보드·점수 초기화 확인
6. GitHub Pages URL에서도 동일하게 동작하는지 확인

## GitHub Pages 배포 방법

### 1. Git 저장소 준비

```bash
git init
git add index.html style.css script.js README.md
git commit -m "feat: add browser tetris game"
git branch -M main
git remote add origin https://github.com/<사용자명>/<저장소명>.git
git push -u origin main
```

### 2. GitHub Pages 활성화

1. GitHub 저장소 페이지에서 **Settings** 탭을 엽니다.
2. 왼쪽 메뉴에서 **Pages**를 선택합니다.
3. **Build and deployment**:
   - Source: `Deploy from a branch`
   - Branch: `main` / `/ (root)`
4. **Save** 후 1~2분 뒤 배포 URL을 확인합니다.

### 3. 배포 확인

- 배포 URL: `https://<사용자명>.github.io/<저장소명>/`
- 게임 보드, **시작** 버튼, 키보드 조작이 정상 동작하는지 확인합니다.

### 배포 시 참고

- 이 프로젝트는 정적 파일만 사용하므로 **빌드 단계가 필요 없습니다**.
- `index.html`, `style.css`, `script.js`는 **상대 경로**로 연결되어 있어 GitHub Pages 서브경로에서도 동작합니다.
- 저장소 이름이 `<사용자명>.github.io`인 경우 루트 URL(`https://<사용자명>.github.io/`)에서 바로 제공됩니다.

## 기술 스택

- HTML5
- CSS3 (Grid, Flexbox)
- Vanilla JavaScript (ES6+)

## 라이선스

학습·데모 목적으로 자유롭게 사용할 수 있습니다.
