import express from 'express';
import bodyParser = require('body-parser');
import { tempData } from './temp-data';
import { serverAPIPort, APIPath } from '@fed-exam/config';
const { v4: uuidv4 } = require('uuid');


console.log('starting server', { serverAPIPort, APIPath });

const app = express();

const PAGE_SIZE = 20;

app.use(bodyParser.json());

app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

app.get(APIPath, (req, res) => {

  // @ts-ignore
  const page: number = req.query.page || 1;
  const paginatedData = tempData.slice(0, page * PAGE_SIZE);
  const totalPages = Math.ceil(tempData.length/PAGE_SIZE);
  const resp = {"tickets": paginatedData,"len": tempData.length, "pages": totalPages}
  res.send(resp);
});

app.post(APIPath,(req, res) => {

  var cloned = Object.assign({},req.body["ticket"]);
  cloned["id"] = uuidv4();
  const index = (req.body["ticket"])["id"];
  tempData.splice(tempData.findIndex((t) => t.id === (req.body["ticket"])["id"]),0,cloned);
  res.send();
});

app.listen(serverAPIPort);
console.log('server running', serverAPIPort)

