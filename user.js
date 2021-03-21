const config = require('./config.json')

async function reportUser(msg, bot) {
    messageContent = msg.content.substring('report '.length); // remove prefix and command from message content

    let guild = await bot.guilds.cache.filter(guild => guild.id == config.guildID).get(config.guildID);
    let moderatorChannel = guild.channels.cache.filter(channel => channel.id == config.moderatorChannelID).get(config.moderatorChannelID);
    let username = msg.author.username;

    moderatorChannel.send(`<@&${config.moderatorRoleID}> Report recieved from ${username}: ${messageContent}`)
        .then(msg.reply("The report was successfully sent. The moderators will handle the issue."))
}

module.exports = {
    reportUser
}