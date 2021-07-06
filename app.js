const ethers = require("ethers");
const fs = require('fs');
const TelegramBot = require("node-telegram-bot-api");
const requst = require("request");
const getprices = require('./get_pancake_prices')

const url = 'https://bsc-dataseed1.binance.org';
const provider = new ethers.providers.JsonRpcProvider(url);


const telegranAPI =[
    '1742236146:AAHhhGsoNNBfNK4gB2DwQHinGi5y6X3GcSU', //https://t.me/NFTClassicCommunity
    '1866611387:AAHruuCO5dTSe21Y8WrC80hruNtZUDbGdJQ', //t.me/BSCToken_Sniper_bot
  ] 
  const token = telegranAPI[0]
  
  // Create a bot that uses 'polling' to fetch new updates
  const bot = new TelegramBot(token, { polling: true });

  



bot.on("message", async (msg) => {
   
   
    let token =''
   
    try {
        if(msg.text.includes('/price'))
    { 
        
        if(msg.text.length > 10)
        {
           
            const resp = await msg.text.match(/\price (.+)/)
         
            if(resp[1].length > 10 && resp[1].includes('0x'))
            { 
               
                token = resp[1]
            }
        }
    

      const   chatId = msg.chat.id;
      const   message = msg.message_id;
      const    price = await getprices.getprice(token || '0x8076C74C5e3F5852037F31Ff0093Eeb8c8ADd8D3') 
      const    nameToken = await getprices.nameToken(token || '0x8076C74C5e3F5852037F31Ff0093Eeb8c8ADd8D3')
     
      
      const  sendmes = await bot.sendMessage(msg.chat.id,`price Token ${nameToken} ${price}`,{
        reply_to_message_id:message,
      
      })
       setTimeout(function(){
           bot.deleteMessage(sendmes.chat.id,sendmes.message_id)
           bot.deleteMessage(chatId,message)
       },15000)
   
    }
    } catch  {
        
    }
  
  
    
   
})

bot.on("left_chat_member",async (msg) =>{
    console.log()
    const chatId = msg.chat.id;
    const id = msg.from.id;
    const message = msg.message_id;
    bot.deleteMessage(chatId,message)
})

bot.on("new_chat_members", async (msg) => {
    const chatId = msg.chat.id;
    const id = msg.from.id;
    const message = msg.message_id;
    const full_name = msg.from.first_name + " " + msg.from.last_name;
    const urlid = "tg://user?id=" + id;

  try {
      bot.deleteMessage(chatId,message)
    const messreply = await bot.sendMessage(
        chatId,
        `welcome to <a href="${urlid}">${full_name}</a>`,
        {
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "click",
                  url: "http://nftclassic.finance/",
                },
              ],
            ],
          },
        }
      );
      setTimeout(function () {
        bot.deleteMessage(messreply.chat.id, messreply.message_id);
      }, 20000);
  } catch  {
      
  }
  
  });
  
  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const id = msg.from.id;
    const message = msg.message_id;
    const full_name = msg.from.first_name + " " + msg.from.last_name;
    const urlid = "tg://user?id=" + id;
    const url = `https://api.telegram.org/bot${token}/getChatMember?chat_id=${chatId}&user_id=${id}`;
    try {
        if(msg.chat.type == 'supergroup')
   {
    requst(url, async function (error, response, body) {
      var json = JSON.parse(body);
          if (msg.text && json.result.status == "member") {
            if (msg.entities != null) {
              for (var i = 0; i < msg.entities.length; i++) {
              
                if (
                  msg.entities[i].type === "url" ||
                  msg.entities[i].type === "text_link"
                ) {
                  await bot.deleteMessage(chatId, message);
                  const messreply = await bot.sendMessage(
                    chatId,
                    `gui link cai gi <a href="${urlid}">${full_name}</a>`,
                    { parse_mode: "HTML" }
                  );
          
                  setTimeout(function () {
                    bot.deleteMessage(messreply.chat.id, messreply.message_id);
                  }, 5000);
          
                  break;
                }
              }
            }
          }
      })
    
      
        
    
      
      // requst(url, function (error, response, body) {
      //   var json = JSON.parse(body);
      //   if (msg.text && json.result.status == "member") {
      //     bot.sendMessage(chatId, "ths click", {
      //       reply_markup: {
      //         inline_keyboard: [
      //           [
      //             { text: "click", callback_data: "click" },
      //             {
      //               text: "click",
      //               url: "https://www.youtube.com/watch?v=SgtYhwTv5I4&list=PLU4OBh9yHE95gzQjclK3KJn7Iq8Y9M07u&ab_channel=RHPTeam",
      //             },
      //           ],
      //         ],
      //       },
      //     });
      //   }
      // });
    
      // send a message to the chat acknowledging receipt of their message
   }
    } catch  {
        
    }
   
    
  });
  bot.on("callback_query", (query) => {
    var data = query.data;
    var chat_id = query.message.chat.id;
    var message_id = query.message.message_id;
    var keyboard = {
      inline_keyboard: [[{ text: "click", callback_data: "click1" }]],
    };
    if (data == "click") {
      bot.editMessageText("done checker", {
        chat_id: chat_id,
        message_id: message_id,
        reply_markup: keyboard,
      });
    }
    if (data == "click1") {
      bot.editMessageText("done checker", {
        chat_id: chat_id,
        message_id: message_id,
      });
      setTimeout(function () {
        bot.deleteMessage(chat_id, message_id);
      }, 7000);
    }
  });



