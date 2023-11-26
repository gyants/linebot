"use server"
import axios from "axios"
import { scrapeTopics } from "../scraper"

export async function scrapeEvilBoard(url) {
    if(!url) return

    try {
        const scrapedTopics = await scrapeTopics(url)
        return scrapedTopics
    } catch (error) {
        throw new Error(`Could not scrape Evil: ${error}`)
    }
}

export async function notifyLine(topicObject, type) {
    const access_token = String(process.env.LINE_NOTIFY_TOKEN)
    const line_notify_url = 'https://notify-api.line.me/api/notify'
    const message = type == 'follow' ? `You are following ${topic.topicName}\n${topic.url}` : `There is an update in ${topic.topicName}\n${topic.url} `
    const options = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${access_token}`
        },
    }
    // if(!message) return
    
    try {
        const response = await axios.post(line_notify_url,{ message },options)
        return response.status

    } catch (error) {
        throw new Error(`Could not notify: ${error}`)
    }
}