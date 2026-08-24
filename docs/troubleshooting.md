# 개발바닥 대표 트러블슈팅

Notion의 개발 기록을 현재 코드와 PR에 대조해, **실제로 발생했고 해결 결과를 설명할 수 있는 사례**만 골랐습니다. 단순 오류 목록보다 문제를 좁힌 과정, 선택의 근거, 검증 결과가 드러나는 사례를 우선했습니다.

## 핵심 어필 포인트

| 사례                  | 결과                                                   | 보여주는 역량                                |
| --------------------- | ------------------------------------------------------ | -------------------------------------------- |
| Lighthouse 성능 개선  | 상세 LCP `12.2s → 2.1s`, 목록 전송량 `5,862 → 410 KiB` | 측정 기반 병목 진단과 선택적 최적화          |
| SSE 알림 신뢰성       | Bearer 인증, 중복 제거, 재연결 후 REST 복구            | 프론트·백엔드를 잇는 실시간 시스템 설계      |
| 무한 스크롤 요청 경쟁 | 페이지별 abort를 생명주기 취소와 요청 잠금으로 교체    | 비동기 요청의 목적에 맞는 동시성 제어        |
| 인증 세션 복구        | 3단계 인증 상태와 single-flight 적용                   | 전역 상태와 인증 요청 경쟁 상태 설계         |
| SPA 배포 장애         | 캐시 정책 분리, Docker DNS 재해석, `--no-deps` 적용    | 브라우저부터 컨테이너까지 이어지는 장애 분석 |

## 1. 감이 아니라 측정으로 LCP 병목을 제거했다

### 문제와 진단

게시글 목록은 원본 이미지 때문에 5.8MiB 이상을 전송했고, 상세 화면은 게시글 API 응답 전까지 전체 화면을 가려 LCP가 12.2초까지 늘어났습니다. Lighthouse를 같은 조건에서 3회 실행해 중앙값을 비교하고, 이미지·렌더링 게이트·번들을 순서대로 점검했습니다.

### 해결과 결과

- 최대 160px로 보이는 이미지를 표시 크기에 맞춰 리사이즈하고 WebP로 변환했습니다. 대상 이미지 합계는 `6,809KB → 32KB`가 됐습니다.
- 게시글 데이터가 필요 없는 UI는 로딩 게이트 밖에서 먼저 그리고, 데이터 영역에는 스켈레톤을 적용했습니다.
- 모든 라우트를 lazy loading하자 상세 LCP가 `2.1s → 2.9s`로 악화됐습니다. 따라서 목록·상세는 즉시 로드하고 나머지 라우트만 분할했습니다.
- 리팩터링 회귀를 막기 위해 테스트를 `65개 → 105개`로 늘렸습니다.

| 페이지           | Performance |            LCP |            전송량 |
| ---------------- | ----------: | -------------: | ----------------: |
| `/posts`         |   `82 → 98` |  `4.7s → 2.1s` | `5,862 → 410 KiB` |
| `/posts/:postId` |   `74 → 98` | `12.2s → 2.1s` | `2,110 → 645 KiB` |

> **어필 포인트:** 일반적으로 좋다고 알려진 기법을 일괄 적용하지 않고, 실제로 느려진 코드 분할은 되돌렸습니다. 기준선 수립, 단계별 변경, 재측정, 회귀 테스트까지 하나의 최적화 과정으로 연결했습니다.

