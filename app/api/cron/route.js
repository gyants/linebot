import { NextResponse } from "next/server";
import { notifyLine, scrapeEvilBoard } from "@/lib/actions";
import Topic from "@/lib/models/topic.model";
import { connectToDB } from "@/lib/mongoose";

export const maxDuration = 10; // This function can run for a maximum of 300 seconds
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request) {
    try {
        connectToDB()
        const topics = await Topic.find({})
        

        if (!topics) throw new Error('No topics fetched')

        // Scrape and check the topics that match
        const url = new URL("https://www.palm-plaza.com/cgi-bin/CCforum/board.cgi?az=list&forum=DCForumID4&archive=")
        const scrapedTopics = await scrapeEvilBoard(url)
        const updatedTopics = await Promise.all(scrapedTopics.map(async scrapedTopic => {
            const matchingTopicInDB = topics.find(topicInDB => topicInDB.topicName === scrapedTopic.topicName);
          
            if (matchingTopicInDB) {
              if (matchingTopicInDB.replyCount !== scrapedTopic.replyCount) {
                console.log(matchingTopicInDB, scrapedTopic);
                try {
                  await Topic.updateOne({ topicName: matchingTopicInDB.topicName }, { $set: { replyCount: Number(scrapedTopic.replyCount) } });
                  console.log('Updated:', matchingTopicInDB.topicName);
                  return matchingTopicInDB;  // Return the updated topic
                } catch (error) {
                  console.log(`Error updating topic: ${error}`);
                  return null;  // Return null for topics that couldn't be updated
                }
              }
            }
          }))
        
        // Notify when updates are found
        updatedTopics.forEach(topic => {
            if(topic) notifyLine(topic.topicName, 'update')
        })
        
        return NextResponse.json({
            message:'Ok',
            data: updatedTopics
        })
        
    } catch (error) {
        throw new Error(`Failed to update topics: ${error}`)
    }
}