export interface Tree extends Object {
  id: string,
  name?: string,
  label?: string,
  children: Tree[]
}