근거: [PR #14](https://github.com/100-hours-a-week/KTB4_Hennie_FE/pull/14), [고도화 진행 기록](https://app.notion.com/p/3c0b7109335181dfad76ed73c5c7f891)

## 2. SSE를 연결 기능이 아니라 복구 가능한 시스템으로 설계했다

### 문제와 진단

네이티브 `EventSource`는 임의의 `Authorization` 헤더를 붙일 수 없었습니다. 또한 연결이 다시 열렸다는 사실만으로 끊긴 동안의 알림이 복구되지는 않으며, 이벤트를 화면 목록에 바로 누적하면 중복·유실·순서 문제도 생길 수 있었습니다.

### 해결

- custom `fetch`를 주입할 수 있는 `eventsource` 패키지로 **액세스 토큰**을 Bearer 헤더에 전달했습니다.
- `NotificationProvider`는 로그인 세션 동안 SSE 연결, 미읽음 개수, 목록 동기화 신호를 유지합니다. 실제 알림 목록은 알림 페이지의 로컬 훅이 관리합니다.
- SSE의 `notification.created`는 데이터 원본이 아니라 “REST로 다시 동기화하라”는 신호로 사용했습니다.
- 최근 이벤트 ID 200개로 중복을 제거하고, 150ms debounce로 짧은 이벤트 묶음의 REST 재조회를 합쳤습니다.
- 연결 성공 시 REST 재동기화하고, `401/403`은 토큰 재발급 후 1회 재연결, `5xx`는 1~30초 지수 백오프와 jitter를 적용했습니다.
- 백엔드는 알림 저장 트랜잭션이 커밋된 뒤 SSE를 전송하고, heartbeat와 emitter 정리를 담당합니다.

현재는 `Last-Event-ID` 기반 영속 replay가 없으므로 알림 DB와 REST API가 복구 기준입니다. Nginx의 SSE 전용 buffering·timeout 설정은 아직 배포 검증이 필요합니다.

> **어필 포인트:** 연결 성공만 구현한 것이 아니라 인증 만료, 중복 이벤트, burst, 네트워크 단절, 컴포넌트 cleanup, 유실 복구까지 실패 경로를 설계했습니다. 프론트와 백엔드를 모두 맡아 저장 시점부터 UI 동기화까지 일관된 계약을 만들었습니다.

근거: [PR #7](https://github.com/100-hours-a-week/KTB4_Hennie_FE/pull/7), [`useNotificationStream.js`](../src/features/notification/hook/useNotificationStream.js), [SSE 설계 기록](https://app.notion.com/p/3b3b7109335180da90a7c3a813e6e156)

## 3. 무한 스크롤에서 AbortController의 책임을 바로잡았다

### 문제와 원인

목록에 다음 페이지를 이어 붙이는 요청인데도 새 요청마다 이전 요청을 취소하는 latest-wins 패턴을 사용했습니다. 검색어 변경처럼 최신 결과 하나만 필요한 요청과, 페이지 순서를 유지해야 하는 누적 요청을 같은 방식으로 처리한 것이 원인이었습니다.

### 해결

- `AbortController`는 화면 이탈과 effect cleanup에서 해당 목록 생명주기의 요청을 정리하는 데만 사용했습니다.
- `useAsyncLock`과 ref 잠금으로 다음 페이지 요청을 직렬화했습니다.
- sentinel이 교차하면 observer를 즉시 해제해 중복 콜백을 막고, 응답은 함수형 업데이트로 append했습니다.
- 조회 전 `null`과 조회 완료 후 빈 배열 `[]`을 구분해 로딩 화면이 빈 상태로 오인되지 않게 했습니다.

현재 측정에서 TBT는 양호했으므로 가상 스크롤을 넣지 않았습니다. 누적 DOM은 긴 목록에서 생길 수 있는 **잠재 병목**이지, 현재 확인된 병목이라고 단정하지 않습니다.

> **어필 포인트:** API를 사용했다는 사실보다 취소, 직렬화, 누적이라는 서로 다른 동시성 의미를 구분했습니다. 최적화도 실제 측정 없이 windowing부터 도입하지 않았습니다.

근거: [PR #12](https://github.com/100-hours-a-week/KTB4_Hennie_FE/pull/12), [`usePostList.js`](../src/features/posts/hook/usePostList.js), [React 학습 기록](https://app.notion.com/p/3b4b71093351805a9bd0caa764333495)

## 4. 세션 복구를 boolean이 아닌 비동기 상태로 다뤘다

### 문제와 원인

새로고침 직후에는 아직 세션을 확인하지 않았는데도 `currentUser === null`이어서 비로그인 UI가 잠깐 보이거나 보호 라우트가 잘못 이동할 수 있었습니다. 여러 요청이 동시에 토큰을 요구하면 재발급 요청도 겹칠 수 있었습니다.

### 해결

- 인증 상태를 `checking / authenticated / unauthenticated`로 분리했습니다.
- 세션 복구는 `restorePromise`, 토큰 재발급은 `refreshPromise`를 공유해 각각 한 번만 실행했습니다.
- 액세스 토큰은 메모리, refresh token은 HttpOnly cookie로 역할을 분리했습니다.
- 프로필 수정 후 Context의 사용자를 갱신해 헤더와 여러 화면을 추가 조회 없이 동기화했습니다.

`checking` 동안 전체 레이아웃을 막기 때문에 세션 복구가 느리면 공개 화면도 늦게 보이는 trade-off가 있습니다. 화면 깜빡임을 막기 위해 correctness를 우선한 현재 정책이며, 필요하면 공개 라우트만 복구와 병렬 렌더링하도록 범위를 줄일 수 있습니다.

> **어필 포인트:** 로그인 여부를 boolean으로 단순화하지 않고 초기화 상태와 요청 경쟁을 모델링했습니다. 동시에 장점만 적지 않고 공개 화면 지연이라는 비용도 명시했습니다.

근거: [`AuthProvider.jsx`](../src/shared/routes/AuthProvider.jsx), [`tokenManager.js`](../src/shared/api/tokenManager.js), [프로젝트 고도화 기록](https://app.notion.com/p/3abb71093351807ca467e3a1661ce9f5)

## 5. 배포 성공과 사용자에게 최신 화면이 보이는 것을 구분했다

### 문제와 진단

CD와 컨테이너 교체는 성공했는데 브라우저에는 이전 화면이 남았습니다. 서버의 이미지·`index.html`·번들 내용을 순서대로 확인한 결과, 오래된 `index.html`이 이전 해시의 자산을 계속 가리키는 캐시 문제가 원인이었습니다. 이후 backend 컨테이너 재생성 시 Nginx가 이전 IP를 바라보는 문제와, frontend 배포가 Compose 의존성을 따라 backend까지 건드릴 위험도 확인했습니다.

### 해결

- `index.html`은 `no-cache`, 해시가 붙은 JS/CSS는 `public, immutable`로 수명을 분리했습니다.
- Nginx가 Docker 내장 DNS를 통해 backend 주소를 다시 해석하도록 구성했습니다.
- 변수형 `proxy_pass`의 URI 처리 차이는 `rewrite`로 `/api` 접두사를 분리했습니다.
- CD는 `docker compose ... up -d --no-deps frontend`로 자기 서비스만 교체합니다.

> **어필 포인트:** “배포 성공”을 워크플로의 초록 체크로 판단하지 않고 브라우저 캐시, Nginx 프록시, Docker DNS, Compose 영향 범위까지 계층별로 확인했습니다.

근거: [`nginx.conf`](../nginx.conf), [CD workflow](../.github/workflows/cd.yml), [12주차 회고록](https://app.notion.com/p/3aab7109335180e48db4e6539bff990c)
