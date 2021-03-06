const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require('./config.json')
const blacklist = require('./blacklist.json')
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

         // check if user is blacklisted
         let blacklistJson = blacklist;
         let blacklistedUsers = blacklistJson.blacklistedUsers;
         if (blacklistedUsers.includes(msg.author.id)) return;

        user.reportUser(msg, bot)
    }

    else {

        // Prevent spam from bot
        if (!msg.content.startsWith(config.prefix)) return; // only reply to messages starting with bot' prefix
        if (!msg.guild) return; // bot will only reply if message is sent in the guild (server)
        if (!msg.member.roles.cache.has(config.moderatorRoleID)) return msg.channel.send("You have to be a moderator to use this command")
        if (msg.channel.parentID != config.moderatorCategoryID) return msg.channel.send("This command can only be used in a moderator channel");

        args = msg.content.substring(config.prefix.length).split(" ") // extract arguments from message

        switch (args[0].toLowerCase()) {
            
            case 'test' :
                
                msg.channel.send("BouncerBot is working")
                break;

            case 'warn' :
                if (!args[2]) return msg.channel.send("Warn command needs a user ID and a message as arguments, $warn <user ID> <message>, i.e $warn 696215209303474187 If you continue spamming you will get a timeout")
                moderator.warnUser(bot, msg);
                break;

            case 'timeout' :
                if (!args[3]) return msg.channel.send("Timeout command needs a user ID, time in minutes, and a message as arguments, $timeout <user ID> <time in minutes> <message>, i.e $timeout 696215209303474187 15 Excessive spamming");
                if (!Number.isFinite(Number(args[2]))) return msg.channel.send("Time in minutes needs to be a number between 1 and 60");
                if (args[2] < 1 || args[2] > 60) return msg.channel.send("Time in minutes needs to be a number between 1 and 60");
                moderator.timeoutUser(bot, msg);
                break;

            case 'untimeout' :
                if (!args[1]) return msg.channel.send("Untimeout command needs a user ID as an argument, $untimeout <user ID>, i.e $untimeout 696215209303474187");
                moderator.untimeoutUser(bot, msg);
                break;

            case 'blacklist' :
                if (!args[1]) return msg.channel.send("Blacklist command needs a user ID as argument, $blacklist <user ID>, i.e $blacklist 696215209303474187");
                moderator.blacklistUser(bot, msg)
                break;

            case 'unblacklist' :
                if (!args[1]) return msg.channel.send("Unblacklist command needs a user ID as argument, $unblacklist <user ID>, i.e $unblacklist 696215209303474187");
                moderator.unblacklistUser(bot, msg)
                break;

            default :
                msg.channel.send(`"${args[0]}" is an invalid command.`)
                    .then(message => message.delete( {timeout: 5000} ))
        }   
    }
});

