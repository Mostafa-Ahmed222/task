import xlsx from "xlsx";
import { sql } from "../../../../DB/connection.js";
import paginate from "../../../services/paginate.js";
import { redisClient } from "./../../../../DB/connection.js";
import path from "path";
import { fileURLToPath } from "url";
import { Worker } from "worker_threads";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// add product manually or add products by excel sheet
export const addProduct = (req, res, next) => {
  // check sending of excel sheet
  if (req.file) {
    // avoid blocking of event loop
    const worker = new Worker(
      path.join(__dirname, "../../../services/worker.js")
    );
    worker.postMessage({type: "addProduct", authId: req.User.id, path: req.file.path});
    worker.on("message", (data) => {
      return res.status(201).json({ message: `${data}`});
    });
    worker.on("error", (err) => {
      return res.status(400).json({ message: "error", err });
    });
  } else {
    // add client manually
    const { Code, Name, Quantity, Description, Category, Trademark } = req.body;
    sql.execute(
      `INSERT INTO products (Code, Name, Quantity, Description, Category, Trademark, traderID) VALUES ("${Code}", "${Name}", ${Quantity}, "${Description}", "${Category}", "${Trademark}", ${req.User.id})`,
      (err, result) => {
        if (err) {
          return next(new Error(`Query ${err}`, { cause: 500 }));
        }
        if (!result.affectedRows) {
          return res.status(400).json({ message: "failed to add product" });
        } else {
          return res.json({ message: "Done" });
        }
      }
    );
  }
};

// get all products and using of redis DB
// can sorting by "id", "Code","Name","Quantity","Description","Category", "Trademark", "createdAt" or "updatedAt"
export const getAllProducts = (req, res, next) => {
  const {
    page,
    size,
    sortedField = "createdAt",
    orderedBy = "ASC",
  } = req.query;
  const { skip, limit } = paginate({ page, size });
  sql.execute(
    `select * from products where traderID = ${req.User.id} order by ${sortedField} ${orderedBy}`,
    (err, products) => {
      if (err) {
        return next(new Error(`Query ${err}`, { cause: 500 }));
      }
      if (!products.length) {
        return next(new Error("Products Not found", { cause: 404 }));
      }
      products = products.slice(skip, limit);
      // saving data in redis DB for 3 minutes
      redisClient.set("products", JSON.stringify({ products }), {
        EX: 180,
        NX: true,
      });
      return res.status(200).json({ message: "Done", products });
    }
  );
};

// search for products by "id", "Code", "Name", "Quantity", "Description", "Category" or "Trademark"
export const searchProducts = (req, res, next) => {
  const { page, size, field, key } = req.query;
  const { skip, limit } = paginate({ page, size });
  sql.execute(
    `select * from products where traderID = ${req.User.id} and products.${field} like '${key}%' `,
    (err, products) => {
      if (err) {
        return next(new Error(`Query ${err}`, { cause: 500 }));
      }
      if (!products.length) {
        return next(new Error("Products Not found", { cause: 404 }));
      }
      products = products.slice(skip, limit);
      return res.status(200).json({ message: "Done", products });
    }
  );
};

// update product data by ID
export const updateProductById = (req, res, next) => {
  const { id } = req.params;
  const { Code, Name, Quantity, Description, Category, Trademark } = req.body;
  sql.execute(
    `update products set Code='${Code}' ,Name = '${Name}', Quantity = ${Quantity}, Description = '${Description}', Category = '${Category}', Trademark = '${Trademark}', updatedAt = "${new Date().toJSON()}" where traderID = ${
      req.User.id
    } and products.id= ${id} `,
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

// update Quantities from excel sheet
export const updateQuantities = (req, res, next) => {
  // check sending of excel sheet
  if (req.file) {
    // avoid blocking of event loop
    const worker = new Worker(
      path.join(__dirname, "../../../services/worker.js")
    );
    worker.postMessage({type: "updateProduct", authId: req.User.id, path: req.file.path});
    worker.on("message", (data) => {
      return res.status(201).json({ message: `${data}` });
    });
    worker.on("error", (err) => {
      return res.status(400).json({ message: "error", err });
    });
  } else {
    return next(new Error("Excel file is required", { cause: 400 }));
  }
};

// delete product By ID
export const deleteProductById = (req, res, next) => {
  const { id } = req.params;
  sql.execute(
    `delete from products where traderID = ${req.User.id} and id= ${id} `,
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
