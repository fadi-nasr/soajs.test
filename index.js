'use strict';
const soajs = require('soajs');
const config = require('./config.js');
config.packagejson = require("./package.json");
const service = new soajs.server.service(config);
const coreModules = require("soajs");
const provision = coreModules.provision;

service.init(function () {
    let reg = service.registry.get();

    let dbConfig = reg.coreDB.provision;
    if (reg.coreDB.oauth) {
        dbConfig = {
            "provision": reg.coreDB.provision,
            "oauth": reg.coreDB.oauth
        };
    }
    provision.init(dbConfig, service.log);

    service.get("/testGet", function(req, res) {
        return res;
    });

    service.post("/testPost", function(req, res) {
        return res;
    });

    service.put("/testPut", function(req, res) {
        return res;
    });

    service.delete("/testDelete", function(req, res) {
        return res;
    });

    service.start();
});