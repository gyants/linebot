const crypto = require("crypto")
import { Client } from '@line/bot-sdk'
import { headers } from 'next/headers'
import { notifyLine, scrapeEvilBoard } from '@/lib/actions';
import { deleteAllTopic, extractAndToString, saveTopicToDB } from '@/lib/utils';

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
async function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        // ignore non-text-message event
        return Promise.resolve(null);
    }
    // Echo text message
    const url = new URL("https://www.palm-plaza.com/cgi-bin/CCforum/board.cgi?az=list&forum=DCForumID4&archive=")
    const topics = await scrapeEvilBoard(url)
    const topicsString = extractAndToString(topics)
    
    const messageText = event.message.text

    if (messageText.startsWith('follow ') || messageText.startsWith('Follow ')) {
        const topicToFollow = messageText.includes('follow ') ? messageText.split('follow ')[1] : messageText.split('Follow ')[1]
        const topicObject = topics.find(obj => obj.topicName.includes(topicToFollow))
        saveTopicToDB(topicObject)
        notifyLine(topicObject,'follow')
        return client.replyMessage(event.replyToken, {
            type: 'text',
            text: `Following ${topicObject.topicName}`
        })
    } else if(messageText.startsWith('unfollow') || messageText.startsWith('Unfollow')) {
        deleteAllTopic()
        return client.replyMessage(event.replyToken, {
            type: 'text',
            text: 'Unfollowed'
        })
    } else if(!topicsString.includes(messageText)){
        return client.replyMessage(event.replyToken, {
            type: 'text',
            text: topicsString
        });
    }
    
}
  