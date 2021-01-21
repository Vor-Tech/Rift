const express = require('express');
const app = express();
const multer  = require('multer');
const crypto = require('crypto');
const path = require('path');
const uploadsDir = 'public/uploads';
const supportedFileExts = [
   // photo
   "jpg", "jpeg", "png", "tiff", "gif", "cr2", "nef", "psd", "eps",
   // music
   "mp3", "wav",
   // video
   "mp4", "mov", "wmv", "webm", "flv", "mkv",
   // 3D models
   "obj", "stl",
   // archives
   "tar.gz", "zip", "tar.xz",
   // programming
   "html", "js", "ts", "json", "jsx", "tsx",
   // documents
   "pdf", "doc", "docx", "ppt", "pptx"
];

const upload = multer({
   storage: multer.diskStorage({
      destination: (req, file, cb) => {
         cb(null, path.join(__dirname, uploadsDir));
      },
      filename: (req, file, cb) => {
         // randomBytes function will generate a random name
         let customFileName = crypto.randomBytes(18).toString('hex')
         // get file extension from original file name
         // let fileExtension = path.extname(file.originalname).split('.')[1];
         let fileExtension = supportedFileExts.filter((e) => {
            return file.originalname.endsWith('.' + e);
         })[0];
         console.log('file extension determined to be: ' + fileExtension);
         let originalName = file.originalname;
         console.log("original name: " + originalName);
         cb(null, customFileName + '.' + fileExtension.toLowerCase());
      }
   })
});
const cdnPort = 3002;

app.use(express.static(__dirname + '/public'));

app.post('/upload', upload.single('uploaded_file'), function (req, res) {
   console.log(req.file, req.body);
   res.status(200);
   res.json({ status: 200, path: `${uploadsDir}/${req.file.filename}`});
   //res.redirect(req.file.path);
});

app.listen(cdnPort, () => { console.log(`SkySpa's CDN is listening for posts and gets on port ${cdnPort}...`) });