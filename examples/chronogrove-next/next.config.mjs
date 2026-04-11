/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@chronogrove/ui',
    '@theme-ui/components',
    '@theme-ui/presets',
    '@theme-toggles/react',
    'theme-ui',
    'three'
  ]
}

export default nextConfig
