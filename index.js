const express = require('express')
app = express().use(bodyParser.json()); 

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

app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));