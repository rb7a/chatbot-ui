// Balance.tsx
import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva } from "class-variance-authority"

// 定义样式变体
const balanceLabelVariants = cva(
  "text-xs font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

// 定义容器的样式，使用Flex布局
// const containerStyle = cva("flex justify-between")
const containerStyle = cva("flex justify-between")

// 定义Balance组件接收的props类型
interface BalanceProps {
  limit: number;
  usage: number;
  limit_remaining: number;
}

const Balance: React.FC<BalanceProps> = ({ limit, usage, limit_remaining }) => {
  // 使用LabelPrimitive.Root来创建标签，这里直接应用了样式变体
  return (
    <div className={containerStyle()}>
      <LabelPrimitive.Root className={balanceLabelVariants()}>
        {` Limit: $${limit} `}
      </LabelPrimitive.Root>
      <LabelPrimitive.Root className={balanceLabelVariants()}>
        {` Usage: $${usage} `}
      </LabelPrimitive.Root>
      <LabelPrimitive.Root className={balanceLabelVariants()}>
        {` Remain: $${limit_remaining} `}
      </LabelPrimitive.Root>
    </div>
  )
}

export { Balance }