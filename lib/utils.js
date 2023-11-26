import Topic from "./models/topic.model"
import { connectToDB } from "./mongoose"

function extractTopic(array) {
    const topicsArray = array.map(obj => obj.topic)
    return topicsArray
}

function arrayToString(topicsArray){
    const topicsString = topicsArray.join('\n')
    return topicsString
}

export function extractAndToString(array){
    const topicsArray = extractTopic(array)
    const topicsString = arrayToString(topicsArray)
    return topicsString
}

export async function saveTopicToDB(topicObject){
    if(!topicObject) return
    try {
        connectToDB()
        const newTopic = new Topic({
            topicName: topicObject.topic,
            replyCount: Number(topicObject.replyCount)
        })

        await newTopic.save()

    } catch (error) {
        throw new Error(`Couldn not save topic: ${error}`)
    }
}

export async function deleteAllTopic() {
    try {
        connectToDB()
        // const topics = await Topic.find({})
        const deleteResult = await Topic.deleteMany({})
        console.log(`Deleted ${deleteResult.deletedCount} topics`)
    } catch (error) {
        throw new Error(`Couldn not delete all topic: ${error}`)
    }
}