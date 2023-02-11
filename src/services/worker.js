import { parentPort } from "worker_threads";
import { sql } from "../../DB/connection.js";
import xlsx from "xlsx";

parentPort.on("message", ({ type, authId, path }) => {
  try {
    // convert excel data
    const workbook = xlsx.readFile(path);
    const workSheet = workbook.Sheets[workbook.SheetNames[0]];
    const range = xlsx.utils.decode_range(workSheet["!ref"]);
    for (let row = range.s.r + 1; row <= range.e.r; row++) {
      const data = [];
      for (let col = range.s.c; col <= range.e.c; col++) {
        let cell = workSheet[xlsx.utils.encode_cell({ r: row, c: col })];
        data.push(cell.v);
      }
      // insert rows in DB
      if (type == "addClient") {
        // add clients in DB
        sql.execute(
          `INSERT INTO clients (Code, Email, Name, Address, City, traderID) VALUES (?, ?, ?, ?, ?, ${authId})`,
          data,
          (err, result) => {
            if (err) {
              return 0;
            }
          }
        );
      } else if (type == "addProduct") {
        // add product in DB
        sql.execute(
          `INSERT INTO products (Code, Name, Quantity, Description, Category, Trademark, traderID) VALUES (?, ?, ?, ?, ?, ?, ${authId})`,
          data,
          (err, result) => {
            if (err) {
              return 0;
            }
          }
        );
      } else if (type == "updateProduct") {
        // reverse data of row
        data.reverse();
        // update products quantities in DB
        sql.execute(
          `update products set Quantity= ?, updatedAt = "${new Date().toJSON()}" where traderID = ${
            authId
          } and products.Code= ?`,
          data,
          (err, result) => {
            if (err) {
              return 0;
            }
          }
        );
      }
    }
    return parentPort.postMessage("Done");
  } catch (error) {
    return parentPort.postMessage("failed to insert data");
  }
});
