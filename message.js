const request = require('request')
const callSendAPI = require('./sendAPI')

module.exports = function handleMessage(senderPSID, receivedMessage) {
    let response
    let message = receivedMessage.text
    let attachment = receivedMessage.attachments[0]
    let processing = {
        text: "Preparing your recipe..."
    }
    const quickReply = {
        text: "What would you like to do next?",
        quick_replies: [
            {
                content_type: "text",
                title: "another recipe",
                payload: "NAME_OF_FOOD",
            },
            {
                content_type: "text",
                title: "Random Recipe",
                payload: "Random_recipe"
            },
            {
                content_type: "text",
                title: "Random food fact",
                payload: "Random_fact"
                
            },
            {
                content_type: "text",
                title: "Random food joke",
                payload: "Random_joke"
                
            }
        ]
    }
    switch(message) {
        case 'Name of Food':
            callSendAPI(senderPSID, { text: 'What are you cooking?. Let me teach you how.'})
            break;
        case 'Picture of Food':
            callSendAPI(senderPSID, { text: 'Send the picture, maybe i can help you...'})
        default:
            callSendAPI(senderPSID, processing)
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
                        if(!err) { 
                            let extendedIngredients = 'These are the needed ingredients'
                            const ingredients = JSON.parse(res.body).extendedIngredients
                            ingredients.forEach((ingredient) => {
                                extendedIngredients += `${ingredient.original}
                                `
                            })
                            const ingredientText = {
                                text: extendedIngredients
                            }
                            callSendAPI(senderPSID, ingredientText)
                            response = {
                                text: JSON.parse(res.body).instructions,
                            }
                            const image = {
                                attachment: {
                                    type: "image",
                                    payload: {
                                        url: JSON.parse(res.body).image,
                                        is_reusable: true
                                    }
                                }
                            }
                            const greeting = {
                                text: "Enjoy your meal, hope to see you again"
                            }
                            callSendAPI(senderPSID, response)
                            callSendAPI(senderPSID, image)
                            setTimeout( () => callSendAPI(senderPSID, greeting), 3000)
                            } else {
                                console.error(err)
                            }
                    })
                } else {
                    console.error(err)
                }
                setTimeout(() => callSendAPI(senderPSID, quickReply), 10000)
            })
    }
    if(attachment.type === 'image') {
        console.log(attachment.payload.url)
    }
}