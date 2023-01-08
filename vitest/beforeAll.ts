import { beforeAll } from 'vitest'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ; (global as any).CSS = { supports: () => false }

beforeAll(() => {
  console.log('beforeAll')
  global.CSS = {
    supports: () => false,
    escape: (str: string) => str
  }
  console.log('CSS.support:' + CSS.supports('selector(:focus-visible)'))
})
