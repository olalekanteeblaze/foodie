const request = require('request')

module.exports = function callSendAPI(senderPSID, response) {
    let request_body = {
        "recipient": {
          "id": senderPSID.id
        },
        "messaging_type": "RESPONSE",
        "message": response
      }
    
      // Send the HTTP request to the Messenger Platform
      request({
        "uri": "https://graph.facebook.com/v7.0/me/messages",
        "qs": { "access_token": process.env.ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
      }, (err, res, body) => {
        if (!err) {
          console.log('message sent!')
        } else {
          console.error("Unable to send message:" + err);
        }
      }); 
    }