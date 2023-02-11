import { sql } from "../../DB/connection.js";
import schedule from "node-schedule";
import { createReport } from "./createReport.js";
import { sendEmail } from "./email.js";

//set directory dirname
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// send a scheduled notifications and offers for clients at the end of the month
export function sendOffers() {
  schedule.scheduleJob("0 0 0 28 * *", () => {
    // get notification details
    sql.execute(
      `SELECT N.notification, N.traderId , T.storeName FROM Notifications AS N INNER JOIN traders as T ON T.id = N.traderID`,
      (err, notifications) => {
        if (err) {
          return 0;
        }
        for (const { notification, storeName, traderId } of notifications) {
          // get client emails
          sql.execute(
            `select Email from clients where traderID=${traderId}`,
            async (err, emails) => {
              if (err) {
                return 0;
              }
              // sending notification
              for (const { Email } of emails) {
                const message = `<p>${notification}</p>`;
                await sendEmail(Email, storeName, message);
              }
            }
          );
        }
      }
    );
  });
}

// send daily report
export function dailyReports() {
  schedule.scheduleJob("0 55 23 * * *", () => {
    // get traders details
    sql.execute(`select id, email from traders`, (err, traders) => {
      if (err || !traders.length) {
        return 0;
      }
      // ${new Date(`${new Date().toLocaleDateString()}, 0:00:00 AM`).toJSON()}
      for (const { id, email } of traders) {
        const report = {};
        // get orders details
        sql.execute(
          `select o.*, t.storeName, t.email as treaderEmail, t.phone as traderPhone , c.Name, c.Address, p.code as productCode from orders as o INNER JOIN products as p ON p.id=o.productID INNER JOIN
          clients as c ON c.id=o.clientID INNER JOIN
           traders as t ON t.id=o.traderID WHERE o.traderID=${id} and o.createdAt > "${new Date(`${new Date().toLocaleDateString()}, 0:00:00 AM`).toJSON()}"`,
          (err, orders) => {
            if (err) {
              return 0;
            }
            report.orders = orders;
            // get products details with Zero Quantity
            sql.execute(
              `select Code, Name, Category, Trademark, updatedAt from products WHERE traderID=${id} and quantity=0`,
              async (err, products) => {
                if (err) {
                  return 0;
                }
                report.products = products;
                // creation of report
                createReport(
                  report,
                  path.join(__dirname, `../../reports/report${id}.pdf`)
                );
                // sending report
                const message = `<h3>daily report of ${new Date().toString()}</h3>`;
                const attachments = [
                  {
                    filename: `DailyReport.pdf`,
                    path: path.join(__dirname, `../../reports/report${id}.pdf`),
                    contentType: "application/pdf",
                  },
                ];
                await sendEmail(
                  email,
                  `daily Report of your store`,
                  message,
                  attachments
                );
              }
            );
          }
        );
      }
    });
  });
}

