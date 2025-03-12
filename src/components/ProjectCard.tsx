import { desc } from "framer-motion/client"
import { GalleryVerticalEnd } from "lucide-react"

type ProjectCardProps = {
  name: string
  description: string
  url: string
  orientation?: "right" | "left"  // optional prop, default is "right"
}

export default function ProjectCard({
  name,
  description,
  url,
  orientation = "right"
}: ProjectCardProps) {
  // Determine the order of the halves based on the orientation prop.
  const isLeft = orientation === "left"

  return (
    <div className="grid grid-cols-2 h-150 rounded-lg overflow-hidden">
      {isLeft ? (
        <>
          {/* Opaque half with project info */}
          <div className="bg-muted p-6 md:p-10 pt-10 flex flex-col items-center justify-start">
            <a href="#" className="flex items-center gap-2 self-center font-medium mb-6">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
              </div>
             Open Source Project 
            </a>
            <div className="max-w-md text-center">
              <h1 className="mb-4 text-2xl font-bold">{name}</h1>
              <p className="mb-4">
                {description}
              </p>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                View on GitHub
              </a>
            </div>
          </div>
          {/* Transparent half */}
        </>
      ) : (
        <>
          {/* Transparent half */}
          <div className="bg-transparent"></div>
          {/* Opaque half with project info */}
          <div className="bg-muted p-6 md:p-10 pt-10 flex flex-col items-center justify-start">
            <a href="#" className="flex items-center gap-2 self-center font-medium mb-6">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
              </div>
              Open Source Project
            </a>
            <div className="max-w-md text-center">
              <h1 className="mb-4 text-2xl font-bold">{name}</h1>
              <p className="mb-4">
                {description}
              </p>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
