import type { Server as HTTPServer } from "http"
import type { Socket } from "net"
import type { Server as IOServer } from "socket.io"

export type NextApiResponseServerIO = import("next").NextApiResponse & {
  socket: Socket & {
    server: HTTPServer & { io?: IOServer }
  }
}
