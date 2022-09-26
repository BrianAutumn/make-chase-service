import CryptoJS from 'crypto-js';
import {tokens} from "../tokens";

export function encrypt(value) {
  return CryptoJS.AES.encrypt(value, tokens.encryptionKey).toString();
}

export function decrypt(value) {
  return CryptoJS.AES.decrypt(value, tokens.encryptionKey).toString(CryptoJS.enc.Utf8);
}