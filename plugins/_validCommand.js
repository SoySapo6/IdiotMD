import stringSimilarity from 'string-similarity'
import fetch from 'node-fetch'
import crypto from 'crypto'
import { FormData, Blob } from 'formdata-node'
import { fileTypeFromBuffer } from 'file-type'

export async function before(m) {
    // Sistema Anti-NSFW
    if (m.chat && global.db.data.chats && global.db.data.chats[m.chat]?.antiNsfw) {
        await detectarNSFW(m, this)
    }
    
    // Resto del código original para comandos
    if (!m.text || !global.prefix.test(m.text)) return

    const usedPrefix = global.prefix.exec(m.text)[0]
    const command = m.text.slice(usedPrefix.length).trim().split(' ')[0].toLowerCase()

    if (!command || command === 'bot') return

    const allCommands = Object.values(global.plugins)
        .flatMap(plugin => Array.isArray(plugin.command) ? plugin.command : [plugin.command])
        .filter(Boolean)
        .map(cmd => typeof cmd === 'string' ? cmd : (cmd instanceof RegExp ? cmd.source : null))
        .filter(cmd => typeof cmd === 'string')

    const exists = allCommands.includes(command)

    let chat = global.db.data.chats[m.chat]
    let user = global.db.data.users[m.sender]

    // ⚡ Detecta comandos en mantenimiento
    global.comandosEnMantenimiento = global.comandosEnMantenimiento || []

    if (global.comandosEnMantenimiento.includes(command)) {
        const mensaje = `╭─❍「 ✦ ${global.apodo} ✦ 」\n│\n├─ El hechizo *${usedPrefix}${command}* está en *mantenimiento*.\n│\n├─ Vuelve a intentarlo más tarde~\n╰─✦`
        await m.reply(mensaje)
        return
    }

    if (!exists) {
        const { bestMatch } = stringSimilarity.findBestMatch(command, allCommands)
        const suggestion = bestMatch.rating > 0.3 ? `¿Quisiste decir *${usedPrefix}${bestMatch.target}*?` : ''

        const mensaje = `╭─❍「 ✦ ${global.apodo} ✦ 」\n│\n├─ El hechizo *${usedPrefix}${command}* no existe en los registros del más allá.\n│\n├─ ${suggestion || 'Consulta los conjuros disponibles con:'}\n│   ⇝ *${usedPrefix}help*\n╰─✦`    
        await m.reply(mensaje)    
        return
    }

    if (chat?.isBanned) {
        const avisoDesactivado = `╭─❍「 ✦ ${global.apodo} ✦ 」\n│\n├─ El poder de Hanako ha sido *sellado* en este grupo.\n│\n├─ Invoca su regreso con:\n│   ⇝ *${usedPrefix}bot on*\n╰─✦`
        await m.reply(avisoDesactivado)
        return
    }

    if (!user.commands) user.commands = 0
    user.commands += 1
}

