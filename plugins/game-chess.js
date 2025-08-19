/* Creditos a SoyMaycol <3
---> GitHub: SoySapo6 */

import { Chess } from 'chess.js'

let partidas = {}

let handler = async (m, { conn, text, command, usedPrefix }) => {
  let id = m.sender

  if (!partidas[id]) partidas[id] = new Chess()
  let partida = partidas[id]

  // mostrar tablero si no se pasó jugada
  if (!text) {
    let url = `https://fen2image.chessvision.ai/${encodeURIComponent(partida.fen())}`
    return conn.sendMessage(m.chat, { 
      image: { url }, 
      caption: 
`╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <3 ✦ 」
│
├─ [♣️]  𝙿𝚊𝚛𝚝𝚒𝚍𝚊 𝚍𝚎 𝙰𝚓𝚎𝚍𝚛𝚎𝚣
│
├─ Estado: ${partida.isGameOver() ? "✅ Finalizada" : "⏳ En juego"}
│
│   ⇝ Usa: *${usedPrefix + command} e2e4*
╰─✦`
    }, { quoted: m })
  }

  let move = partida.move(text.trim(), { sloppy: true })
  if (!move) return m.reply("⚠️ Movimiento inválido. Ejemplo: *e2e4*")

  if (partida.isGameOver()) {
    let url = `https://fen2image.chessvision.ai/${encodeURIComponent(partida.fen())}`
    delete partidas[id]
    return conn.sendMessage(m.chat, { 
      image: { url },
      caption: `♟️ Tu jugada: *${move.san}*\n\n✅ ¡La partida ha terminado!`
    }, { quoted: m })
  }

  // IA random
  let moves = partida.moves()
  let iaMove = moves[Math.floor(Math.random() * moves.length)]
  partida.move(iaMove)

  let url = `https://fen2image.chessvision.ai/${encodeURIComponent(partida.fen())}`

  if (partida.isGameOver()) {
    delete partidas[id]
    return conn.sendMessage(m.chat, { 
      image: { url },
      caption: `Tú: *${move.san}*\nIA: *${iaMove}*\n\n✅ ¡La partida terminó!`
    }, { quoted: m })
  }

  conn.sendMessage(m.chat, { 
    image: { url },
    caption: 
`╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <3 ✦ 」
│
├─ [♣️]  𝙼𝚘𝚟𝚒𝚖𝚒𝚎𝚗𝚝𝚘𝚜
│
├─  Tú: *${move.san}*
│   IA: *${iaMove}*
│
│   ⇝ Juega con: *${usedPrefix + command} <jugada>*
╰─✦`
  }, { quoted: m })
}

handler.help = ['chess']
handler.tags = ['game']
handler.command = ['chess']
handler.register = true

export default handler
