const express = require('express');
const router = express.Router();
const User = require('../model/user');
const mongoose =require('mongoose');
const bcrypt =require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require('../model/user');
const checkAuth = require('../middleware/check-auth')


//to add data or object to array
router.get('/',checkAuth,(req,res,next)=>{
   User.find()
   .then(result =>{
       res.status(200).json({
           userData:result
       });
   })
   .catch(err=> {
       console.log(err);
       res.status(500).json({
           error:err
       })
   });
    });

//password will show in hash form 
    router.post('/signup',(req,res,next)=>{
        bcrypt.hash(req.body.password,10,(err,hash)=>{
            if(err)
            {
                return res.status(500).json({
                    error:err
                })
            }
            else{
                const user =new User({
                    _id:new mongoose.Types.ObjectId,
                    username:req.body.username,
                    password:hash,
                    phone:req.body.phone,
                    email:req.body.email,
                    userType:req.body.userType
                })
                user.save()
                .then(result => {
                    res.status(200).json({
                        new_user:result
                    })
                })
                .catch(err =>{
                    res.status(500).json({
                        error:err
                    })
                })
            }
        })

    })     
   //login user...
   router.post('/login',(req,res,next) =>{
       User.find({username:req.body.username})
       .exec()
       .then(user=>{
           if(user.length <1)
           {
           return res.status(401).json({
               msg:'user not exist'
           })
       }
       bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
           if(!result)
           {
               return res.status(401).json({
                   msg:'password matching fail'
               })
           }
           if(result)
           {
            const token = jwt.sign({
                username:user[0].username,
                phone:user[0].phone,
                email:user[0].email ,
                userType:user[0].userType 
            },
            'this is dummy text',
            {
                expiresIn:"24h"
            }
           );
           res.status(200).json({
               username:user[0].username,
               phone:user[0].phone,
               email:user[0].email,
               userType:user[0].userType, 
               token:token
           })
           }
       })
   })
   .catch(err => {
       res.status(500).json({
           err:err
       })
   })
})   

    

// //to post request
// router.post('/',(req,res,next)=>{
// const user =new User({
//     _id:new mongoose.Types.ObjectId,
//     username:req.body.username,
//     phone:req.body.phone,
//     email:req.body.email,
//     password:req.body.password,
//     userType:req.body.userType
// })

// user.save()
// .then(result =>{
//     console.log(result)
//     res.status(200).json({
//         newUser:result
//     })
// })
// .catch(err =>{
//     console.log(err)
//     res.status(500).json(
//         {
//             error:err
//         })
// })
// })

// // particular id used to retrieve data
// router.get('/:id',(req,res,next)=> {
//     console.log(req.params.id);
//     User.findById(req.params.id)
//     .then(result => {
//         res.status(200).json({
//             user:result
//         })
//     })
//     .catch(err =>{
//         console.log(err);
//         res.status(500).json({
//             error:err
//         })
//     })
// })


//delete request
router.delete('/:id',(req,res,next)=>{
    User.remove({_id:req.params.id})
    .then(result=>{
    res.status(200).json({
        message:'product deleted',
        result:result
    })
})
.catch(err =>{
    res.status(500).json({
        error:err
    })
})
})

//put request

router.put('/:id',(req,res,next)=>{
    console.log(req.params.id);
    User.findOneAndUpdate({_id:req.params.id },{
       $set:{
        username:req.body.username,
        phone:req.body.phone,
        email:req.body.email,
        password:req.body.password,
        userType:req.body.userType
       } 
    })
    .then(result =>{
        res.status(200).json({
            updated_user:result
        })
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
})


module.exports = router;