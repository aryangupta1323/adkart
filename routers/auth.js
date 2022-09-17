const router=require('express').Router()
const authController=require('../controllers/auth')
const {check}=require('express-validator')
router.get('/signin',authController.getSignIn)
router.post('/signin',check('email').isEmail().withMessage("Enter Valid Email").normalizeEmail(),
        check('contact').isNumeric().isLength({min:10,max:10}).withMessage("Contact must contain 10 digits"),
        check('password').matches(/^[A-Za-z]\w{7,14}$/).withMessage("password between 6 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter"),
        authController.postSignIn)
router.get('/login',authController.getLogin)
router.post('/login',check('email').isEmail().withMessage("Enter valid Email").normalizeEmail(),authController.postLogin)
router.post('/logout',authController.postLogout)
router.get('/reset-password',authController.getResetPassword)
router.post('/reset-password',authController.postResetPassword)
router.get('/reset-password/:userId/:token',authController.getUpdatePassword)
router.post('/update-password',check('password').matches(/^[A-Za-z]\w{7,14}$/).withMessage("password between 6 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter"),authController.postUpdatePassword)
module.exports=router