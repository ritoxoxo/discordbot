const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const http = require('http');

console.log('Bot script started');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

const TOKEN = process.env.TOKEN;

// Role IDs
const OWNER_ROLE_ID = '1366216887750492218';
const MODS_ROLE_ID = '1367291104042680340';
const VAMP_ROLE_ID = '1366216887742234695';
const NEWBIE_ROLE_ID = '1366216887733850151';
const WANTS_TO_VERIFY_ROLE_ID = '1384575485119434753';
const ONLY_FOR_TAG_ROLE_ID = '1384575610910933083';

// Channel & Media
const WELCOME_CHANNEL_ID = '1366216888392093854';
const GIF_URL = 'https://media.discordapp.net/attachments/1366216889302384769/1384424207881867345/walking-hey.gif';

// Trigger message
const TRIGGER_TEXT = `› *Hey pretty* <a:kissezgif:1366562622287380532> ,

*Welcome to xoxo*, *you are now verified! Please check out <#1366216888182640727> and consider boosting to get* <#1366216888182640729>  

♱ | *Decorate your pretty profile by getting your roles in* <#1366216888392093847> , <#1366216888392093849>  <#1366216888392093848> 

♱ | *Let us get to know you by telling us a little something about you in* <#1366216888392093851>`;

// Function to remove unwanted roles and send welcome embed
async function handleVampRoleAdd(member) {
  try {
    // Remove roles
    await member.roles.remove([NEWBIE_ROLE_ID, WANTS_TO_VERIFY_ROLE_ID, ONLY_FOR_TAG_ROLE_ID]);

    // Fetch welcome channel
    const channel = await member.guild.channels.fetch(WELCOME_CHANNEL_ID);
    if (!channel) return console.error('Welcome channel not found');

    // Create embed
    const embed = new EmbedBuilder()
      .setTitle('◟        ⌞𝔴𝔢𝔩𝔠𝔬𝔪𝔢⌝        ◞')
      .setDescription(`*pretty up your profile*  <:Notes:1367338605646975047>

⁝⠀                 ›  [roles](https://discord.com/channels/1366216887595434055/1366216888392093847)⠀⸝⸝  [color](https://discord.com/channels/1366216887595434055/1366216888392093849)     ᛝ
⠀    ⠀    ⸝⸝   [gaming](https://discord.com/channels/1366216887595434055/1366216888392093848)  ⸝⸝   [intro](https://discord.com/channels/1366216887595434055/1366216888392093851)      ㅤ⸝⸝

⠀                         → ** say hi **   .ᐟ)`)
      .setColor('#4A0404')
      .setThumbnail(GIF_URL);

    // Send mention + embed
    await channel.send({ content: `<@${member.id}>`, embeds: [embed] });
  } catch (error) {
    console.error('Error sending welcome embed:', error);
  }
}

// On message, only add the Vamp role
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (
    !message.member.roles.cache.has(OWNER_ROLE_ID) &&
    !message.member.roles.cache.has(MODS_ROLE_ID)
  ) return;

  if (!message.content.trim().startsWith(TRIGGER_TEXT.trim())) return;

  let targetMember;

  if (message.reference) {
    try {
      const repliedMsg = await message.channel.messages.fetch(message.reference.messageId);
      targetMember = repliedMsg.member;
    } catch {
      return;
    }
  } else if (message.mentions.members.size > 0) {
    targetMember = message.mentions.members.first();
  } else return;

  if (!targetMember) return;

  // Only add the Vamp role here
  try {
    await targetMember.roles.add(VAMP_ROLE_ID);
  } catch (error) {
    console.error('Error adding Vamp role:', error);
  }
});

// On guildMemberUpdate, if Vamp role newly added, send embed and remove unwanted roles
client.on('guildMemberUpdate', async (oldMember, newMember) => {
  if (!oldMember.roles.cache.has(VAMP_ROLE_ID) && newMember.roles.cache.has(VAMP_ROLE_ID)) {
    await handleVampRoleAdd(newMember);
  }
});

client.login(TOKEN).catch(console.error);

// Small HTTP server to keep Google Cloud Run container alive
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is running');
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`HTTP server listening on port ${PORT}`);
});
