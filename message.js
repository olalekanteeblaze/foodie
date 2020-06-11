const request = require('request')
const callSendAPI = require('./sendAPI')

module.exports = function handleMessage(senderPSID, receivedMessage) {
    let response
    let message = receivedMessage.text
    request({
        "uri": 'https://api.spoonacular.com/recipes/search',
        "qs": {
            "query": message,
            "number": 1,
        },
        "method": "get"
    }, (err, res, body) => {
        if(!err){
            console.log(res)
        } else {
            console.error(err)
        }
    })
}