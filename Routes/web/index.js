const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const passport = require('passport')
const Bank = require('../../model/bank');
const User = require('../../model/user');



router.use('/', (req, res, next) => {
    console.log(new Date().getTime())
    next()
})

router.get('/', authenticated, (req, res) => {
    
    res.render('index', {name: req.user.name})
})



function authenticated(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}

function notAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect('/')
    }
    next()
}

// register controllers
router.get('/register', notAuthenticated,  (req, res) => {
    res.render('register')
})

router.post('/register', async (req, res) => {
    try {
        const hashPass = await bcrypt.hash(req.body.password, 10)
        const newUser = {
            
            name: req.body.name,
            password: hashPass,
            email: req.body.email,
            isAdmin: true
     }

    //  database operations
        const Admin = new User(newUser)
        Admin.save()
        res.redirect('/login')
    } catch (error) {
        res.redirect('/register')
    }
    
})

router.get('/pay', authenticated, (req,res)=>{
    res.render('pay', {name: req.user.name, email: req.user.email})
})
router.post('/pay', authenticated, (req, res) => {
    // get payment info from user
    const userPaymentInfo = {
        "Transaction id":new Date().getTime().toString(),
            Destination: req.body.destination,
            "Payment time": new Date(),
            "Amount": req.body.amount
    }
    // update users payment history field in database
    User.updateOne(
        {name:req.user.name},
        {$push: { "Payment history": [ userPaymentInfo ] }},
        (err,result) => {
            if(err) return res.send(err)
            console.log(result)
        }
    )
    res.redirect('/pay')
    // User.save()?



} )

// router.get('/display', async (req,res, next)=>{
//     let Bobby = await User.find({'name':'bobby'}).map(user => user);
    
//     console.log(Bobby)
    
// })


// logiin conrolers
router.get('/login',  notAuthenticated,(req, res) => {
    res.render('login')
})

router.post('/login', passport.authenticate('local',{
    successRedirect:'/',
    failureRedirect: '/login',
    failureFlash: true
}))

router.post('/logout', (req,res) => {
    req.logOut()
    res.redirect('/login')
})

//  function makebank(){
//     const Zenith = new Bank({
//     name: 'zenith bank',
//     TimeStamp: new Date().getTime(),
//     Branch: 'Epe',
//     active: true,
//     hasMobileApp: true
// })
// Zenith.save()
// }
// // other controllers
// router.get('/make',(req, res)=>{
//     makebank()
// })

module.exports = router