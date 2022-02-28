const path = require("path");
const { Client } = require('tdl');
const { TDLib } = require('tdl-tdlib-addon');
const fs = require('fs');

const client = new Client(new TDLib(path.join(__dirname, "libtdjson.so")), { //for server
    // const client = new Client(new TDLib(), { //for my pc
    apiId: 8041059, // Your api_id, get it at http://my.telegram.org/
    apiHash: '465da79c30d842e1d017d04f26d079af' // Your api_hash
});

// [database_setup]
let readDatabase = () => JSON.parse(fs.readFileSync('database.json'));
let writeDatabase = () => {
    database = {blacklisted, whiteList, pasteFromTo, replaceSentences, percentage}
    return fs.writeFileSync('database.json', JSON.stringify(database))
};
let database = readDatabase();
//set variables from database
let {blacklisted, whiteList, pasteFromTo, replaceSentences, percentage} = database;

let monitoringChats = [], sendChats = [];
let loginTime;
let name = "AliXGamer"
// Used to [ignore_duplicate_messages]
let previousMessage = "";
// Used to [append_specific_telegram_id]
const telegramId = "@vexcoinssupport";

client.on('error', (err) =>
{
});
client.on('update', async update =>
{
    //TODO: find a way to forward image 'photo' data
    // console.log('Received update:', update);
    try
    {
        if (update._ == "updateUser" && update.user)
        {
            myId = update.user.id;
        }

        if ("message" in update && update._ === "updateNewMessage" && update.message.date > loginTime)
        {
            if (update.message.is_outgoing) return;

            let photoMessage = false;
            let msg = "";

            if (update.message.content._ == "messagePhoto" && "caption" in update.message.content)
            {
                msg = update.message.content.caption.text;
            }
            else
            {
                msg = update.message.content.text.text;
            }
            const id = update.message.chat_id;
            if (msg.includes(".pastehere"))
            {
                if (sendChats.indexOf(id) == -1)
                {
                    sendChats.push(id);
                    await sendMessage(id, "ok, will do!");
                }
                else
                {
                    await sendMessage(id, "I know bro, chill ;)");
                }
            }

            if (msg.includes(".nopaste"))
            {
                const change = id;
                if (change)
                {
                    if (sendChats.includes(change) != -1)
                    {
                        sendChats.splice(sendChats.indexOf(change), 1);
                    }
                    await sendMessage(id, "no more pasting :)");
                }
            }

            if (msg.includes(".watchthis"))
            {
                if (monitoringChats.indexOf(id) == -1)
                {
                    monitoringChats.push(id);
                    await sendMessage(id, "monitoring like a pro");
                }
                else
                {
                    await sendMessage(id, "already monitoring this :/");
                }
            }

            if (msg.includes(".emptychannels"))
            {
                pasteFromTo = [];
                sendChats = [];
                monitoringChats = [];
                writeDatabase();
                await sendMessage(id, "Just removed all forwarding channels!");
            }

            if (msg.includes(".watchlist"))
            {
                await sendMessage(id, "WatchList: " + monitoringChats.join(","));
            }

            if (msg.includes(".pastelist"))
            {
                await sendMessage(id, "PasteList: " + sendChats.join(",") + `\nPasteFromTo: ${JSON.stringify(pasteFromTo)}`);
            }

            if (msg.includes(".nowatch"))
            {
                const change = id;
                if (change)
                {
                    if (monitoringChats.includes(change) != -1)
                    {
                        monitoringChats.splice(monitoringChats.indexOf(change), 1);
                    }
                    await sendMessage(id, "I am blind");
                }
            }

            if (msg.includes(".addblack"))
            {
                const change = msg.match(/(?<=\.addblack\s)([^\s]+)/g);
                if (change)
                {
                    const word = change[0].toLowerCase();
                    if (blacklisted.indexOf(word) == -1)
                    {
                        blacklisted.push(word);
                    }
                    writeDatabase();
                    await sendMessage(id, "added: " + word + " to blacklist");
                }
            }
            if (msg.includes(".removeblack"))
            {
                const change = msg.match(/(?<=\.removeblack\s)([^\s]+)/g);
                if (change)
                {
                    const word = change[0].toLowerCase();
                    if (blacklisted.includes(word) != -1)
                    {
                        blacklisted.splice(blacklisted.indexOf(word), 1);
                        await sendMessage(id, "removed: " + word + " from blacklist");
                    }
                    else
                    {
                        await sendMessage(id, word + " isn't added to the blacklist");
                    }
                    writeDatabase();
                }
            }
            if (msg.includes(".blacklist"))
            {
                await sendMessage(id, "Blacklist: " + blacklisted.join(","));
            }

            if (msg.includes(".addwhite"))
            {
                const change = msg.match(/(?<=\.addwhite\s)([^\s]+)/g);
                if (change)
                {
                    const word = change[0].toLowerCase();
                    if (whiteList.indexOf(word) == -1)
                    {
                        whiteList.push(word);
                    }
                    writeDatabase();
                    await sendMessage(id, "added: " + word + " to whiteList");
                }
            }
            if (msg.includes(".removewhite"))
            {
                const change = msg.match(/(?<=\.removewhite\s)([^\s]+)/g);
                if (change)
                {
                    const word = change[0].toLowerCase();
                    if (whiteList.includes(word) != -1)
                    {
                        whiteList.splice(whiteList.indexOf(word), 1);
                        await sendMessage(id, "removed: " + word + " from whiteList");
                    }
                    else
                    {
                        await sendMessage(id, word + " isn't added to the whiteList");
                    }
                }
                writeDatabase();
            }
            if (msg.includes(".whitelist"))
            {
                await sendMessage(id, "Whitelist: " + whiteList.join(","));
            }

            if (msg.includes(".name"))
            {
                const change = msg.match(/(?<=\.name\s)@*\w+/g);
                if (change)
                {
                    name = change[0];
                    await sendMessage(id, "changed name to: " + change[0]);
                }
            }

            if (msg.includes(".addmonitor"))
            {
                const change = msg.match(/(?<=\.addmonitor\s)-*\d+/g);
                if (change)
                {
                    if (monitoringChats.indexOf(chaneg[0]) != -1)
                    {
                        monitoringChats.push(change[0]);
                        await sendMessage(id, "will be monitoring: " + change[0]);
                    }
                    else
                        await sendMessage(id, "ALREADY MONITORING: " + change[0]);
                }
            }

            if (msg.includes(".pastefromto"))
            {
                const change = msg.match(/-*\d+/g);
                if (change && change.length == 2)
                {
                    // monitoringChats.push(change[0]);
                    // sendChats.push(change[1]);
                    pasteFromTo.push({ monitor: change[0], paste: change[1] });
                    writeDatabase();
                    await sendMessage(id, `Will be sending messages from ${change[0]} to ${change[1]}`);
                }
            }

            if (msg.includes(".addpaste"))
            {
                const change = msg.match(/(?<=\.addpaste\s)-*\d+/g);
                if (change)
                {
                    if (sendChats.indexOf(change[0]))
                    {
                        sendChats.push(change[0]);
                        await sendMessage(id, "will be pasting here: " + change[0]);
                    }
                    else
                        await sendMessage(id, "ALREADY PASTING: " + change[0]);
                }
            }
            if (msg.includes(".removewatch"))
            {
                const change = msg.match(/(?<=\.removewatch\s)-*\d+/g);
                if (change)
                {
                    if (monitoringChats.includes(change) != -1)
                    {
                        monitoringChats.splice(monitoringChats.indexOf(change), 1);
                    }
                    await sendMessage(id, "No longer watching: " + change[0]);
                }
            }
            if (msg.includes(".removepaste"))
            {
                const change = msg.match(/(?<=\.removepaste\s)-*\d+/g);
                if (change)
                {
                    if (sendChats.includes(change) != -1)
                    {
                        sendChats.splice(sendChats.indexOf(change), 1);
                    }
                    await sendMessage(id, "No longer sending to: " + change[0]);
                }
            }

            // TODO could you please fix this feature, it isn't working
            // TODO or rewrite the logic based on .pastelist outcome
            if (msg.includes(".removefromto"))
            {
                const change = msg.match(/-*\d+/g);
                if (change && change.length == 2)
                {
                    let fromMonitor = pasteFromTo.map(x => x.monitor);
                    let fromPaste = pasteFromTo.map(x => x.paste);
                    if ((fromMonitor.indexOf(id.toString()) != -1 || fromMonitor.indexOf(id)) != -1 && (fromPaste.indexOf(id.toString()) != -1 || fromPaste.indexOf(id) != -1))
                    {
                        pasteFromTo.splice(fromMonitor.indexOf(id.toString()), 1);
                    }
                    writeDatabase();
                    await sendMessage(id, "No longer sending to: " + change[0]);
                }
            }

            if (msg.includes(".replace"))
            {
                msg = msg.toLowerCase();
                let filteredMessage = msg.split('.replace ');

                if (filteredMessage.length == 2)
                {
                    filteredMessage = filteredMessage[1].split(' > ');

                    if (filteredMessage.length == 2) {
                        replaceSentences[filteredMessage[0]] = filteredMessage[1];
                        writeDatabase();
                        await sendMessage(id, `Alright, replacing "${filteredMessage[0]}" with "${filteredMessage[1]}" from now on.`);
                    }
                }
            }

            if (msg.includes(".dontreplace"))
            {
                msg = msg.toLowerCase();
                let filteredMessage = msg.split('.dontreplace ');

                if (filteredMessage.length == 2)
                {
                    if (filteredMessage[1] in replaceSentences)
                    {
                        delete replaceSentences[filteredMessage[1]];
                        writeDatabase();
                        await sendMessage(id, `We are no longer replacing this sentence: "${filteredMessage[1]}".`);
                    }
                    else
                        await sendMessage(id, `This sentence, "${filteredMessage[1]}", is not even found in the list; not replacing anyway!`);
                }
            }

            if (msg.includes(".replacelist"))
            {
                await sendMessage(id, `Replace List: ${JSON.stringify(replaceSentences)}`);
            }

            if (msg.includes(".reset")) {
                replaceSentences = {};
                blacklisted = [];
                whiteList = [];
                pasteFromTo = [];
                percentage = 0.008;
                monitoringChats = [];
                sendChats = [];
                writeDatabase();
                await sendMessage(id, `Everything has just been reset!`);
            }

            if (msg.includes(".commands")) {
                await sendMessage(id, `Commands: \nname @MYNAME (changes the name that will be changed, default: AliXGamer)\nwatchthis (monitors the sv for messages)\nnowatch (no longer monitor)\npastehere (forwards the messages to this channel)\nnopaste (no longer forwards to this channel)\naddblack xxx (adds xxx to the blacklist)\nremoveblack xxx (removes xxx from blacklist if present)\nblacklist (shows the current blacklist)\nwatchlist (shows the ids of channels that are being monitored)\npastelist (shows the ids of channels where the messages are forwarded AND ALSO PASTEFROMTO LIST)\ncommands (pastes this list of commands)\nwhitelist (list of whitelist word that are appended to each forwarded message)\naddwhite (add a word to whitelist)\nremovewhite (remove a word from the whitelist)\nremovepaste id(removes id from pastelist)\nremovewatch if (removes id from watchlist)\naddpaste id (adds id to pastelist)\naddmonitor id (adds id to watchlist)\npastefromto id id (adds first id to watchlist and second to pastelist)\nreplace sentence > sentence(replace the first sentence with the second)\nreplacelist(gets the replace list)\ndontreplace word(no longer replaces the word specified)\nremovefromto Fromid ToId(removes entity from pastefromto)\nemptychannels (removes all forwarding channels)\nreset (resets everything)\nsetpercentage value (updates the percentage value)\npercentage (shows the current percentage value)`);
            }

            // [show_current_percentage_logic]
            if (msg.includes('.percentage')) {
                await sendMessage(id, `The current percentage value is: " ${percentage}`);
            }

            // [update_percentage_command_logic]
            if (msg.includes('.setpercentage')) {
                percentage = parseFloat(msg.replace('.setpercentage', '').match(/[\d|.]/g).join(''));/*is number*/
                writeDatabase();
                await sendMessage(id, `This percentage is now : " ${percentage}`);
            }

            /*Replace by long and short*/
            if (msg.search(/long/i) !== -1 || msg.search(/short/i) !== -1) {
                let label;
                if (msg.search(/long/i) !== -1) label = 'long'; else if (msg.search(/short/i) !== -1) label = 'short';
                if (label) {
                    let enterNo, stopNo, enterIndex, stopIndex;
                    let splitMsg = msg.split(/\r?\n/);
                    let getNumber = (str) => {
                        let result, mark;
                        if (str.includes(':')) mark = ':'
                        if (str.includes('=')) mark = '='
                        if (mark) str.split(mark).forEach(el => {
                            if (!isNaN(parseFloat(el.match(/[^\\n]/g).join(''))) && !result)
                                result = parseFloat(el.match(/[^\\n]/g).join(''))
                        });
                        return result
                    }
                    splitMsg.forEach((el, i) => {
                        if (el.toLowerCase().includes('entry')) {
                            if (!getNumber(el)) {
                                splitMsg[i] = el + '\n' + splitMsg[i + 1];
                                splitMsg[i + 1] = '';
                            }
                            enterIndex = i;
                            enterNo = getNumber(splitMsg[i])
                            console.log('ENTRY', enterNo, splitMsg[i])
                            if (enterNo && percentage && !splitMsg[enterIndex].includes('-')) {
                                splitMsg[enterIndex]
                                if (label === 'long') splitMsg[enterIndex] = splitMsg[enterIndex].replace(enterNo, enterNo + ' - ' + ((enterNo * percentage) + enterNo))
                                if (label === 'short') splitMsg[enterIndex] = splitMsg[enterIndex].replace(enterNo, enterNo + ' - ' + (((enterNo * percentage) - enterNo) * -1))
                            }
                        }
                        if (el.toLowerCase().includes('stop') && (el + splitMsg[i + 1]).includes('%') !== -1) {
                            if (splitMsg[i + 1] && !getNumber(el)) {
                                splitMsg[i] = el + '\n' + splitMsg[i + 1];
                                splitMsg[i + 1] = '';
                            }
                            stopIndex = i;
                            stopNo = getNumber(splitMsg[i])
                            console.log('STOP', stopNo, splitMsg[i])
                            if (stopNo && enterNo && splitMsg[stopIndex].includes('%')) {
                                let numberIndex = splitMsg[stopIndex].indexOf(stopNo)
                                let percentMarkIndex = splitMsg[stopIndex].lastIndexOf('%')
                                let numberWithPercentage = splitMsg[stopIndex].slice(numberIndex, percentMarkIndex + 1);
                                let shortEq = (((enterNo * stopNo) / 100) + enterNo);
                                let longEq = (((enterNo * stopNo) / 100) - enterNo) * -1;
                                if (label === 'long') splitMsg[stopIndex] = splitMsg[stopIndex].replace(numberWithPercentage, longEq)
                                if (label === 'short') splitMsg[stopIndex] = splitMsg[stopIndex].replace(numberWithPercentage, shortEq)
                            }
                        }
                    })
                    msg = splitMsg.join('\n')
                }
            }

            // [ignore_duplicate_messages]
            if (previousMessage === msg) {
                return;
            } else {
                previousMessage = msg;
            }

            if (monitoringChats.indexOf(id.toString()) != -1 || monitoringChats.indexOf(id) != -1)
            {
                if ((msg.toLowerCase().includes("target 1") && msg.toLowerCase().includes("target 2") && msg.toLowerCase().includes("target 3")) || whiteList.some(v => msg.toLowerCase().includes(v.toLowerCase())))
                {
                    let rectifiedMsg = msg.replace(/@\w+/g, name);
                    rectifiedMsg = rectifiedMsg.toLowerCase();
                    blacklisted.forEach(word =>
                        {
                        patt = "(\\b|\\s|\\()" + word.toLowerCase() + "(\\s|\\b|\\))";
                        re = new RegExp(patt, "g");
                        rectifiedMsg = rectifiedMsg.replace(re, "");
                    });

                    Object.keys(replaceSentences).forEach(sentence =>
                        {
                        patt = "(?=(\\b|\\s|\\())" + sentence.toLowerCase() + "(?=(\\s|\\b|\\)))";
                        re = new RegExp(patt, "gi");
                        rectifiedMsg = rectifiedMsg.replace(re, replaceSentences[sentence]);
                    });

                    rectifiedMsg = rectifiedMsg.trim();
                    rectifiedMsg = rectifiedMsg.toUpperCase();

                    // [append_specific_telegram_id]
                    rectifiedMsg = rectifiedMsg.concat(`\n${telegramId}`);

                    sendChats.forEach(async element =>
                        {
                        await sendMessage(element, rectifiedMsg)
                    });
                }
            }

            let fromMonitor = pasteFromTo.map(x => x.monitor);
            let messengerIndex = fromMonitor.indexOf(id.toString());
            if (messengerIndex != -1)
            {
                if ((msg.toLowerCase().includes("target 1") && msg.toLowerCase().includes("target 2") && msg.toLowerCase().includes("target 3")) || whiteList.some(v => msg.toLowerCase().includes(v.toLowerCase())))
                {
                    let rectifiedMsg = msg.replace(/@\w+/g, name);
                    rectifiedMsg = rectifiedMsg.toLowerCase();
                    blacklisted.forEach(word =>
                        {
                        patt = "(\\b|\\s|\\()" + word.toLowerCase() + "(\\s|\\b|\\))";
                        re = new RegExp(patt, "g");
                        rectifiedMsg = rectifiedMsg.replace(re, "");
                    });

                    Object.keys(replaceSentences).forEach(sentence =>
                        {
                        patt = "(?=(\\b|\\s|\\())" + sentence.toLowerCase() + "(?=(\\s|\\b|\\)))";
                        re = new RegExp(patt, "gi");
                        rectifiedMsg = rectifiedMsg.replace(re, replaceSentences[sentence]);
                    });

                    rectifiedMsg = rectifiedMsg.trim();
                    rectifiedMsg = rectifiedMsg.toUpperCase();

                    // [append_specific_telegram_id]
                    rectifiedMsg = rectifiedMsg.concat(`\n${telegramId}`);

                    let element = pasteFromTo[messengerIndex];
                    // if (element.monitor == id.toString() || element.monitor == id)
                    await sendMessage(element.paste, rectifiedMsg)
                }
            }

            console.warn("message from " + id + ": " + msg);
        }
    }
    catch (err)
    {
        return
    }
});

