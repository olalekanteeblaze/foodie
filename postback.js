const callSendAPI = require('./sendAPI')

module.exports = function handlePostback(senderPSID, receivedPB) {
    let response;
    let payload = receivedPB.payload

    switch(payload){
        case 'get started':
            response = {
                text: "Get recipe using:",
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
        default:
            response = {
                text: "I don't understand, are you hungry?"
            }
    }
    callSendAPI(senderPSID, response)
}