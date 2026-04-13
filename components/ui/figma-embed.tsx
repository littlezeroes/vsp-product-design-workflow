"use client"

type FigmaEmbedProps = {
  url: string
  title?: string
  height?: number
  className?: string
}

/**
 * Embed a Figma design file/frame.
 *
 * Accepts any figma.com URL:
 *   - https://www.figma.com/design/KEY/NAME
 *   - https://www.figma.com/design/KEY/NAME?node-id=X-Y
 *   - https://figma.com/design/KEY/NAME
 *
 * Converts to embed format:
 *   - https://embed.figma.com/design/KEY/NAME?embed-host=...
 */
export function FigmaEmbed({ url, title = "Figma Design", height = 450, className }: FigmaEmbedProps) {
  // Build embed URL from any figma.com URL
  let embedUrl = url
  // Remove www. if present
  embedUrl = embedUrl.replace("https://www.figma.com/", "https://embed.figma.com/")
  // Handle without www.
  if (!embedUrl.includes("embed.figma.com")) {
    embedUrl = embedUrl.replace("https://figma.com/", "https://embed.figma.com/")
  }

  // Add required embed params
  const separator = embedUrl.includes("?") ? "&" : "?"
  embedUrl += `${separator}embed-host=vsp-ds&footer=false&viewport-controls=true&theme=system`

  return (
    <div className={`rounded-12 border overflow-hidden ${className ?? ""}`} style={{ borderColor: "var(--border)" }}>
      <iframe
        src={embedUrl}
        title={title}
        height={height}
        className="w-full"
        allowFullScreen
        style={{ border: "none" }}
      />
    </div>
  )
}
