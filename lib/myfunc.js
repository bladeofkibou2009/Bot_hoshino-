import axios from 'axios'
import fs from 'fs'
import isNaN from 'is-nan'

export const getBuffer = async (url, options) => {
	try {
		options ? options : {}
		const res = await axios({
			method: "get",
			url,
			headers: {
				'DNT': 1,
				'Upgrade-Insecure-Requests': 1
			},
			...options,
			responseType: 'arraybuffer'
		})
		return res.data
	} catch (err) {
		return err
	}
}

export const fetchJson = async (url, options) => {
    try {
        options ? options : {}
        const res = await axios({
            method: 'GET',
            url: url,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
            },
            ...options
        })
        return res.data
    } catch (err) {
        return err
    }
}

export const getRandom = (ext) => {
    return `${Math.floor(Math.random() * 10000)}${ext}`
}

export const jsonFormat = (obj) => {
    return JSON.stringify(obj, null, 2)
}

export const example = (isPrefix, command, args) => {
    return `🍟 *Contoh Penggunaan* :\n${isPrefix + command} ${args}`
}

export const sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}