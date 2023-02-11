import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendEmail } from "../../../services/email.js";
import { sql } from "../../../../DB/connection.js";
// signup
export const signup = (req, res, next) => {
  const { name, storeName, email, password, phone } = req.body;
  sql.execute(
    `select email from traders where email = '${email}'`,
    (err, result) => {
      if (err) {
        return next(new Error(`Query ${err}`, { cause: 500 }));
      }
      // check existence of email
      if (result.length) {
        return next(new Error("email exist", { cause: 409 }));
      }
      // hashing password
      const hash = bcrypt.hashSync(password, +process.env.SALTROUND);
      // insert into DB
      sql.execute(
        `insert into traders (name, storeName,email, password, phone) values ('${name}', '${storeName}','${email}', '${hash}', '${phone}')`,
        (err, result) => {
          if (err) {
            return next(new Error(`Query ${err}`, { cause: 500 }));
          }
          if (!result.affectedRows) {
            return next(new Error("fail to insert", { cause: 409 }));
          }
          // generate token to confirm and reconfirm email
          const token = jwt.sign({ email }, process.env.confirmEmailToken, {
            expiresIn: "1h",
          });
          const link = `
            ${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}
            `;
          const reftoken = jwt.sign({ email }, process.env.confirmEmailToken);
          const reflink = `
            ${req.protocol}://${req.headers.host}/auth/requestEmailToken/${reftoken}
            `;
          const message = `
            <a href='${link}'>follow link to confirm your email</a>
            <br>
            <br>
            <a href='${reflink}'>follow link to Reconfirm your email</a>
            `;
          // sending to email for verification
          sendEmail(email, "Confirm Email", message);
          return res
            .status(201)
            .json({ message: "Done check your email to confirm it" });
        }
      );
    }
  );
};
// reConfirmEmail
export const reConfirmEmail = (req, res, next) => {
  const { token } = req.params;
  // check token
  const decoded = jwt.verify(token, process.env.confirmEmailToken);
  if (!decoded?.email) {
    return next(new Error("in-valid payload", { cause: 400 }));
  }
  // check Email and confirmation state of Email
  sql.execute(
    `select email, confirmEmail from traders where email = '${decoded.email}'`,
    (err, result) => {
      if (err) {
        return next(new Error(`Query ${err}`, { cause: 500 }));
      }
      if (!result.length) {
        return next(new Error("In-valid trader email", { cause: 404 }));
      }
      if (result[0].confirmEmail) {
        return next(new Error("email already confirmed", { cause: 400 }));
      }
      // send to confirmation Email
      const refToken = jwt.sign(
        { email: decoded.email },
        process.env.confirmEmailToken,
        {
          expiresIn: "2h",
        }
      );
      const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${refToken}`;
      const message = `<a href='${link}'>follow link to confirm your email</a>`;
      sendEmail(decoded.email, "ReConfirm Email", message);
      res.status(200).json({ message: "Done check your email to confirm it" });
    }
  );
};
// confirmEmail
export const confirmEmail = (req, res, next) => {
  const { token } = req.params;
  // check token
  const decoded = jwt.verify(token, process.env.confirmEmailToken);
  if (!decoded?.email) {
    return next(new Error("in-valid payload", { cause: 400 }));
  }
  // check Email and confirmation state of Email
  sql.execute(
    `select email, confirmEmail from traders where email = '${decoded.email}'`,
    (err, result) => {
      if (err) {
        return next(new Error(`Query ${err}`, { cause: 500 }));
      }
      if (!result.length) {
        return next(new Error("In-valid trader email", { cause: 404 }));
      }
      if (result[0].confirmEmail) {
        return next(new Error("email already confirmed", { cause: 400 }));
      }
      // change confirm Email status
      sql.execute(
        `update traders set confirmEmail= ${true} where email= '${
          decoded.email
        }'`,
        (err, result) => {
          if (err) {
            return next(new Error(`Query ${err}`, { cause: 500 }));
          }
          if (!result.affectedRows) {
            return next(new Error("failed to update ", { cause: 404 }));
          }
          // redirect to frontend login page
          return res.redirect(process.env.FEURL);
        }
      );
    }
  );
};
// signin
export const signin = (req, res, next) => {
  const { email, password } = req.body;
  // check email
  sql.execute(
    `select * from traders where email= '${email}'`,
    (err, result) => {
      if (err) {
        return next(new Error(`Query ${err}`, { cause: 500 }));
      }
      if (!result.length) {
        return next(new Error("In-valid trader account", { cause: 404 }));
      }
      // check confirmation of email
      if (!result[0].confirmEmail) {
        return next(new Error("Confirm your email first", { cause: 400 }));
      }
      // check password
      const match = bcrypt.compareSync(password, result[0].password);
      if (!match) {
        return next(new Error("In-Valid Account", { cause: 404 }));
      }
      // generate authentication token
      const token = jwt.sign(
        { id: result[0].id, isLoggedIn: true },
        process.env.TOKENSIGNATURE,
        { expiresIn: 60 * 60 * 24 }
      );
      return res.status(200).json({ message: "Done", token });
    }
  );
};
