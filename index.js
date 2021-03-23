const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require('./testConfig.json')
const user = require('./user.js')
const moderator = require('./moderator.js')

bot.on('ready', () => {
    console.log("Bot is online!");
}); 

bot.login(process.env.BOUNCER_BOT_TOKEN);

bot.on('message', (msg) => {
 
    
    if (msg.author.bot) return; // stops bot from replying to itself
    
    // recieve messages from users
    if (msg.channel.type == "dm") {
        if (msg.content.toLowerCase().startsWith("report")) {
           user.reportUser(msg, bot)
        }

        else {
            msg.reply("Not a valid message. Message needs to start with report")
                .catch(err => console.error(err))
        }
    }

    else {

        // Prevent spam from bot
        if (!msg.content.startsWith(config.prefix)) return; // only reply to messages starting with bot' prefix
        if (!msg.guild) return; // bot will only reply if message is sent in the guild (server)

        args = msg.content.substring(config.prefix.length).split(" ") // extract arguments from message

        switch (args[0].toLowerCase()) {
            
            case 'test' :
                msg.channel.send("BouncerBot is working")
                break;

            case 'warn' :
                moderator.warnUser(bot, msg);
                break;

            case 'timeout' :
                moderator.timeoutUser(bot, msg);
                break;

            default :
                msg.channel.send(`"${args[0]}" is an invalid command.`)
                    .then(message => message.delete( {timeout: 5000} ))
        }   
    }
});

