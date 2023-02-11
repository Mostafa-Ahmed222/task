const dataMethods = ["body", "query", "params", "headers"];

const validation = (Schema) => {
  return (req, res, next) => {
    try {
      const validationArr = [];
      dataMethods.forEach((key) => {
        // check validation
        if (Schema[key]) {
          const validationResult = Schema[key].validate(req[key], {
            abortEarly: false,
          });
          if (validationResult?.error?.details) {
            // push validation error in array
            validationArr.push(validationResult.error.details);
          }
        }
      });
      //check validation errors
      if (validationArr.length) {
        return res
          .status(400)
          .json({ message: "Validation error", validationArr });
      } else {
        return next();
      }
    } catch (error) {
      return res.status(500).json({
        message: "catch error",
        error: error.message,
      });
    }
  };
};
export default validation;
