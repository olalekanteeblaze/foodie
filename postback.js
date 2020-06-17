const callSendAPI = require('./sendAPI')

module.exports = function handlePostback(senderPSID, receivedPB) {
    let response;
    let payload = receivedPB.payload

    switch(payload){
        case 'get started':
            const greeting = {
                text: `Hi ${senderPSID.firstName}!, My name is Foodie. I'm a seasoned chef and know how to cook a lot of foods. You can get the recipe of a food by telling me the name or showing me a picture. I also tell food fact and some jokes that people find really funny because they are not.`
            }
            callSendAPI(senderPSID, greeting)
            response = {
                text: `Get recipe using:`,
                quick_replies: [
                    {
                        content_type: "text",
                        title: "Name of Food",
                        payload: "NAME_OF_FOOD",
                    },
                    {
                        content_type: "text",
                        title: "Picture of Food",
                        payload: "PICTURE",
                    }
                ]
            }
            break;
        case 'NAME_OF_FOOD':
            response = {
                text: "Enter name of food"
            }
        case 'PICTURE':
            response = {
                text: "Take a picture or select from gallery"
            }
        default:
            response = {
                text: "I don't understand, are you hungry?"
            }
    }
    setTimeout( () => callSendAPI(senderPSID, response), 2000)
}