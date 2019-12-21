"use strict";

const {
  cluster: { isMaster, setupWorkerProcesses }
} = require("./server");

if (isMaster) {
  setupWorkerProcesses();
} else {
  const { errorHandler } = require("./utils");
  const { startServer } = require("./server");
  const { db, databaseVersion } = require("./database");

  db.createConn()
    .then(databaseVersion.load)
    .then(startServer)
    .catch(errorHandler);
}
