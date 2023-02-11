import { sql } from "../../../../DB/connection.js";
import paginate from "../../../services/paginate.js";
import { redisClient } from "./../../../../DB/connection.js";

// creating order
export const createOrder = (req, res, next) => {
  const { clientID, productID, Quantity } = req.body;
  // checking of client id
  sql.execute(
    `select * from clients where id = ${clientID} and traderID=${req.User.id}`,
    (err, clients) => {
      if (err) {
        return next(new Error(`Query ${err}`, { cause: 500 }));
      }
      if (!clients.length) {
        return next(
          new Error(`in-Valid client id`, {
            cause: 404,
          })
        );
      }
    }
  );
  // checking of productID , Quantity
  sql.execute(
    `select Quantity FROM products WHERE id = ${productID} and traderID=${req.User.id}`,
    (err, products) => {
      if (err) {
        return next(new Error(`Query ${err}`, { cause: 500 }));
      }
      if (!products.length) {
        return next(
          new Error(`in-Valid product id`, {
            cause: 404,
          })
        );
      }
      if (!products[0].Quantity) {
        return next(
          new Error(`There is no available quantity of the product`, {
            cause: 409,
          })
        );
      }
      if (Quantity > products[0].Quantity) {
        return next(
          new Error(
            `Order Quantity must be smaller than or equal Product Quantity`,
            {
              cause: 409,
            }
          )
        );
      }
      // creation of order
      sql.execute(
        `INSERT INTO orders (clientID, productID, Quantity, traderID) VALUES (${clientID}, ${productID}, ${Quantity}, ${req.User.id})`,
        (err, result) => {
          if (err) {
            return next(new Error(`Query ${err}`, { cause: 500 }));
          }
          if (!result.affectedRows) {
            return next(new Error(`failed to create order `, { cause: 400 }));
          }
          // update quantity of product
          sql.execute(
            `update Products set Quantity= (${
              products[0].Quantity - Quantity
            }), updatedAt = "${new Date().toJSON()}" WHERE id = ${productID} and traderID=${
              req.User.id
            }`,
            (err, product) => {
              if (err) {
                return next(new Error(`Query ${err}`, { cause: 500 }));
              }
              if (!product.affectedRows) {
                return next(
                  new Error(`failed to update product after create order`, {
                    cause: 409,
                  })
                );
              }
              return res.status(201).json({ message: "Done" });
            }
          );
        }
      );
    }
  );
};

// get orders and using of redis DB
// can sorting by "id", "clientID", "clientCode", "productID", "Quantity", "clientEmail", "clientName", "Address", "productCode", "productName", "createdAt" or "updatedAt"
export const getOrders = (req, res, next) => {
  const {
    page,
    size,
    sortedField = "createdAt",
    orderedBy = "ASC",
  } = req.query;
  const { skip, limit } = paginate({ page, size });
  sql.execute(
    `select o.*, c.code as clientCode ,c.Email as clientEmail, c.Name as clientName, c.Address, p.code as productCode, p.Name as productName from orders as o INNER JOIN products as p ON p.id=o.productID INNER JOIN clients as c ON c.id=o.clientID INNER JOIN traders as t ON t.id=o.traderID WHERE o.traderID=${req.User.id} order BY ${sortedField} ${orderedBy};`,
    (err, orders) => {
      if (err) {
        return next(new Error(`Query ${err}`, { cause: 500 }));
      }
      if (!orders.length) {
        return next(new Error("orders Not found", { cause: 404 }));
      }
      orders = orders.slice(skip, limit);
      // saving data in redis DB for 3 minutes
      redisClient.set("orders", JSON.stringify({ orders }), {
        EX: 180,
        NX: true,
      });
      return res.status(200).json({ message: "Done", orders });
    }
  );
};

// search for orders by "clientID", "productID", "clientEmail","Address" or "City"
export const searchOrders = (req, res, next) => {
  const { page, size, field, key } = req.query;
  const { skip, limit } = paginate({ page, size });
  sql.execute(
    `select o.*, c.code as clientCode ,c.Email as clientEmail, c.Name as clientName, c.Address, c.City, p.code as productCode, p.Name as productName from orders as o INNER JOIN products as p ON p.id=o.productID INNER JOIN
    clients as c ON c.id=o.clientID INNER JOIN traders as t ON t.id=o.traderID WHERE o.traderID=${req.User.id} and ${field} like '${key}%'
    `,
    (err, orders) => {
      if (err) {
        return next(new Error(`Query ${err}`, { cause: 500 }));
      }
      if (!orders.length) {
        return next(new Error("orders Not found", { cause: 404 }));
      }
      orders = orders.slice(skip, limit);
      return res.status(200).json({ message: "Done", orders });
    }
  );
};

// delete order by id
export const deleteOrderById = (req, res, next) => {
  const { id } = req.params;
  sql.execute(
    `delete from orders where traderID = ${req.User.id} and id= ${id} `,
    (err, order) => {
      if (err) {
        return next(new Error(`Query ${err}`, { cause: 500 }));
      }
      if (!order.affectedRows) {
        return next(new Error("in-valid Data", { cause: 404 }));
      }
      return res.status(200).json({ message: "Done" });
    }
  );
};
