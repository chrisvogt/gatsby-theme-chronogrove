import React from 'react'
import Layout from './src/components/layout'

// NOTE(chrisvogt): wraps the page element and sets persistent UI elements
const wrapPageElement = ({ element, props }) => <Layout {...props}>{element}</Layout>

export default wrapPageElement
