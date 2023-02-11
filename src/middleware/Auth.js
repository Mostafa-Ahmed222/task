import jwt from "jsonwebtoken";
import { sql } from "../../DB/connection.js";

export const auth = () => {
  return (req, res, next) => {
    const { authorization } = req.headers;
    // checking of Bearer Key
    if (!authorization.startsWith(process.env.BearerKey)) {
      return next(
        new Error("In-valid token or In-valid bearer key", { cause: 400 })
      );
    }
    const token = authorization.split(process.env.BearerKey)[1];
    const decoded = jwt.verify(token, process.env.TOKENSIGNATURE);
    // verification of token
    if (!decoded?.id || !decoded?.isLoggedIn) {
      return next(new Error("in-valid payload", { cause: 400 }));
    }
    // check authentication data
    sql.execute(
      `select id, email, name,confirmEmail from traders where id= '${decoded.id}'`,
      (err, result) => {
        if (err) {
          return next(new Error(`Query ${err}`, { cause: 500 }));
        }
        if (!result.length) {
          return next(new Error("Un-authorized user", { cause: 403 }));
        }
        if (!result[0].confirmEmail) {
          return next(new Error("Confirm your email first", { cause: 400 }));
        }
        req.User = result[0];
        return next();
      }
    );
  };
};
