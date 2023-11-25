const crypto = require("crypto")
require('dotenv').config()
import { Client } from '@line/bot-sdk'
import { headers } from 'next/headers'

const client = new Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
});

const channelSecret = process.env.LINE_CHANNEL_SECRET; // Channel secret string

export const POST = async (req) => {
    const headersList = headers()
    const body = await req.json()
    // x-line-signature verification
    const xLineSignature = headersList.get('x-line-signature');
    const signature = crypto
      .createHmac("SHA256", channelSecret)
      .update(JSON.stringify(body))
      .digest("base64");
    console.log(body)

    if (signature !== xLineSignature) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
        });
    }

    // Check if events array exists and handle each event
    if (body.events && Array.isArray(body.events)) {
        try {
        const results = await Promise.all(body.events.map(handleEvent));
        return new Response(JSON.stringify(results), {
            status: 200,
        });
        } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
        });
        }
    } else {
        // No events found in the webhook object
        return new Response(JSON.stringify({ error: 'No events found' }), {
        status: 400,
        });
    }
};
  
// Handling each event
function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        // ignore non-text-message event
        return Promise.resolve(null);
    }
    // Echo text message
    return client.replyMessage(event.replyToken, {
        type: 'text',
        text: event.message.text
    });
}
  