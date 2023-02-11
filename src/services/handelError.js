// setup global Handeling error
  export const globalError = (err, req, res, next)=>{
    if (err) {
      if (process.env.MOOD == 'dev') {
        typeof(err) === 'string' ? res.status(400).json({message: err}) :
          res.status(err['cause'] || 500).json({message: err.message, stack: err.stack})
      } else {
        //check if an error are string without status code such as multer error
        typeof(err) === 'string' ? res.status(400).json({message: err}) :
          res.status(err['cause'] || 500).json({message: err.message})
      }
    }
  }
