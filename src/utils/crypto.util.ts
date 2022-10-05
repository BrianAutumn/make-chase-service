import CryptoJS from 'crypto-js';
import {appConf} from "../tokens";

export function encrypt(value) {
  return CryptoJS.AES.encrypt(value, appConf.encryptionKey).toString();
}

export function decrypt(value) {
  return CryptoJS.AES.decrypt(value, appConf.encryptionKey).toString(CryptoJS.enc.Utf8);
}