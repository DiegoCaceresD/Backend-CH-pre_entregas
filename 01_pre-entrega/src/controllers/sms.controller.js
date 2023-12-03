import config from "../config/config.js";
import twilio from "twilio";

const twilioClient = twilio(
  config.twilioAccountSID,
  config.twilioAuthToken
);

const twilioSMSOptions = {
  body: "Esto es un mensaje SMS de prueba usando Twilio",
  from: config.twilioSmsNumber,
  to: config.twilioToSmsNumber,
};

export const sendSMS = async (req, res) => {
  try {
    console.log('Envio de SMS usando Twilio');
    console.log(twilioClient);
    const result = await twilioClient.messages.create(twilioSMSOptions)
    res.send({msg: 'Succes', payload: result})
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error });
  }
};
