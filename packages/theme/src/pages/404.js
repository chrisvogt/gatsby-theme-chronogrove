/** @jsx jsx */
import { Box, Container, Flex, Grid, jsx } from 'theme-ui'
import { useEffect, useState } from 'react'
import loadable from '@loadable/component'
import { Themed } from '@theme-ui/mdx'

const LottieClientOnly = loadable(() => import('lottie-react-web'), { ssr: false })

import Layout from '../components/layout'

const options = Object.freeze({
  animationData: require('../../assets/astronaut.json'),
  autoplay: true,
  loop: true
})

const NotFoundPage = () => {
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <Layout>
      <Flex sx={{ position: 'relative', flex: 1 }}>
        <Container>
          <Grid gap={4} sx={{ gridTemplateColumns: ['auto', 'auto', '1fr 70%'] }}>
            <Box>{isClient && <LottieClientOnly key='$floatingAstronaut' height='50vh' options={options} />}</Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: ['center', 'center', 'left']
              }}
            >
              <Themed.h1 sx={{ my: 0 }}>404</Themed.h1>
              <Themed.p>
                Lost in space? Why not go{' '}
                <Themed.a title='Home page' href='/'>
                  home
                </Themed.a>
                .
              </Themed.p>
            </Box>
          </Grid>
        </Container>
      </Flex>
    </Layout>
  )
}

export default NotFoundPage
