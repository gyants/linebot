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