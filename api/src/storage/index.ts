import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/tmp/SCBM/images')
    },
    filename: (req, file, cb) => {
        if(!fs.existsSync('/tmp/SCBM/images/'+req.user.deviceId))
            fs.mkdirSync('/tmp/SCBM/images/'+req.user.deviceId);
        if(file.fieldname === "userImage")
            return cb(null, "userImage.jpeg");

        cb(null, req.user.deviceId+"/"+req.user.id+".jpeg")
    }
})

export const upload = multer({storage: storage})