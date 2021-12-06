const Whatsapp = require("./models/Whatsapp");
const path = require("path");
const ObjectsToCsv = require("objects-to-csv");
const mkdirp = require("mkdirp");
const fs = require("fs");

const createWhatsapp = async ({ req = null, res = null }) => {
  try {
    if (!req) return "please provide request object";
    if (!res) return "please provide response object";

    console.log("creating whatsapp ", req.body[0].imei);

    const resdata = await Whatsapp.bulkWrite(
      req.body.map((data) => ({
        updateOne: {
          filter: { uid: data.uid },
          update: { $set: data },
          upsert: true,
        },
      })),
      { ordered: false }
    );

    return res.status(200).json({ resdata });
  } catch (e) {
    console.log("whats app error ", e);
    return res.status(500).json(e || "Internal server error!");
  }
};

const getWhatsapps = async ({
  req,
  res,
  limit = 10,
  skip = 0,
  sortBy = "-date",
}) => {
  try {
    if (!req) return "please provide request object";
    if (!res) return "please provide response object";
    let whatsappDB = await Whatsapp.find({ imei: req.body.imei })
      .sort(sortBy)
      .skip(skip)
      .limit(limit);
    res.status(200).json(whatsappDB);
  } catch (e) {
    console.log("getWhatsapp.js (xinj-9)", e.message); //xinj-9
    res.status(500).send("getWhatsapp.js (xinj-10)"); //xinj-10
  }
};

const deleteWhatsapps = async ({ imei = "", res }) => {
  try {
    if (!res) return "please provide response object";
    await Whatsapp.deleteMany({ imei });
    res.status(200).json({ msg: "deleted successfully" });
  } catch (e) {
    console.log("deleteWhatsapp.js (xinj-9)", e.message);
    res.status(500).send("deleteWhatsapp.js (xinj-10)");
  }
};

const whatsappToCSV = async ({ imei = "", dictoryPath = "", res }) => {
  try {
    if (!res) return "please provide response object";
    const whatsapp = new ObjectsToCsv(await Whatsapp.find({ imei }).lean());
    await whatsapp.toDisk(path.join(dictoryPath));
    res.status(200).json({ msg: "save whatsapp successfully" });
  } catch (error) {
    console.log("whatsapp to csv (xinj-9)", error.message);
    res.status(500).send("whatsapp to csv (xinj-10)");
  }
};

module.exports = {
  createWhatsapp,
  getWhatsapps,
  deleteWhatsapps,
  whatsappToCSV,
};
