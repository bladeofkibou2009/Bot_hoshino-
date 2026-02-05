import pkg from '@whiskeysockets/baileys';
const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason, 
    fetchLatestBaileysVersion, 
    jidDecode,
    makeInMemoryStore 
} = pkg;
import { Boom } from '@hapi/boom';
import pino from 'pino';
import fs from 'fs';
import chalk from 'chalk';
import './config.js';

const logger = pino({ level: 'silent' });
const store = makeInMemoryStore({ logger });

async function startPitaa() {
    const { state, saveCreds } = await useMultiFileAuthState(global.sessionName || 'session');
    const { version } = await fetchLatestBaileysVersion();
    
    const conn = makeWASocket({
        version,
        logger,
        printQRInTerminal: true,
        auth: state,
        browser: ['Pitaa Bot', 'Chrome', '1.0.0'],
    });

    store?.bind(conn.ev);

    conn.decodeJid = (jid) => {
        if (!jid) return jid;
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {};
            return decode.user && decode.server && decode.user + '@' + decode.server || jid;
        } else return jid;
    };

    conn.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        if (qr) console.log(chalk.yellow('📸 ini scan ya kak!'));
        
        if (connection === 'close') {
            let shouldReconnect = (lastDisconnect.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) startPitaa();
        } else if (connection === 'open') {
            console.log(chalk.green('✅ Pitaa Bot ONLINE 🥰'));
        }
    });

    conn.ev.on('creds.update', saveCreds);

    conn.ev.on('messages.upsert', async chatUpdate => {
        try {
            const m = chatUpdate.messages[0];
            if (!m.message || m.key.remoteJid === 'status@broadcast') return;
            
            const { pitaaHandler } = await import(`./case.js?t=${Date.now()}`);
            pitaaHandler(conn, m);
        } catch (err) {
            console.log(err);
        }
    });
}

if (!fs.existsSync('./tmp')) fs.mkdirSync('./tmp');
startPitaa();