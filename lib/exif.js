import fs from 'fs'
import { exec } from 'child_process'
import path from 'path'

export async function addExif(buffer, packname, author) {
    const filename = path.join('./tmp', `${Date.now()}.webp`)
    const exifFile = path.join('./tmp', `${Date.now()}.exif`)
    fs.writeFileSync(filename, buffer)

    const json = {
        "sticker-pack-id": `pitaa-bot`,
        "sticker-pack-name": packname,
        "sticker-pack-publisher": author,
    }

    const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00])
    const jsonBuffer = Buffer.from(JSON.stringify(json), "utf-8")
    const exif = Buffer.concat([exifAttr, jsonBuffer])
    exif.writeUIntLE(jsonBuffer.length, 14, 4)
    
    fs.writeFileSync(exifFile, exif)
    return filename 
}