const request = require('request')
const callSendAPI = require('./sendAPI')

module.exports = function handleMessage(senderPSID, receivedMessage) {
    let response
    let message = receivedMessage.text
    console.log(senderPSID)
    let attachment = receivedMessage && receivedMessage.attachments && receivedMessage.attachments[0]
    let processing = {
        text: "Preparing your recipe..."
    }
    const quickReply = {
        text: "What would you like to do next?",
        quick_replies: [
            {
                content_type: "text",
                title: "get another recipe",
                payload: "NAME_OF_FOOD",
            },
            {
                content_type: "text",
                title: "get a random recipe",
                payload: "Random_recipe"
            },
            {
                content_type: "text",
                title: "tell me a food fact",
                payload: "Random_fact"
                
            },
            {
                content_type: "text",
                title: "tell me a joke",
                payload: "Random_joke"
                
            }
        ]
    }
    console.log(message)
    if(message) {
        switch(message) {
            case 'Name of food':
                callSendAPI(senderPSID, { text: 'What are you cooking?. Let me teach you how.'})
                break;
            case 'Picture of food':
                callSendAPI(senderPSID, { text: 'Send the picture, maybe i can help you...'})
                break;
            case 'get another recipe':
                const response = {
                    text: "Get recipe using:",
                    quick_replies: [
                        {
                            content_type: "text",
                            title: "Name of food",
                            payload: "NAME_OF_FOOD",
                        },
                        {
                            content_type: "text",
                            title: "Picture of food",
                            payload: "PICTURE",
                        }
                    ]
                }
                callSendAPI(senderPSID, response)
                break;
            case 'get a random recipe':
                request({
                    "uri": `https://api.spoonacular.com/recipes/random`,
                    "qs": {
                        "apiKey": process.env.API_KEY,
                        "number": 1
                    },
                    "method": "get"
                },(err, res, body) => {
                    if(!err) { 
                        console.log(res.body)
                        let extendedIngredients = 'These are the needed ingredients'
                        const ingredients = JSON.parse(res.body).recipes[0].extendedIngredients
                        ingredients.forEach((ingredient) => {
                            extendedIngredients += `
${ingredient.original}`
                        })
                        const ingredientText = {
                            text: extendedIngredients
                        }
                        callSendAPI(senderPSID, ingredientText)
                        const response = {
                            text: JSON.parse(res.body).recipes[0].instructions,
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
                            console.error("err1")
                        }
                })
                setTimeout(() => callSendAPI(senderPSID, quickReply), 10000)
                break;
            case 'tell me a food fact':
                request({
                    "uri": "https://api.spoonacular.com/food/trivia/random",
                    "qs": {
                        "apiKey": process.env.API_KEY,
                    }
                },(err, res, body) => {
                    if(!err) {
                        const fact = { text : JSON.parse(res.body).text }
                        callSendAPI(senderPSID, fact)
                    } else {
                        console.log("error getting fact")
                    }       
                })
                setTimeout(() => callSendAPI(senderPSID, quickReply), 3000)
                break;
            case 'tell me a joke':
                request({
                    "uri": "https://api.spoonacular.com/food/jokes/random",
                    "qs": {
                        "apiKey": process.env.API_KEY,
                    }
                },(err, res, body) => {
                    if(!err) {
                        const joke = { text : JSON.parse(res.body).text }
                        callSendAPI(senderPSID, joke)
                    } else {
                        console.log("error getting joke")
                    }    
                })
                setTimeout(() => callSendAPI(senderPSID, quickReply), 3000)
                break;
            
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
                                    extendedIngredients += `
                                    ${ingredient.original}
                                    `
                                })
                                const ingredientText = {
                                    text: extendedIngredients
                                }
                                callSendAPI(senderPSID, ingredientText)
                                const response = {
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
                                    console.error("err1")
                                }
                        })
                    } else {
                        console.error("err2")
                    }
                    setTimeout(() => callSendAPI(senderPSID, quickReply), 10000)
                })
        }
    }
        if(attachment) {
            const imageUrl = attachment.payload.url
            request({
                "uri": "https://api.spoonacular.com/food/images/classify",
                "qs": {
                    "imageUrl" : imageUrl,
                    "apiKey": process.env.API_KEY
                },
                "method": "get"
            }, (err, res, body) => {
                if(!err) {
                    const category = JSON.parse(res.body).category.replace("_", " ")
                    const prob = parseInt(JSON.parse(res.body).probability * 100)
                    const message = {
                        text: `I'm ${prob}% sure this food belong to the ${category} category. Preparing your recipe....`
                    } 
                    callSendAPI(senderPSID, message)
                    request({
                        "uri": 'https://api.spoonacular.com/recipes/search',
                        "qs": {
                            "query": category,
                            "number": 1,
                            "apiKey": process.env.API_KEY,
                            "instructionsRequired": true
                        },
                        "method": "get"
                    }, (err, res, body) => {
                        if(!err){
                            console.log(JSON.parse(res.body))
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
                                        extendedIngredients += `
                                        ${ingredient.original}
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
                                        console.error("err1")
                                    }
                            })
                        } else {
                            console.error("err2")
                        }
                        setTimeout(() => callSendAPI(senderPSID, quickReply), 10000)
                    })
                    
                } else {
                    console.log("error occured parsing image")
                }
            })
        }
}