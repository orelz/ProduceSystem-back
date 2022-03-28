const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors")


//Uses
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

//DB connection
mongoose.connect("mongodb://localhost:27017/produceSite");

//User Schema
//Will be soon

//Produce Schema
const produceSchema = {
  produceName: String,
  produceCategory: String,
  produceStatus: String,
  importantProduce: Boolean,
  authorName: String,
  produceCreateDate: Date,
  produceContent: String,
};

const Produce = new mongoose.model("Produce", produceSchema);

app.get("/", (req, res) => {
  res.send("Work");
});

app.post("/createProduce", express.json({type: '*/*'}), (req, res) => {
  Produce.find(
    { importantProduce: true},
    (err, foundProduce) => {

      if (foundProduce.length>=5) {

        res.send("Error- Cant save more then five important produces. " + err);  

      } else {

        const produce = new Produce({
          produceName: req.body.produceName,
          produceCategory: req.body.produceCategory,
          produceStatus: req.body.produceStatus,
          importantProduce: req.body.importantProduce,
          authorName: req.body.authorName,
          produceCreateDate: new Date(),
          produceContent: req.body.produceContent,
        });
        produce.save((err) => {
          if (!err) {
            res.json("Produce saved");
          } else {
            res.send("Error" + err);
          }
        });

        
      }
    }
  );


});

//Get profuces - Tables
// A. Get all the regular produces.
app.get("/regularProduces", (req, res) => {
  Produce.find(
    { importantProduce: false, produceStatus: "active"},
    (err, foundProduce) => {
      if (foundProduce) {
        res.send(foundProduce);
      } else {
        res.send("Error " + err);
      }
    }
  );
});


// B. Get the importent produces.

app.get("/importantProduces", (req, res) => {
  Produce.find(
    { importantProduce: true, produceStatus: "active"},
    (err, foundProduce) => {
      if (foundProduce) {
        res.send(foundProduce);
      } else {
        res.send("Error " + err);
      }
    }
  );
});
// C. Get the hide produces.
app.get("/hideProduces", (req, res) => {
  Produce.find({ produceStatus: "hide" }, (err, foundProduce) => {
    if (foundProduce) {
      res.send(foundProduce);
    } else {
      res.send("Error " + err);
    }
  });
});
// D. Get the archive produces.
app.get("/archiveProduces", (req, res) => {
  Produce.find({ produceStatus: "archive" }, (err, foundProduce) => {
    if (foundProduce) {
      res.send(foundProduce);
    } else {
      res.send("Error " + err);
    }
  });
});
// E. Get all produces (not in use).
app.get("/allProduces", (req, res) => {
  Produce.find(
    {},
    (err, foundProduce) => {
      if (foundProduce) {
        res.send(foundProduce);
      } else {
        res.send("Error " + err);
      }
    }
  );
});


//Actions on specific produce
app
  .route("/produces/:produceName")
  .get((req, res) => {
    Produce.findOne(
      { produceName: req.params.produceName },
      (err, foundProduce) => {
        if (foundProduce) {
          res.send(foundProduce);
        } else {
          res.send("Error " + err);
          console.log(err);
        }
      }
    );
  })
  .patch(express.json({type: '*/*'}), (req, res) => {
    Produce.updateOne(
      { produceName: req.params.produceName },
      { $set: req.body },
      (err, foundProduce) => {
        if (foundProduce) {
          console.log(foundProduce);
          // res.send("Update produce Success");
          res.json("Update produce Success: " + req.body); //Need to check this fix later
        } else {
          res.send("Update fail " + err);
        }
      }
    );
  })
  .delete((req, res) => {
    Produce.deleteOne({ produceName: req.params.produceName }, (err) => {
      if (!err) {
        res.send("Produce deleted");
      } else {
        res.send("Delete produce fail " + err);
      }
    });
  });

app.listen(3000, () => {
  console.log("Server run in port 3000");
});
