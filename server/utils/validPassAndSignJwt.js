import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PRIV_KEY = fs.readFileSync(path.join(__dirname, '..', 'id_rsa_priv.pem'), 'utf-8')

export const signJWT = id => {

    const payload = {
        sub: id,
        iat: Date.now()
    }

    const signedToken =  jwt.sign(payload, PRIV_KEY, {
        expiresIn: process.env.LOGIN_EXPIRES,
        algorithm: 'RS256'
    })

    //TODO 
    //! LATER ADD Bearer BEGIN TO SIGNEDTOKEN
    return signedToken
    
}

export const genPassword = (password) => {
    const salt = crypto.randomBytes(32).toString('hex')
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')

    return {
        hash,
        salt
    }
}

export const validPassword = (password, hash, salt) => {
    const validHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
    return validHash === hash
}