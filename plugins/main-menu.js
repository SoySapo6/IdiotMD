// ♥ 𝙼𝚎𝚗𝚞 𝚍𝚎 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 ♥
// ᵁˢᵃ ᵉˢᵗᵉ ᶜᵒᵈⁱᵍᵒ ˢⁱᵉᵐᵖʳᵉ ᶜᵒⁿ ᶜʳᵉᵈⁱᵗᵒˢ

let handler = async (m, { conn, args }) => {
  let userId = m.mentionedJid?.[0] || m.sender
  let user = global.db.data.users[userId]
  let name = conn.getName(userId)
  let _uptime = process.uptime() * 1000
  let uptime = clockString(_uptime)
  let totalreg = Object.keys(global.db.data.users).length

  // Saludo decorado
  let hour = new Intl.DateTimeFormat('es-PE', {
  hour: 'numeric',
  hour12: false,
  timeZone: 'America/Lima'
}).format(new Date())
  
  let saludo = hour < 6 ? "🌌 Buenas madrugadas idiota." :
               hour < 12 ? "🌅 Buenos días, y a esa hora usando el bot? Te salvaste..." :
               hour < 18 ? "🌄 Buenas tardes xd, Deberías usarme mas." :
               "🌃 Buenas noches, Que sueñes conmigo :)"

  // Agrupar comandos por categorías
  let categories = {}
  for (let plugin of Object.values(global.plugins)) {
    if (!plugin.help || !plugin.tags) continue
    for (let tag of plugin.tags) {
      if (!categories[tag]) categories[tag] = []
      categories[tag].push(...plugin.help.map(cmd => `#${cmd}`))
    }
  }

  // Emojis random por categoría
  let decoEmojis = ['💀', '👾', '🌀', '🙃', '🤡', '😵', '🕳️', '📺', '🚨', '🧨']
  let emojiRandom = () => decoEmojis[Math.floor(Math.random() * decoEmojis.length)]

  // MENÚ HANAKO-KUN STYLE
  let menuText = `
╭─❖ 𝘐𝘥𝘪𝘰𝘵𝙈𝘿 ❖─╮

✦ Y𝙤𝙪 𝘼𝙧𝙚 𝘼𝙣 I𝙙𝙞𝙤𝙩 ✦
> *_${saludo}_*

🤓 Idiota: @${userId.split('@')[0]}  
⏱️ Tiempo activo: ${uptime}  
👥 Idiotas: ${totalreg}  

≪───[XD]───≫  
Hecho por: *_SoyMaycol_*

╰─❖𝘐𝘥𝘪𝘰𝘵𝙈𝘿 ❖─╯


`.trim()

  for (let [tag, cmds] of Object.entries(categories)) {
    let tagName = tag.toUpperCase().replace(/_/g, ' ')
    let deco = emojiRandom()
    menuText += `

╭─━━━ ${deco} ${tagName} ${deco} ━━━╮
${cmds.map(cmd => `│ ☻ ${cmd}`).join('\n')}
╰─━━━━━━━━━━━━━━━━╯`
  }

  // Mensaje previo cute
  await conn.reply(m.chat, 'Jah, Debes ser paciente si quieres ver mi menu...', m, {
    contextInfo: {
      externalAdReply: {
        title: botname,
        body: "Simplemente eres un Idiota",
        thumbnailUrl: 'https://files.catbox.moe/rplq60.jpeg',
        sourceUrl: redes,
        mediaType: 1,
        showAdAttribution: true,
        renderLargerThumbnail: true,
      }
    }
  })

  // Enviar menú con video estilo gif
  await conn.sendMessage(m.chat, {
    video: { url: 'https://files.catbox.moe/fwkb9i.mp4', gifPlayback: true },
    caption: menuText,
    gifPlayback: true,
    contextInfo: {
      mentionedJid: [m.sender, userId],
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363372883715167@newsletter',
        newsletterName: 'SoyMaycol <3',
        serverMessageId: -1,
      },
      forwardingScore: 999,
      externalAdReply: {
        title: botname,
        body: "Aca tienes Idiota... :)",
        thumbnailUrl: banner,
        sourceUrl: redes,
        mediaType: 1,
        showAdAttribution: true,
        renderLargerThumbnail: true,
      },
    }
  }, { quoted: m })
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'menú', 'help', 'ayuda']

export default handler

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return `${h}h ${m}m ${s}s`
}
