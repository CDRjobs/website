import { isPlainObject, omit, isArray, keys, mapValues } from 'lodash/fp'

const removeTypename = (value: unknown): unknown => {
  if (isPlainObject(value)) {
    return mapValues(removeTypename, omit('__typename', value as object))
  }
  
  if (isArray(value)) {
    return value.map(removeTypename)
  }
   
  return value
}

export default removeTypename