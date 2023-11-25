const crypto = require("crypto");
require('dotenv').config();

const channelSecret = process.env.LINE_CHANNEL_SECRET; // Channel secret string

export default async function handler(req, res) {
    try {
        const xLineSignature = req.headers['x-line-signature']; // Access the x-line-signature header
        const requestBody = req.body; // In Next.js, the request body is already parsed
        
        // Calculate the expected signature
        const signature = crypto
          .createHmac("SHA256", channelSecret)
          .update(JSON.stringify(requestBody))
          .digest("base64");
        
        if (signature !== xLineSignature) {
          // Request is not valid
          return res.status(403).json({ error: 'Forbidden' });
        }

        // Your reply logic goes here
        for (const event of requestBody.events) {
            if (event.type === 'message' && event.message.type === 'text') {
                const replyToken = event.replyToken;
                const message = { type: 'text', text: 'Hello' };
                await client.replyMessage(replyToken, message);
            }
        }

        // Send a 200 OK response
        res.status(200).json({ message: 'Success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
