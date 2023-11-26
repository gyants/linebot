import axios from "axios"
import * as cheerio from 'cheerio'

let iconv = require('iconv-lite')

export async function scrapeTopics(url) {
    const username = String(process.env.BRIGHT_DATA_USERNAME)
    const password = String(process.env.BRIGHT_DATA_PASSWORD)
    const port = 22225
    const session_id = (1000000 * Math.random()) | 0
    const options = {
        auth: {
            username: `${username}-session-${session_id}`,
            password,
        },
        host: 'brd.superproxy.io',
        port,
        rejectUnauthorized:false,
        encoding: null,
        responseType: 'arraybuffer',
    }

    try {
        // Fetch
        const response = await axios.get(url, options)
        const decodedData = iconv.decode(response.data, 'tis-620')
        const $ = cheerio.load(decodedData)
        
        const topicText = $('a > font[size="4"][color="#7F00FF"][face="Tahoma"]')

        const extractedTextArray = [];

        // Use the selector to find elements and extract text into the array
        $(topicText).each((index, element) => {
            const extractedText = element.children[0].data;
            const extractedUrl = element.parent.attribs.href.trim()
            const fontSiblings = $(element.parent).siblings('font');
            const username = $(fontSiblings[0]).text().trim();
            const dateTime = $(fontSiblings[1]).text().trim();
            const replyCountMatch = $(fontSiblings[2]).text().trim().match(/\((\d+)\n\)/);
            const replyCount = replyCountMatch ? replyCountMatch[1] : null

            if (extractedText && extractedUrl) {
                extractedTextArray.push({
                    topic: extractedText,
                    url: extractedUrl,
                    username,
                    dateTime,
                    replyCount
                });
            }
        })
        console.log(username, password)
        return extractedTextArray
    } catch (error) {
        throw new Error(`Failed to scrape Palm: ${error}`)
    }
}
