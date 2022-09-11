const express = require('express');
const app = express();
const vipLogin = require('./vip_login.json');

app.all('*',(req, res, next)=> {
  res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST'); 
  res.setHeader("Content-Type", "application/json;charset=utf-8");
  next();
});

app.get('/teambition', (req, res)=> {
  console.log('请求\n',req);
  

console.log('参数参数参数参数参数参数\n',req.url);

console.log('参数参数参数参数\n',req.query);

  res.send(vipLogin);
}); 
app.post('/create', (req, res)=> {
  console.log(req);
  res.send({
    id: new Date().valueOf() + ((Math.random() * 100000) | 0)
  });
}); 
app.post('/update', (req, res)=> {
  console.log(req);
  res.send({
    id: new Date().valueOf() + ((Math.random() * 100000) | 0)
  });
}); 
app.put('/put', (req, res)=> {
  console.log(req);
  res.send({
    "id": new Date().valueOf() + ((Math.random() * 100000) | 0)
  });
}); 
app.delete('/del', (req, res)=> {
  console.log(req);
  res.send({
    "id": new Date().valueOf() + ((Math.random() * 100000) | 0)
  });
}); 

app.listen(3300, ()=> {
  console.log('服务器运行在3300');
})