const config = require('./config.json')

async function warnUser(bot, msg) {

    let userID = msg.content.split(" ")[1];
    let message = msg.content.substring(config.prefix.length + "warn ".length + userID.length); // remove prefix, command and userID from message

    // send warning to user
    let guild = await bot.guilds.cache.filter(guild => guild.id == config.guildID).get(config.guildID);
    guild.members.fetch(userID)
        .then(member => member.user.send(message))
        .catch(err => msg.channel.send("Could not find any user with ID " + userID))
}

// a timeout will set assign a timeout-role to the user, send the user a message that contains the reason for the timeout
// the timeout-role will be unassigned after a given time
async function timeoutUser(bot, msg) {
    let userID = msg.content.split(" ")[1];
    let time = msg.content.split(" ")[2]; // how much time in minutes (converted to milliseconds) the timeout will last
    let message = msg.content.substring(config.prefix.length + "timeout ".length + userID.length + 1 + time.length) // reason for why the user recieved the timeout

    let guild = await bot.guilds.cache.filter(guild => guild.id == config.guildID).get(config.guildID);
    guild.members.fetch(userID)
        .then(member => {

            member.user.send(`You have been set on a timeout for ${time} minute${ time > 1 ? 's' : ''}: ${message}`)
            member.voice.kick(); // remove user from the voice channel the user is connected to
            member.roles.add(config.timeoutRoleID)
            setTimeout(() => {
                member.roles.remove(config.timeoutRoleID)
                member.user.send("You are no longer on a timeout")
            }, time * 60 * 1000) // convert time from minutes to milliseconds
        })
        .catch(err => msg.channel.send("Could not find any user with ID " + userID));
}

function blacklistUser(msg) {
    let userID = msg.content.split(" ")[1]
    // get blacklistedUsers array from json file
    // check if userID is in array
        // send error message: user already blacklisted
    // else: add user to array
    // update json file 
}

module.exports = {
    warnUser,
    timeoutUser,
    blacklistUser
}