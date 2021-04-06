const fs = require('fs')
const config = require('./config.json')
const blacklist = require('./blacklist.json')

async function warnUser(bot, msg) {

    let userID = msg.content.split(" ")[1];
    let message = msg.content.substring(config.prefix.length + "warn ".length + userID.length); // remove prefix, command and userID from message

    // send warning to user
    let guild = await bot.guilds.cache.filter(guild => guild.id == config.guildID).get(config.guildID);
    guild.members.fetch(userID)
        .then(member => {

            let username = member.user.username;
            let displayName = member.displayName;
            displayName = displayName != username ? displayName : null // set displayName to null if it is identical to the username

            msg.channel.send(`A warning has been sent to user ${username} ${displayName ? ' (' + displayName + ')' : ''}`);
            member.user.send(message)
        })
        .catch(err => msg.channel.send("Could not find any user in the guild with ID " + userID));
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

            let username = member.user.username;
            let displayName = member.displayName;
            displayName = displayName != username ? displayName : null // set displayName to null if it is identical to the username

            msg.channel.send(`A timeout of ${time} minute${ time > 1 ? 's' : ''} was set for user ${username} ${displayName ? ' (' + displayName + ')' : ''}`);
            member.user.send(`You have been set on a timeout for ${time} minute${ time > 1 ? 's' : ''}: ${message}. For the duration of the timeout you will not be able to connect to any voice channels or write in any text channels. If your timeout isn't removed after the set time, please notify a moderator.`);
            member.voice.kick(); // remove user from the voice channel the user is connected to
            member.roles.add(config.timeoutRoleID);
            setTimeout(() => {
                member.roles.remove(config.timeoutRoleID);
                member.user.send("You are no longer on a timeout. You will now be able to join voice channels and write in text channels.");
            }, time * 60 * 1000); // convert time from minutes to milliseconds
        })
        .catch(err => msg.channel.send("Could not find any user in the guild with ID " + userID));
}

// a timeout will set assign a timeout-role to the user, send the user a message that contains the reason for the timeout
// the timeout-role will be unassigned after a given time
async function untimeoutUser(bot, msg) {
    let userID = msg.content.split(" ")[1];

    let guild = await bot.guilds.cache.filter(guild => guild.id == config.guildID).get(config.guildID);
    guild.members.fetch(userID)
        .then(member => {

            let username = member.user.username;
            let displayName = member.displayName;
            displayName = displayName != username ? displayName : null // set displayName to null if it is identical to the username

            msg.channel.send(`Timeout for user ${username} ${displayName ? ' (' + displayName + ')' : ''} is now removed.`);
            member.user.send("You are no longer on a timeout. You will now be able to join voice channels and write in text channels.");
            member.roles.remove(config.timeoutRoleID);
        })
        .catch(err => msg.channel.send("Could not find any user in the guild with ID " + userID));
}

async function blacklistUser(bot, msg) {
    let userID = msg.content.split(" ")[1]

    let guild = await bot.guilds.cache.filter(guild => guild.id == config.guildID).get(config.guildID);
    guild.members.fetch(userID)
        .then(member => {

            let username = member.user.username;
            let displayName = member.displayName;
            displayName = displayName != username ? displayName : null // set displayName to null if it is identical to the username

            // get blacklistedUsers array from json file
            let blacklistJson = blacklist;
            let blacklistedUsers = blacklistJson.blacklistedUsers;

            // check if user is blacklisted
            if (blacklistedUsers.includes(userID)) return msg.channel.send(`User ${username} ${displayName ? ' (' + displayName + ')' : ''} has already been blacklisted.`);
            // add user to blacklist
            blacklistedUsers.push(userID);
            msg.channel.send(`User ${username} ${displayName ? ' (' + displayName + ')' : ''} was successfully added to the blacklist.`)

            // update json file 
            blacklistJson = JSON.stringify(blacklistJson);
            fs.writeFileSync('./blacklist.json', blacklistJson);

        })
        .catch(() => msg.channel.send("Could not find any user in the guild with ID " + userID));
}

async function unblacklistUser(bot, msg) {
    let userID = msg.content.split(" ")[1]

    let guild = await bot.guilds.cache.filter(guild => guild.id == config.guildID).get(config.guildID);
    guild.members.fetch(userID)
        .then(member => {

            let username = member.user.username;
            let displayName = member.displayName;
            displayName = displayName != username ? displayName : null // set displayName to null if it is identical to the username

            // get blacklistedUsers array from json file
            let blacklistJson = blacklist;
            let blacklistedUsers = blacklistJson.blacklistedUsers;

            // check if user is blacklisted
            if (!blacklistedUsers.includes(userID)) return msg.channel.send(`Could not find user ${username} ${displayName ? ' (' + displayName + ')' : ''} in the blacklist.`);
            // remove user from blacklist
            let index = blacklistedUsers.indexOf(userID);
            blacklistedUsers.splice(index, 1);
            msg.channel.send(`User ${username} ${displayName ? ' (' + displayName + ')' : ''} was successfully removed from the blacklist.`)

            // update json file 
            blacklistJson = JSON.stringify(blacklistJson);
            fs.writeFileSync('./blacklist.json', blacklistJson);

        })
        .catch(() => msg.channel.send("Could not find any user in the guild with ID " + userID));
}

module.exports = {
    warnUser,
    timeoutUser,
    blacklistUser,
    unblacklistUser,
    untimeoutUser
}