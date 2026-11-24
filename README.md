# 이야기 재잘재잘 🦖

> 아기 공룡 뚜뚜와 함께 이야기를 듣고, 편하게 재잘재잘 따라 말하는 동화 앱이에요.

말을 천천히 하는 연습을 하는 유아를 위한 동화 앱입니다.
동화를 **느긋한 속도로 읽어 주고**, 반복 구절을 **같이 말하고**, **후~ 불기** 놀이로 입 근육을 쓰게 해요.

- 기술: React 19 + Vite + TypeScript, PWA(vite-plugin-pwa), Capacitor(아이폰·안드로이드 앱)
- 그림: 모든 일러스트를 SVG 코드로 직접 그렸어요 (외부 이미지·저작권 캐릭터 없음)
- 개인정보: 서버 없이 기기 안에만 저장 (이름, 설정, 저장한 동화). 마이크는 소리 크기만 재고 녹음하지 않아요.

## 실행

```bash
npm install
npm run dev        # 같은 와이파이의 폰에서 http://<내 PC IP>:5173 로 열어 보기
npm run build      # dist/ 생성
npm run preview
```

## 폴더 구조

```
src/
  art/art.ts              배경 7종, 캐릭터·소품 25종, 장면 조립(sceneSVG)
  data/types.ts           Story / Page / Settings 타입
  data/stories.ts         기본 동화 3편
  lib/speech.ts           내레이션 엔진 (문장 단위 읽기, 쉬기, 중단 토큰)
  lib/mic.ts              후~ 불기용 마이크 소리 크기
  lib/storage.ts          localStorage 래퍼
  services/storyApi.ts    동화 생성 API 클라이언트 (3단계 서버)
  services/storyClean.ts  AI 응답 검사·정리
  components/Scene.tsx, BlowButton.tsx
  screens/Home, Library, Reader, CarMode, Maker, SettingsPanel
docs/story-prompt.md      서버에서 쓸 동화 생성 프롬프트
```

## 로드맵

### 1단계: PWA로 배포 (지금)
1. GitHub에 올리고 Vercel(또는 Netlify)에 연결 → `npm run build`, 출력 폴더 `dist`
2. 아이가 쓸 폰에서 주소 열기
   - **아이폰**: Safari → 공유 → "홈 화면에 추가"
   - **안드로이드**: Chrome → 메뉴 → "앱 설치" (또는 "홈 화면에 추가")
3. 한 번 열면 오프라인에서도 동작해요 (차 안에서도 OK)

한계: 화면이 꺼지면 읽기가 멈출 수 있어요 (특히 아이폰).

### 2단계: Capacitor로 앱 만들기
```bash
npx cap add android
npx cap add ios          # Mac에서
npm run cap:sync         # 웹 빌드 → 네이티브 프로젝트로 복사
npm run cap:android      # Android Studio 열기 → APK 빌드
npm run cap:ios          # Xcode 열기
```
- 추가할 플러그인 후보: 네이티브 TTS(`@capacitor-community/text-to-speech`), 화면 켜두기(`@capacitor-community/keep-awake`),
  백그라운드 오디오(가족 녹음 파일 재생). `lib/speech.ts`만 바꾸면 나머지 화면은 그대로예요.
- 권한: Android `RECORD_AUDIO`, iOS `NSMicrophoneUsageDescription` ("후~ 불기 소리 크기를 재는 데만 써요")
- 설치
  - **안드로이드(가족용)**: 서명한 APK 파일을 보내서 설치 (설정에서 "출처를 알 수 없는 앱" 허용)
  - **아이폰(가족용)**: Mac의 Xcode로 무료 설치 가능하지만 무료 계정은 7일마다 다시 설치해야 해요.
    Apple Developer Program(연 99달러)에 가입하면 TestFlight로 보내거나 1년짜리 서명을 쓸 수 있어요.

### 3단계: 동화 생성 서버 (ASP.NET Core)
- `POST /api/stories` `{ words: string[], childName: string }` → `{ title, pages[] }`
- 서버가 Claude API 키를 보관하고 `docs/story-prompt.md` 프롬프트로 호출
- 요청 제한, 응답 검사, 로그에서 개인정보 제외
- 앱 `.env`에 `VITE_STORY_API_URL=https://...` 설정

### 4단계: 스토어 공개 (선택)
- Google Play: 등록비 25달러(1회). 2023-11-13 이후 만든 개인 계정은 테스터 12명 이상이 14일 연속 참여하는 비공개 테스트를 거쳐야 출시 가능
- 아동 대상 앱 정책(Google Play 가족 정책, App Store 키즈 카테고리): 광고·추적 SDK 금지, 개인정보처리방침, 보호자 확인 화면
