export type Delta = any;

/**
 * Apply a delta to a given object to transform it into the after object.
 *
 * @param before The before object
 * @param delta The delta of change
 */
export function applyDelta(before:any, delta:Delta):any{
  for(let key in delta){
    if(delta[key] !== null && typeof delta[key] === 'object'){
      if(typeof before[key] !== 'object'){
        before[key] = delta[key];
        continue;
      }
      applyDelta(before[key],delta[key])
      continue;
    }
    if(delta[key] === null){
      delete before[key];
      continue;
    }
    before[key] = delta[key]
  }
  return before;
}

/**
 * Create a delta object representing the differences between the before and after objects.
 *
 * @param before The before object
 * @param after The after object
 */
export function createDelta(before:any, after:any):Delta|undefined{
  if(typeof after === 'object'){
    if(typeof before !== 'object'){
      return after;
    }
    let result = {};
    let change = false;
    let keys = new Set<string>();
    Object.keys(before).forEach(keys.add,keys)
    Object.keys(after).forEach(keys.add,keys)
    for(let key of Array.from(keys)){
      if(key.charAt(0) === '$'){
        result[key] = after[key];
        continue;
      }
      let delta = createDelta(before[key],after[key]);
      if(delta !== undefined){
        change = true;
        result[key] = delta;
      }
    }
    if(change){
      return result;
    }else{
      return undefined;
    }
  }

  if(before === after){
    return undefined;
  }else if(after === undefined){
    return null;
  }else{
    return after;
  }
}

/**
 * Remove all objects from the delta that have an operation key with the given operation value.
 *
 * @param delta The delta to filter.
 * @param operationName The operation name. Should start with a $.
 * @param operationValue The operation value
 */
export function filterOperation(delta,operationName,operationValue){
  if(delta[operationName] === operationValue){
    return undefined;
  }
  for(let key in delta){
    if(delta[key] !== null && typeof delta[key] === 'object'){
      if(delta[key][operationName] === operationValue){
        delete delta[key]
      }else{
        filterOperation(delta[key],operationName,operationValue);
      }
    }
  }
  return delta;
}

/**
 * Remove all operation keys from the delta.
 *
 * @param delta The delta to remove keys from
 */
export function removeOperations(delta){
  for(let key in delta){
    if(key.charAt(0) === '$'){
      delete delta[key];
      continue
    }
    if(delta[key] !== null && typeof delta[key] === 'object'){
      removeOperations(delta[key])
    }
  }
  return delta;
}

