const request = require('request')
const callSendAPI = require('./sendAPI')

module.exports = function handleMessage(senderPSID, receivedMessage) {
    let response
    let message = receivedMessage.text
    let processing = {
        text: "Preparing your recipe..."
    }
    switch(message) {
        case 'Name of Food':
            callSendAPI(senderPSID, { text: 'What are you cooking?. Let me teach you how.'})
            break;
        case 'Picture of Food':
            callSendAPI(senderPSID, { text: 'Send the picture, maybe i can help you...'})
        default:
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
                            console.log(ingredients)
                            ingredients.forEach((ingredient) => {
                                extendedIngredients += `${ingredient.original}
                                `
                            })
                            ingredientText = {
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
                            quickReply = {
                                text: "What would you like to do next?",
                                quick_replies: [
                                    {
                                        content_type: "text",
                                        title: "Get another recipe",
                                        payload: "NAME_OF_FOOD",
                                    },
                                    {
                                        content_type: "text",
                                        title: "Get a Random Recipe",
                                        payload: "Random"
                                    },
                                    {
                                        content_type: "type",
                                        title: "Get a Random food fact",
                                        payload: "Random"
                                        
                                    },
                                    {
                                        content_type: "type",
                                        title: "Get a Random food joke",
                                        payload: "Random"
                                        
                                    }
                                ]
                            }
                            callSendAPI(senderPSID, response)
                            callSendAPI(senderPSID, image)
                            callSendAPI(senderPSID, greeting)
                            callSendAPI(senderPSID, quickReply)
                            } else {
                                console.error(err)
                            }
                    })
                } else {
                    console.error(err)
                }
            })
    }
}