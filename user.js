const config = require('./testConfig.json')

async function reportUser(msg, bot) {
    messageContent = msg.content.substring('report '.length); // remove prefix and command from message content

    let guild = await bot.guilds.cache.filter(guild => guild.id == config.guildID).get(config.guildID);
    let moderatorChannel = await guild.channels.cache.filter(channel => channel.id == config.moderatorChannelID).get(config.moderatorChannelID);
    let guildMember = await guild.members.fetch(msg.author.id);
    let username = msg.author.username;
    let displayName = guildMember.displayName;
    displayName = displayName != username ? displayName : null // set displayName to null if it is identical to the username
    
    moderatorChannel.send(`<@&${config.moderatorRoleID}> Report recieved from ${username} ${displayName ? ' (' + displayName + ')' : ''}: ${messageContent}`) // only show displayname if it is not identical to username
        .then(msg.reply("The report was successfully sent. The moderators will handle the issue."))
        .catch(err => console.error(err));
}

module.exports = {
    reportUser
}