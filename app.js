const express = require('express');
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || "8000";
const engine = require('consolidate');
const {MongoClient, ObjectId} = require('mongodb');
const bodyParser = require('body-parser');

// Set static
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true,cookie: {maxAge: 600000}}));

// Setup handlebars engine
app.engine('hbs', engine.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');

var sess;

// Set up mongodb connection
async function MongoConnect(name) {
    const uri = "mongodb+srv://admin:admin@cluster0.hzsez.gcp.mongodb.net/test?retryWrites=true&w=majority";
    const client = new MongoClient(uri, {useUnifiedTopology: true});

    try {
        await client.connect();

        const db = client.db(name);
        return db;
    } catch (e) {
        console.error(e);
    }
}

// Processing
app.get("/", (req, res) => {
    res.render("Login.hbs");
});

app.post("/login", (req, res) => {
    var usr = req.body.usr;
    var pwd = req.body.pwd;
    if (usr == "") {
        var errMsg = "Must input username";
        return res.render("Login.hbs", {e: errMsg});
    }
    if (pwd == "") {
        var errMsg = "Must input password";
        return res.render("Login.hbs", {e: errMsg});
    }
    MongoConnect("toys")
        .then(db => {
            db.collection("login").find().toArray()
                .then(data => {
                    data.forEach(item => {
                        if (item.username == usr && item.password == pwd) {
                            console.log("Login success");
                            return res.redirect("/alltoys");
                        }
                        console.log("Login failed");
                        res.redirect("/");
                    })
                })
        })
        .catch(e => console.error(e));
});

app.get("/alltoys", (req, res) => {
    MongoConnect("toys")
        .then(db => {
        db.collection("toys").find().toArray()
        .then(data => {
            res.render("AllToys.hbs", {data: data});
        });
    })
    .catch(e => console.error(e));
});

app.get("/addtoyspage", (req, res) => {
    res.render("AddToys.hbs");;
});

app.post("/addtoys", (req, res) => {
    var name = req.body.name;
    var price = req.body.price;
    var status = req.body.status;
    var img = req.body.img;

    if (name == "") {
        var errMsg = "Must input name";
        return res.render("AddToys.hbs", {e: errMsg});
    }

    if (price != "") {
        if (isNaN(price)) {
            var errMsg = "Just input price number only";
            return res.render("AddToys.hbs", {e: errMsg});
        }
    } else {
        var errMsg = "Must input price";
        return res.render("AddToys.hbs", {e: errMsg});
    }

    if (img != "") {
        regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
        if (!regexp.test(img)) {
            var errMsg = "Must input url type (https:// or http://)";
            return res.render("AddToys.hbs", {e: errMsg});
        }
    } else {
        var errMsg = "Must input image url";
        return res.render("AddToys.hbs", {e: errMsg});   
    }
    
    MongoConnect("toys")
    .then(db => {
        db.collection("toys").insertOne({
            "name": name,
            "price": price,
            "status": status == "true" ? true : false,
            "img": img
        });

        res.redirect("/alltoys");
    })
    .catch(e => console.error(e));
});

app.get("/delete", (req, res) => {
    var _id = req.query.id;

    MongoConnect("toys")
    .then(db => {
        db.collection("toys").deleteOne({_id: ObjectId(_id)});
        res.redirect("/alltoys");
    })
    .catch(e => console.error(e));
});

app.get("/updatepage", (req, res) => {
    var _id = req.query.id;
    MongoConnect("toys")
        .then(db => {
            db.collection("toys").find({_id: ObjectId(_id)}).toArray()
        .then(data => {
            res.render("UpdateToys.hbs", {data: data});
            });
        })
        .catch(e => console.error(e));
});

app.post("/update", (req, res) => {
    var _id = req.body._id;
    var name = req.body.name;
    var price = req.body.price;
    var status = req.body.status;
    var img = req.body.img;

    MongoConnect("toys")
    .then(db => {
        db.collection("toys").updateOne({_id: ObjectId(_id)}, {$set: {
            name: name,
            price: price,
            status: status == "true" ? true : false,
            img: img
        }});

        res.redirect("/alltoys");
    })
    .catch(e => console.error(e));
});

app.get("/searchpage", (req, res) => {
    res.render("SearchToys.hbs");
});

app.post("/search", (req,res) => {
    var key = req.body.key;

    MongoConnect("toys")
        .then(db => {
            db.collection("toys").find({name: {$regex: key, $options:"$i"}}).toArray()
            .then(data => {
                res.render("SearchToys.hbs", {data: data});
            })
        })
        .catch(e => console.error(e));
});

// Listen port
app.listen(PORT, () => console.log('App listened port: ' + PORT));
