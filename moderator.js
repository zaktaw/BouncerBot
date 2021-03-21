const config = require('./config.json')

async function warnUser(bot, msg) {

    userID = msg.content.split(" ")[1];
    warning = msg.content.substring(config.prefix.length + "warn ".length + userID.length); // remove config, command and userID from the message

    // send warning to user
    let guild = await bot.guilds.cache.filter(guild => guild.id == config.guildID).get(config.guildID);
    guild.members.fetch(userID)
        .then(member => member.user.send(warning))
}

module.exports = {
    warnUser
}