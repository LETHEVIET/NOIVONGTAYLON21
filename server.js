const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const path = __dirname + '/app/views';

const app = express();

app.use(express.static(path));

var corsOptions = {
  origin: "http://localhost:8081"
};


app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
/*
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
*/
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const dp = require("./app/models");

dp.mongoose
    .connect(dp.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connected to database!");
    })
    .catch(err => {
        console.log("Cannot connect to the database!", err)
        process.exit();
    });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Vietle application." });
});


//db.sequelize.sync();

app.get('/', function (req, res){
  res.sendFile(path + "index.html")
})


require("./app/routes/person.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});