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
  console.log("GET");
  const paginatedData = tempData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = tempData.length;
  const resp = {"tickets": paginatedData,"len": tempData.length}

  // res.send(paginatedData);
  res.send(resp);
});

app.post(APIPath,(req, res) => {

  // @ts-ignore
  console.log("POST");
  var cloned = Object.assign({},req.body["ticket"]);
  cloned["id"] = uuidv4();

  const index = (req.body["ticket"])["id"];
  console.log("id: ", index);
  
  console.log("index: ", tempData.findIndex((t) => t.id == index));
  tempData.splice(tempData.findIndex((t) => t.id === (req.body["ticket"])["id"]),0,cloned);
  console.log("\nlen: ", tempData.length);


  // res.send(paginatedData);
  // res.send(resp);
});

app.listen(serverAPIPort);
console.log('server running', serverAPIPort)

