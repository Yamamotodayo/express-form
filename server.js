"use strict";

import * as dotenv from 'dotenv'
dotenv.config()
import Express from "express";
import fs from "fs";
import { networkInterfaces } from "os";

const app = Express();
const PORT = process.env.PORT; // .envから読み込み
const nets = networkInterfaces();
const net = nets["Wi-Fi"]?.find((v) => v.family == "IPv4");
const ipAddress = net.address // IPアドレス取得

app.listen(PORT);
console.log(`http://localhost:${PORT}`);
console.log(`http://${ipAddress}:${PORT}`);

app.set("view engine", 'ejs');

// body-parserの設定
app.use(Express.json());
app.use(Express.urlencoded({
    extended: true
}));

app.get("/", (req, res) => {
  //   res.send('<a href="/form">goto form!</a>');
  const read = JSON.parse(fs.readFileSync("json/db.json"));
  res.render('pages/form', {"list": read});
//   console.log(req);
});

// app.get("/form", (req, res) => {
//   res .send("Hello form");
// });

app.post("/", (req, res) => {
    // console.log(req.body);

    // JSONファイルからデータの取得
    const read = JSON.parse(fs.readFileSync("json/db.json"));
    console.log(read);

    // データの編集
    const temple = {id: read.length, text: req.body["form-text"]};
    
    read.push(temple);

    console.log(read);

    // データの保存
    fs.writeFileSync("json/db.json", JSON.stringify(read));

    // console.log(req.body["form-text"]);
    res.redirect("/");
});


app.post('/delete', (req, res) => {

  let read = JSON.parse(fs.readFileSync("json/db.json"));
  console.log(read);

  read = read.filter(( item ) => {
    return item.id != req.body["delete-id"]
  })

  console.log(read);

  read = read.map((item, index) => {
    return {id: index, text: item.text}
  })

  fs.writeFileSync("json/db.json", JSON.stringify(read));

  console.log(req.body);
  res.redirect('/');

});
