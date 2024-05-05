const express = require("express");
const fs = require("fs");
const router = require("./app/controllers/router");

let app = express();
let puerto = 3000;

app.use(express.json());
app.use(router);
app.use(express.static("app"));
app.use("/views", express.static("views"));
app.use("/views_scripts", express.static("views"));
app.use("/img", express.static("img"));
app.use("/Styles", express.static("Styles"));


app.listen(puerto, () => {
    console.log("Practica 3 puerto:" + puerto);
});
