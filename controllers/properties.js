const Property = require('../models/property').Property

exports.getIndex=(req,res,next)=>{
    Property.find().then(props=>{
        console.log(props)
        res.render('index',{
        pageTitle:"Home",
        properties:props,
        Username:req.session.user?req.session.user.firstName+ " " + req.session.user.lastName:null
        })}).catch(err=>{
            console.log(err)
        })
}

exports.getAllProperties=(req,res,next)=>{
    Property.find().then(props=>{
        console.log(props)
        res.render('all-properties',{
        pageTitle:"Properties",
        properties:props
        })}).catch(err=>{
            console.log(err)
        })
    
}

exports.getProperty=(req,res,next)=>{
    const id=req.params.propId

    Property.findOne({_id:id}).then(property=>{
        res.render('property-details',{
            pageTitle:'Details',
            property:property
        })
    })
}