// 🔞 Sistema Anti-NSFW
async function detectarNSFW(m, conn) {
    try {
        let isAdmin = false
        let isBotAdmin = false
        
        // Verificar si el usuario es admin
        if (m.chat.includes('@g.us') || m.chat.includes('@lid')) {
            try {
                let groupMetadata = await conn.groupMetadata(m.chat)
                if (groupMetadata && groupMetadata.participants) {
                    let participants = groupMetadata.participants
                    
                    // Verificar si el usuario es admin
                    let userParticipant = participants.find(p => p.id === m.sender)
                    if (userParticipant) {
                        isAdmin = userParticipant.admin === 'admin' || userParticipant.admin === 'superadmin'
                    }
                    
                    // Verificar si el bot es admin
                    let botJid = conn.user?.jid || conn.user?.id || conn.decodeJid?.(conn.user?.id)
                    
                    if (botJid) {
                        // Buscar bot en participantes con múltiples métodos
                        let botParticipant = participants.find(p => {
                            return p.id === botJid || 
                                   p.id.split('@')[0] === botJid.split('@')[0] ||
                                   p.id.includes(botJid.split('@')[0]) ||
                                   botJid.includes(p.id.split('@')[0])
                        })
                        
                        if (botParticipant) {
                            isBotAdmin = botParticipant.admin === 'admin' || botParticipant.admin === 'superadmin'
                        } else {
                            // Búsqueda por número si no se encuentra
                            let botNumber = botJid.split('@')[0].replace(/\D/g, '')
                            botParticipant = participants.find(p => {
                                let participantNumber = p.id.split('@')[0].replace(/\D/g, '')
                                return participantNumber === botNumber
                            })
                            
                            if (botParticipant) {
                                isBotAdmin = botParticipant.admin === 'admin' || botParticipant.admin === 'superadmin'
                            }
                        }
                    }
                }
            } catch (e) {
                // Silenciar errores de verificación
            }
        }
        
        // Verificar si es owner
        if (!isAdmin && global.owner) {
            isAdmin = global.owner.some(owner => {
                let ownerNumber = Array.isArray(owner) ? owner[0] : owner
                return ownerNumber === m.sender.split('@')[0]
            })
        }
        
        // Lista de palabras NSFW - PALABRAS COMPLETAS SOLAMENTE
        const palabrasNSFW = [
            // Palabras básicas
            'porno', 'porn', 'xxx', 'sexo', 'sex', 'pene', 'vagina', 'masturbacion',
            'masturbar', 'coger', 'follar', 'puta', 'puto', 'verga', 'chupar', 
            'mamar', 'correrse', 'venirse', 'orgasmo', 'pussy', 'dick', 'cock', 
            'culo', 'tetas', 'boobs', 'desnudo', 'desnuda', 'horny', 'cachondo', 
            'excitado', 'placer', 'gemir', 'penetrar', 'chuparla', 'mamada', 
            'oral', 'anal', 'prostituta', 'escort', 'webcam', 'onlyfans', 'pack',
            'sexy', 'sensual', 'pornhub', 'xnxx', 'penon', 'xvideos', 'youporn',
            
            // Palabras adicionales específicas
            'erotico', 'erótica', 'erotica', 'pornohub', 'desnudito', 'desnudita',
            'desvestirse', 'desvestido', 'desvestida', 'desnudos', 'sexting',
            'sado', 'bdsm', 'bondage', 'sadomasoquismo', 'hardcore', 'deepthroat',
            'clitoris', 'clítoris', 'semen', 'eyaculacion', 'eyacular', 'penetracion',
            'pechos', 'pezones', 'pezon', 'gangbang', 'violacion', 'violada', 
            'violador', 'zoofilia', 'bestialidad', 'incesto', 'pedofilia', 'pedofilo',
            'lolicon', 'shotacon', 'hentai', 'ecchi', 'rule34', 'camshow',
            'swingers', 'sextape', 'pornografia', 'pornografía', 'pornografia infantil', 'hot', '🔥', '👉👌', '👉 👌', 'cachondo', '🥴', '🥵'
        ]
        
        // 1. Detectar texto NSFW con palabras completas
        if (m.text) {
            const tieneNSFW = detectarPalabraCompleta(m.text.toLowerCase(), palabrasNSFW)
            
            if (tieneNSFW && !isAdmin) {
                await eliminarMensaje(m, conn, isBotAdmin, '🔞 Contenido inapropiado detectado en texto')
                return
            }
        }
        
        // 2. Detectar imágenes NSFW
        if (m.mtype === 'imageMessage' && m.message?.imageMessage) {
            await detectarImagenNSFW(m, conn, isAdmin, isBotAdmin)
        }
        
        // 3. Detectar stickers NSFW
        if (m.mtype === 'stickerMessage' && m.message?.stickerMessage) {
            await detectarImagenNSFW(m, conn, isAdmin, isBotAdmin, 'sticker')
        }
        
    } catch (error) {
        console.error('Error en sistema anti-NSFW:', error)
    }
}

