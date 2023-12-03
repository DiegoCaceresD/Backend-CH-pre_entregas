import nodemailer from "nodemailer";
import config from "../config/config.js";
import _dirname from "../utils.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: config.gmailAccount,
    pass: config.gmailAppPassword,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.error(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

const mailOptions = {
  from: "Coder " + config.gmailAccount,
  to: config.gmailAccount,
  subject: "Correo de prueba",
  html: `<div>
            <h1> Esto es un Test </h1>
                <p> Curso Backend </p>
    </div>`,
  attachments: [],
};

const mailOptionsWithAttachments = {
  from: "Coder " + config.gmailAccount,
  to: config.gmailAccount,
  subject: "Correo de prueba",
  html: `<div>
            <h1> Esto es un Test </h1>
            <p> Ahora usando imagenes </p>
            <img src = "cid:meme" /> 
        </div>`,
  attachments: [
    {
        filename: 'Meme de programacion.jpg',
        path: _dirname + '/public/images/meme-programacion.jpg',
        cid: 'meme'
    }
  ],
};

export const sendEmail = (req, res) => {
  try {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        res.status(400).send({ message: "Error", payload: error });
      }

      console.log("Message sent: %s", info.messageId);
      res.send({ message: "success", payload: info });
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({
        error: error,
        message: "No se ha podido enviar el mail desde: " + config.gmailAccount,
      });
  }
};


export const sendEmailWithAttachments = (req, res) => {
    try {
        transporter.sendMail(mailOptionsWithAttachments, (error, info) => {
            if (error) {
              console.error(error);
              res.status(400).send({ message: "Error", payload: error });
            }
      
            console.log("Message sent: %s", info.messageId);
            res.send({ message: "success", payload: info });
          });
    } catch (error) {
        console.error(error);
    res
      .status(500)
      .send({
        error: error,
        message: "No se ha podido enviar el mail desde: " + config.gmailAccount,
      });
    }
}