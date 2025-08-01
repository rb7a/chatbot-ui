import { useState, useCallback } from "react"
import { Play, RotateCcw, RefreshCwOff } from "lucide-react"
import { Button } from "@/mcp/components/ui/button"
import { StdErrNotification } from "@/mcp/lib/notificationTypes"
import {
  LoggingLevel,
  LoggingLevelSchema
} from "@modelcontextprotocol/sdk/types.js"
import { InspectorConfig } from "@/mcp/lib/configurationTypes"
import { ConnectionStatus } from "@/mcp/lib/constants"

interface SidebarProps {
  connectionStatus: ConnectionStatus
  onConnect: () => void
  onDisconnect: () => void
  stdErrNotifications: StdErrNotification[]
  clearStdErrNotifications: () => void
}

const McpConnect = ({
  connectionStatus,
  onConnect,
  onDisconnect,
  stdErrNotifications,
  clearStdErrNotifications
}: SidebarProps) => {
  return (
    <div className="bg-card border-border flex h-full flex-col border-r">
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-4">
          {/* Connect Button */}
          <div className="space-y-2">
            {connectionStatus === "connected" && (
              <div className="grid grid-cols-2 gap-4">
                <Button
                  data-testid="connect-button"
                  onClick={() => {
                    onDisconnect()
                    onConnect()
                  }}
                >
                  <RotateCcw className="mr-2 size-4" />
                  {"Reconnect"}
                </Button>
                <Button onClick={onDisconnect}>
                  <RefreshCwOff className="mr-2 size-4" />
                  Disconnect
                </Button>
              </div>
            )}
            {connectionStatus !== "connected" && (
              <Button className="w-full" onClick={onConnect}>
                <Play className="mr-2 size-4" />
                Connect
              </Button>
            )}

            <div className="mb-4 flex items-center justify-center space-x-2">
              <div
                className={`size-2 rounded-full${(() => {
                  switch (connectionStatus) {
                    case "connected":
                      return "bg-green-500"
                    case "error":
                      return "bg-red-500"
                    case "error-connecting-to-proxy":
                      return "bg-red-500"
                    default:
                      return "bg-gray-500"
                  }
                })()}`}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {(() => {
                  switch (connectionStatus) {
                    case "connected":
                      return "Connected"
                    case "error": {
                      return "Connection Error - Check if your MCP server is running and config is correct"
                    }
                    case "error-connecting-to-proxy":
                      return "Error Connecting to MCP Inspector Proxy - Check Console logs"
                    default:
                      return "Disconnected"
                  }
                })()}
              </span>
            </div>

            {stdErrNotifications.length > 0 && (
              <>
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">
                      Error output from MCP server
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearStdErrNotifications}
                      className="h-8 px-2"
                    >
                      Clear
                    </Button>
                  </div>
                  <div className="mt-2 max-h-80 overflow-y-auto">
                    {stdErrNotifications.map((notification, index) => (
                      <div
                        key={index}
                        className="border-b border-gray-200 py-2 font-mono text-sm text-red-500 last:border-b-0"
                      >
                        {notification.params.content}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default McpConnect
