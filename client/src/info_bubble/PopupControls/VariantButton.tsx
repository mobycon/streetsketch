import React from 'react'
import { useIntl } from 'react-intl'

import { useSelector } from '~/src/store/hooks'
import VARIANT_ICONS from '~/src/segments/variant_icons.yaml'
import Button from '~/src/ui/Button'
import Icon from '~/src/ui/Icon'
import { Tooltip } from '~/src/ui/Tooltip'

interface VariantButtonProps {
  set: string
  selection: string
  isSelected: boolean
  onClick: () => void
}

export function VariantButton (
  props: VariantButtonProps
): React.ReactElement | null {
  const { set, selection, isSelected, onClick } = props
  const flags = useSelector((state) => state.flags)
  const intl = useIntl()

  const icon = VARIANT_ICONS[set][selection]

  if (icon === undefined) return null

  // If a variant is disabled by feature flag, skip it
  if (icon.enableWithFlag !== undefined) {
    const flag = flags[icon.enableWithFlag]
    if (!flag?.value) return null
  }

  const label = intl.formatMessage({
    id: `variant-icons.${set}|${selection}`,
    defaultMessage: icon.title
  })

  let isLocked = false
  let sublabel

  return (
    <Tooltip label={label} sublabel={sublabel} placement="bottom">
      <Button
        data-testid={icon.title}
        className={isSelected ? 'variant-selected' : undefined}
        disabled={isSelected || isLocked}
        onClick={onClick}
      >
        <svg
          xmlns="http://www.w3.org/1999/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          className="icon"
          style={icon.color !== undefined ? { fill: icon.color } : undefined}
        >
          <use href={`#icon-${icon.id}`} />
        </svg>
        {isLocked && <Icon name="lock" />}
      </Button>
    </Tooltip>
  )
}
