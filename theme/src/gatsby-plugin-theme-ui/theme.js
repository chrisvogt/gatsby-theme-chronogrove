import { tailwind } from '@theme-ui/presets'
import { merge } from 'theme-ui'

const fonts = {
  sans: '-apple-system, BlinkMacSystemFont, avenir next, avenir, helvetica neue, helvetica, Ubuntu, roboto, noto, segoe ui, arial, sans-serif',
  serif:
    'Iowan Old Style, Apple Garamond, Georgia, Baskerville, Times New Roman, Droid Serif, Times, Source Serif Pro, serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol',
  mono: 'Menlo, Consolas, Monaco, Liberation Mono, Lucida Console, monospace'
}

export const floatOnHover = {
  transition: 'all 200ms ease-in-out',

  '&:hover, &:focus': {
    transform: 'scale(1.015)',
    boxShadow: 'lg'
  }
}

const GradientBanner = {
  /**
   * Gradient animation created by @bibby0912.
   * Visit https://codepen.io/bibby0912/pen/mErWyA
   */
  maxWidth: '100%',
  height: '340px',
  border: '20px solid transparent',
  boxSizing: 'border-box',
  padding: '1rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: 'black',

  backgroundImage: `
  linear-gradient(white, white),
  linear-gradient(180deg, cornflowerblue, purple 50%, cornflowerblue)`,

  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%, 100% 200%',
  backgroundPosition: '0 0, 0 100%',
  backgroundOrigin: 'padding-box, border-box',
  animation: 'highlight 3s infinite alternate',

  '@keyframes highlight': {
    '100%': {
      backgroundPosition: '0 0, 0 0'
    }
  }
}

export const glassmorhismPanel = {
  borderRadius: '10px',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.15)'
}

export const backdropBlurStrong = {
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)'
}

export const backdropBlurMedium = {
  backdropFilter: 'blur(12px) saturate(150%)',
  WebkitBackdropFilter: 'blur(12px) saturate(150%)'
}

export const backdropBlurLight = {
  backdropFilter: 'blur(8px) saturate(120%)',
  WebkitBackdropFilter: 'blur(8px) saturate(120%)'
}

export const card = {
  borderRadius: 'card',
  background: 'var(--theme-ui-colors-panel-background)',
  color: 'var(--theme-ui-colors-panel-text)',
  boxShadow: 'default',
  flexGrow: 1,
  padding: 3,
  fontSize: [1, 2],
  textDecoration: 'none',
  backdropFilter: 'blur(12px) saturate(150%)',
  WebkitBackdropFilter: 'blur(12px) saturate(150%)'
}

export const metricCard = {
  backgroundColor: 'var(--theme-ui-colors-panel-background)',
  boxShadow: 'none',
  color: 'var(--theme-ui-colors-panel-text)',
  span: {
    fontFamily: 'heading',
    fontWeight: 'bold',
    padding: 2
  }
}

export const PostCard = {
  ...card,
  ...floatOnHover,
  ...glassmorhismPanel,
  backgroundColor: 'var(--theme-ui-colors-panel-background)',
  color: 'var(--theme-ui-colors-panel-text)',
  display: 'flex',
  height: '100%',
  flexDirection: 'column',
  '.card-media': {
    mb: 2,
    overflow: 'hidden'
  },
  '.read-more-icon': {
    display: 'inline',
    transition: 'all 250ms ease-in',
    opacity: 0,
    paddingLeft: 0
  },
  '&:hover .read-more-icon': {
    opacity: 1,
    paddingLeft: '8px'
  }
}

