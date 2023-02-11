import multer from "multer";

// set mimetype
export const fileValidation = {
  image: ["image/png", "image/jpeg", "image/gif"],
  pdf: ["application/pdf"],
  excel: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
};

// generation of multer
export function myMulter(customValidation = fileValidation.excel) {
  const storage = multer.diskStorage({});

  function fileFilter(req, file, cb) {
    if (customValidation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb("invalid format", false);
    }
  }
  const upload = multer({ fileFilter, storage });
  return upload;
}
