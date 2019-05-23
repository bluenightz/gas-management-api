const UPLOAD_FOLDER = __dirname + '/../../public/upload/csv/'
const mime = require('mime')
const crypto = require('crypto');
const multer = require('multer')

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, UPLOAD_FOLDER)
	},
	filename: (req, file, cb) => {
		crypto.pseudoRandomBytes(16, function (err, raw) {
			cb(null, raw.toString('hex') + '.' + mime.extension(file.mimetype));
		})
	}
})

const upload = multer({ 
	storage,
	limits: {
		fileSize: 10 * (1000) * 1000 
	},
	fileFilter: (req, file, cb) => {
		if( mime.extension(file.mimetype) === "csv" ) {
			cb(null, true)
		}
		else {
			cb(new Error(`Please upload only .csv file`))
		}
	}
})
.single('importFile')

module.exports = upload