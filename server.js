const express = require('express');
const bodyParser = require('body-parser');
const connect = require('./models/index');
const util = require('./lib/utility');

const drugHandler = require('./lib/drugHandler');
const familyHandler = require('./lib/familyHandler');
const signHandler = require('./lib/signHandler');


const app = express();

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.post('/login', signHandler.loginForm); // 앱 시동시 시작 지점
app.post('/signup', signHandler.signupForm); // 화원가입


app.post('/drug', util.verifyToken, drugHandler.drugCreate); // 새로운 약 등록

app.get('/drug/:id', drugHandler.drugGet); // 특정 약 정보 보여주기
app.post('/drug/:id', drugHandler.drugUpdate); // 특정 약 수정
app.delete('/drug/:id', drugHandler.drugDelete); // 특정 약 삭제


app.get('/family', util.verifyToken, familyHandler.familyListUp); // 로그인 후 보여지는 가족 목록
app.post('/family', util.verifyToken, familyHandler.familyAdd); // 새로운 가족 추가

app.get('/family/:id', util.verifyToken, familyHandler.familyDrugGet); // 특정 가족의 맴버, 나의 약과 가족 약 정보
app.post('/family/:id', util.verifyToken, familyHandler.familyMemberAdd); // 특정 가족에 맴버 추가
app.delete('/family/:id', util.verifyToken, familyHandler.familySelfout); // 특정 가족에서 내가 나가기
app.delete('/family/:user/:id', util.verifyToken, familyHandler.familyDelete); // 가족 폭파

app.listen(app.get('port'), () => {
  console.log('listening on ' + app.get('port'));
});
