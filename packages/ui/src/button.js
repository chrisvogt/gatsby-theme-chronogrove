/** @jsx jsx */
import { jsx } from 'theme-ui'

const Button = ({ variant = 'primary', ...props }) => (
  <button
    {...props}
    sx={{
      appearance: 'none',
      display: 'inline-block',
      textAlign: 'center',
      lineHeight: 'inherit',
      textDecoration: 'none',
      fontSize: 'inherit',
      fontWeight: 'bold',
      m: 0,
      px: 3,
      py: 2,
      border: 0,
      borderRadius: 4,
      variant: `buttons.${variant}`
    }}
  />
)

export default Button
