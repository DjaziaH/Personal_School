const express = require('express');
const app = express();
var cors = require('cors');
const jwt = require('jsonwebtoken');


const {mongoose} = require('./db/mongoose')
const bodyParser = require('body-parser');

const host = "localhost";
const port = 3000;
/** Load in the mongoose models */
const {Module, Course, Content , User} = require('./db/models');

/** Load middleware */
app.use(bodyParser.json());

/** Use CORS */
app.use(cors());


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header(
        'Access-Control-Expose-Headers',
        'x-access-token, x-refresh-token'
    );
    res.setHeader("Access-Control-Allow-Headers", "content-type");

    next();
});


/** *************************************************************************************************** **/
// check whether the request has a valid JWT access token
let authenticate = (req, res, next) => {
    let token = req.header('x-access-token');

    // verify the JWT
    jwt.verify(token, User.getJWTSecret(), (err, decoded) => {
        if (err) {
            // there was an error
            // jwt is invalid - * DO NOT AUTHENTICATE *
            res.status(401).send(err);
        } else {
            // jwt is valid
            req.user_id = decoded._id;
            next();
        }
    });
}

// Verify Refresh Token Middleware (which will be verifying the session)
let verifySession = (req, res, next) => {
    // grab the refresh token from the request header
    let refreshToken = req.header('x-refresh-token');

    // grab the _id from the request header
    let _id = req.header('_id');

    User.findByIdAndToken(_id, refreshToken).then((user) => {
        if (!user) {
            // user couldn't be found
            return Promise.reject({
                'error': 'User not found. Make sure that the refresh token and user id are correct'
            });
        }


        // if the code reaches here - the user was found
        // therefore the refresh token exists in the database - but we still have to check if it has expired or not

        req.user_id = user._id;
        req.userObject = user;
        req.refreshToken = refreshToken;

        let isSessionValid = false;

        user.sessions.forEach((session) => {
            if (session.token === refreshToken) {
                // check if the session has expired
                if (User.hasRefreshTokenExpired(session.expiresAt) === false) {
                    // refresh token has not expired
                    isSessionValid = true;
                }
            }
        });

        if (isSessionValid) {
            // the session is VALID - call next() to continue with processing this web request
            next();
        } else {
            // the session is not valid
            return Promise.reject({
                'error': 'Refresh token has expired or the session is invalid'
            })
        }

    }).catch((e) => {
        res.status(401).send(e);
    })
}

/** ***************************************************************************************************************************************** **/

/** GET all modules */
app.get('/modules',(req,res)=>{
    Module.find({}).then((modules)=>{
        res.send(modules);
    });
})

/** GET a specified module */
app.get('/modules/:moduleId',(req,res)=>{
    Module.findById({_id:req.params.moduleId}).then((modules)=>{
        res.send(modules);
    });
})
/** POST new Module */
app.post('/modules',(req,res)=>{
    console.log(req.body.module);

    let name = req.body.module.name;
    let description = req.body.module.description;
    var newModule = new Module({
        name,
        description
    });
    newModule.save().then((moduledoc)=>{
        res.send(moduledoc)
    });
})


/** PATCH : update a specified module */
app.patch('/modules/:moduleId',(req,res)=>{
    Module.findOneAndUpdate({_id: req.params.moduleId},{
        $set: req.body
    }).then(()=>{
        res.sendStatus(200);
        console.log("module updated")
    });
});

app.put('/modules/:moduleId', (req, res) => {
    console.log('moduleId : ' + req.params.moduleId)
    console.log('module name : ' + req.body.name)
    console.log('module descri: ' + req.body.description)
    var module = {
        name : req.body.name,
        description: req.body.description,
    };
    Module.findByIdAndUpdate(req.params.moduleId, { $set: module }, { new: true }, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Course Update :' + JSON.stringify(err, undefined, 2)); }
    });
});

/** DELETE specified module */
app.delete('/modules/:moduleId', (req, res) => {
     
    Module.findByIdAndRemove(req.params.moduleId, (err, doc) => {
        if (!err) { 
            res.send(doc); 
        }
        else { console.log('Error in Module Delete :' + JSON.stringify(err, undefined, 2)); }
    });
});

/** **************************COURSES***************************** */

/** GET the courses of a spesified module */
app.get('/modules/:moduleId/courses',(req,res)=>{
    Course.find({
        _moduleId: req.params.moduleId
    }).then((courses)=> {
        res.send(courses);
    })
});
/** GET the courses of a spesified module */
app.get('/modules/:moduleId/courses/:courseId',(req,res)=>{
    console.log("req.params.courseId = "+req.params.courseId)
    Course.findOne({
        _id:req.params.courseId,
        _moduleId: req.params.moduleId
    }).then((courses)=> {
        res.send(courses);
    })
});
/** POST a new course in a spesified module */
app.post('/modules/:moduleId/courses',(req,res)=>{
    let newCourse = new Course({
        title: req.body.course.title,
        objectif: req.body.course.objectif,
        _moduleId: req.params.moduleId
    });
    
    newCourse.save().then((newCourseDoc)=>{
        res.send(newCourseDoc);
        
    })
});

/** PATCH : update a specified course of a specified module */
app.patch('/modules/:moduleId/courses/:courseId',(req,res)=>{
    Course.findOneAndUpdate({
        _id : req.params.courseId,
        _moduleId: req.params.moduleId
    },{
        $set: req.body
    }).then(()=>{
        res.sendStatus(200);
        console.log("course updated")
    });
});