async function main(phone)
{
    await client.connect();
    await client.login(() => ({
        type: "user",
        getPhoneNumber: retry => retry
            ? Promise.reject('Invalid phone number')
            : Promise.resolve(`+${phone}`),
        getAuthCode: authCode,
        getPassword: (passwordHint, retry) => retry
            ? Promise.reject('Invalid password, ' + passwordHint)
            : Promise.resolve('nbsjdnkdsa')
    }));
    const { loggedIn } = require('./index.js');
    loginTime = Math.floor(Date.now() / 1000);
    loggedIn();

    // await logout();
}

async function authCode(retry)
{
    if (retry)
    {
        return Promise.reject('Invalid auth code')
    }
    else
    {
        const x = await new Promise((res, rej) =>
        {
            //TODO: throws error when this function is called
            try
            {
                const { subscribeToCode } = require('./index.js');
                subscribeToCode((code) =>
                {
                    res(code);
                });
            }
            catch (e)
            {
                console.log("ERROR: " + e);
            }
        });

        return Promise.resolve(x);
    }
}

async function sendMessage(chat_id, msg)
{
    await client.invoke({
        _: "sendMessage",
        chat_id,
        input_message_content: {
            _: "inputMessageText",
            text: {
                _: "formattedText",
                text: msg
            }
        }
    })
}

async function logout(callback)
{
    await client.invoke(({
        _: "logout"
    }));

    callback();
}

// main()
module.exports = { main, logout }
