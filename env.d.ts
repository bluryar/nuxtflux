declare namespace NodeJS {
  export interface ProcessEnv extends ImportMetaEnv {

  }
}

interface ImportMetaEnv {
  readonly VITE_TITLE: string
  readonly NUXT_APP_BASE_URL: string
}

declare module '@arco-design/color' {

  // Define the shape of the color options object
  interface GenerateOptions {
    index?: number
    dark?: boolean
    list?: boolean
    format?: 'hex' | 'rgb' | 'hsl'
  }

  // Type for the generate function
  export function generate(color: string, options?: GenerateOptions): string | string[]

  // Type for getRgbStr function
  export function getRgbStr(color: string): string

  // Define the shape of the color list object used in getPresetColors
  interface ColorList {
    [colorName: string]: {
      light: string | string[]
      dark: string | string[]
      primary: string
    }
  }
  // Type for the getPresetColors function
  export function getPresetColors(): ColorList

}
