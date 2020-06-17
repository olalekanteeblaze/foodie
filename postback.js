const callSendAPI = require('./sendAPI')

module.exports = function handlePostback(senderPSID, receivedPB) {
    let response;
    let payload = receivedPB.payload

    switch(payload){
        case 'get started':
            response = {
                text: `Hi ${senderPSID.first_name} Get recipe using:`,
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
    callSendAPI(senderPSID, response)
}