export function createTypeHelper<T>() {
  return (value: T) => value;
}
export function createSubtypeHelper<T>() {
  return <X extends T>(value: X) => value;
}
