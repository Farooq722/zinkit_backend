const bcrypt = require("bcryptjs");
const cookie = require("cookie-parser");
const jwt = require("jsonwebtoken");

const sendEmail = require("../mongoose/resend");
const verificationEmail = require("../utils/verifyEmailTemplate");
const forgetPassword1 = require("../utils/forgetPassword");
const User = require("../models/userModel");
const accessToken  = require("../utils/accessToken");
const refreshToken = require("../utils/refreshToken");
const uploadImage = require("../utils/uploadImage");
const generateOtp = require("../utils/generateOtp");

async function registerUser(req, res)  {

    try {
        const { name, email, password } = req.body;

        if(!name || !email || !password) {
            return res.status(400).json({
                msg: "fill required feildds",
                error: true,
                success: false
            })
        }

        const user = await User.findOne({ email });
        if(user) {
            return res.json({
                msg: "User Already Registered",
                error: true,
                success: false
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const payload = {
            name,
            email,
            password: hashPassword
        }

        const newUser = new User(payload);
        const save = newUser.save();

        const verifyEmail = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`;

       await sendEmail({
            sendTo: email,
            subject: "Verify email from zinkit",
            html: verificationEmail({
                name,
                url:  verifyEmail
            })
        });

        // console.log(save);
        return res.json({
            msg: "User register successfully",
            error: false,
            success: true,
            data: await save
        });

    } catch(err) {
        return res.status(500).json({
            msg: err.message || err,
            error: true,
            success: false
        })
    }
}

async function verifyEmailController(req, res) {
    try {
        const { code } = req.body;

        const user = await User.findOne({_id: code});
        if(!user) {
            return res.status(400).json({
                msg: "Invalid credentials",
                error: true,
                success: false
            })
        }

        const updateUser = await User.updateOne({_id: code},{
            verify_email: true
        })

        return res.json({
            msg: "Verificaion Email done",
            error: false,
            success: true
        });

    } catch(err) {
        return res.status(500).json({
            msg: err,
            error: true,
            success: false 
        })
    }
}

async function loginController(req, res) {
    
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(500).json({
                msg: "Provide valid credentials"
            })
        }

        const user = await User.findOne({ email });
        if(!user) {
            return res.status(404).json({
                msg: "User is not Registered"
            });
        }

        if(user.status == "Inactive" || user.status == "Suspened"){
            return res.status(402).json({
                msg: "Contact to admin"
            });
        }

        const checkPassword = bcrypt.compare(password, user.password);

        if(!checkPassword) {
            return res.status(400).json({
                msg: "Enter valid password"
            });
        }

        const accessToken1 = await accessToken(user._id);
        const refreshToken1 = await refreshToken(user._id);
            
        const cookieOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }
        res.cookie('accessToken', accessToken1 , cookieOption)
        res.cookie('refreshToken', refreshToken1 , cookieOption)


        return res.json({
            msg: "Login successfull",
            data: {
                accessToken1,
                refreshToken1
            }
        });

    }catch(err) {
        return res.status(500).json({
            msg: err.message || err,
            error: true,
            success: false
        });
    }
}

async function logoutController(req, res) {

    try{

        const userId = req.userId;
        const removeRefreshToken = await User.findByIdAndUpdate(userId, {
            refresh_token:""
        })
        
        const cookieOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        res.clearCookie("accessToken", cookieOption)
        res.clearCookie("refreshToken", cookieOption)

        return res.json({
            msg: "Logout successfull",
            error: false,
            success: true
        });

    } catch(err){
        return res.status(500).json({
            msg: err.message || err,
            error: true,
            success: false
        });
    }
}

async function uploadAvatar(req, res) {

    try {
        const userId = req.userId;

        const image = req.file;
        const upload = await uploadImage(image);
        const updateUser = await User.findByIdAndUpdate(userId, {
            avatar: upload.url
        })
        // console.log(upload.url);

        return res.status(200).json({
            msg: "profile uploaded",
            
        })

    } catch (err) {
        return res.status(500).json({
            msg: err.message || err,
            error: true,
            success: false
        });
    }
}

async function updateUserProfile(req, res) {
    try {
        const userId = req.userId;
        const { name, email, password, number} = req.body;

        let hashPassword = "";
        if(password) {
            const salt = await bcrypt.genSalt(10);
            hashPassword = await bcrypt.hash(password, salt);
        }

        const updateUser = await User.updateOne({_id: userId}, {
            ...(name && {name: name}),
            ...(email && {email: email}),
            ...(password && {password: hashPassword}),
            ...(number && {number: number})
        })
        
        return res.status(200).json({
            msg: "Updated data",
            error: false,
            success: true,
            data: updateUser
        });

    } catch (err) {
        return res.status(500).json({
            msg: err.message || err,
            errpr: true,
            success: false
        });
    }
}

async function forgetPassword(req, res) {
    try {
        
        const { email } = req.body;

        const user = await User.findOne({email});
        if(!user) {
            return res.status(404).json({
                msg: "User Email not found"
            });
        }

        const otp = generateOtp();
        console.log("otp", otp);
        const expireTime = new Date() + 60 * 60 * 1000; //1hr
        const updateOtp = await User.findByIdAndUpdate(user._id,{
            forget_password_otp: otp,
            forget_password_expiry: new Date(expireTime).toISOString()
        })

        await sendEmail({
            sendTo: email,
            subject: "Forget password form zinkit",
            html: forgetPassword1({
                name: user.name,
                otp: otp
            })
        })
        return res.json({
            msg: "Check your mail"
        });

    } catch (err) {
        return res.status(500).json({
            msg: err.message || err,
            error: true,
            success: false
        })
    }
}

async function verifyForgetPasswordOtp(req, res) {
    try {
        
        const { email, otp } = req.body;

        if(!email || !otp) {
            return res.status(400).json({
                msg: "Provide valid email or OTP"
            });
        }

        const userExit = await User.findOne({email});
        if(!userExit) {
            return res.status(404).json({
                msg: "Email not found"
            });
        }

        const currentTime = new Date().toISOString();
        if(userExit.forget_password_expiry < currentTime) {
            return res.status(400).json({
                msg: "OTP expired try again"
            })
        }

        if(otp != userExit.forget_password_otp) {
            return res.json({
                msg: "Invalid OTP"
            });
        }

        return res.status(200).json({
            msg: "Verification success",
            error: false,
            success: true
        })

    } catch (err) {
        return res.status(500).json({
            msg: err.message || err,
            error: true,
            success: false
        })
    }
}

async function resetPassword(req, res) {
    try {
        const { email, newPassword, confirmPassword } = req.body;

        if(!email || !newPassword || !confirmPassword) {
            return res.status(400).json({
                msg: "Provide required details"
            });
        }

        const user = await User.findOne({ email });
        if(!user) {
            return res.status(404).json({
                msg: "Email not found"
            });
        }

        if(newPassword != confirmPassword) {
            return res.status(400).json({
                msg: "Both feilds are not same"
            });
        }

        let hashPassword = "";
        const salt = await bcrypt.genSalt(10);
        hashPassword = await bcrypt.hash(newPassword, salt);

        const update = await User.findOneAndUpdate(user._id, {
            password: hashPassword
        });

        return res.status(200).json({
            msg: "Update password successfull",
            error: false,
            success: true
        });

    } catch (err) {
        return res.status(500).json({
            msg: err.message || err,
            error: true,
            success: false
        })
    }
}

async function refreshToken1(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken || req?.header?.authorization?.split(" ")[1];

        if(!refreshToken) {
            return res.status(400).json({
                msg: "Invalid token"
            })
        }

        const verifyToken = jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH);
        if(!verifyToken) {
            return res.json({
                msg: "Token expired"
            });
        }

        const userId = verifyToken._id;
        const newAccessToken = accessToken(userId);
        const cookieOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }
        res.cookie('accessToken', newAccessToken, cookieOption);

        return res.status(200).json({
            msg: "New access token generated",
            error: false,
            success: true,
            data: {
                accessToken: newAccessToken
            }
        });

    } catch (err) {
        return res.status(500).json({
            msg: err.message || err,
            error: true,
            success: false
        });
    }

}

module.exports = {
    registerUser,
    verifyEmailController,
    loginController,
    logoutController,
    uploadAvatar,
    updateUserProfile,
    forgetPassword,
    verifyForgetPasswordOtp,
    resetPassword,
    refreshToken1,
}
