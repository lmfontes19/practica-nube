const express = require("express");
const fs = require("fs");
const http = require("http");
const router = require("./app/controllers/router");
const dotenv = require('dotenv');

let app = express();

dotenv.config();

app.use(express.json());
app.use(router);
app.use(express.static("app"));
app.use("/views", express.static("views"));
app.use("/views_scripts", express.static("views"));
app.use("/img", express.static("img"));
app.use("/Styles", express.static("Styles"));

const serverHttp = http.createServer(app);
serverHttp.listen(process.env.HTTP_PORT, process.env.IP);
serverHttp.on('listening', () => console.info(`Notes App running at http://${process.env.IP}:${process.env.HTTP_PORT}`));
