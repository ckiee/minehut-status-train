const api = require("./api").api;
const { Client, MessageEmbed, Message } = require("discord.js");
const client = new Client();
const config = require("./config");
client.login(config.token);
client.on('ready', () => {
    console.log("Logged in as "+client.user.tag);
    function gameTask() {
        client.user.setActivity(`${client.guilds.size} guilds. | ${config.prefix}help`, {type:"WATCHING"});
    }
    client.setInterval(gameTask, 300000);
    gameTask();
});

client.on('message', async msg => {
    if (msg.author.bot || !msg.content.startsWith(config.prefix)) return;
    const cmd = msg.content.toLowerCase().split(" ")[0].slice(config.prefix.length);
    const args = msg.content.split(" ").slice(1); 
    switch (cmd) {
        case "topservers":
        let topten = api.commServers.sort((s1, s2) => s1.playerCount - s2.playerCount).slice(0, 4).map(se => `  • ${se.name} (${se.playerCount} players)`).join("\n");
        msg.channel.send(new MessageEmbed().setAuthor(client.user.username, client.user.displayAvatarURL()).setDescription(`**\`Showing Top 10 Servers:\`**\n${topten}`).setFooter("Minehut Top 10 Servers").setTimestamp(new Date()));
        break;

        case "help":
        msg.channel.send(
            new MessageEmbed().setAuthor(client.user.username, client.user.displayAvatarURL()).setDescription(
`*\`Showing all commands:\`*
• Ping: Pong! :ping_pong:
• Server: Show some info about a Minehut server. ${config.prefix}server <server name>
• TopServers: See the top 10 Minehut Server names.`
            )
        );
        break;
        case "ping":
        let m = await msg.channel.send("Pong! :ping_pong:");
        m.edit(`Pong! :ping_pong: (Roundtrip: ${m.createdTimestamp - msg.createdTimestamp}ms | One-way: ${~~client.ping}ms)`);
        break;
        case "server":
        if (args.length < 1) {
            return msg.channel.send(`:x: Invalid usage! \`${config.prefix}server <server name>\``)
        }
        let server = await api.getServerByName(args[0]);
        
        msg.channel.send(new MessageEmbed()
    .setAuthor(client.user.username, client.user.displayAvatarURL())
    .setFooter("Minehut Stats Bot")
    .setTimestamp(new Date())
    .setDescription(
`Showing info about Server ***\`${server.name}\`***!
• Online? ${api.getServerSessionByName(args[0]!=null?`:white_check_mark: (${api.getServerSessionByName(args[0]).playerCount} players online)`:":x:")}
• Created At: \`${new Date(server.creation).toDateString()}\`
• Credits Per Day: \`${server.credits_per_day}\`
• Message of the Day: \`${server.motd}\`
• Visible? ${server.visibility?":white_check_mark:":":x:"}
    • Server Settings:
        Allow Flight? ${server.server_properties.allow_flight?":white_check_mark:":":x:"}
        Allow Nether? ${server.server_properties.allow_nether?":white_check_mark:":":x:"}
        Difficulty? \`${server.server_properties.difficulty}\`
        Command Blocks? ${server.server_properties.enable_command_block?":white_check_mark:":":x:"}
        Force Gamemode? ${server.server_properties.force_gamemode?":white_check_mark:":":x:"}
        Default Gamemode? \`${server.server_properties.gamemode}\`
        Generate Structures? ${server.server_properties.generate_structures?":white_check_mark:":":x:"}
        Hardcore? ${server.server_properties.hardcore?":white_check_mark:":":x:"}
        Seed? \`${server.server_properties.level_seed==''?"None":server.server_properties.level_seed}\`
        Max players? \`${server.server_properties.max_players}\`
        Can PvP? ${server.server_properties.pvp?":white_check_mark:":":x:"}
        Summon Animals? ${server.server_properties.spawn_animals?":white_check_mark:":":x:"}
        Summon Mobs? ${server.server_properties.spawn_mobs?":white_check_mark:":":x:"}`)
    );
        break;
    }
});
