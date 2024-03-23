const admin = require("firebase-admin");

const serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const request = require('request')

const TelegramBot = require('node-telegram-bot-api')

const token = '6793476484:AAEbGlkM_r_zFk8OT84CfHvqj0DU81R-WQg';

const bot = new TelegramBot(token,{polling : true})


const db = admin.firestore();

bot.on('message',function(mg){
    const msg = mg.text;

    const new_msg = msg.split(" ")

    if(new_msg[0].toLowerCase() == "insert"){
        db.collection("Cgpa data").add({
            key : new_msg[1],
            datavalue : new_msg[2],
            userId : mg.from.id
        }).then(() =>{
            bot.sendMessage(mg.chat.id,new_msg[1] + " stored successfully")
        })
    }
    else if (new_msg[0] == "get") {
        let keyCondition = new_msg[1] ? db.collection("Cgpa data").where('key', '==', new_msg[1]) : null;
        let userIdCondition = db.collection("Cgpa data").where('userId', '==', mg.from.id);
    
        let query = keyCondition ? keyCondition : userIdCondition;
    
        query.get().then((docs) => {
            docs.forEach((doc) => {
                bot.sendMessage(mg.chat.id, doc.data().key + " " + doc.data().datavalue);
            });
        });
    }
    
    else{
        bot.sendMessage(mg.chat.id,"Please make sure you keeping get or insert in your message to insert or get data")
    }
})
