const express = require("express");
const fs = require("fs");
const app = express();

function logReqRes(filename) {
    return ((req, res, next) => {
        fs.appendFile(
            filename,
            `${Date.now()} : ${req.ip} ${req.method} : ${req.path}\n`,
            (err, data) => { next(); });
    });
}

module.exports = {
    logReqRes
};