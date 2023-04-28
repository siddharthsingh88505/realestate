import express from "express";
import { SiteController } from "../controllers/siteController.js";
import { UserController } from "../controllers/userController.js";
import { GridFsStorage } from "multer-gridfs-storage";
import Grid from "gridfs-stream";
import multer from "multer";
import mongoose from "mongoose";
import crypto from "crypto";
import path from "path";
import { verifyToken } from "../token.js";
import bodyParser from "body-parser";

// initialize router
const router = express.Router();

// // Configuring multer library
// const storage = multer.memoryStorage(); //defining the storage engine
// const upload = multer({ storage: storage });

// Mongo uri
const mongoURI = "mongodb://127.0.0.1:27017/dummy";

// Create mongoconnection
const conn = mongoose.createConnection(mongoURI);

// Init gfs
let gfs,gridfsBucket;

conn.once('open', () => {
    // Init stream
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'photos'
    });
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('photos');
})

// Create storage engine
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = verifyToken(req.cookies.token).userId + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'photos'
                };
                resolve(fileInfo);
            });
        });
    }
});

const upload = multer({ storage });

// routes
router.get("/", SiteController.homePageController);
router.get("/featured/:count?", SiteController.featuredPageController);
router.get("/category/:category/:count?", SiteController.categoriesController);
router.get("/single-list", SiteController.singleListController);
router.get("/about", SiteController.aboutPageController);
router.get("/contact", SiteController.contactPageController);
router.get("/register", SiteController.registerPageController);
router.get("/register-as-agent", SiteController.registerAgentPageController);
router.get("/login", SiteController.loginPageController);
router.get("/logout", SiteController.logoutPageController);
router.get("/upload-property", SiteController.uploadPageController);
router.get("/admin/dashboard", SiteController.adminDashboard);
router.get("/payment/:id", SiteController.paymentPageController);
router.get("/search", SiteController.searchPageController);
router.post("/search", SiteController.searchProperties);
router.get("/chat", SiteController.chatPageController);
router.get("/add-user/:aid", SiteController.addUser);
router.post("/save-chat/:id",bodyParser.json(), SiteController.saveChat);
router.get("/chat-history/:id", SiteController.chatHistoryApi);
router.get("/images/:id", SiteController.imageApi);
router.get("/videos/:id", SiteController.videoApi);
router.get("/user-list", SiteController.userListApi);
router.get("/property-list", SiteController.propertyListApi);
router.get("/order-list", SiteController.orderListApi);
router.get("/delete-property/:id", SiteController.deleteProperties);
router.get("/delete-user/:id", SiteController.deleteUser);
router.post("/register", UserController.userRegistration);
router.post("/login", UserController.userLogin);
router.post("/update-user", UserController.updateUser);
router.post("/upload-property", upload.fields([{name:"image"},{name:"video"}]), UserController.uploadProperty);
router.post("/payment/:id", SiteController.paymentHandle);

// export routes
export { router, gfs, gridfsBucket };