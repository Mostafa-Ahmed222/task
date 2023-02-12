import { sql } from "../../../../DB/connection.js";
import { redisClient } from "./../../../../DB/connection.js";


// add offer or notification
export const addNotification = (req, res, next) => {
  const { notification } = req.body;
  sql.execute(
    `INSERT INTO Notifications (notification, traderID) VALUES ("${notification}", ${req.User.id})`,
    (err, result) => {
      if (err) {
        return next(new Error(`Query ${err}`, { cause: 500 }));
      }
      if (!result.affectedRows) {
        return res.status(400).json({ message: "failed to add" });
      }
      return res.json({ message: "Done" });
    }
  );
};

// get all notifications
// can sorting by "id", "notification", "createdAt" or "updatedAt"
export const getAllNotification = (req, res, next) => {
  const { sortedField = "createdAt", orderedBy = "ASC" } = req.query;
  sql.execute(
    `select * from Notifications where traderID = ${req.User.id} order by ${sortedField} ${orderedBy}`,
    (err, notifications) => {
      if (err) {
        return next(new Error(`Query ${err}`, { cause: 500 }));
      }
      if (!notifications.length) {
        return next(new Error("notifications Not found", { cause: 404 }));
      }
      // saving data in redis DB for 3 minutes
      redisClient.set(`notifications${req.User.id}`, JSON.stringify({ notifications }), {
        EX: 180,
        NX: true,
      });
      return res.status(200).json({ message: "Done", notifications });
    }
  );
};

// update notification data by ID
export const updateNotificationById = (req, res, next) => {
  const { id } = req.params;
  const { notification } = req.body;
  sql.execute(
    `update Notifications set notification='${notification}', updatedAt = "${new Date().toJSON()}" where traderID = ${
      req.User.id
    } and id= ${id} `,
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

// delete notification By ID
export const deleteNotificationById = (req, res, next) => {
  const { id } = req.params;
  sql.execute(
    `delete from Notifications where traderID = ${req.User.id} and id= ${id} `,
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