app.put('/modules/:moduleId/courses/:courseId', (req, res) => {
    var crs = {
        title : req.body.title,
        objectif: req.body.objectif,
        _moduleId: req.params.moduleId,
    };
    Course.findByIdAndUpdate(req.params.courseId, { $set: crs }, { new: true }, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Course Update :' + JSON.stringify(err, undefined, 2)); }
    });
});

/** DELETE a specified course of a spesified module */
app.delete('/modules/:moduleId/courses/:courseId',(req,res)=>{
    Course.findOneAndRemove({
        _id:req.params.courseId,
        _moduleId: req.params.moduleId
    }).then((removedCourseDoc)=>{
        res.send(removedCourseDoc)
        console.log("deleted")
    })
});

app.delete('/modules/:moduleId/courses',(req,res)=>{
    Course.remove({
        _moduleId :  req.params.moduleId
    }).then((removedCourseDoc)=>{
        res.send(removedCourseDoc)
        console.log("deleted")
    })
});


/** **************************CONTENT***************************** */

/** GET the Contents of a spesified course */
app.get('/modules/:moduleId/courses/:courseId/contents',(req,res)=>{
    Content.find({
        _courseId: req.params.courseId
    }).then((contents)=> {
        res.send(contents);
    })
});
/** GET specified content of a specified course */
app.get('/modules/:moduleId/courses/:courseId/contents/:contentId',(req,res)=>{
    console.log("req.params.courseId = "+req.params.courseId)
    Content.findOne({
        _id:req.params.contentId,
        _courseId: req.params.courseId
    }).then((content)=> {
        res.send(content);
    })
});
/** POST a new content in a spesified course */
app.post('/modules/:moduleId/courses/:courseId/contents',(req,res)=>{
    let newContent= new Content({
        title: req.body.content.title,
        type: req.body.content.type,
        link: req.body.content.link,
        _courseId: req.params.courseId
    });
    
    newContent.save().then((newContentDoc)=>{
        res.send(newContentDoc);
        
    })
});

/** PATCH : update a specified content of a specified course */
app.patch('/modules/:moduleId/courses/:courseId/contents/:contentId',(req,res)=>{
    Content.findOneAndUpdate({
        _id : req.params.contentId,
        _courseId: req.params.courseId
    },{
        $set: req.body
    }).then(()=>{
        res.sendStatus(200);
        console.log("content updated")
    });
});

app.put('/modules/:moduleId/courses/:courseId/contents/:contentId', (req, res) => {
    var content = {
        title : req.body.title,
        type : req.body.type,
        link: req.body.link,
        _courseId: req.params.courseId,
    };
    Content.findByIdAndUpdate(req.params.contentId, { $set: content }, { new: true }, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Course Update :' + JSON.stringify(err, undefined, 2)); }
    });
});

/** DELETE a specified content of a spesified course */
app.delete('/modules/:moduleId/courses/:courseId/contents/:contentId',(req,res)=>{
    Content.findOneAndRemove({
        _id:req.params.contentId,
        _courseId: req.params.courseId
    }).then((removedContentDoc)=>{
        res.send(removedContentDoc)
        console.log("deleted")
    })
});

app.delete('/modules/:moduleId/courses/:courseId/contents',(req,res)=>{
    Content.remove({
        _courseId :  req.params.courseId
    }).then((removedContentDoc)=>{
        res.send(removedContentDoc)
        console.log("deleted")
    })
});



/* ******************************* USER ROUTES *********************************************** */

/**
 * POST /users
 * Purpose: Sign up
 */
app.post('/users', (req, res) => {
    // User sign up

    let body = req.body;
    let newUser = new User(body);

    newUser.save().then(() => {
        return newUser.createSession();
    }).then((refreshToken) => {
        // Session created successfully - refreshToken returned.
        // now we geneate an access auth token for the user

        return newUser.generateAccessAuthToken().then((accessToken) => {
            // access auth token generated successfully, now we return an object containing the auth tokens
            return { accessToken, refreshToken }
        });
    }).then((authTokens) => {
        // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
        res
            .header('x-refresh-token', authTokens.refreshToken)
            .header('x-access-token', authTokens.accessToken)
            .send(newUser);
    }).catch((e) => {
        res.status(400).send(e);
    })
})


/**
 * POST /users/login
 * Purpose: Login
 */
app.post('/users/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    User.findByCredentials(email, password).then((user) => {
        return user.createSession().then((refreshToken) => {
            // Session created successfully - refreshToken returned.
            // now we geneate an access auth token for the user

            return user.generateAccessAuthToken().then((accessToken) => {
                // access auth token generated successfully, now we return an object containing the auth tokens
                return { accessToken, refreshToken }
            });
        }).then((authTokens) => {
            // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
            res
                .header('x-refresh-token', authTokens.refreshToken)
                .header('x-access-token', authTokens.accessToken)
                .send(user);
        })
    }).catch((e) => {
        res.status(400).send(e);
    });
})


/**
 * GET /users/me/access-token
 * Purpose: generates and returns an access token
 */
app.get('/users/me/access-token', verifySession, (req, res) => {
    // we know that the user/caller is authenticated and we have the user_id and user object available to us
    req.userObject.generateAccessAuthToken().then((accessToken) => {
        res.header('x-access-token', accessToken).send({ accessToken });
    }).catch((e) => {
        res.status(400).send(e);
    });
})


app.listen(port,()=>{
    console.log('Server is listing on port '+port);
})