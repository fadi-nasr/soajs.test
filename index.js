'use strict';
const soajs = require('soajs');
const config = require('./soa.json');
config.packagejson = require("./package.json");
const service = new soajs.server.service(config);
const coreModules = require("soajs");
const provision = coreModules.provision;
const express = require('express');

const sApp = express();
const mApp = express();

function startServer(serverConfig, callback) {
    let mReply = {
        'result': true,
        'ts': Date.now(),
        'service': {
            'service': serverConfig.name,
            'type': 'rest',
            'route': "/heartbeat"
        }
    };
    let sReply = {
        'result': true,
        'data': {
            'firstname': "test",
            'lastname': "service",
            'type': "endpoint"
        }
    };

    sApp.get('/', (req, res) => res.json(sReply));
    mApp.get('/heartbeat', (req, res) => res.json(mReply));

    sApp.patch("/testPatch", (req, res) => {
        return res;
    });

    sApp.head("/testHead", (req, res) => {
        return res;
    });

    sApp.options("/testOther", (req, res) => {
        return res;
    });

    let sAppServer = sApp.listen(serverConfig.s.port, () => console.log(`${serverConfig.name} service listening on port ${serverConfig.s.port}!`));
    let mAppServer = mApp.listen(serverConfig.m.port, () => console.log(`${serverConfig.name} service listening on port ${serverConfig.m.port}!`));

    return callback(
        {
            "sAppServer": sAppServer,
            "mAppServer": mAppServer,
            "name": serverConfig.name
        }
    )
}

function stopServer(config) {
    console.log("Stopping server");

    config.mAppServer.close((err) => {
        console.log("...sAppServer: " + config.name);
    });

    config.sAppServer.close((err) => {
        console.log("...mAppServer: " + config.name);
    });
}

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

    // startServer({s: {port: 4010}, m: {port: 5010}, name: "test"},  () => {});

    service.get("/testGet", (req, res) => {
        return res;
    });

    service.post("/testPost", (req, res) => {
        return res;
    });

    service.put("/testPut", (req, res) => {
        return res;
    });

    service.delete("/testDelete", (req, res) => {
        return res;
    });

    service.put("/testPut", (req, res) => {
        return res;
    });

    // service.start();
});

module.exports = {
    startServer: startServer,
    stopServer: stopServer
};