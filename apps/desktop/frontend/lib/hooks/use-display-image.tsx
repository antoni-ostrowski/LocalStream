import { GetImageFromPath } from "@/wailsjs/go/main/App"
import { useEffect, useState } from "react"

export default function useDisplayImage(path: string) {
  const [imageString, setImageString] = useState("")

  useEffect(() => {
    void (async () => {
      const res = await GetImageFromPath(path)
      setImageString(res)
    })()
  }, [path])

  return {
    imageString
  }
}
