import type { IconType } from 'react-icons'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonStyles = cva(
  'font-medium select-none rounded-lg flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      color: {
        primary: '',
        danger: '',
        success: '',
        light: '',
      },
      variant: {
        text: 'bg-transparent px-2 py-1',
        contained: 'px-4 py-2',
      },
    },
    compoundVariants: [
      // Contained variants
      {
        variant: 'contained',
        color: 'primary',
        className: 'bg-primary text-white hover:bg-primary-600',
      },
      {
        variant: 'contained',
        color: 'danger',
        className: 'bg-red-500 text-white hover:bg-red-600',
      },
      {
        variant: 'contained',
        color: 'success',
        className: 'bg-green-500 text-white hover:bg-green-600',
      },
      {
        variant: 'contained',
        color: 'light',
        className: 'bg-gray-200 text-gray-800 border border-gray-300 hover:bg-gray-300',
      },
      // Text variants
      {
        variant: 'text',
        color: 'primary',
        className: 'text-primary hover:bg-primary-50',
      },
      {
        variant: 'text',
        color: 'danger',
        className: 'text-red-500 hover:bg-red-50',
      },
      {
        variant: 'text',
        color: 'success',
        className: 'text-green-500 hover:bg-green-50',
      },
      {
        variant: 'text',
        color: 'light',
        className: 'text-gray-800 hover:bg-gray-100',
      },
    ],
    defaultVariants: {
      color: 'primary',
      variant: 'contained',
    },
  }
)

type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonStyles> & {
    children: string
    StartIcon?: IconType
  }

export default function Button({
  children,
  StartIcon,
  color,
  variant,
  className,
  ...props
}: ButtonProps) {
  return (
    <button className={buttonStyles({ color, variant, className })} {...props}>
      {StartIcon && <StartIcon className="mr-2" aria-hidden />}
      {children}
    </button>
  )
}
