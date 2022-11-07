"use strict";

import * as dotenv from 'dotenv'
dotenv.config()
import Express from "express";
import fs from "fs";
import ip from "ip";
import mysql from "mysql2";
import bodyParser from 'body-Parser';
import path from 'path';

const app = Express();
const PORT = process.env.PORT; // .envから読み込み
const ipAddress = ip.address() // IPアドレス取得
// console.log(nets);

app.listen(PORT);
console.log(`http://localhost:${PORT}`);
console.log(`http://${ipAddress}:${PORT}`);

app.set("view engine", 'ejs');

// body-parserの設定
// app.use(Express.json());
// app.use(Express.urlencoded({
//     extended: true
// }));

// app.get("/", (req, res) => {
//   //   res.send('<a href="/form">goto form!</a>');
//   const read = JSON.parse(fs.readFileSync("json/db.json"));
//   res.render('pages/form', {"list": read});
// //   console.log(req);
// });

// // app.get("/form", (req, res) => {
// //   res.send("Hello form");
// // });

// app.post("/", (req, res) => {
//     // console.log(req.body);

//     // JSONファイルからデータの取得
//     const read = JSON.parse(fs.readFileSync("json/db.json"));
//     console.log(read);

//     // データの編集
//     const temple = {id: read.length, text: req.body["form-text"]};
    
//     read.push(temple);

//     console.log(read);

//     // データの保存
//     fs.writeFileSync("json/db.json", JSON.stringify(read));

//     // console.log(req.body["form-text"]);
//     res.redirect("/");
// });


// app.post('/delete', (req, res) => {

//   let read = JSON.parse(fs.readFileSync("json/db.json"));
//   console.log(read);

//   read = read.filter(( item ) => {
//     return item.id != req.body["delete-id"]
//   })

//   console.log(read);

//   read = read.map((item, index) => {
//     return {id: index, text: item.text}
//   })

//   fs.writeFileSync("json/db.json", JSON.stringify(read));

//   console.log(req.body);
//   res.redirect('/');

// });

// ↓↓↓↓↓↓↓↓↓↓↓↓ここから↓↓↓↓↓↓↓↓↓↓↓↓

// body-parserの設定
app.use(bodyParser.urlencoded({extended: true}));


// データベース接続情報
const cone = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Yama1106',
  database: 'form',
});


// テーブルtestのデータを取得してfrom.ejsで表示
app.get('/', (req, res) => {
  cone.query(
    'SELECT * FROM test',
    (error, results) => {
      res.render('form.ejs', {test: results})
      console.log(results);
    }
  );
});

// データの追加
// const sql = "INSERT INTO test(id, text) VALUES(id, ?)"
// cone.query(sql, ['テストだよ'], (err, result, fields) => {
//   if (err) throw err;
//   console.log(result);
// })

app.get('/', (req, res) => 
  res.sendFile(path.join(__dirname, 'form.ejs'))
);

// データに追加
app.post('/', (req, res) => {
  const sql = "INSERT INTO test SET ?"
  // const sql = "INSERT INTO test(id, text) VALUES(id, ?)" // これだとデータを追加できないなぜ

  cone.query(sql, req.body, (err, result, fields) => {
    if (err) throw err;
    res.redirect('/')
  })
});


//　データの削除
// app.get('/:id', (req, res) だとダメ
app.get('/delete/:id', (req, res) => {
  const sql = "DELETE FROM test WHERE id = ?"

  cone.query(sql, [req.params.id], (err, result, fields) => {
    if (err) throw err;
    console.log(result);
    res.redirect('/')
  });
});


// データの更新
app.post('/update/:id', (req, res) => {
  const sql = "UPDATE test SET ? WHERE id = " + req.params.id

  cone.query(sql, req.body, (err, result, fields) => {
    if (err) throw err;
    console.log(result);
    res.redirect('/');
  });
});


// 更新フォーム
app.get('/edit/:id', (req, res) => {
  const sql = "SELECT * FROM test WHERE id = ?"
  cone.query(sql, [req.params.id], (err, result, fields) => {
    if (err) throw err;
    res.render('edit', {test : result})
  } )
})
