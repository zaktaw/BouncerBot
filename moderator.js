const config = require('./config.json')

async function warnUser(bot, msg) {

    let userID = msg.content.split(" ")[1];
    let warningMessage = msg.content.substring(config.prefix.length + "warn ".length + userID.length); // remove prefix, command and userID from message

    // send warning to user
    let guild = await bot.guilds.cache.filter(guild => guild.id == config.guildID).get(config.guildID);
    guild.members.fetch(userID)
        .then(member => member.user.send(warningMessage))
        .catch(err => msg.channel.send("Could not find any user with ID " + userID))
}

// a timeout will set assign a timeout-role to the user, send the user a message that contains the reason for the timeout
// the timeout-role will be unassigned after a given time
async function timeoutUser(bot, msg) {
    let userID = msg.content.split(" ")[1];
    let minutes = msg.content.split(" ")[2] * 1000 * 60; // how many minutes (converted to milliseconds) the timeout will last
    let reason = msg.content.split(" ")[3]; // reason for why the user recieved the timeout

    let guild = await bot.guilds.cache.filter(guild => guild.id == config.guildID).get(config.guildID);
    guild.members.fetch(userID)
        .then(member => {

            member.user.send(reason)
            member.voice.kick(); // remove user from the voice channel the user is connected to
            member.roles.add(config.timeoutRoleID)
            setTimeout(() => {
                member.roles.remove(config.timeoutRoleID)
            }, minutes)
        });
}

module.exports = {
    warnUser,
    timeoutUser
}