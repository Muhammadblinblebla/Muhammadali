import type { NextApiRequest, NextApiResponse } from "next"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // no-op, client joins via websocket
  res.status(200).json({ ok: true })
}
