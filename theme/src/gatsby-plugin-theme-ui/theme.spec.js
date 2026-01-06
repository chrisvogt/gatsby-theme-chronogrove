import theme, { floatOnHover } from './theme'
import { tailwind } from '@theme-ui/presets'
import { merge } from 'theme-ui'

jest.mock('theme-ui', () => ({
  merge: jest.fn((...args) => Object.assign({}, ...args))
}))

describe('Theme Configuration', () => {
  describe('a snapshot of the configuration', () => {
    it('matches the snapshot', () => {
      expect(theme).toMatchSnapshot()
    })
  })

  describe('general configurations', () => {
    it('merges with Tailwind preset', () => {
      const mergedTheme = merge(tailwind, theme)
      expect(mergedTheme).toBeTruthy()
    })

    it('defaults the color mode to dark', () => {
      expect(theme.config.useColorSchemeMediaQuery).toBe(true)
      expect(theme.config.useCustomProperties).toBe(true)
      expect(theme.config.useLocalStorage).toBe(true)
    })
  })

  describe('font definitions', () => {
    it('defines sans-serif fonts correctly', () => {
      expect(theme.fonts.sans).toContain('sans-serif')
    })

    it('defines serif fonts correctly', () => {
      expect(theme.fonts.serif).toContain('Iowan Old Style')
    })

    it('defines monospace fonts correctly', () => {
      expect(theme.fonts.monospace).toContain('Menlo')
    })
  })

  describe('GradientBanner styles', () => {
    it('defines the GradientBanner styles', () => {
      const banner = theme.styles.GradientBanner
      expect(banner).toHaveProperty('maxWidth', '100%')
      expect(banner).toHaveProperty('height', '340px')
      expect(banner).toHaveProperty('backgroundImage')
      expect(banner).toHaveProperty('animation', 'highlight 3s infinite alternate')
      expect(banner).toHaveProperty('backgroundPosition', '0 0, 0 100%')
      expect(banner).toHaveProperty('backgroundOrigin', 'padding-box, border-box')
      expect(banner).toHaveProperty('backgroundRepeat', 'no-repeat')
      expect(banner).toHaveProperty('backgroundSize', '100% 100%, 100% 200%')
    })

    it('verifies @keyframes highlight definition', () => {
      const highlight = theme.styles.GradientBanner['@keyframes highlight']
      expect(highlight).toBeTruthy()
      expect(highlight['100%']).toHaveProperty('backgroundPosition', '0 0, 0 0')
    })
  })

  describe('PostCard styles', () => {
    it('applies PostCard base styles', () => {
      const postCard = theme.cards.PostCard
      expect(postCard).toHaveProperty('display', 'flex')
      expect(postCard).toHaveProperty('flexDirection', 'column')
      expect(postCard).toHaveProperty('backgroundColor', 'var(--theme-ui-colors-panel-background)')
    })

    it('integrates floatOnHover into PostCard', () => {
      const postCard = theme.cards.PostCard
      expect(postCard).toMatchObject(floatOnHover)
    })

    it('integrates glassmorphismPanel into PostCard', () => {
      const postCard = theme.cards.PostCard
      expect(postCard).toHaveProperty('borderRadius', '10px')
      expect(postCard).toHaveProperty('backdropFilter', 'blur(10px)')
    })

    it('defines PostCard hover styles for .read-more-icon', () => {
      const postCard = theme.cards.PostCard
      expect(postCard['&:hover .read-more-icon']).toHaveProperty('opacity', 1)
      expect(postCard['&:hover .read-more-icon']).toHaveProperty('paddingLeft', '8px')
    })
  })

  describe('Card styles and variants', () => {
    it('defines primary card styles', () => {
      const primaryCard = theme.cards.primary
      expect(primaryCard).toHaveProperty('borderRadius', 'card')
      expect(primaryCard).toHaveProperty('boxShadow', 'default')
    })

    it('defines actionCard with dynamic borderLeft', () => {
      const actionCard = theme.cards.actionCard
      expect(actionCard.borderLeft(theme)).toBe(`2px solid ${theme.colors.primary}`)
      expect(actionCard.a).toHaveProperty(':hover', 'pointer')
    })

    it('tests metricCard nested span styles', () => {
      const metricCard = theme.cards.metricCard
      expect(metricCard.span).toHaveProperty('fontFamily', 'heading')
      expect(metricCard.span).toHaveProperty('fontWeight', 'bold')
      expect(metricCard.span).toHaveProperty('padding', 2)
    })

    it('defines UserProfile card styles dynamically', () => {
      const userProfile = theme.cards.UserProfile
      expect(userProfile.padding(theme)).toEqual(['none', `0 ${theme.space[3]} 0 0`])
      expect(userProfile).toHaveProperty('border', 'none')
      expect(userProfile).toHaveProperty('background', 'none')
    })

    it('tests StatusCardDark styles', () => {
      const statusCardDark = theme.cards.StatusCardDark
      expect(statusCardDark).toHaveProperty('backgroundColor', '#1e2530')
    })
  })

  describe('color mode configurations', () => {
    it('defines light mode background colors', () => {
      expect(theme.colors.background).toBe('#fdf8f5')
      expect(theme.colors['panel-background']).toContain('rgba(255, 255, 255, 0.45)')
    })

    it('defines dark mode background colors', () => {
      const darkMode = theme.colors.modes.dark
      expect(darkMode).toHaveProperty('background', '#14141F')
      expect(darkMode).toHaveProperty('primary', '#1E90FF')
      expect(darkMode).toHaveProperty('text', '#fff')
    })
  })

  describe('responsive layout', () => {
    it('defines container styles', () => {
      const containerStyles = theme.layout.container
      expect(containerStyles).toHaveProperty('maxWidth', ['', '98%', '', '', '1440px'])
      expect(containerStyles).toHaveProperty('py', [2, 3])
      expect(containerStyles).toHaveProperty('px', [3, 4])
    })
  })

  describe('button and badge variants', () => {
    it('defines button variants', () => {
      expect(theme.buttons.primary).toHaveProperty('bg', 'primary')
      expect(theme.buttons.secondary).toHaveProperty('bg', 'secondary')
      expect(theme.buttons.gray).toHaveProperty('bg', 'gray')
    })

    it('defines badge variants', () => {
      expect(theme.badges.primary).toHaveProperty('bg', 'primary')
      expect(theme.badges.outline).toHaveProperty('boxShadow', 'inset 0 0 0 1px')
    })
  })

  describe('GitHubCardFooter styles', () => {
    it('defines display and justify content', () => {
      const footerStyles = theme.styles.GitHubCardFooter
      expect(footerStyles).toHaveProperty('display', 'flex')
      expect(footerStyles).toHaveProperty('justifyContent', 'space-between')
    })
  })

  describe('VideoWrapper styles', () => {
    it('defines wrapper and iframe styles', () => {
      const videoWrapperStyles = theme.styles.VideoWrapper
      expect(videoWrapperStyles).toHaveProperty('position', 'relative')
      expect(videoWrapperStyles).toHaveProperty('paddingBottom', '56.25%')
      expect(videoWrapperStyles.iframe).toHaveProperty('position', 'absolute')
    })
  })

  describe('UserProfileDark styles', () => {
    it('applies dynamic padding function', () => {
      const userProfileDark = theme.cards.UserProfileDark
      const padding = userProfileDark.padding(theme)
      expect(padding).toEqual(['none', `0 ${theme.space[3]} 0 0`])
    })
  })

  describe('Book styles', () => {
    it('applies dynamic filter function', () => {
      const bookStyles = theme.styles.Book
      const filter = bookStyles.filter(theme)
      expect(filter).toBe(`drop-shadow(${theme.shadows.default})`)
    })

    it('applies hover filter function', () => {
      const bookStyles = theme.styles.Book
      const hoverFilter = bookStyles['&:hover, &:focus'].filter(theme)
      expect(hoverFilter).toBe(`drop-shadow(${theme.shadows.xl})`)
    })
  })

  describe('Container styles', () => {
    it('defines Container padding and spacing', () => {
      const containerStyles = theme.styles.Container
      expect(containerStyles).toHaveProperty('py', [2, 3])
      expect(containerStyles).toHaveProperty('px', [3, 4])
    })
  })

  describe('GradientBannerDark styles', () => {
    it('extends GradientBanner with dark mode gradient', () => {
      const gradientBannerDark = theme.styles.GradientBannerDark
      expect(gradientBannerDark.backgroundImage).toContain('linear-gradient')
      expect(gradientBannerDark).toHaveProperty('color', 'light')
    })
  })

  describe('IntroExperienceSlide styles', () => {
    it('defines initial hidden state', () => {
      const slideStyles = theme.styles.IntroExperienceSlide
      expect(slideStyles).toHaveProperty('opacity', 0)
      expect(slideStyles).toHaveProperty('height', 0)
      expect(slideStyles).toHaveProperty('visibility', 'hidden')
    })

    it('defines active slide state', () => {
      const slideStyles = theme.styles.IntroExperienceSlide
      expect(slideStyles['&.active-slide']).toHaveProperty('opacity', 1)
      expect(slideStyles['&.active-slide']).toHaveProperty('visibility', 'initial')
    })
  })

  describe('Header styles', () => {
    it('defines header layout properties', () => {
      const headerStyles = theme.styles.Header
      expect(headerStyles).toHaveProperty('alignItems', 'center')
      expect(headerStyles).toHaveProperty('display', 'block')
      expect(headerStyles).toHaveProperty('transition', 'all 0.3s ease-in-out')
    })
  })

  describe('InstagramItem styles', () => {
    it('integrates floatOnHover mixin', () => {
      const instagramItem = theme.styles.InstagramItem
      expect(instagramItem).toMatchObject(floatOnHover)
      expect(instagramItem).toHaveProperty('cursor', 'pointer')
      expect(instagramItem).toHaveProperty('borderRadius', '8px')
    })
  })

  describe('TopNavigation styles', () => {
    it('defines navigation color', () => {
      const topNavStyles = theme.styles.TopNavigation
      expect(topNavStyles).toHaveProperty('color', 'white')
    })
  })

  describe('WidgetFooter styles', () => {
    it('defines footer typography and alignment', () => {
      const footerStyles = theme.styles.WidgetFooter
      expect(footerStyles).toHaveProperty('color', 'text')
      expect(footerStyles).toHaveProperty('fontFamily', 'heading')
      expect(footerStyles).toHaveProperty('textAlign', ['center', 'right'])
    })
  })

  describe('Footnotes styles', () => {
    it('applies dynamic fontSize function', () => {
      const footnotesStyles = theme.styles['.footnotes']
      const fontSize = footnotesStyles.fontSize(theme)
      expect(fontSize).toBe(theme.fontSizes[1])
    })
  })
})
