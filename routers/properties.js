const router=require('express').Router()
const propController=require('../controllers/properties')



router.get('/', propController.getIndex)

router.get('/all-properties',propController.getAllProperties)

router.get('/property/:propId',propController.getProperty)
module.exports=router