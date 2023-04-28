import { propertyModel } from "../models/propertyModel.js";
import { userModel } from "../models/userModel.js";
import { verifyToken } from "../token.js";
import { gfs, gridfsBucket } from "../routes/web.js";
import mongoose from "mongoose";
import { transporter } from "../emailsender.js";
import { orderModel } from "../models/orderModel.js";
import { chatModel } from "../models/chatModel.js";

class SiteController{
    // home page
    static homePageController = async (req, res) => {
        // console.log(req.cookies);
        let recent,featured;
        try {
            // getting list of all sold properties
            let orders = await orderModel.find({},{propertyId:1});
            let orders_list=[];
            orders.forEach(order=>{
                // appending property id
                orders_list.push(order.propertyId);
            })
            console.log("Orders list => ",orders_list);
            // recent property files
            recent = await propertyModel.find({_id:{ $nin: orders_list }}, null, { sort: { _id: -1 }, limit: 4 });
            // featured property files
            featured = await propertyModel.find({_id:{ $nin: orders_list }}, null, { limit: 3 });
            
        } catch (error) {
            console.log(error);
        }
        // console.log(verifyToken(req.cookies.token));
        if (req.cookies.token) {
            const isVerified = verifyToken(req.cookies.token);
            console.log(isVerified)
            if (isVerified) {
                res.cookie("token", req.cookies.token);
                res.render("index", { verified: true, userType: isVerified.userType, recent: recent, featured: featured, isAdmin: isVerified.admin });
            }
            else {
                res.render("index", { verified: false, recent: recent, featured: featured });
            }
        }
        else {
            res.render("index",{ verified: false, recent: recent, featured: featured });
        }
    }
    // featured page
    static featuredPageController = async (req, res) => {
        let featured, propertyCount;
        console.log(req.params.count)
        try {
            // getting list of all sold properties
            let orders = await orderModel.find({},{propertyId:1});
            let orders_list=[];
            orders.forEach(order=>{
                // appending property id
                orders_list.push(order.propertyId);
            });
            // Number of properties
            propertyCount = await propertyModel.find({_id:{ $nin: orders_list }}).count();
            if (req.params.count==0) {
                // Fetching only 10 properties
                featured = await propertyModel.find({_id:{ $nin: orders_list }}, null, { limit: 10 });
            }
            else if (req.params.count <= Math.ceil(propertyCount / 10)) {
                // Fetching only 10 properties
                featured = await propertyModel.find({_id:{ $nin: orders_list }}, null, { skip: (req.params.count-1)*10, limit: 10 });
            }
            else {
                // Fetching only 10 properties
                featured = await propertyModel.find({_id:{ $nin: orders_list }}, null, { limit: 10 });
            }
        } catch (error) {
            console.log(error);
        }
        if (req.cookies.token) {
            const isVerified = verifyToken(req.cookies.token);
            if (isVerified) {
                res.cookie("token", req.cookies.token);
                res.render("featured", { verified: true, userType: isVerified.userType, featured: featured, count: propertyCount, active: req.params.count,isAdmin:isVerified.admin });
            }
            else {
                res.render("featured", { verified: false, featured: featured, count: propertyCount, active: req.params.count });
            }
        }
        else {
            res.render("featured",{verified:false, featured: featured, count:propertyCount, active: req.params.count });
        }
    }
    // featured page for types of properties
    static categoriesController = async (req, res) => {
        let featured, propertyCount;
        try {
            // getting list of all sold properties
            let orders = await orderModel.find({},{propertyId:1});
            let orders_list=[];
            orders.forEach(order=>{
                // appending property id
                orders_list.push(order.propertyId);
            });
            // Number of properties
            propertyCount = await propertyModel.find({ type: (req.params.category),_id:{ $nin: orders_list } }).count();
            if (req.params.count==0) {
                // Fetching only 10 properties
                featured = await propertyModel.find({ type: (req.params.category),_id:{ $nin: orders_list } }, null, {  limit: 10 });
            }
            else if (req.params.count <= Math.ceil(propertyCount / 10)) {
                // Fetching only 10 properties
                featured = await propertyModel.find({ type: (req.params.category),_id:{ $nin: orders_list } }, null, { skip: (req.params.count-1)*10, limit: 10 });
            }
            else {
                // Fetching only 10 properties
                featured = await propertyModel.find({ type: (req.params.category),_id:{ $nin: orders_list } }, null, { limit: 10 });
            }
        } catch (error) {
            console.log(error);
        }
        if (req.cookies.token) {
            const isVerified = verifyToken(req.cookies.token);
            if (isVerified) {
                res.cookie("token", req.cookies.token);
                res.render("categories", { verified: true, userType: isVerified.userType, featured: featured, count: propertyCount, active: req.params.count, category: req.params.category.toUpperCase(),isAdmin:isVerified.admin });
            }
            else {
                res.render("categories", { verified: false, featured: featured, count: propertyCount, active: req.params.count, category: req.params.category.toUpperCase() });
            }
        }
        else {
            res.render("categories",{verified:false, featured: featured, count:propertyCount, active: req.params.count, category: req.params.category.toUpperCase() });
        }
    }
    // single-list page for more details of single property
    static singleListController = async (req, res) => {
        console.log("From single list page => ",req.query);
        let property_details,agent_details;
        try {
            property_details = await propertyModel.find({ _id: req.query.id });
            // fetching agent details
            agent_details = await userModel.find({ _id: req.query.ref_id });
        } catch (error) {
            console.log(error);
        }
        if (req.cookies.token) {
            const isVerified = verifyToken(req.cookies.token);
            if (isVerified) {
                res.cookie("token", req.cookies.token);
                res.render("single-list", { verified: true, userType: isVerified.userType, property: property_details, agent: agent_details, isAdmin: isVerified.admin, user: isVerified.userId, isSame: agent_details[0].id === isVerified.userId });
            }
            else {
                res.render("single-list", { verified: false, property: property_details, agent: agent_details });
            }
        }
        else {
            res.render("single-list",{ verified: false, property: property_details, agent: agent_details });
        }
    }
    // about page
    static aboutPageController = (req, res) => {
        if (req.cookies.token) {
            const isVerified = verifyToken(req.cookies.token);
            if (isVerified) {
                res.cookie("token", req.cookies.token);
                res.render("about", { verified: true, userType: isVerified.userType,isAdmin:isVerified.admin});
            }
            else {
                res.render("about", { verified: false });
            }
        }
        else {
            res.render("about",{verified:false});
        }
    }
    // contact page
    static contactPageController = (req, res) => {
        if (req.cookies.token) {
            const isVerified = verifyToken(req.cookies.token);
            if (isVerified) {
                res.cookie("token", req.cookies.token);
                res.render("contact", { verified: true, userType: isVerified.userType,isAdmin:isVerified.admin });
            }
            else {
                res.render("contact", { verified: false });
            }
        }
        else {
            res.render("contact",{verified:false});
        }
    }
    // register page
    static registerPageController = (req, res) => {
        
        res.render("register", {
            data: {
                firstName: "",
                lastName: "",
                userType: "-1",
                contact: "",
                email: "",
                password: "",
                cnfpassword: "",
                tc:'0'
        },status:""});
    }
    // login page
    static loginPageController = (req, res) => {
        res.render("login", {
            data: {
                email: "",
                password: "",
            },status:""
        });
    }
    // register as agent
    static registerAgentPageController = (req, res) => {
        res.render("register-as-agent",{data:{email:"",password:""},status:""});
    }
    // logout user
    static logoutPageController = (req, res) => {
        res.cookie("token", "");
        res.redirect("/");
    }
    // upload property page
    static uploadPageController = (req, res) => {
        console.log(req.cookies);
        console.log(verifyToken(req.cookies.token));
        if (req.cookies.token) {
            const isVerified = verifyToken(req.cookies.token);
            if (isVerified) {
                // res.cookie("token", req.cookies.token);
                res.render("upload-property", {
                    verified: true, userType: isVerified.userType, data: {
                        name: '',
                        location: '',
                        description: '',
                        price: '',
                        area: '',
                        bedroom: '',
                        bathroom: '',
                        owner: '',
                        type: '-1',
                        city: '-1'
                    }, status: "", message: "", isAdmin: isVerified.admin
                });
                console.log("userType => ",isVerified.userType)
            }
            else {
                res.render("upload-property", { verified: false,data: {
                name: '',
                location: '',
                description: '',
                price: '',
                area: '',
                bedroom: '',
                bathroom: '',
                owner: '',
                type: '-1',
                city: '-1'
            }, status:"", message:""  });
            }
        }
        else {
            res.render("upload-property",{verified:false, data: {
                name: '',
                location: '',
                description: '',
                price: '',
                area: '',
                bedroom: '',
                bathroom: '',
                owner: '',
                type: '-1',
                city: '-1'
            }, status:"", message:"" });
        }
    }
    // admin dashboard
    static adminDashboard = async (req, res) => {
        if (req.cookies.token) {
            const isVerified = verifyToken(req.cookies.token);
            console.log(isVerified)
            if (isVerified && isVerified.admin) {
                let users, properties,orders;
                try {
                    // getting list of all sold properties
                    let orders_done = await orderModel.find({},{propertyId:1});
                    let orders_list=[];
                    orders_done.forEach(order=>{
                        // appending property id
                        orders_list.push(order.propertyId);
                    });
                    users = await userModel.find({email:{$ne:'siddharthsingh88505@gmail.com'}});
                    properties = await propertyModel.find({_id:{ $nin: orders_list }});
                    orders = await orderModel.find();
                    console.log(orders)
                    // console.log(users)
                } catch (error) {
                    users = [];
                    properties = [];
                    orders = [];
                    console.log(error)
                }
                res.cookie("token", req.cookies.token);
                res.render("admin-dashboard", { verified: true, users: users.length, properties: properties.length, orders: orders.length });
            }
            else {
                // res.render("admin-dashboard", { verified: false });
                res.redirect("/")
            }
        }
        else {
            // res.render("admin-dashboard",{ verified: false });
            res.redirect("/");
        }
    }
    // payment page
    static paymentPageController = async (req, res) => {
        if (req.cookies.token) {
            const isVerified = verifyToken(req.cookies.token);
            if (isVerified && !isVerified.admin) {
                let property,propertyPrice;
                try {
                    property = await propertyModel.find({_id:req.params.id });
                    propertyPrice = property[0].price;
                } catch (error) {
                    property = "";
                    propertyPrice = "";
                    console.log(error)
                }
                res.cookie("token", req.cookies.token);
                res.render("payment", { verified: true, userType: isVerified.userType, price: propertyPrice, property: property, success: false, failed: false, message: "" });
            }
            else {
                if (isVerified.admin) {
                    res.redirect("/")
                }
                else {
                    res.redirect("/login")
                }
            }
        }
        else {
            res.redirect("/login")
        }
    }
    // chat page
    static chatPageController = async (req, res) => {
        // authenticate user base on cookies
        // authenticate agent id based on db fetch
        // if agent is found add the users to agent and in user also if doesn't exist
        if (req.cookies.token) {
            const isVerified = verifyToken(req.cookies.token);
            if (isVerified && !isVerified.admin) {
                let users_data = [];
                try {
                    const users = await chatModel.find({ users: isVerified.userId });
                    const promises = users.flatMap(function (doc) {
                        return doc.users.map(async function (user) {
                            if (isVerified.userId !== user) {
                                let result = await userModel.find({ _id: user }, { firstName: 1 });
                                users_data.push({ id: user, name: result[0].firstName });
                            }
                            console.log("Users_data from try =>", users_data.reverse());
                        });
                    });

                    await Promise.all(promises);
                    console.log("Users data => ", users_data);
                    if (users_data.length !== 0) {
                        res.render("chat-app", { verified: true, userType: isVerified.userType, users: users_data, isAdmin: isVerified.admin });
                    }
                    else {
                        res.render("chat-app", { verified: true, userType: isVerified.userType, users: "", isAdmin: isVerified.admin });
                    }
                    
                } catch (error) {
                    users_data = "";
                    console.log(error);
                    console.log("Users data => ", users_data);
                    res.render("chat-app", { verified: true, userType: isVerified.userType,users: users_data,isAdmin: isVerified.admin });
                }
                
                
            }
            else {
                res.redirect("/");
            }
        }
        else {
            res.redirect("/");
        }
    }
    // add user
    static addUser = async (req, res) => {
        if (req.cookies.token) {
            const isVerified = verifyToken(req.cookies.token);
            if (isVerified && !isVerified.admin)
            {
                // add the user if doesn't exits in chats
                try {
                    let ifExists = await chatModel.exists({ users: [isVerified.userId, req.params.aid] });
                    console.log("ifExists =>", ifExists);
                    if (ifExists) {
                        res.redirect("/chat");
                    }
                    else {
                        let newChat = new chatModel({
                            users: [isVerified.userId, req.params.aid],
                            messages: []
                        })
                        await newChat.save();
                        res.redirect("/chat");
                    }
                } catch (error) {
                    res.redirect("/chat");
                    console.log(error);
                }
                
            }
            else {
                res.redirect("/")
            }
        }
        else {
            res.redirect("/");
        }
    }
    // chat history api
    static chatHistoryApi = async (req, res) => {
        const sender = verifyToken(req.cookies.token).userId;
        const receiver = req.params.id;
        let messages = [];
        try {
            let result = await chatModel.findOne({ users: { $all: [sender, receiver] } });
            messages = result.messages;
        } catch (error) {
            console.log(error);
        }
        console.log("Messages => ", messages);
        if (messages.length === 0) {
            res.render('message', { haveMessage: false });
        }
        else {
            res.render('message', { haveMessage: true, messages: messages, sender: sender, receiver: receiver });
        }
    }
    // save chat
    static saveChat = async (req, res) => {
        const sender = verifyToken(req.cookies.token).userId;
        const receiver = req.params.id;
        const message = req.body.text;
        console.log("hello from save chat");
        console.log("Message is coming from => ", sender);
        console.log("Message to => ", receiver);
        console.log("Message => ", message);
        try {
            const doc = await chatModel.findOne({ users: { $all: [sender, receiver] } });
            doc.messages.push({ from: sender, to: receiver, message: message });
            doc.save();
            res.status(200).send("ok");
        } catch (error) {
            res.status(500).send("Internal server error");
        }
        
    }
    // images api
    static imageApi = async (req, res) => {
        gfs.files.findOne({ _id: new mongoose.mongo.ObjectId(req.params.id) }, (err, file) => {
            if (!file || file.length === 0) {
                console.log("No file exists");
                res.send("no file");
            }
            else {
                // console.log(file);
                const readstream = gridfsBucket.openDownloadStream(file._id);
                readstream.pipe(res);
            }
        })
    }
    // videos api
    static videoApi = async (req, res) => {
        gfs.files.findOne({ _id: new mongoose.mongo.ObjectId(req.params.id) }, (err, file) => {
            if (!file || file.length === 0) {
                console.log("No file exists");
                res.send("no file");
            }
            else {
                // console.log(file);
                const readstream = gridfsBucket.openDownloadStream(file._id);
                readstream.pipe(res);
            }
        })
    }
    // user list api
    static userListApi = async (req, res) => {
        let users;
        try {
            users = await userModel.find({ email: { $ne: 'siddharthsingh88505@gmail.com' } });
            // console.log(users)
        } catch (error) {
            users = [];
            console.log(error)
        }
        res.render("user-list",{users:users});
    }
    // property list api
    static propertyListApi = async (req, res) => {
        let properties;
        try {
            // getting list of all sold properties
            let orders = await orderModel.find({},{propertyId:1});
            let orders_list=[];
            orders.forEach(order=>{
                // appending property id
                orders_list.push(order.propertyId);
            });
            properties = await propertyModel.find({_id:{ $nin: orders_list }});
            // console.log(properties)
        } catch (error) {
            properties = [];
            console.log(error);
        }
        res.render("property-list",{properties:properties});
    }
    // order list api
    static orderListApi = async (req, res) => {
        let orders;
        try {
            orders = await orderModel.find();
            // console.log(properties)
        } catch (error) {
            orders = [];
            console.log(error);
        }
        res.render("order-list", { orders: orders });
    }
    // delete properties
    static deleteProperties = async (req, res) => {
        let property;
        console.log(req.params.id)
        try {
            property = await propertyModel.find({ _id: req.params.id });
            for (let i = 0; i < property[0].images.length; i++){
                console.log(`Image ${i + 1} id =>`, property[0].images[i].id);
                gridfsBucket.delete(property[0].images[i].id);
                console.log("deleted")
            }
            for (let i = 0; i < property[0].videos.length; i++){
                console.log(`Video ${i + 1} id =>`, property[0].videos[i].id);
                gridfsBucket.delete(property[0].videos[i].id);
                console.log("deleted")
            }
            await propertyModel.deleteOne({ _id: property[0].id });
        } catch (error) {
            console.log(error);
        }
        res.redirect("/admin/dashboard");
    }
    // delete users
    static deleteUser = async (req, res) => {
        console.log(req.params.id);
        let user,properties;
        try {
            user = await userModel.find({ _id: req.params.id });
            properties = await propertyModel.find({ ref_id: user[0].id });
            console.log("user=>", user[0]);
            console.log("properties", properties);
            properties.forEach(property => {
                for (let i = 0; i < property.images.length; i++) {
                    console.log(`Image ${i + 1} id =>`, property.images[i].id);
                    gridfsBucket.delete(property.images[i].id);
                    console.log("deleted")
                }
                for (let i = 0; i < property.videos.length; i++) {
                    console.log(`Video ${i + 1} id =>`, property.videos[i].id);
                    gridfsBucket.delete(property.videos[i].id);
                    console.log("deleted");
                }
                
            })
            for (let i = 0; i < properties.length; i++){
                await propertyModel.deleteOne({ _id: properties[i].id });
            }
            await userModel.deleteOne({ _id: user[0].id });
            
        } catch (error) {
            console.log(error)
        }
        res.redirect("/admin/dashboard");
    }
    // payment handle
    static paymentHandle = async (req, res) => {
        console.log(req.params.id)
        if (req.cookies.token) {
            const isVerified = verifyToken(req.cookies.token);
            if (isVerified && !isVerified.admin) {
                let property,propertyPrice,isBooked;
                try {
                    property = await propertyModel.find({ _id: req.params.id });
                    propertyPrice = property[0].price;
                    // checking whether property is booked or not
                    isBooked = await orderModel.exists({ propertyId: req.params.id });
                } catch (error) {
                    property = "";
                    propertyPrice = "";
                    console.log(error);
                }
                res.cookie("token", req.cookies.token);
                if (!property) {
                    // failed
                    res.render("payment", { verified: true, userType: isVerified.userType, price: propertyPrice, property: property, success: false, failed: true, message: "Something went wrong." });
                }
                else {
                    
                    // check user and agent aren't same
                    if (isVerified.userId === property[0].ref_id) {
                        res.render("payment", { verified: true, userType: isVerified.userType, price: propertyPrice, property: property, success: false, failed: true, message: "User and agent can't be same" });
                    }
                    else {
                        if(isBooked){
                            res.render("payment", { verified: true, userType: isVerified.userType, price: false, property: property, success: false, failed: true, message: "Property is already booked." });
                        }
                        else{
                            // success
                            console.log("Property id =>", property[0].id);
                            console.log("User id =>", isVerified.userId);
                            console.log("Amount =>", property[0].price);
                            console.log(isVerified);
                            try {
                                // get user detail
                                let user = await userModel.find({ _id: isVerified.userId });
                                // get agent detail
                                let agent = await userModel.find({ _id: property[0].ref_id });
                                const doc = new orderModel({
                                    propertyId: property[0].id,
                                    userId: user[0].id,
                                    amount: property[0].price
                                });
                                await doc.save();
                                // mail object
                                // send mail to user
                                console.log(user[0].email, agent[0].email);
                                let mailOptions = {
                                    from: {
                                        name: "RealEstate",
                                        address: "siddharthsingh88505@gmail.com"
                                    },

                                    to: user[0].email, //allowed comma separated mutiple emails
                                    //

                                    // subject
                                    subject: "Successfully paid token amount",

                                    // html
                                    html: `<h3 style='color: black; '>Hey ${user[0].firstName},<br>You have successfully paid token amount of ${property[0].price} to agent<br></h3 >
                        <p>Please find below details of agent to contact</p>
                        <p><b>Agent name : </b><i>${agent[0].firstName} &nbsp; ${agent[0].lastName}</i></p>
                        <p><b>Agent Email : </b><i>${agent[0].email}</i></p><br>
                        <p><b>Agent Contact : </b><i>${agent[0].contact}</i></p>`,
                                
                                };
                                transporter.sendMail(mailOptions, (err, res) => {
                                    if (err) {
                                        console.log(err)
                                    }
                                    else {
                                        console.log(res.response)
                                        // send mail to agent
                                mailOptions = {
                                    from: {
                                        name: "RealEstate",
                                        address: "siddharthsingh88505@gmail.com"
                                    },

                                    to: agent[0].email, //allowed comma separated mutiple emails
                                    //

                                    // subject
                                    subject: "Received token amount from client",

                                    // html
                                    html: `<h3 style='color: black; '>Hey ${agent[0].firstName},<br>paid you token amount of ${property[0].price} successfully.<br></h3 >
                        <p>Please find below details of agent to contact</p>
                        <p><b>Client name : </b><i>${user[0].firstName} &nbsp; ${user[0].lastName}</i></p>
                        <p><b>Client Email : </b><i>${user[0].email}</i></p><br>
                        <p><b>Client Contact : </b><i>${agent[0].contact}</i></p>`,
                                
                                };
                                transporter.sendMail(mailOptions, (err, res) => {
                                    if (err) {
                                        console.log(err)
                                    }
                                    else {
                                        console.log(res.response)
                                    }
                                });
                                    }
                                });

                            }
                            catch (error) {
                                console.log(error);
                            };
                            res.render("payment", { verified: true, userType: isVerified.userType, price: false, property: property, success: true, failed: false, message: "" });
                        }
                        
                    }
                }
                
                
            }
            else {
                res.redirect("/");
            }
        }
        else {
            res.redirect("/")
        }
    }
    // search page
    static searchPageController = async (req, res) => {
        if (req.cookies.token) {
            const isVerified = verifyToken(req.cookies.token);
            console.log(isVerified)
            if (isVerified) {
                res.cookie("token", req.cookies.token);
                res.render("search", { verified: true, userType: isVerified.userType, isAdmin: isVerified.admin, properties: [] });
            }
            else {
                res.render("search", { verified: false, properties: [] });
            }
        }
        else {
            res.render("search", { verified: false, properties: [] });
        }
    }
    // get search result
    static searchProperties = async (req, res) => {
        console.log(req.body);
        const { location, type,noticType, price } = req.body;
        console.log(location, type, price);
        let properties = [];
        try {
            if (location.trim().length>0 && type.length > 2 && noticType.length > 2 && price.length > 2)
            {
                console.log("first");
                let orders = await orderModel.find({},{propertyId:1});
                let orders_list=[];
                orders.forEach(order=>{
                    // appending property id
                    orders_list.push(order.propertyId);
                });
                properties = await propertyModel.find({_id:{ $nin: orders_list }, location: { '$regex': location, $options: 'i' }, type: type, notic: { '$regex': noticType, $options: 'i' }, price: { $lt: price } });
            }
            else if (location.trim().length > 0 && type.length > 2)
            {
                console.log("two");
                let orders = await orderModel.find({},{propertyId:1});
                let orders_list=[];
                orders.forEach(order=>{
                    // appending property id
                    orders_list.push(order.propertyId);
                });
                properties = await propertyModel.find({_id:{ $nin: orders_list }, location: { '$regex': location, $options: 'i' }, type: type });
            }
            else if (location.trim().length > 0 && noticType.length > 2) {
                let orders = await orderModel.find({},{propertyId:1});
                let orders_list=[];
                orders.forEach(order=>{
                    // appending property id
                    orders_list.push(order.propertyId);
                });
                properties = await propertyModel.find({_id:{ $nin: orders_list }, location: { '$regex': location, $options: 'i' }, notic: { '$regex': noticType, $options: 'i' } });
                }
            else if (location.trim().length > 0 && price.length > 2)
            {
                console.log("three");
                let orders = await orderModel.find({},{propertyId:1});
                let orders_list=[];
                orders.forEach(order=>{
                    // appending property id
                    orders_list.push(order.propertyId);
                });
                properties = await propertyModel.find({_id:{ $nin: orders_list }, location: { '$regex': location, $options: 'i' }, price: { $lt: price } });
            }
            else if (type.length > 2 && noticType.length > 2) {
                let orders = await orderModel.find({},{propertyId:1});
                let orders_list=[];
                orders.forEach(order=>{
                    // appending property id
                    orders_list.push(order.propertyId);
                });
                properties = await propertyModel.find({_id:{ $nin: orders_list }, type: type, notic: { '$regex': noticType, $options: 'i' } });
                }
            else if (type.length > 2 && price.length > 2)
            {
                console.log("four");
                let orders = await orderModel.find({},{propertyId:1});
                let orders_list=[];
                orders.forEach(order=>{
                    // appending property id
                    orders_list.push(order.propertyId);
                });
                properties = await propertyModel.find({_id:{ $nin: orders_list }, type: type, price: { $lt: price } });
            }
            else if (noticType.length > 2 && price.length > 2) {
                let orders = await orderModel.find({},{propertyId:1});
                let orders_list=[];
                orders.forEach(order=>{
                    // appending property id
                    orders_list.push(order.propertyId);
                });
                properties = await propertyModel.find({_id:{ $nin: orders_list }, notic: { '$regex': noticType, $options: 'i' }, price: { $lt: price } });
                }
            else if (location.trim().length > 0)
            {
                console.log("five");
                let orders = await orderModel.find({},{propertyId:1});
                let orders_list=[];
                orders.forEach(order=>{
                    // appending property id
                    orders_list.push(order.propertyId);
                });
                properties = await propertyModel.find({_id:{ $nin: orders_list }, location: { '$regex': location, $options: 'i' } });
            }
            else if (type.length > 2)
            {
                console.log("six");
                let orders = await orderModel.find({},{propertyId:1});
                let orders_list=[];
                orders.forEach(order=>{
                    // appending property id
                    orders_list.push(order.propertyId);
                });
                properties = await propertyModel.find({_id:{ $nin: orders_list }, type: type });
                console.log(properties)
            }
            else if (noticType.length > 2) {
                let orders = await orderModel.find({},{propertyId:1});
                let orders_list=[];
                orders.forEach(order=>{
                    // appending property id
                    orders_list.push(order.propertyId);
                });
                properties = await propertyModel.find({_id:{ $nin: orders_list }, notic: { '$regex': noticType, $options: 'i' } });
                }
            else if (price.length > 2)
            {
                console.log("seven");
                let orders = await orderModel.find({},{propertyId:1});
                let orders_list=[];
                orders.forEach(order=>{
                    // appending property id
                    orders_list.push(order.propertyId);
                });
                properties = await propertyModel.find({_id:{ $nin: orders_list }, price: { $lt: price } });
            }
            else {
                console.log("eight");
                properties = [];
            }
        }
        catch (error) {
            console.log(error);
        }
        console.log(properties);
        if (req.cookies.token) {
            const isVerified = verifyToken(req.cookies.token);
            if (isVerified) {
                res.cookie("token", req.cookies.token);
                res.render("search", { verified: true, userType: isVerified.userType, isAdmin: isVerified.admin, properties: properties });
            }
            else {
                res.render("search", { verified: false, properties: properties });
            }
        }
        else {
            res.render("search", { verified: false, properties: properties });
        }
    }
}

export { SiteController };