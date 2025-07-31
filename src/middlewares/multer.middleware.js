import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "uploads/");
    },
    filename: function(req, file, callback) {
        const ext = path.extname(file.originalname);
        const uniqueName = uuidv4() + ext;
        callback(null, uniqueName);
    }
});

const upload = multer({ storage });

export default upload;
