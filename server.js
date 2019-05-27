const express = require('express')
const bodyParser = require('body-parser')
const db = require('./src/queries')
const app = express()
const port = process.env.PORT || 3000;
const cors = require('cors')

app.use(cors())
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if ('OPTIONS' == req.method) {
     res.sendStatus(200);
   }
   else {
     next();
}});

app.get('/', function(req, res) {
    res.send('Homepage')
})

app.post('/machine/code', db.saveCode)

app.get('/client/scan', db.afterScan)
app.post('/client/login', db.login)
app.post('/client/signup', db.signup)
app.get('/client/user/points', db.getPoints)
app.get('/client/codes', db.getAvailableCodes)
app.post('/client/user/get/code', db.redimPoints)

app.get('/client/user/get/code/used', db.getUsedCodes)

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  })