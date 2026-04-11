import './globals.css'

import {
  chronogroveHeadTheme,
  resolveChronogroveSurfaceColors,
  buildThemeUiNoFlashInlineScript,
  buildHtmlBackgroundInlineScript,
  buildThemeUiColorModeFallbackCss
} from '@chronogrove/ui/color-mode'

import EmotionRegistry from './emotion-registry'
import Providers from './providers'

export const metadata = {
  title: 'Chronogrove UI — Next.js reference',
  description: 'App Router proof for @chronogrove/ui (issue #563)'
}

export default function RootLayout({ children }) {
  const surface = resolveChronogroveSurfaceColors(chronogroveHeadTheme)
  const colorModeScript = buildThemeUiNoFlashInlineScript()
  const htmlBackgroundScript = buildHtmlBackgroundInlineScript({
    defaultBackgroundHex: surface.defaultBackgroundHex,
    darkBackgroundHex: surface.darkBackgroundHex
  })
  const colorModeFallbackCSS = buildThemeUiColorModeFallbackCss({
    defaultBackgroundHex: surface.defaultBackgroundHex,
    darkBackgroundHex: surface.darkBackgroundHex,
    defaultTextHex: surface.defaultTextHex,
    defaultTextMutedHex: surface.defaultTextMutedHex,
    darkTextHex: surface.darkTextHex,
    darkTextMutedHex: surface.darkTextMutedHex,
    defaultPanelBackground: surface.defaultPanelBackground,
    darkPanelBackground: surface.darkPanelBackground,
    defaultPanelText: surface.defaultPanelText,
    darkPanelText: surface.darkPanelText
  })

  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <meta name='emotion-insertion-point' content='' />
        <script dangerouslySetInnerHTML={{ __html: colorModeScript }} />
        <script dangerouslySetInnerHTML={{ __html: htmlBackgroundScript }} />
        <style dangerouslySetInnerHTML={{ __html: colorModeFallbackCSS }} />
      </head>
      <body suppressHydrationWarning>
        <EmotionRegistry>
          <Providers>{children}</Providers>
        </EmotionRegistry>
      </body>
    </html>
  )
}
