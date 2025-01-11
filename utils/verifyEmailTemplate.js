const verificationEmail = ({name, url}) => {
    return `
    <p>Dear ${name}</p>
    <p>Thank you for registering zinkit</p>
    <a href=${url} style="color:white;background:blue;margin-top:10px">
    Verify email here
    </a>
    
    `
}

module.exports = verificationEmail;