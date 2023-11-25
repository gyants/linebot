const crypto = require("crypto");
require('dotenv').config();

const channelSecret = process.env.LINE_CHANNEL_SECRET; // Channel secret string

export const POST = async (req, res) => {
    try {
      const xLineSignature = req.get("x-line-signature"); // Get the x-line-signature header from the request
      const requestBody = await req.json(); // Parse the JSON request body
      
      // Calculate the expected signature
      const signature = crypto
        .createHmac("SHA256", channelSecret)
        .update(JSON.stringify(requestBody))
        .digest("base64");
      
      if (signature !== xLineSignature) {
        // Request is not valid, reject it or handle the error
        // Send an error response, e.g., 403 Forbidden
        return res.sendStatus(403);
      }
  
      // Request is valid, proceed with handling it
  
      // Your reply logic goes here
      for (const event of requestBody.events) {
        if (event.type === 'message' && event.message.type === 'text') {
          const replyToken = event.replyToken;
          const message = { type: 'text', text: 'Hello' };
          await client.replyMessage(replyToken, message);
        }
      }
  
      // Send a 200 OK response to acknowledge receipt of the webhook
      return res.sendStatus(200);
    } catch (error) {
      console.error(error);
      // Handle any errors that may occur during request processing
      // Send an appropriate error response
      return res.status(500).json({ error: 'Something went wrong' });
    }
  }