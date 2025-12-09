export function cloneArray<T> (array: T[]): T[] {
  return Array.from(array)
}

export function cloneObject<T> (object: T): T {
  return Object.assign({}, object)
}

export function cloneInstanceObject<InstanceObject> (instanciableObject: InstanceObject): InstanceObject {
  // see https://stackoverflow.com/questions/16024940/how-do-i-clone-a-javascript-class-instance/16025595#16025595
  return Object.assign(Object.create(Object.getPrototypeOf(instanciableObject)), instanciableObject)
}

export function cloneObjectArray<Object> (objectArray: Object[]): Object[] {
  return Array.from(objectArray, (object: Object) => {
    return cloneObject(object)
  })
}

export function cloneInstanceObjectArray<InstanceObject> (instanceObjectArray: InstanceObject[]): InstanceObject[] {
  return Array.from(instanceObjectArray, (instanceObject: InstanceObject) => {
    return cloneInstanceObject(instanceObject)
  })
}
