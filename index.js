const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require('./config.json')

bot.on('ready', () => {
    console.log("Bot is online!");
}); 

bot.login(process.env.BOUNCER_BOT_TOKEN);

bot.on('message', (msg) => {
 
    // Prevent spam from bot
    if (!msg.content.startsWith(config.prefix)) return; // only reply to messages starting with bot' prefix
    if (msg.author.bot) return; // stops bot from replying to itself
    if (!msg.guild) return; // bot will only reply if message is sent in the guild (server)
    
    // make bot only answer to users with role matching role id given in config.json file
        // not implemented yet

    args = msg.content.substring(config.prefix.length).split(" ") // extract arguments from message

    switch (args[0].toLowerCase()) {
        
        case 'test' :
            msg.channel.send("BouncerBot is working")
            break;

        default :
            msg.channel.send(`"${args[0]}" is an invalid command.`)
                .then(message => message.delete( {timeout: 5000} ))
    }   
    
});

