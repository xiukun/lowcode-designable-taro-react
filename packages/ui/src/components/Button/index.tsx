import type { CSSProperties, ReactNode } from 'react'
import React from 'react'
import { connect, mapProps, mapReadPretty, useForm } from '@formily/react'
import { Button as Component } from '@nutui/nutui-react-taro'
import { ButtonProps } from '@nutui/nutui-react-taro/dist/types/index'
import { Block } from '@tarojs/components'

import { getIconImageConfig, typeIconImageProps } from '../Icon/IconImage'
import { typePropsBase } from '../type'

type typeProps = typePropsBase &
  ButtonProps &
  Partial<{
    leftIcon: typeIconImageProps
    rightIcon: typeIconImageProps
    eventsConfig
  }>

export const Button = ({
  leftIcon,
  rightIcon,
  children,
  eventsConfig,
  ...props
}: typeProps) => {
  const propNames = ['leftIcon', 'rightIcon']
  const IconImageConfig = getIconImageConfig(propNames, {
    leftIcon,
    rightIcon,
  })
  if (IconImageConfig.leftIcon) {
    IconImageConfig.icon = IconImageConfig.leftIcon
    delete IconImageConfig.leftIcon
  }

  return (
    // @ts-ignore
    <Component
      {...props}
      {...IconImageConfig}
      onClick={(e) => {
        e?.preventDefault()
        eventsConfig?.scriptClick?.()
      }}
    >
      {children}
    </Component>
  )
}
