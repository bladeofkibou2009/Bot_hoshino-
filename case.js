import fs from 'fs'
import axios from 'axios'
import { exec } from 'child_process'
import * as Utils from './lib/myfunc.js'
import uploadImage from './lib/uploadImage.js'
import { toSticker } from './lib/converter.js'
import './config.js'

export const pitaaHandler = async (conn, m) => {
    try {
 
        const body = (m.message?.conversation || m.message?.imageMessage?.caption || m.message?.videoMessage?.caption || m.message?.extendedTextMessage?.text || m.message?.buttonsResponseMessage?.selectedButtonId || '')
        const prefix = /^[\\/!#.]/gi.test(body) ? body.match(/^[\\/!#.]/gi)[0] : ''
        const isCmd = body.startsWith(prefix)
        const command = isCmd ? body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase() : ''
        const args = body.trim().split(/ +/).slice(1)
        const text = args.join(" ")
        const pushname = m.pushName || "Kakak"
        const botNumber = await conn.decodeJid(conn.user.id)
        const sender = m.key.fromMe ? (conn.user.id.split(':')[0]+'@s.whatsapp.net' || conn.user.id) : (m.key.participant || m.key.remoteJid)
        const isOwner = global.owner.includes(sender.split('@')[0])
        
        const isGroup = m.key.remoteJid.endsWith('@g.us')
        const groupMetadata = isGroup ? await conn.groupMetadata(m.key.remoteJid) : ''
        const participants = isGroup ? await groupMetadata.participants : ''
        const groupAdmins = isGroup ? await participants.filter(v => v.admin !== null).map(v => v.id) : ''
        const isBotAdmins = isGroup ? groupAdmins.includes(botNumber) : false
        const isAdmins = isGroup ? groupAdmins.includes(sender) : false

        m.reply = (teks) => {
            conn.sendMessage(m.key.remoteJid, { text: teks }, { quoted: m })
        }

        if (isCmd) {
            await conn.sendPresenceUpdate('composing', m.key.remoteJid)
        }

        if (isGroup && isBotAdmins && !isAdmins && !isOwner) {
            
            if (body.includes('chat.whatsapp.com')) {
                await conn.sendMessage(m.key.remoteJid, { delete: m.key })
                return m.reply('❌ *ANTILINK DETECTED*\nPitaa hapus ya! Jangan sebar link grup lain di sini sayang... 😠')
            }
         
            const badwords = ['anjing', 'babi', 'tolol', 'bangsat', 'memek', 'ngentot', 'peler', 'asulibing']
            if (badwords.some(word => body.toLowerCase().includes(word))) {
                await conn.sendMessage(m.key.remoteJid, { delete: m.key })
                return m.reply(`Duh kak *${pushname}*, mulutnya dijaga ya! Pitaa hapus pesannya biar grup ini tetep adem... 🤫`)
            }

            if (m.key.id.startsWith('BAE5') && !m.key.fromMe) {
                await m.reply('❌ *BOT DETECTED*\nMaaf ya, cuma Pitaa yang boleh jadi bot di sini! Bye-bye... 👋')
                return await conn.groupParticipantsUpdate(m.key.remoteJid, [sender], 'remove')
            }
            
            const adultWords = ['bokep', 'porn', 'vcs', 'hentai', 'xnxx']
            if (adultWords.some(word => body.toLowerCase().includes(word))) {
                await m.reply('❌ *ANTI 18+ DETECTED*\nIh mesum! Pitaa tendang ya, jangan bawa virus ke sini! 😤')
                return await conn.groupParticipantsUpdate(m.key.remoteJid, [sender], 'remove')
            }
        }

        if (!isCmd) return

        switch(command) {

            case 'menu': {
                let menuText = `
⢀⣀⠀⠀⠀⢀⡶⢶⡄⠀⠀⠀⣀⡀
⢿⣩⡇⠀⠀⢈⡿⢿⡁⠀⠀⢸⣍⡿
⠀⢿⠛⠶⠶⠛⠁⠈⠛⠶⠶⠛⡿⠀
    . halo semuaa! യ◟
⠀⠘⣧⣀⣀⣀⣀⣀⣀⣀⣀⣼⠃⠀
                          ⋱ hi beautifull  ⋰
⠀⠀⠿⠶⠶⠶⠶⠶⠶⠶⠶⠿⠀⠀ + ࣪ ˖
— 𝗂𝗆 𝗉𝗂𝗍𝖺 𝖻𝗈𝗍 𝖻𝖾𝖺𝗎𝗍𝗂𝖿𝗎𝗅𝗅
𝖺𝖽𝖺 𝖻𝗂𝗌𝖺 𝖻𝖺𝗇𝗍𝗎 𝗄𝖺𝗄?ˎˊ˗
⌕ 𝗯𝗲𝗮𝘂𝘁𝗶𝗳𝘂𝗹𝗹 ><                
             
╭──𖥔 *MAKER & CONVERTER*
│ꕤ ${prefix}iqc <teks>
│ꕤ ${prefix}brat <teks>
│ꕤ ${prefix}bratanime <teks>
│ꕤ ${prefix}fakestory <user|teks>
│ꕤ ${prefix}sticker (reply foto)
╰─────────────𖥔

╭──𖥔 *STALKER*
│ꕤ ${prefix}mlstalk <id|zone>
╰─────────────𖥔

╭──𖥔 *GROUP*
│ꕤ ${prefix}hidetag 
│ꕤ ${prefix}open 
│ꕤ ${prefix}close 
│ꕤ ${prefix}kick 
╰─────────────𖥔

╭──𖥔 *SECURITY SYSTEM*
│ꕤ Antilink: ✅ Active
│ꕤ Antibot: ✅ Active
│ꕤ Anti-18+: ✅ Active
│ꕤ Anti-Toxic: ✅ Active
╰─────────────𖥔
`
                await conn.sendMessage(m.key.remoteJid, { 
                    text: menuText,
                    contextInfo: { 
                        externalAdReply: { 
                            title: "𝗉𝗂𝗍𝖺𝖺 - 𝗆𝖽", 
                            body: "𝗍𝖺𝗇𝗒𝖺 𝖺𝗉𝖺 𝖺𝗃𝖺 𝗄𝖾 𝗉𝗂𝗍𝖺𝖺 𝗒𝖺!", 
                            previewType: "PHOTO", 
                            thumbnailUrl: "https://files.catbox.moe/j2kua7.jpg",
                            sourceUrl: "https://github.com" 
                        } 
                    } 
                }, { quoted: m })
            }
            break

            case 'iqc': {
                if (!text) return m.reply(`Aduhhh, teksnya mana kak? Contoh: ${prefix}iqc Pitaa sayang kakak`)
                m.reply('Bentar ya, Pitaa rakit dulu kata-katanya... 🕒')
                try {
                    const { data } = await axios.get(`https://api.zenitsu.web.id/api/maker/iqc?text=${encodeURIComponent(text)}&apikey=${global.zenitsu}`, { responseType: 'arraybuffer' })
                    await conn.sendMessage(m.key.remoteJid, { image: data, caption: `✨ *Done ya Sayang!*` }, { quoted: m })
                } catch (e) { m.reply('Yah, mesin IQC lagi mogok kak.. 🥺') }
            }
            break

            case 'brat': {
                if (!text) return m.reply('Kasih kata-kata dong kak, biar stikernya cantik! 🥺')
                try {
                    let resUrl = `https://api.nexray.web.id/maker/brat?text=${encodeURIComponent(text)}`
                    let buffer = await Utils.getBuffer(resUrl)
                    await conn.sendMessage(m.key.remoteJid, { sticker: buffer }, { quoted: m })
                } catch (e) { m.reply('Gagal bikin Brat sticker.. coba lagi ya 🥺') }
            }
            break

            case 'bratanime': {
                if (!text) return m.reply('Mana teks wibunya kak? 🌸')
                try {
                    let resUrl = `https://api.nexray.web.id/maker/bratanime?text=${encodeURIComponent(text)}`
                    let buffer = await Utils.getBuffer(resUrl)
                    await conn.sendMessage(m.key.remoteJid, { sticker: buffer }, { quoted: m })
                } catch (e) { m.reply('Anime-nya lagi libur kak 🥺') }
            }
            break

            case 'fakestory': {
                if (!text.includes('|')) return m.reply('Format: username|caption\nContoh: .fakestory Pitaa|Lagi kangen..')
                let [u, c] = text.split('|')
                let avatar = "https%3A%2F%2Ffiles.catbox.moe%2Fj2kua7.jpg"
                let resUrl = `https://api.nexray.web.id/maker/fakestory?username=${encodeURIComponent(u)}&caption=${encodeURIComponent(c)}&avatar=${avatar}`
                await conn.sendMessage(m.key.remoteJid, { image: { url: resUrl }, caption: 'Tuh, udah jadi story palsunya! 😜' }, { quoted: m })
            }
            break

            case 's':
            case 'sticker': {
                let q = m.quoted ? m.quoted : m
                let mime = (q.msg || q).mimetype || ''
                if (/image/.test(mime)) {
                    m.reply('Tunggu sebentar, Pitaa sulap jadi stiker... 🪄')
                    let media = await q.download()
                    let encmedia = await toSticker(media, 'jpg')
                    await conn.sendMessage(m.key.remoteJid, { sticker: encmedia }, { quoted: m })
                } else {
                    m.reply('Fotonya mana sayang? Kirim/reply foto ya!')
                }
            }
            break

            case 'mlstalk': {
                if (!text) return m.reply(`Contoh: ${prefix}mlstalk 1001972742|13005`)
                let [id, zone] = text.split('|')
                if (!id || !zone) return m.reply('Mana ID sama Zone-nya kak?')
                m.reply('Sabar, Pitaa lagi cari akunnya... 🧐')
                try {
                    let res = await axios.get(`https://api.nexray.web.id/stalker/mlbb?id=${id}&zone=${zone}`)
                    let hasil = `🎮 *MOBILE LEGENDS STALKER* 🎮\n\n👤 Nickname: ${res.data.userName || 'Ketemu!'}\n🆔 ID: ${id}\n🌐 Zone: ${zone}\n\nUdah ketemu ya kak, jangan lupa push rank! 😋`
                    m.reply(hasil)
                } catch (e) { m.reply('Yah, akunnya gak ketemu kak.. 🥺') }
            }
            break

            case 'hidetag': {
                if (!isGroup) return m.reply('Cuma bisa di grup kak! 😤')
                if (!isAdmins) return m.reply('Cuma Admin yang boleh panggil semua member! 😠')
                conn.sendMessage(m.key.remoteJid, { text: text ? text : '', mentions: participants.map(a => a.id) })
            }
            break

            case 'open': {
                if (!isGroup || !isBotAdmins || !isAdmins) return m.reply('Pitaa/Kakak harus jadi admin ya! 🥺')
                await conn.groupSettingUpdate(m.key.remoteJid, 'not_announcement')
                m.reply('✅ Grup berhasil dibuka! Silakan chat ya kak... ✨')
            }
            break

            case 'close': {
                if (!isGroup || !isBotAdmins || !isAdmins) return m.reply('Pitaa/Kakak harus jadi admin ya! 🥺')
                await conn.groupSettingUpdate(m.key.remoteJid, 'announcement')
                m.reply('✅ Grup berhasil ditutup! Biar gak berisik dulu ya... 🔒')
            }
            break

            case 'kick': {
                if (!isGroup || !isBotAdmins || !isAdmins) return m.reply('Pitaa harus admin buat nendang orang! 🥺')
                let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                if (!user) return m.reply('Tag orang yang mau dikick kak!')
                await conn.groupParticipantsUpdate(m.key.remoteJid, [user], 'remove')
                m.reply('Selamat tinggal! Udah Pitaa tendang keluar... 👋🤣')
            }
            break

            default:
                if (isCmd && isOwner && body.startsWith('>')) {
                    try {
                        let evaled = await eval(text)
                        if (typeof evaled !== 'string') evaled = await import('util').then(v => v.format(evaled))
                        m.reply(evaled)
                    } catch (e) { m.reply(String(e)) }
                }
        }
    } catch (err) {
        console.log('Error di PitaaHandler: ', err)
    }
}