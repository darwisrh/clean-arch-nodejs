const multer = require('multer')

const uploadFile = (image) => {
  // Membuat destinasi untuk handle upload
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads")
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, ''))
    }
  })

  const fileFilter = function (req, file, cb) {
    if (file.fieldname === image) {
      if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = {
          message: 'Only image files are allowed!',
        };
        return cb(new Error('Only image files are allowed!'), false);
      }
    }
    cb(null, true);
  }

  const sizeInMb = 10
  const maxSize = sizeInMb * 1000 * 1000

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxSize
    }
  }).single(image)

  return (req, res, next) => {
    upload(req, res, (err) => {
      if (req.fileValidationError) {
        return res.status(400).send(req.fileValidationError)
      }

      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).send({
            message: 'Max file size 10MB'
          })
        }
        return res.status(400).send(err)
      }
      return next()
    })
  }
}

module.exports = {
  uploadFile
}