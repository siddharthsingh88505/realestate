import jwt from "jsonwebtoken";

// function for creating jwt token
function createToken(payload) {
    const token = jwt.sign(
                            payload,
                            process.env.JWT_SECRET_KEY,
                            { expiresIn: "5d" }
    );
    return token;
}

// function for verifying jwt token
function verifyToken(token) {
    try {
        let something = jwt.verify(token, process.env.JWT_SECRET_KEY);
        return something;
    } catch (error) {
        return false;
    }
    
}

export { createToken, verifyToken }; 