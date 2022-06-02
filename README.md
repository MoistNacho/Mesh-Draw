# Mesh Web Boilerplate

메쉬코리아의 웹 제품을 위한 기본 프로젝트

## Features

- 📸 CSR with Prerendering (using `react-snap`)
- ✂️ Code Spliting (using `React.lazy`)
- 📡 API Client generation (using `openapi-generator-cli`)
- 🔥 React Hot Loader
- 📈 Google Analytics
- 🎨 Base UI, Styletron
- 🖋️ Good Linting (using `prettier`, `eslint`, `stylelint`)
- 🤖 Automatic e2e test (using `Cypress`)
- 📟 Support IE11 (using `babel`)

## Installation

    `yarn` // same as yarn install && yarn build
    `yarn prepare` // only for development

## Commands

### `yarn start --port ${port-number}`

개발 환경으로 앱을 시작합니다. (`http://localhost:${port-number}`) `webpack-dev-server` 를 사용하며 `react-hot-loader`를 사용한 HMR 을 지원합니다.

### `yarn build`

상용 환경을 위한 앱을 `dist`에 빌드합니다. `public`에 있는 파일들이 복사되지 않으므로 배포 때 추가해줘야 합니다. `react-snap`을 이용하여 prerendered HTML 이 생성됩니다.

### `yarn generate-apis`

`scripts/generate-apis.js`에 정의된 Open API spec 문서들로부터 API Client 를 만들어서 `src/apiClients`에 저장합니다.

### `yarn redoc ${api-spec-file-path}`

Open API spec 문서를 redoc 을 사용하여 웹 브라우저에서 확인합니다. 기본 port 는 30001 로 `package.json`에 정의되어 있습니다.

## Structure Overview

- .vscode
  - VS Code 관련 설정이 있습니다.
- @types
  - navermaps 와 같은 추가 typing 이 있습니다.
- apiSpecs
  - Open API spec 파일들이 있습니다.
- cypress
  - Cypress를 이용한 e2e 테스트 파일과 관련 설정이 있습니다.
- dist
  - 빌드를 통해 생성된 파일들이 있습니다. git 으로 관리하지 않습니다.
- public
  - `robots.txt`처럼 웹서비스 root 에 공개되는 파일들이 있습니다. 빌드시 dist 로 복사되지 않습니다.
- scripts
  - `package.json`에서 사용하는 스크립트 파일들이 있습니다.
- src
  - apiClients
    - `openapi-generator-cli`에 의해 생성되는 API Client 가 있습니다. git 으로 관리하지 않습니다.
  - components
    - 앱의 여러 곳에서 사용되는 Component 들이 있습니다.
  - lib
    - 앱의 여러 곳에서 사용되는 코드들이 구조화되어 있습니다.
  - routes
    - 앱의 route 구조와 같이 각 페이지별 코드들이 있습니다.
  - stores
    - 앱의 여러 곳에서 사용되는 MobX store 가 있습니다.
  - App.tsx
    - Root Component 로 Provider 와 Router 를 포함합니다.
  - config.ts
    - 각종 설정을 가지고 있습니다. `.env`에 정의된 환경변수들이 빌드시 webpack 을 통해 삽입됩니다.
  - index.html
    - HtmlWebpackPlugin 의 template 이 되는 html 파일입니다. `${}`로 표시된 template parameters 는 `webpack.common.js`에서 삽입합니다.
  - index.tsx
    - Webpack 의 entry 파일입니다.
  - Layout.tsx
    - `<Alert />`와 같이 앱 전체에 사용되는 Component 가 있습니다.
- .env
  - `config.ts`에서 사용되는 환경변수를 정의하는 파일입니다. git 으로 관리하지 않으며 개발자 스스로 관리해야 합니다.
- .env.example
  - `.env`에서 사용되는 환경변수의 예시입니다. 여기에 정의된 환경변수가 `.env`에 없는 경우 빌드 에러가 발생합니다.
- webpack.common.js
  - Webpack 기본 설정 파일입니다. 환경에 특화된 설정은 `webpack.dev.js` 또는 `webpack.prod.js`에 쓰면 됩니다.

## Tech Stack

- Typescript
- React
  - Hooks, lazy, Suspense
  - react-helmet
  - react-hot-loader
  - react-router
- Mobx
  - mobx-react-router
- Build
  - babel
    - @babel/preset-env
    - @babel/polyfill
  - webpack
    - webpack-bundle-analyzer
    - webpack-merge
    - dotenv-webpack
    - fork-ts-checker-webpack-plugin
  - react-snap
- API
  - openapi-generator-cli
  - redoc-cli
  - whatwg-fetch
- Style
  - styled-components
  - sanitize.css
- Util
  - debug
  - loadjs
  - lodash-es
- Test
  - cypress
  - jest
- Lint
  - eslint
  - prettier
  - stylelint
- Other Dev Tools
  - patch-package
  - postinstall-postinstall
  - pre-push
  - replace-in-file
  - rimraf
  - shelljs

## clone 후에 해야 할 것들

- Github 저장소 Settings &gt; Secrets 에서 `SSH_PRIVATE_KEY`, `GPR_AUTH_TOKEN`을 설정하세요.
  - `SSH_PRIVATE_KEY`는 웹프론트엔드 팀장에게 받으시면 됩니다.
  - `GPR_AUTH_TOKEN`은 [Mesh One 프로젝트 설정](https://wiki.mm.meshkorea.net/pages/viewpage.action?pageId=62639523) 문서에 있습니다.
