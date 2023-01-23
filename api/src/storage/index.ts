import multer from 'multer';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.env.BASE_PATH+'/src/storage/images')
    },
    filename: (req, file, cb) => {
        if(!fs.existsSync(process.env.BASE_PATH+'/src/storage/images/'+req.user.deviceId))
            fs.mkdirSync(process.env.BASE_PATH+'/src/storage/images/'+req.user.deviceId);
        if(file.fieldname === "userImage")
            return cb(null, "userImage.jpeg");

        cb(null, req.user.deviceId+"/"+req.user.id+".jpeg")
    }
})

export const upload = multer({storage: storage})