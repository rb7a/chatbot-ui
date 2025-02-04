import React, { FC, useState } from "react"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import ReactMarkdown, { Components } from "react-markdown"
import { MessageCodeBlock } from "./message-codeblock"
import "katex/dist/katex.min.css"

interface MessageMarkdownProps {
  content: string
}

// 定义扩展的 Components 类型
type CustomComponents = Components & {
  ThinkBlock?: React.FC<{ children: React.ReactNode }>
}

// 替换 <think> 为 Markdown 兼容直接改成引用
const preprocessContent = (content: string) => {
  return content.replace(
    /<think>([\s\S]*?)<\/think>/g,
    (_, innerContent) =>
      `>${innerContent.trim().replace(/\n\n/g, " \n > \n >")}`
  )
}

// 定义 ThinkBlock 组件
const ThinkBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false) // 折叠状态

  const toggleOpen = () => {
    setIsOpen(!isOpen) // 切换折叠状态
  }

  // 根据 children 内容动态设置标题
  const isThinking = React.Children.toArray(children).some(child => {
    if (typeof child === "string") {
      return child.includes("思考中") || child.includes("正在输出")
    }
    return false
  })

  const title = isThinking ? "正在思考" : "思考完毕" // 动态标题

  return (
    <div className="mb-4">
      {/* 标题部分,点击切换折叠状态 */}
      <div
        className="cursor-pointer font-bold text-blue-500 hover:underline"
        onClick={toggleOpen}
      >
        {title} {isOpen ? "▲" : "▼"}
      </div>

      {/* 折叠内容部分 */}
      {isOpen && (
        <div className="mt-2 border-l-4 border-gray-300 pl-4 text-gray-600 dark:text-gray-400">
          {children}
        </div>
      )}
    </div>
  )
}

export const MessageMarkdown: FC<MessageMarkdownProps> = ({ content }) => {
  const processedContent = preprocessContent(content) // 预处理内容

  return (
    <ReactMarkdown
      className="prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 min-w-full space-y-6 break-words"
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={
        {
          p({ children }) {
            return <p className="mb-2 last:mb-0">{children}</p>
          },
          img({ node, ...props }) {
            return <img className="max-w-[67%]" {...props} />
          },
          code({ node, className, children, ...props }) {
            const childArray = React.Children.toArray(children)
            const firstChild = childArray[0] as React.ReactElement
            const firstChildAsString = React.isValidElement(firstChild)
              ? (firstChild as React.ReactElement).props.children
              : firstChild

            if (firstChildAsString === "▍") {
              return (
                <span className="mt-1 animate-pulse cursor-default">▍</span>
              )
            }

            if (typeof firstChildAsString === "string") {
              childArray[0] = firstChildAsString.replace("▍", "▍")
            }

            const match = /language-(\w+)/.exec(className || "")

            if (
              typeof firstChildAsString === "string" &&
              !firstChildAsString.includes("\n")
            ) {
              return (
                <code className={className} {...props}>
                  {childArray}
                </code>
              )
            }

            return (
              <MessageCodeBlock
                key={className || ""} // 使用更稳定的 key
                language={(match && match[1]) || ""}
                value={String(childArray).replace(/\n$/, "")}
                {...props}
              />
            )
          },
          // 注册 ThinkBlock 组件
          think({ children }) {
            return <ThinkBlock>{children}</ThinkBlock>
          }
        } as CustomComponents
      } // 使用扩展的类型
    >
      {processedContent}
    </ReactMarkdown>
  )
}
// import React, { FC } from "react"
// import remarkGfm from "remark-gfm"
// import remarkMath from "remark-math"
// import rehypeKatex from "rehype-katex"
// import { MessageCodeBlock } from "./message-codeblock"
// import { MessageMarkdownMemoized } from "./message-markdown-memoized"
// import "katex/dist/katex.min.css"

// interface MessageMarkdownProps {
//   content: string
// }

