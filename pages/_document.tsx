import { ColorModeScript } from '@chakra-ui/react'
import theme from 'lib/theme'
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        {/* <ColorModeScript initialColorMode={theme.config.initialColorMode} /> */}
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}