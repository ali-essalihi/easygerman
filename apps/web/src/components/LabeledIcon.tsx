import { IconType } from 'react-icons'

interface Props {
  Icon: IconType
  label: string
}

export default function LabeledIcon({ Icon, label }: Props) {
  return (
    <div className="flex items-center">
      <Icon size={16} className="text-gray-600" />
      <span className="ml-1">{label}</span>
    </div>
  )
}