export default merge(tailwind, {
  config: {
    initialColorModeName: 'default', // or 'light', but default is fine
    useColorSchemeMediaQuery: true, // enables respecting system preference
    useCustomProperties: true,
    useLocalStorage: true
  },

  badges: {
    primary: {
      color: 'background',
      bg: 'primary'
    },
    outline: {
      color: 'primary',
      bg: 'transparent',
      boxShadow: 'inset 0 0 0 1px',
      fontSize: 1
    }
  },

  buttons: {
    primary: {
      color: 'background',
      bg: 'primary'
    },
    secondary: {
      color: 'background',
      bg: 'secondary'
    },
    gray: {
      color: 'background',
      bg: 'gray'
    },
    readMore: {
      color: 'primary',
      bg: 'transparent',
      border: theme => `1px solid ${theme.colors.primary}`,
      borderRadius: 'card',
      px: 3,
      py: 2,
      fontSize: [1, 2],
      fontWeight: 'medium',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(66, 46, 163, 0.1), transparent)',
        transition: 'left 0.5s ease-in-out'
      },
      '&:hover, &:focus': {
        bg: 'primary',
        color: 'background',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(66, 46, 163, 0.3)',
        '&::before': {
          left: '100%'
        }
      },
      '&:active': {
        transform: 'translateY(0)',
        boxShadow: '0 2px 8px rgba(66, 46, 163, 0.2)'
      }
    }
  },

  cards: {
    /* The <Card /> default style. Used when no variant is defined. */
    primary: {
      ...card
    },

    actionCard: {
      ...card,
      ...floatOnHover,
      ...glassmorhismPanel,
      borderLeft: theme => `2px solid ${theme.colors.primary}`,
      a: {
        ':hover': 'pointer'
      }
    },

    metricCard: {
      ...card,
      ...metricCard
    },

    /* The following styles represent specific card components, indicated in PascalCase. */

    UserProfile: {
      padding: theme => ['none', `0 ${theme.space[3]} 0 0`],
      border: 'none',
      color: 'white',
      background: 'none'
    },

    UserProfileDark: {
      ...card,
      padding: theme => ['none', `0 ${theme.space[3]} 0 0`],
      color: 'white',
      borderBottom: 'none',
      backgroundColor: 'none',
      boxShadow: 'none'
    },

    StatusCardDark: {
      backgroundColor: '#1e2530'
    },

    PostCard,

    aiSummary: {
      ...card,
      ...glassmorhismPanel,
      borderLeft: theme => `2px solid ${theme.colors.primary}`,
      '@keyframes pulse': {
        '0%, 100%': {
          opacity: 1
        },
        '50%': {
          opacity: 0.7
        }
      },
      '@keyframes gentleGlow': {
        '0%': {
          filter: 'drop-shadow(0 0 12px rgba(66, 46, 163, 0.4))'
        },
        '100%': {
          filter: 'drop-shadow(0 0 20px rgba(66, 46, 163, 0.7))'
        }
      },
      '@keyframes gentleFloat': {
        '0%, 100%': {
          transform: 'translateY(0px)'
        },
        '50%': {
          transform: 'translateY(-4px)'
        }
      },
      '@keyframes slideInFromLeft': {
        '0%': {
          opacity: 0,
          transform: 'translateX(-30px)'
        },
        '100%': {
          opacity: 1,
          transform: 'translateX(0)'
        }
      },
      '@keyframes expandWidth': {
        '0%': {
          width: '0%'
        },
        '100%': {
          width: '100%'
        }
      },
      '@keyframes gentleBounce': {
        '0%, 20%, 50%, 80%, 100%': {
          transform: 'translateY(0)'
        },
        '40%': {
          transform: 'translateY(-4px)'
        },
        '60%': {
          transform: 'translateY(-2px)'
        }
      },
      '@keyframes blink': {
        '0%, 50%': {
          opacity: 1
        },
        '51%, 100%': {
          opacity: 0
        }
      },
      '@keyframes fadeInUp': {
        '0%': {
          opacity: 0,
          transform: 'translateY(20px)'
        },
        '100%': {
          opacity: 1,
          transform: 'translateY(0)'
        }
      },
      '@keyframes slideDown': {
        '0%': {
          opacity: 0,
          maxHeight: '0px',
          overflow: 'hidden'
        },
        '100%': {
          opacity: 1,
          maxHeight: '1000px',
          overflow: 'visible'
        }
      }
    }
  },

  colors: {
    accent: 'deeppink',
    background: '#fdf8f5',
    'panel-background': 'rgba(255, 255, 255, 0.45)',
    'panel-divider': () => '1px solid rgba(255, 229, 224, 0.17)',
    'panel-highlight': theme => theme.colors.gray[1],
    modes: {
      dark: {
        background: '#1e1e2f',
        'panel-background': 'rgba(30, 30, 47, 0.45)',
        'panel-divider': theme => `1px solid ${theme.colors.gray[8]}`,
        'panel-highlight': theme => theme.colors.gray[8],
        primary: '#1E90FF',
        text: '#fff',
        textMuted: '#d8d8d8',
        tableText: '#fff',
        tableBackground: 'rgba(30, 30, 47, 0.45)',
        tableHeaderBackground: 'rgba(30, 37, 48, 0.8)',
        tableRowBackground: 'rgba(30, 30, 47, 0.25)',
        tableRowAlternateBackground: 'rgba(30, 37, 48, 0.5)',
        tableBorder: 'rgba(255, 255, 255, 0.1)'
      }
    },
    primary: '#422EA3',
    secondary: '#711E9B',
    secondaryGradient: 'linear-gradient(45deg, #4527a0 0%, #711e9b 100%)',
    tableText: '#111',
    tableBackground: 'light',
    tableHeaderBackground: '#f4f4f9',
    tableRowBackground: 'transparent',
    tableRowAlternateBackground: '#fafafa',
    tableBorder: 'muted',
    text: '#111',
    textMuted: '#333'
  },

  fonts: {
    body: fonts.serif,
    heading: fonts.sans,
    monospace: fonts.mono,
    sans: fonts.sans,
    serif: fonts.serif
  },

  fontSizes: ['.875rem', '1rem', '1.25rem', '1.375rem', '1.5rem', '1.875rem', '2.25rem', '3rem', '4rem', '4.5rem'],

  layout: {
    container: {
      maxWidth: ['', '98%', '', '', '1440px'],
      py: [2, 3],
      px: [3, 4]
    }
  },

  links: {
    homeNavigation: {
      color: 'primary',
      display: 'block',
      py: 2,
      textDecoration: 'none',
      '&:not(:last-of-type)': {
        borderBottom: 'var(--theme-ui-colors-panel-divider)'
      },
      '&:hover, &:focus': {
        backgroundColor: 'var(--theme-ui-colors-panel-background)'
      }
    }
  },

  radii: {
    default: '4px',
    card: '8px'
  },

  global: {
    '@keyframes wobble': {
      '0%, 100%': { transform: 'rotate(0deg)' },
      '15%': { transform: 'rotate(-15deg)' },
      '30%': { transform: 'rotate(10deg)' },
      '45%': { transform: 'rotate(-10deg)' },
      '60%': { transform: 'rotate(5deg)' },
      '75%': { transform: 'rotate(-5deg)' }
    },
    '@media (prefers-reduced-motion: reduce)': {
      '.emoji': {
        animation: 'none !important'
      }
    }
  },

  styles: {
    root: {
      color: 'text',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',

      fontFamily: 'body',
      fontWeight: 'body',
      lineHeight: 'body'
    },

    p: {
      fontSize: [2, 3]
    },

    ul: {
      fontSize: [2, 3]
    },

    outlined: {
      border: '4px solid #efefef'
    },

    table: {
      backgroundColor: 'rgba(255, 255, 255, 0.35)',
      color: 'tableText',
      width: '100%',
      borderCollapse: 'collapse',
      borderSpacing: 0,
      marginBottom: '1.5rem',
      overflow: 'hidden',
      borderRadius: '10px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      'th, td': {
        fontSize: '1.125em',
        textAlign: 'left',
        padding: '12px 15px'
      },
      th: {
        backgroundColor: 'tableHeaderBackground',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      },
      'tbody tr:nth-of-type(odd)': {
        backgroundColor: 'tableRowAlternateBackground'
      },
      'tbody tr:nth-of-type(even)': {
        backgroundColor: 'tableRowBackground'
      }
    },

    tableDark: {
      ...glassmorhismPanel,
      backgroundColor: 'rgba(30, 30, 47, 0.35)',
      color: 'tableText',
      width: '100%',
      borderCollapse: 'collapse',
      borderSpacing: 0,
      marginBottom: '1.5rem',
      overflow: 'hidden',
      borderRadius: '10px',
      boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
      'th, td': {
        fontSize: '1.125em',
        textAlign: 'left',
        padding: '12px 15px'
      },
      th: {
        backgroundColor: 'tableHeaderBackground',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      },
      'tbody tr:nth-of-type(odd)': {
        backgroundColor: 'tableRowAlternateBackground'
      },
      'tbody tr:nth-of-type(even)': {
        backgroundColor: 'tableRowBackground'
      }
    },

    text: {
      inverse: {
        color: 'muted'
      },
      title: {
        fontFamily: 'fonts.sans'
      }
    },

    GitHubCardFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      mt: 2
    },

    PageFooter: {
      zIndex: '10',
      color: 'text',
      a: {
        color: 'text'
      },
      width: '100%',
      display: 'block'
    },

    Book: {
      filter: theme => `drop-shadow(${theme.shadows.default})`,
      '&:hover, &:focus': {
        filter: theme => `drop-shadow(${theme.shadows.xl})`,
        transform: 'scale(1.01)',
        transition: 'all .35s ease-in-out'
      }
    },

    Container: {
      py: [2, 3],
      px: [3, 4]
    },

    GradientBanner,

    GradientBannerDark: {
      ...GradientBanner,
      backgroundImage: `
        linear-gradient(#252e3c, #252e3c),
        linear-gradient(270deg, #00D7B9, #B95DD7 50%, #FFB367 100%);`,
      color: 'light'
    },

    IntroExperienceSlide: {
      opacity: 0,
      height: 0,
      display: 'flex',
      visibility: 'hidden',
      '&.active-slide': {
        display: 'block',
        height: 'auto',
        opacity: 1,
        visibility: 'initial'
      }
    },

    Header: {
      alignItems: 'center',
      color: 'text',
      display: 'block',
      transition: 'all 0.3s ease-in-out',
      width: '100%'
    },

    InstagramItem: {
      ...floatOnHover,
      background: 'none',
      border: 'none',
      boxShadow: 'md',
      cursor: 'pointer',
      overflow: 'hidden',
      borderRadius: '8px',
      p: 0
    },

    TopNavigation: {
      color: 'white'
    },

    VideoWrapper: {
      position: 'relative',
      paddingBottom: '56.25%' /* 16:9 */,
      paddingTop: '25px',
      height: 0,
      iframe: {
        border: 0,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
      }
    },

    WidgetFooter: {
      color: 'text',
      fontFamily: 'heading',
      textAlign: ['center', 'right']
    },

    '.footnotes': {
      fontSize: theme => theme.fontSizes[1]
    },

    '.text-center': {
      textAlign: 'center'
    }
  },

  text: {
    title: {
      color: 'primary',
      fontFamily: 'heading',
      fontSize: [1, 2],
      fontWeight: '550',
      textTransform: 'uppercase'
    }
  },

  variants: {
    cards: {
      dark: {
        backgroundColor: 'teal'
      }
    }
  }
})
