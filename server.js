if( process.env.NODE_ENV !== 'production' ){
    require('dotenv').config()
}
const express = require('express');
const app = express();
const route = require('express');
const flash = require('express-flash');
// const nodemon = require('nodemon');
const session = require('express-session')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const path = require('path')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose');
const DBusers = require('./model/user');



// db connection


mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('your DB is steede up')
});

//f



//set
app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, "./public")));

//middlewarre
app.use(express.urlencoded({ extended: false }));
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use('/', require('./Routes/web'));



passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    
    // qeury database for user with incoming email
    const userArr = await DBusers.find({email: email});
    let theLoggedUser = userArr[0]
    
    if(theLoggedUser === null || undefined) return done(null,false, {message: "you need to rgister"})
    try {

        if(await bcrypt.compare(password, theLoggedUser.password)){
            return done(null, theLoggedUser, {message:" login success "})
        }else{
            return done(null, false, {message:" password incorrect "})
        }
        
    } catch (error) {
        done(error)
    }
}))




passport.serializeUser((theLoggedUser, done) => done(null, theLoggedUser._id) );

passport.deserializeUser( async function(id, done){
    let user = await DBusers.find({_id: id})
    const actualUser = user[0]
    return done(null, actualUser)
})





// server
const PORT = (process.env.PORT || 3272);


app.listen(PORT, (req, res) => {
    console.log(`servr fired up on port: ${PORT}`);
});
