const { Router } = require('express')
const multer = require("multer");
const path = require("path");

const fileController = require("../controllers/fileController");

const router = Router();

const storage = multer.memoryStorage({
    destination: (req, file, cb) => {
        cb(null, "public/files");
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + "_" + path.extname(file.originalname));
    }
})

const upload = multer({ storage: storage });

router.post('/', upload.single("upload_file"), fileController.post_file);


module.exports = router;