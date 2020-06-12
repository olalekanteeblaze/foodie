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
            "apiKey": process.env.API_KEY,
            "instructionsRequired": true
        },
        "method": "get"
    }, (err, res, body) => {
        if(!err){
            let id = JSON.parse(res.body).results[0].id
            request({
                "uri": `https://api.spoonacular.com/recipes/${id}/information`,
                "qs": {
                    "apiKey": process.env.API_KEY
                },
                "method": "get"
            },(err, res, body) => {
                console.log(res.body)
            })
        } else {
            console.error(err)
        }
    })
}