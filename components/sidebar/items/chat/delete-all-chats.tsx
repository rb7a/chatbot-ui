import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { ChatbotUIContext } from "@/context/context"
import { deleteAllChats } from "@/db/chats"
import { Tables } from "@/supabase/types"
import { IconTrash } from "@tabler/icons-react"
import { FC, useContext, useRef, useState } from "react"
import { toast } from "sonner"
import { WithTooltip } from "@/components/ui/tooltip" // 假设您有一个工具提示组件

interface DeleteAllChatsProps {
  profile: Tables<"profiles">
}

export const DeleteAllChats: FC<DeleteAllChatsProps> = ({ profile }) => {
  const { setChats, setChatMessages, setSelectedChat } =
    useContext(ChatbotUIContext)
  const { handleNewChat } = useChatHandler()

  const buttonRef = useRef<HTMLButtonElement>(null)
  const [showChatDialog, setShowChatDialog] = useState(false)

  const handleDeleteAllChats = async () => {
    if (!profile) return

    await deleteAllChats(profile.user_id)

    setChats([])
    setChatMessages([])
    setSelectedChat(null)

    handleNewChat()
    toast.success("All chats deleted!")
  }

  return (
    <Dialog open={showChatDialog} onOpenChange={setShowChatDialog}>
      <DialogTrigger asChild>
        <WithTooltip
          display={<div>Delete all chats</div>} // 提示信息
          trigger={
            <IconTrash className="cursor-pointer hover:opacity-50" size={32} />
          }
        />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete All Chats</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete all chats?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setShowChatDialog(false)}>
            Cancel
          </Button>
          <Button
            ref={buttonRef}
            variant="destructive"
            onClick={handleDeleteAllChats}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
// import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
// import { Button } from "@/components/ui/button"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger
// } from "@/components/ui/dialog"
// import { ChatbotUIContext } from "@/context/context"
// import { deleteAllChats } from "@/db/chats"
// import { Tables } from "@/supabase/types"
// import { IconTrash } from "@tabler/icons-react"
// import { FC, useContext, useRef, useState } from "react"
// import { toast } from "sonner"

// interface DeleteAllChatsProps {
//   profile: Tables<"profiles">
// }

// export const DeleteAllChats: FC<DeleteAllChatsProps> = ({ profile }) => {
//   const { setChats, setChatMessages, setSelectedChat } =
//     useContext(ChatbotUIContext)
//   const { handleNewChat } = useChatHandler()

//   const buttonRef = useRef<HTMLButtonElement>(null)
//   const [showChatDialog, setShowChatDialog] = useState(false)

//   const handleDeleteAllChats = async () => {
//     if (!profile) return

//     await deleteAllChats(profile.user_id)

//     setChats([])
//     setChatMessages([])
//     setSelectedChat(null)

//     handleNewChat()
//     toast.success("All chats deleted!")
//   }

//   return (
//     <Dialog open={showChatDialog} onOpenChange={setShowChatDialog}>
//       <DialogTrigger asChild>
//         <IconTrash className="hover:opacity-50" size={32} />
//       </DialogTrigger>

//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Delete All Chats</DialogTitle>
//           <DialogDescription>
//             Are you sure you want to delete all chats?
//           </DialogDescription>
//         </DialogHeader>

//         <DialogFooter>
//           <Button variant="ghost" onClick={() => setShowChatDialog(false)}>
//             Cancel
//           </Button>
//           <Button
//             ref={buttonRef}
//             variant="destructive"
//             onClick={handleDeleteAllChats}
//           >
//             Delete
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }
