"use server"

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