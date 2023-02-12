import xlsx from "xlsx";
import { sql } from "../../../../DB/connection.js";
import { redisClient } from "./../../../../DB/connection.js";
import paginate from "../../../services/paginate.js";
import path from "path";
import { fileURLToPath } from "url";
import { Worker } from "worker_threads";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// add client manually or add clients by excel sheet
export const addClients = (req, res, next) => {
  // check sending of excel sheet
  if (req.file) {
    const worker = new Worker(
      path.join(__dirname, "../../../services/worker.js")
    );
    // avoid blocking of event loop
    worker.postMessage({type: "addClient", authId: req.User.id, path: req.file.path});
    worker.on("message", (data) => {
      return res.status(201).json({ message: `${data}` });
    });
    worker.on("error", (err) => {
      return res.status(400).json({ message: "error", err });
    });
  } else {
    // add client manually
    const { Code, Email, Name, Address, City } = req.body;
    sql.execute(
      `INSERT INTO clients (Code, Email, Name, Address, City, traderID) VALUES ("${Code}", "${Email}", "${Name}", "${Address}", "${City}", ${req.User.id})`,
      (err, result) => {
        if (err) {
          return next(new Error(`Query ${err}`, { cause: 500 }));
        }
        if (!result.affectedRows) {
          return res.status(400).json({ message: "failed to add" });
        } else {
          return res.json({ message: "Done" });
        }
      }
    );
  }
};

// get all clients and using of redis DB
// can sorting by "id", "Code", "Email","Name","Address","City", "createdAt" or "updatedAt"
export const getAllClients = (req, res, next) => {
  const {
    page,
    size,
    sortedField = "createdAt",
    orderedBy = "ASC",
  } = req.query;
  const { skip, limit } = paginate({ page, size });
  sql.execute(
    `select * from clients where traderID = ${req.User.id} order by ${sortedField} ${orderedBy}`,
    (err, clients) => {
      if (err) {
        return next(new Error(`Query ${err}`, { cause: 500 }));
      }
      if (!clients.length) {
        return next(new Error("clients Not found", { cause: 404 }));
      }
      clients = clients.slice(skip, limit);
      // saving data in redis DB for 3 minutes
      redisClient.set(`clients${req.User.id}`, JSON.stringify({ clients }), {
        EX: 180,
        NX: true,
      });
      return res.status(200).json({ message: "Done", clients });
    }
  );
};
// search for clients by "id","Code","Email","Name","Address" or "City"
export const searchClients = (req, res, next) => {
  const { page, size, field, key } = req.query;
  const { skip, limit } = paginate({ page, size });
  sql.execute(
    `select * from clients where traderID = ${req.User.id} and clients.${field} like '${key}%' `,
    (err, clients) => {
      if (err) {
        return next(new Error(`Query ${err}`, { cause: 500 }));
      }
      if (!clients.length) {
        return next(new Error("clients Not found", { cause: 404 }));
      }
      clients = clients.slice(skip, limit);
      return res.status(200).json({ message: "Done", clients });
    }
  );
};

// update client data by ID
export const updateClientById = (req, res, next) => {
  const { id } = req.params;
  const { Code, Email, Name, Address, City } = req.body;
  sql.execute(
    `update clients set Code='${Code}', Email = "${Email}", Name = '${Name}', Address = '${Address}', City = '${City}', updatedAt = "${new Date().toJSON()}" where traderID = ${
      req.User.id
    } and clients.id= ${id} `,
    (err, result) => {
      if (err) {
        return next(new Error(`Query ${err}`, { cause: 500 }));
      }
      if (!result.affectedRows) {
        return next(new Error("in-valid Data", { cause: 404 }));
      }
      return res.status(200).json({ message: "Done" });
    }
  );
};

// delete client By ID
export const deleteClientById = (req, res, next) => {
  const { id } = req.params;
  sql.execute(
    `delete from clients where traderID = ${req.User.id} and id= ${id} `,
    (err, result) => {
      if (err) {
        return next(new Error(`Query ${err}`, { cause: 500 }));
      }
      if (!result.affectedRows) {
        return next(new Error("in-valid Data", { cause: 404 }));
      }
      return res.status(200).json({ message: "Done" });
    }
  );
};
