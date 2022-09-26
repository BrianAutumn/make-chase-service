import {cloneDeep} from "lodash";

/**
 * Remove all objects that the given roles do not have view rights for.
 *
 * @param subject the object to filter.
 * @param roles The roles to filter with
 */
export function viewFilter(subject: any, roles: Array<string>) {
  subject = cloneDeep(subject);
  for (let key in subject) {
    if (subject[key] !== null && typeof subject[key] === 'object') {
      if (subject[key].$view && subject[key].$view.length !== 0 && !subject[key].$view.some(value => roles.includes(value))) {
        if (Array.isArray(subject)) {
          subject.splice(parseInt(key), 1)
        } else {
          delete subject[key]
        }
      } else {
        subject[key] = viewFilter(subject[key], roles);
      }
    }
  }
  return subject;
}

/**
 * Remove all metadata from the object.
 *
 * @param target The delta to remove keys from
 */
export function removeMetadata(target) {
  for (let key in target) {
    if (key.charAt(0) === '$') {
      delete target[key];
      continue
    }
    if (target[key] !== null && typeof target[key] === 'object') {
      removeMetadata(target[key])
    }
  }
  return target;
}