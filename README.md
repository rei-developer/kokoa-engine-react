# THE KOKOA ENGINE
## RUN PROJECT
### BACKEND
- DEVELOPMENT
```
1. yarn
2. yarn start:dev
```
- PRODUCTION
```
yarn start
```
### FRONTEND
- DEVELOPMENT
```
1. yarn
2. yarn start
```
- PRODUCTION
```
1. yarn build
2. /build directory => `apache` or `nginx` index settings
```

## SYSTEM DEPENDENCY
### MySQL
* hawawa.sql => MySQL 8.0 settings
### nodemailer
* #https://codeburst.io/sending-an-email-using-nodemailer-gmail-7cfa0712a799
* .env.sample 파일을 참고하여 .env 파일 내에 smtp 설정을 완료하십시오.

## DEVELOPMENT NOTE
### Rest API
- get
  1. Auth JWT 토큰 인증 구현
  2. Profile Information 가져오기
- post
  1. Auth JWT 토큰 인증 및 로그인/로그아웃 구현