// Función para detectar palabras completas (evita falsos positivos)
function detectarPalabraCompleta(texto, palabrasProhibidas) {
    // Crear regex para cada palabra que busque palabras completas
    return palabrasProhibidas.some(palabra => {
        // Regex que busca la palabra como palabra completa (con límites de palabra)
        const regex = new RegExp(`\\b${palabra.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
        return regex.test(texto)
    })
}

// Función para subir imagen/sticker a CatBox
async function subirACatBox(buffer) {
    try {
        const { ext, mime } = (await fileTypeFromBuffer(buffer)) || {}
        const blob = new Blob([buffer.toArrayBuffer()], { type: mime })
        const formData = new FormData()
        const randomBytes = crypto.randomBytes(5).toString('hex')
        
        formData.append('reqtype', 'fileupload')
        formData.append('fileToUpload', blob, randomBytes + '.' + ext)

        const response = await fetch('https://catbox.moe/user/api.php', {
            method: 'POST',
            body: formData,
            headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36'
            }
        })

        const url = await response.text()
        
        // Verificar que la URL sea válida
        if (!url || !url.startsWith('https://files.catbox.moe/')) {
            throw new Error('URL de CatBox inválida')
        }
        
        return url.trim()
    } catch (error) {
        console.error('Error subiendo a CatBox:', error)
        throw error
    }
}

async function detectarImagenNSFW(m, conn, isAdmin, isBotAdmin, tipo = 'imagen') {
    if (isAdmin) return // Los admins pueden enviar lo que quieran
    
    try {
        // Descargar la imagen
        let buffer = await m.download()
        if (!buffer) return
        
        // Subir imagen a CatBox
        let imageUrl = await subirACatBox(buffer)
        
        // Hacer petición a la API con la URL de CatBox
        const response = await fetch(`https://delirius-apiofc.vercel.app/tools/checknsfw?image=${encodeURIComponent(imageUrl)}`)
        
        if (!response.ok) {
            throw new Error(`Error en API: ${response.status} ${response.statusText}`)
        }
        
        const data = await response.json()
        
        if (data.status && data.data) {
            // Limpiar el porcentaje para obtener solo el número
            const porcentajeTexto = data.data.percentage.replace('%', '')
            const porcentaje = parseFloat(porcentajeTexto)
            const esNSFW = data.data.NSFW && porcentaje > 50
            
            if (esNSFW) {
                const mensaje = `🔞 ${tipo === 'sticker' ? 'Sticker' : 'Imagen'} NSFW detectada (${data.data.percentage})`
                await eliminarMensaje(m, conn, isBotAdmin, mensaje)
                
                // Mensaje adicional con detalles
                const detalles = `╭─❍「 ✦ ${global.apodo} ✦ 」
│
├─ ⚠️ *Se detectó y removió contenido inapropiado de este plano terrenal...*
│
├─ 📊 *Informe de los guardianes mágicos:*
│   ⇝ Nivel NSFW: ${data.data.percentage}
│   ⇝ Estado: ${data.data.safe ? '✨ Seguro para todos los magos' : '🚫 No apto para este reino'}
│   ⇝ Tipo de elemento: ${tipo === 'sticker' ? 'Sticker encantado' : 'Imagen'}
│   ⇝ URL analizada: ${imageUrl}
│
├─ ✦ *Mensaje del oráculo:*
│   ⇝ ${data.data.response || 'Este contenido no es digno del grupo sagrado.'}
╰─✦`
                
                await conn.reply(m.chat, detalles, m)
            }
        } else {
            console.error('Respuesta inválida de la API:', data)
        }
        
    } catch (error) {
        console.error('Error detectando imagen NSFW:', error)
        
        // Mensaje de error opcional (puedes comentar esto si no quieres mostrar errores)
        const errorMsg = `╭─❍「 ✦ ${global.apodo} ✦ 」
│
├─ ⚠️ *Error en el sistema de detección NSFW:*
│   ⇝ ${error.message}
│
├─ 🛡️ *El contenido no pudo ser analizado correctamente*
╰─✦`
        
        // await conn.reply(m.chat, errorMsg, m) // Descomenta si quieres mostrar errores
    }
}

async function eliminarMensaje(m, conn, isBotAdmin, razon) {
    try {
        let mensajeEliminado = false
        
        // Intentar eliminar el mensaje
        if (isBotAdmin) {
            try {
                await conn.sendMessage(m.chat, { delete: m.key })
                mensajeEliminado = true
            } catch (deleteError) {
                try {
                    await conn.deleteMessage(m.chat, m.key)
                    mensajeEliminado = true
                } catch (altError) {
                    // Silenciar errores
                }
            }
        }
        
        // Si no es admin, intentar de todas formas
        if (!mensajeEliminado) {
            try {
                await conn.sendMessage(m.chat, { delete: m.key })
                mensajeEliminado = true
                isBotAdmin = true
            } catch (forceError) {
                // Silenciar errores
            }
        }
        
        // Mensaje de advertencia
        const advertencia = `╭─❍「 ✦ 𝚂𝚘𝚢𝙼𝚊𝚢𝚌𝚘𝚕 <𝟹 ✦ 」
│
├─ 🚫 *Se ha detectado un acto prohibido en este reino...*
│
├─ 👤 *Involucrado:* @${m.sender.split('@')[0]}
├─ ⚠️ *Razón:* ${razon}
├─ 📝 *Estado:* ${mensajeEliminado ? '✅ El hechizo de eliminación fue exitoso' : '❌ No se pudo eliminar, verifica que el bot tenga poderes de administrador'}
╰─✦`
        
        await conn.reply(m.chat, advertencia, m, { mentions: [m.sender] })
        
    } catch (error) {
        console.error('Error general eliminando mensaje:', error)
        await conn.reply(m.chat, `❌ Error al procesar: ${razon}`, m)
    }
          }
