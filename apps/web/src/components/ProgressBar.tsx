import * as RadixProgress from '@radix-ui/react-progress'

type Props = RadixProgress.ProgressProps & { value: number; max: number } & {
  label: string
}

export default function ProgressBar({ label, ...props }: Props) {
  const { value, max } = props
  const progress = Math.floor(max === 0 ? 0 : (value * 100) / max)
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="text-gray-600 text-sm mr-2">{label}</div>
        <div className="text-gray-600 text-sm">{progress}%</div>
      </div>
      <RadixProgress.Root
        {...props}
        className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200"
      >
        <RadixProgress.Indicator
          className="size-full bg-gray-400"
          style={{ transform: `translateX(-${100 - progress}%)` }}
        />
      </RadixProgress.Root>
    </div>
  )
}
