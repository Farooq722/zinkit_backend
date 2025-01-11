const {Resend} = require("resend");
const dotenv = require("dotenv");

dotenv.config();

if(!process.env.RESEND_API) {
    console.log("Provide resend-api in side the .env file");
}
const resend = new Resend(process.env.RESEND_API);

const sendEmail = async ({ sendTo, subject, html}) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'zinkit <onboarding@resend.dev>',
                to: sendTo,
                subject: subject,
                html: html,
          });

          if (error) {
            return console.error({ error });
          }
        
          console.log({ data });

    } catch(err) {
        console.log(err);
    }
}

module.exports = sendEmail;