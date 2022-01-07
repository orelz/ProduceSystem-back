const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { get } = require("express/lib/response");
const req = require("express/lib/request");

//Uses
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

//DB connection
mongoose.connect("mongodb://localhost:27017/produceSite");

//User Schema
//Will be soon

//Produce Schema
const produceSchema = {
  produceName: String,
  produceCategory: String,
  activeProduce: Boolean,
  importentProduce: Boolean,
  produceInArchive: Boolean,
  authorName: String,
  produceCreateDate: Date,
  produceContent: String,
};

const Produce = new mongoose.model("Produce", produceSchema);

app.get("/", (req, res) => {
  res.send("Work");
});

app.post("/createProduce", (req, res) => {
  const produce = new Produce({
    produceName: req.body.produceName,
    produceCategory: req.body.produceCategory,
    activeProduce: req.body.activeProduce,
    importentProduce: req.body.importentProduce,
    produceInArchive: false,
    authorName: req.body.authorName,
    produceCreateDate: new Date(),
    produceContent: req.body.produceContent,
  });

  produce.save((err) => {
    if (!err) {
      res.send("Produce saved");
    } else {
      res.send("Error" + err);
    }
  });
});

//Get profuces - Tables
// A. Get all the regular produces.
app.get("/regularProduces", (req, res) => {
  Produce.find(
    { importentProduce: false, activeProduce: true, produceInArchive: false },
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

app.get("/importentProduces", (req, res) => {
  Produce.find(
    { importentProduce: true, activeProduce: true, produceInArchive: false },
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
  Produce.find({ activeProduce: false }, (err, foundProduce) => {
    if (foundProduce) {
      res.send(foundProduce);
    } else {
      res.send("Error " + err);
    }
  });
});
// D. Get the archive produces.
app.get("/archiveProduces", (req, res) => {
  Produce.find({ produceInArchive: true }, (err, foundProduce) => {
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
  .patch((req, res) => {
    Produce.updateOne(
      { produceName: req.params.produceName },
      { $set: req.body },
      (err, foundProduce) => {
        if (foundProduce) {
          console.log(foundProduce);
          res.send("Update produce Success");
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
