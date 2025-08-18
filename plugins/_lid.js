const handler = async (msg, { conn }) => {
  const chatId = msg.key.remoteJid
  const senderId = msg.key.participant || msg.key.remoteJid

  // Reacción inicial
  await conn.sendMessage(chatId, {
    react: { text: '😐, key: msg.key }
  })

  // Extraer el ID citado o usar el que envió el mensaje
  const context = msg.message?.extendedTextMessage?.contextInfo
  const citado = context?.participant
  const objetivo = citado || senderId

  const esLID = objetivo.endsWith('@lid')
  const tipo = esLID ? 'LID oculto (@lid)' : 'Número visible (@s.whatsapp.net)'
  const numero = objetivo.replace(/[^0-9]/g, '')

  const mensaje = `
*Identificador:* ${objetivo}
*Número:* +${numero}
*Tipo de cuenta:* ${tipo}
`.trim()

  await conn.sendMessage(chatId, {
    text: mensaje
  }, { quoted: msg })
}

handler.command = ['lid']
handler.group = true
handler.private = false

export default handler
