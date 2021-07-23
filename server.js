const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");  
const path = __dirname + '/app/views/';

const app = express();

app.use(express.static(path));

var corsOptions = {
  origin: "http://localhost:8081"
};


app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const dp = require("./app/models");
const { person } = require("./app/models");

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


const pathToIndex = __dirname + '/app/views/' + "index.html";
app.get("/", (req, res) => {
  const raw = fs.readFileSync(pathToIndex)
  const pageTitle = "Homepage - Welcome to my page"
  const updated = raw.replace("__PAGE_META__", `<title>${pageTitle}</title>`)
  res.send(updated)
})

//db.sequelize.sync();

app.get('/*', function (req, res){
  //res.sendFile(path + "index.html")
  const pageTitle = "Homepage - Welcome to my page"
  console.log(req.query);

  if (req.query.id == null){
    return res.sendFile(path + "index.html")
  }

  if (dp.mongoose.connection.readyState == 1){
    
    const Person = dp.person;
    Person.findById(req.query.id)
        .then(data => {
            if (!data)
              res.sendFile(path + "index.html")
            else  {
              fs.readFile(pathToIndex, 'utf8', (err, htmlData) => {
                if (err) {
                    console.error('Error during file reading', err);
                    return res.status(404).end()
                }

                htmlData = htmlData
                    .replace("__META_OG_TITLE__", data.name)
                    .replace("__META_DESCRIPTION__", data.description)
                    .replace("__META_OG_IMAGE__", data.card)
                return res.send(htmlData);
              });
            }
        })
        .catch(err => {
        });
  }

  fs.readFile(pathToIndex, 'utf8', (err, htmlData) => {
    if (err) {
        console.error('Error during file reading', err);
        return res.status(404).end()
    }
    // TODO get person info

    // TODO inject meta tags
  });
  
})


require("./app/routes/person.routes")(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});