const express = require('express')
const bodyParser = require('body-parser')
const handlePostback = require('./postback')
const handleMessage = require('./message')

app = express().use(bodyParser.json()); 
require('dotenv').config()

app.get('/webhook', (req, res) => {
    let VERIFY_TOKEN = "FOODIE"
      
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
    if (mode && token) {
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
      
      } else {
        res.sendStatus(403);      
      }
    }
});

app.post('/webhook', (req, res) => {
    let body = req.body;
    if (body.object === 'page') {
      body.entry.forEach(function(entry) {
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);
        let senderPSID = webhook_event.sender.id;
        console.log('Sender PSID: ' + senderPSID);
        if (webhook_event.message) {
        handleMessage(senderPSID, webhook_event.message);        
        } else if (webhook_event.postback) {
        handlePostback(senderPSID, webhook_event.postback);
        } 
 
      });
  
      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED');
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }

})
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));