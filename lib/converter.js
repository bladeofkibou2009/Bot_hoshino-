import fs from 'fs'
import { exec } from 'child_process'
import path from 'path'

export function ffmpeg(buffer, args = [], ext = '', resExt = '') {
  return new Promise(async (resolve, reject) => {
    try {
      let tmp = path.join('./tmp', Date.now() + '.' + ext)
      let out = tmp + '.' + resExt
      await fs.promises.writeFile(tmp, buffer)
      exec(`ffmpeg -i ${tmp} ${args.join(' ')} ${out}`, (e) => {
        fs.promises.unlink(tmp)
        if (e) return reject(e)
        let raw = fs.readFileSync(out)
        fs.promises.unlink(out)
        resolve(raw)
      })
    } catch (e) {
      reject(e)
    }
  })
}

export function toAudio(buffer, ext) {
  return ffmpeg(buffer, [
    '-vn',
    '-ac', '2',
    '-b:a', '128k',
    '-ar', '44100',
    '-f', 'mp3'
  ], ext, 'mp3')
}

export function toSticker(buffer, ext) {
  return ffmpeg(buffer, [
    '-vcodec', 'libwebp',
    '-vf', "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse"
  ], ext, 'webp')
        }
