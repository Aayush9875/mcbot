const mineflayer = require('mineflayer');

const CONFIG = {
  host: 'mcnp.network',         // Replace with your server IP / domain
  port: 25565,               // Default port is 25565
  username: 'negaslayer69', // Replace with your exact Minecraft name
 
  reconnectDelay: 3000       // Reconnect delay in milliseconds (3 seconds)
};

function createBot() {
  console.log(`[${new Date().toLocaleTimeString()}] Attempting connection...`);

  const bot = mineflayer.createBot({
    host: CONFIG.host,
    port: CONFIG.port,
    username: CONFIG.username,
    version: false // Auto-detect Minecraft version
  });

  // When the bot successfully joins the world
  bot.on('spawn', () => {
    console.log(`[${new Date().toLocaleTimeString()}] Connected and holding account slot!`);

    // Auto-login: Sends /login command if password is provided
    if (CONFIG.password && CONFIG.password.length > 0) {
      setTimeout(() => {
        bot.chat(`/login ${CONFIG.password}`);
        console.log(`[${new Date().toLocaleTimeString()}] Sent auto-login password.`);
      }, 1500);
    }

    // Anti-AFK Routine: Swing arm and look around every 20 seconds to prevent idle kick
    const afkInterval = setInterval(() => {
      if (bot && bot.entity) {
        bot.swingArm('right');
        const yaw = (Math.random() - 0.5) * Math.PI;
        const pitch = (Math.random() - 0.5) * (Math.PI / 2);
        bot.look(yaw, pitch, true);
      }
    }, 20000);

    // Clean up interval on kick/disconnect
    bot.once('end', () => clearInterval(afkInterval));
  });

  // Reconnect logic on disconnect
  bot.on('end', (reason) => {
    console.log(`[${new Date().toLocaleTimeString()}] Disconnected (${reason}). Reconnecting in ${CONFIG.reconnectDelay / 1000}s...`);
    setTimeout(createBot, CONFIG.reconnectDelay);
  });

  // Ignore non-fatal connection errors
  bot.on('error', (err) => {
    console.log(`[${new Date().toLocaleTimeString()}] Error: ${err.message}`);
  });
}

// Start the bot loop
createBot();
