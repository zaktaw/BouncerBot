const config = require('./config.json')

async function reportUser(msg, bot) {

    let guild = await bot.guilds.cache.filter(guild => guild.id == config.guildID).get(config.guildID);
    let inboxChannel = await guild.channels.cache.filter(channel => channel.id == config.inboxChannelID).get(config.inboxChannelID);
    let guildMember = await guild.members.fetch(msg.author.id);
    let username = msg.author.username;
    let displayName = guildMember.displayName;
    displayName = displayName != username ? displayName : null // set displayName to null if it is identical to the username

    inboxChannel.send(`<@&${config.moderatorRoleID}> Report recieved from ${username} ${displayName ? ' (' + displayName + ')' : ''}: ${msg.content}`) // only show displayname if it is not identical to username
        .then(msg.reply("The report was successfully sent. The moderators will handle the issue."))
        .catch(err => console.error(err));
}

module.exports = {
    reportUser
}