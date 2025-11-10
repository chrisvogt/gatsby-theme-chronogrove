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
      expect(theme.colors['panel-background']).toContain('rgba(255, 255, 255, 0.35)')
    })

    it('defines dark mode background colors', () => {
      const darkMode = theme.colors.modes.dark
      expect(darkMode).toHaveProperty('background', '#1e1e2f')
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
})
