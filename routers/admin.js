const router=require('express').Router()
const path=require('path')
const {check}=require('express-validator')
const multer=require('multer')
const propertyFileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null,  path.join(__dirname,"..","images","property-images"));
    },
    filename: (req, file, cb) => {
      cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }
  });
  const profileFileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null,  path.join(__dirname,"..","images","profile-images"));
    },
    filename: (req, file, cb) => {
      cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }
  });
  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype.split('/')[1] === 'png' ||
      file.mimetype.split('/')[1] === 'jpg' ||
      file.mimetype.split('/')[1] === 'jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

const propertyUpload=multer({storage:propertyFileStorage,fileFilter:fileFilter})
const profileUpload=multer({storage:profileFileStorage,fileFilter:fileFilter})
const adminController=require('../controllers/admin')
const checkLogin=require('../middleware/check-login').checkLogin

router.get('/add-property',checkLogin,adminController.getAddProperty)

router.post('/add-property',checkLogin,propertyUpload.single('image'),check('year').isInt({min:1800,max:new Date().getFullYear}).withMessage('Invalid Year'),
check('description').isLength({min:10}).withMessage("Description must be minimum 10 characters long").isLength({max:200}).withMessage("Description must contain not more than 200 characters"),
adminController.postAddProperty)

router.post('/delete/:propId',checkLogin,adminController.postDeleteProperty)

router.get('/your-properties',checkLogin,adminController.getYourProperties)

router.get('/profile',checkLogin,adminController.getProfile)
router.post('/profile',checkLogin,profileUpload.single('pimage'),adminController.postProfile)

module.exports=router