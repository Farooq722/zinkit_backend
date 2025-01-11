const forgetPassword = ({name, otp}) => {
    return `
    
    <div>
    <p>Dear ${name} </p>
    <p>you are requested a reset password. please use following otp code to reset you password. </p>
    <div>${otp}</div>
    <p>OTP valids only upto 1 hour </p>
    <p> THANKS </p>
    <p> ZINKIT </p>
    </div>
    `
}
module.exports = forgetPassword;