// const replaceMathDelimiters = (content: string) => {
//   return content
//     .replace(/\\\(/g, "$")
//     .replace(/\\\)/g, "$")
//     .replace(/\\\[/g, "\n$$")
//     .replace(/\\\]/g, "$$\n")
// }

// export const MessageMarkdown: FC<MessageMarkdownProps> = ({ content }) => {
//   return (
//     <MessageMarkdownMemoized
//       className="prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 min-w-full space-y-6 break-words"
//       remarkPlugins={[remarkGfm, remarkMath]}
//       rehypePlugins={[rehypeKatex]}
//       components={{
//         p({ children }) {
//           return <p className="mb-2 last:mb-0">{children}</p>
//         },
//         img({ node, ...props }) {
//           return <img className="max-w-[67%]" {...props} />
//         },
//         code({ node, className, children, ...props }) {
//           const childArray = React.Children.toArray(children)
//           const firstChild = childArray[0] as React.ReactElement
//           const firstChildAsString = React.isValidElement(firstChild)
//             ? (firstChild as React.ReactElement).props.children
//             : firstChild

//           if (firstChildAsString === "▍") {
//             return <span className="mt-1 animate-pulse cursor-default">▍</span>
//           }

//           if (typeof firstChildAsString === "string") {
//             childArray[0] = firstChildAsString.replace("▍", "▍")
//           }

//           const match = /language-(\w+)/.exec(className || "")

//           if (
//             typeof firstChildAsString === "string" &&
//             !firstChildAsString.includes("\n")
//           ) {
//             return (
//               <code className={className} {...props}>
//                 {childArray}
//               </code>
//             )
//           }

//           return (
//             <MessageCodeBlock
//               key={Math.random()}
//               language={(match && match[1]) || ""}
//               value={String(childArray).replace(/\n$/, "")}
//               {...props}
//             />
//           )
//         }
//       }}
//     >
//       {replaceMathDelimiters(content)}
//     </MessageMarkdownMemoized>
//   )
// }
// // import React, { FC } from "react"
// // import remarkGfm from "remark-gfm"
// // import remarkMath from "remark-math"
// // import { MessageCodeBlock } from "./message-codeblock"
// // import { MessageMarkdownMemoized } from "./message-markdown-memoized"

// // interface MessageMarkdownProps {
// //   content: string
// // }

// // export const MessageMarkdown: FC<MessageMarkdownProps> = ({ content }) => {
// //   return (
// //     <MessageMarkdownMemoized
// //       className="prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 min-w-full space-y-6 break-words"
// //       remarkPlugins={[remarkGfm, remarkMath]}
// //       components={{
// //         p({ children }) {
// //           return <p className="mb-2 last:mb-0">{children}</p>
// //         },
// //         img({ node, ...props }) {
// //           return <img className="max-w-[67%]" {...props} />
// //         },
// //         code({ node, className, children, ...props }) {
// //           const childArray = React.Children.toArray(children)
// //           const firstChild = childArray[0] as React.ReactElement
// //           const firstChildAsString = React.isValidElement(firstChild)
// //             ? (firstChild as React.ReactElement).props.children
// //             : firstChild

// //           if (firstChildAsString === "▍") {
// //             return <span className="mt-1 animate-pulse cursor-default">▍</span>
// //           }

// //           if (typeof firstChildAsString === "string") {
// //             childArray[0] = firstChildAsString.replace("`▍`", "▍")
// //           }

// //           const match = /language-(\w+)/.exec(className || "")

// //           if (
// //             typeof firstChildAsString === "string" &&
// //             !firstChildAsString.includes("\n")
// //           ) {
// //             return (
// //               <code className={className} {...props}>
// //                 {childArray}
// //               </code>
// //             )
// //           }

// //           return (
// //             <MessageCodeBlock
// //               key={Math.random()}
// //               language={(match && match[1]) || ""}
// //               value={String(childArray).replace(/\n$/, "")}
// //               {...props}
// //             />
// //           )
// //         }
// //       }}
// //     >
// //       {content}
// //     </MessageMarkdownMemoized>
// //   )
// // }
