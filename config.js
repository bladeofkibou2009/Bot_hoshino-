import fs from 'fs'

global.owner = ['628xxxxxxxx'] // Ganti nomor kakak ya
global.ownerName = 'Pitaa'
global.botName = 'Pitaa Bot 🎀'
global.sessionName = 'session'
global.prefa = ['.', '/', '!'] 

// --- API KEYS ---
global.zenitsu = 'znx' 
global.nexray = 'nexray'

global.mess = {
    wait: 'Sabar ya sayang, Pitaa lagi proses... ⏳',
    success: 'Yey! Udah jadi nih kak ✨',
    error: 'Duh maaf, ada error nih kak. Coba lagi nanti ya 🥺',
    admin: 'Ih, fitur ini cuma buat Admin grup tau! 😤',
    botAdmin: 'Pitaa harus jadi Admin dulu biar bisa jalanin ini 🥺',
    owner: 'Hanya owner tersayang Pitaa yang boleh pake ini 😋',
    group: 'Fitur ini cuma bisa dipake di dalam grup ya kak!'
}

let file = import.meta.url
import.meta.poll = (file, cb) => {
    fs.watchFile(file, () => cb(file))
}
import.meta.poll(file, () => {
    console.log('Update di config.js!')
})