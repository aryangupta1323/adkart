const User= require('../models/user').User
const bcrypt=require('bcrypt')
const crypto=require('crypto')
const {validationResult}=require('express-validator/check')
const nodemailer=require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'Gmail', // no need to set host or port etc.
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
});
exports.getSignIn=(req,res,next)=>{
    let messages=req.flash('error')
    if(messages.length===0) messages=[]
    res.render('signin',{
        pageTitle:"Sign In",
        errorMsg:messages,
        oldInput:{}
    })
}

exports.postSignIn=(req,res,next)=>{
    const {fname,lname,contact,email,password}=req.body
    console.log(contact)
    const error=validationResult(req)
    console.log(error.array())
    if(!error.isEmpty()){
        return res.status(402).render('signin',{
            pageTitle:"Sign In",
            errorMsg:error.array().map(error => error.msg),
            oldInput:{fname,lname,contact,email,password}
        })
    }
    User.findOne({$or: [{email:email},{contact:+contact}]}).then(user=>{
        console.log(user)
        if(!user){
            bcrypt.hash(password,12).then(pass=>{
                const new_user=new User({
                    firstName:fname,
                    lastName:lname,
                    contact:contact,
                    email:email,
                    password:pass
                })
                new_user.save()
                res.redirect("/login")
            }).catch(err=>{
                console.log(err)
            })
        }
        else if(user.email===email){
            req.flash('error',"User already Exists with this email")
            res.redirect('signin')
            // return new Error('User already Exists')
        }
        else if(user.contact===+contact){
            req.flash('error',"User already Exists with this Number")
            res.redirect('signin')
        }
    }).then(result=>{
        console.log(result)
        
    }).catch(err=>{
        console.log(err)
    })
}

exports.getLogin=(req,res,next)=>{
    let emessages=req.flash('error')
    if(emessages.length===0) emessages=[]
    let smessages=req.flash('success')
    if(smessages.length===0) smessages=[]
    res.render('login',{
        pageTitle:"Login",
        errorMsg:emessages,
        successMsg:smessages,
        oldInput:{}
    })
}

exports.postLogin=(req,res,next)=>{
    const {email,password}=req.body
    User.findOne({email:email}).then(user=>{
        if(user){
             bcrypt.compare(password,user.password).then(result=>{
                if(result){
                    
                    req.session.user = user;
                    req.session.isLoggedIn = true;
                    req.session.save(err => {
                        if(err) console.log(err)                             
                        res.redirect('/')
                    });

                }else{
                    res.render('login',{
                        pageTitle:"Login",
                        errorMsg:["password don't match."],
                        oldInput:{email:email},
                        successMsg:[]
                    })
                    // throw new Error('password dont match')
                    
                }})
               .catch(err=>{
                    console.log(err)
                    if(err) console.log(err);
                    req.flash('error', 'something went wrong, please try again later.');
                    res.redirect('/login');
                 })
        }else{
            req.flash('error','User not found');
            res.redirect('/login')
           throw new Error("user not found")
        }
        
    }).catch(err=>{
        console.log(err)
    })
}
exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        if(err) console.log(err);
        res.redirect('/');
    });
};

exports.getResetPassword=(req,res,next)=>{
    let emessages=req.flash('error')
    if(emessages.length===0) emessages=[]
    let smessages=req.flash('success')
    if(smessages.length===0) smessages=[]
    res.render('reset-password',{
        pageTitle:'Reset Password',
        successMsg:smessages,
        errorMsg:emessages
    })
}

exports.postResetPassword=(req,res,next)=>{
    let email=req.body.email
    User.findOne({email:email}).then(user=>{
        if(!user){
            req.flash('error','No user with this email,Please renter')
            res.redirect('/reset-password')
        }
        else{
            crypto.randomBytes(32, function(err, buffer) {
                if(!err){
                    user.token = buffer.toString('hex');
                    user.save(err=>{
                        let url='http://localhost:3000/reset-password/'+user._id+"/"+user.token
                        transporter.sendMail({
                                to:email,
                                from:'Adkart',
                                subject: 'Reset Password',
                                html: `<a href=${url}>${url}</a>`
                        }).then(result=>{
                                req.flash('success',"Email Sent successfully")
                                res.redirect('/reset-password')
                        }).catch(err=>{
                        console.log(err);
                        })
                    })
                        
                } 
              })
        }
    }).catch(err=>{
        console.log(err)
    })
}

exports.getUpdatePassword=(req,res,next)=>{
    const userId=req.params.userId
    const token=req.params.token
    let smessages=req.flash('success')
    if(smessages.length===0) smessages=[]
    // let emessages=req.flash('error')
    // if(emessages.length===0) emessages=[]
    User.findOne({token:token}).then(user=>{
        if(user){
            res.render('update-password',{
                pageTitle:"Update Password",
                userId:user._id,
                token:user.token,
                successMsg:smessages
            })
          }
        else{
            res.redirect('/login')
        } 
    }).catch(err=>{
        console.log(err)
    })
}

exports.postUpdatePassword=(req,res,next)=>{
    const userId=req.body.userId
    const token=req.body.token
    const password=req.body.password
    const error=validationResult(req);
    if(!error.isEmpty()){
        return res.status(402).render('update-password',{
            pageTitle:"Update Password",
            userId:userId,
            token:token,
            successMsg:[],
            errorMsg:error.array().map(error => error.msg)
        })
    }
    User.findOne({_id:userId,token:token}).then(user=>{
        console.log("user : " +user)
        if(user){
            bcrypt.hash(password,12).then(pass=>{
                if(pass){
                    user.password=pass
                    user.token=undefined
                    user.save();
                     req.flash('success',"Password Updated Successfully")
                     res.redirect("/login")
                }
            }).catch(err=>{
                console.log(err)
            })
          }
        else{
             res.redirect('/login')
        } 
    }).catch(err=>{
        console.log(err)
    })
}