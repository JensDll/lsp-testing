import { EntryObject } from 'webpack'

declare module 'webpack' {
  type EntryDescription = Exclude<EntryObject[string], string | string[]>

  export { EntryDescription }
}
