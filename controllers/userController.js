import { userModel } from "../models/userModel.js";
import { propertyModel } from "../models/propertyModel.js";
import bcrypt from "bcrypt";
import { createToken } from "../token.js";
import { verifyToken } from "../token.js";


class UserController{
    // registration 
    static userRegistration = async (req, res) => {
        try {
            console.log(req.body);
            let { firstName, lastName, userType, contact, email, password, cnfpassword, tc } = req.body;
            firstName = firstName.toLowerCase();
            lastName = lastName.toLowerCase();
            // checking all fields are provided or not
            if (firstName && lastName && userType && contact && email && password && cnfpassword && tc) {
                // checking user already exists or not
                const user = await userModel.findOne({ $or: [{ "email": email }, { "contact": contact }] });
                if (!user) {
                    if (password === cnfpassword) {
                        try {
                            const salt = await bcrypt.genSalt(10);
                            const hash_password = await bcrypt.hash(password, salt);
                            if (userType === '1') {
                                userType = "User";
                            }
                            else {
                                userType = "Agent";
                            }
                            const doc = new userModel({
                                firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
                                lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1),
                                userType: userType,
                                contact: contact,
                                email: email.toLowerCase(),
                                password: hash_password,
                                tc: tc
                            });

                            // save user
                            await doc.save();
                            const saved_user = await userModel.findOne({ email: email });
                            res.render("register", {
                                data: {
                                    firstName: "",
                                    lastName: "",
                                    userType: "-1",
                                    contact: "",
                                    email: "",
                                    password: "",
                                    cnfpassword: "",
                                    tc: '0'
                                }, status: "Success", message: "User registered successfully"
                            });
                        }
                        catch (error) {
                            console.log(error)
                            res.render("register", { data: req.body, status: "Failed", message: "Something went wrong" });
                        }
                    }
                    else {
                        res.render("register", { data: req.body, status: "Failed", message: "Password does not match" });
                    }
                }
                else {
                    const user = await userModel.findOne({ "contact": contact });
                    if (user) {
                        res.render("register", { data: req.body, status: "Failed", message: "Contact already exists" });
                    }
                    else {
                        res.render("register", { data: req.body, status: "Failed", message: "Email already exists" });
                    }
                }
                
            }
            else {
                res.render("register", { data: req.body, status: "Failed", message: "All fields are mandatory" });
            }
        }
        catch (error) {
            res.render("register", { data: req.body, status: "Failed", message: "Something went wrong." });
            console.log(error);
        }
    };

    // login
    static userLogin = async (req, res) => {
        try {
            const { email, password } = req.body;
            // email password is provided or not
            if (!(email && password)) {
                res.render("login",{ data:req.body, status: "Failed", message: "All fields are mandatory"});
            }
            else {
                const user = await userModel.findOne({ email: email });
                if (!user) {
                    res.render("login",{ data:req.body, status: "Failed", message: "User not found"});
                }
                else {
                    const isMatch = await bcrypt.compare(password, user.password);
                    if (user.email === email && isMatch) {
                        const saved_user = await userModel.findOne({ email: email });
                        let jwt_token;
                        if (email === "siddharthsingh88505@gmail.com") {
                            // creating jwt token
                            jwt_token = createToken({ userId: saved_user._id, userType: saved_user.userType, admin: true });
                            // sending response with token as cookie
                            res.cookie("token", jwt_token);
                            res.redirect("/");
                        }
                        else {
                            // creating jwt token
                            jwt_token = createToken({ userId: saved_user._id, userType: saved_user.userType, admin:false });
                            // sending response with token as cookie
                            res.cookie("token", jwt_token);
                            res.redirect("/");
                        }
                    }
                    else {
                        res.render("login",{ data:req.body, status: "Failed", message: "Email or password doesn't match",});
                    }
                }
            }
        }
        catch (error) {
            console.log(error)
            res.render("login",{ data:req.body, status: "Failed", message: "Something error occured"});
        }
    };

    // update userType from user to agent
    static updateUser = async (req, res) => {
        try {
            const { email, password } = req.body;
            // email password is provided or not
            if (!(email && password)) {
                res.render("register-as-agent",{ data:req.body, status: "Failed", message: "All fields are mandatory"});
            }
            else {
                const user = await userModel.findOne({ email: email });
                if (!user) {
                    res.render("register-as-agent",{ data:req.body, status: "Failed", message: "User not found"});
                }
                else {
                    const isMatch = await bcrypt.compare(password, user.password);
                    if (user.email === email && isMatch) {
                        const saved_user = await userModel.findOneAndUpdate({ email: email },{userType:"Agent"});
                        // creating jwt token
                        let jwt_token = createToken({ userId: saved_user._id, userType: saved_user.userType });
                        // sending response with token as cookie
                        res.cookie("token", jwt_token);
                        // res.redirect("/");
                        res.render("register-as-agent", {
                            data: {
                                firstName: "",
                                password:""
                        }, status: "Success", message: "Updated Successfully.",});
                    }
                    else {
                        res.render("register-as-agent",{ data:req.body, status: "Failed", message: "Email or password doesn't match",});
                    }
                }
            }
        }
        catch (error) {
            console.log(error)
            res.render("register-agent",{ data:req.body, status: "Failed", message: "Something error occured"});
        }
    };

    // upload property data
    static uploadProperty = async (req, res) => {
        console.log(req.files);
        const files = req.files;
        const { name, location, description, price, area, bedroom, bathroom, owner, type, city, noticType } = req.body;
        let images = [];
        for (let i = 0; i < files.image.length; i++) {
            // filter files data
            let imageData = {
                id: files.image[i].id,
                name: files.image[i].filename
            };
            // add data to images array
            images.push(imageData);
        }
        let videos = [];
        // check video is available or not
        if (files.video) {
            for (let i = 0; i < files.video.length; i++) {
                // filter files data
                let videoData = {
                    id: files.video[i].id,
                    name: files.video[i].filename
                };
                // add data to videos array
                videos.push(videoData);
            }
        }
        
        if (req.cookies.token) {
            // token verification
            const isVerified = verifyToken(req.cookies.token);
            if (isVerified) {
                try {
                    if (isVerified.userType === 'Agent' && !isVerified.admin) {
                        // new document
                        const doc = new propertyModel({
                            ref_id: isVerified.userId,
                            name: name,
                            location: location,
                            description: description,
                            price: price,
                            area: area,
                            bedroom: bedroom,
                            bathroom: bathroom,
                            owner: owner,
                            type: type,
                            city: city,
                            notic: noticType.toUpperCase(),
                            images: images,
                            videos: videos
                        });
                        // save document
                        await doc.save();
                        res.render("upload-property",
                            {
                                verified: true, userType: isVerified.userType,
                                data: {
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
                                },
                                status: "Success", message: "Property uploaded successfully", isAdmin: isVerified.admin
                            });
                    }
                    else if (isVerified.admin) {
                        res.render("upload-property",
                            {
                                verified: true, userType: isVerified.userType,
                                data: {
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
                                },
                                status: "Failed", message: "Admin cannot upload property", isAdmin: isVerified.admin
                            });
                    }
                    else {
                        res.render("upload-property",
                            {
                                verified: true, userType: isVerified.userType,
                                data: {
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
                                },
                                status: "Failed", message: "Please register yourself as agent", isAdmin: isVerified.admin
                            });
                    }
                }
                catch (error) {
                    console.log(error)
                    res.render("upload-property", {
                        verified: true, userType: isVerified.userType, data: {
                            name: name,
                            location: location,
                            description: description,
                            price: price,
                            area: area,
                            bedroom: bedroom,
                            bathroom: bathroom,
                            owner: owner,
                            type: type,
                            city: city
                        }, status: "Failed", message: " Something went wrong", isAdmin: isVerified.admin
                    });
                }
                
            }
            else {
                res.render("upload-property", {
                    verified: false, data: {
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
                    }, status: "Failed", message: "Please login first"
                });
            }
        }
        else {
            res.render("upload-property", {
                verified: false, data: {
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
                }, status: "Failed", message: "Please login first"
            });
        }
    };
}

export { UserController };
