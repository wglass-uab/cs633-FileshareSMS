const nodemailer = require("nodemailer");

const email_info = {
	service: 'gmail',
	host:"smtp.gmail.com",
	port: 465, 
	secure:true,
  auth: {	
		type: 'OAuth2',
		user: 'heeshin174@gmail.com',
		clientId: '585540904993-1rdh4fisagut0uee5h83kkd3866k5nue.apps.googleusercontent.com', 
		clientSecret: 'B5tRhG78IApdkJAB782YeeYE', 
		refreshToken: '1//04jmQK44zCdptCgYIARAAGAQSNwF-L9Ir-qA_Fr39nrkjQnykFwzS67qo9CD3lGH0W6b-cT3TMnoGl8XFYC2YHGS_-r1uz_Lc4Ig',
		accessToken: 'ya29.a0ARrdaM-VJ4bnlFJphnKIJqF4wirqJOhtF5fgJljRV-PrgZzn9UsnRESkISL2l2I73vetv7nVrBf8E4xAu8Gp2HgXf0PZCcYp_yNAORU3lZ2Cr9g5kXddsXeW97kzYRrPopJyKUEgxCdkH0bV72Rn9uG6N02I',
		expires: 3600
	}
}

const email_template = {
	from : 'heeshin174@gmail.com',
	to : "woodglass@yahoo.com", 
	subject: "Order detail",
	html: ""
};

const send_email = async (data) => 
  nodemailer.createTransport(email_info).sendMail(
    data, 
    (error, info) => {
      if(error) {
	      console.error(JSON.stringify(error));
	    } else {
	      console.log(info);
	      return info.response;
	    }
    }
  );
  
module.exports = {send_email,email_template};