"use client"

import { useCallback, useState, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { Paperclip, X, File, FileText, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export type FileWithPreview = File & {
  preview?: string
  id: string
}

interface FileDropzoneProps {
  value?: FileWithPreview[]
  onChange?: (files: FileWithPreview[]) => void
  onBlur?: () => void
  disabled?: boolean
  maxFiles?: number
  maxSize?: number // in bytes
  accept?: Record<string, string[]>
  className?: string
}

export function FileDropzone({
  value = [],
  onChange,
  onBlur,
  disabled = false,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB
  accept = {
    "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    "application/pdf": [".pdf"],
    "text/csv": [".csv"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    "application/msword": [".doc"],
  },
  className,
}: FileDropzoneProps) {
  const [files, setFiles] = useState<FileWithPreview[]>(value || [])
  
  // Update files when value prop changes
  useEffect(() => {
    setFiles(value || [])
  }, [value])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      try {
        const newFiles = acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
            id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
          }),
        ) as FileWithPreview[]

        const updatedFiles = [...files, ...newFiles].slice(0, maxFiles)
        setFiles(updatedFiles)
        onChange?.(updatedFiles)
      } catch (error) {
        console.error("Error processing dropped files:", error)
      }
    },
    [files, maxFiles, onChange],
  )

  const removeFile = useCallback((id: string) => {
    const fileToRemove = files.find(file => file.id === id)
    if (fileToRemove?.preview) {
      URL.revokeObjectURL(fileToRemove.preview)
    }
    
    const updatedFiles = files.filter((file) => file.id !== id)
    setFiles(updatedFiles)
    onChange?.(updatedFiles)
  }, [files, onChange])

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    disabled,
    maxFiles: maxFiles - files.length,
    maxSize,
    accept,
  })

  // Clean up previews when component unmounts
  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview)
        }
      })
    }
  }, [files])

  const getFileIcon = (file: FileWithPreview) => {
    if (file.type.startsWith("image/")) {
      return file.preview ? (
        <div className="relative h-10 w-10 overflow-hidden rounded">
          <img 
            src={file.preview} 
            alt={file.name} 
            className="h-full w-full object-cover" 
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg"
            }}
          />
        </div>
      ) : (
        <ImageIcon className="h-10 w-10 text-muted-foreground" />
      )
    } else if (file.type === "application/pdf") {
      return <FileText className="h-10 w-10 text-red-500" />
    } else if (file.type === "text/csv") {
      return <FileText className="h-10 w-10 text-green-500" />
    } else if (
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.type === "application/msword"
    ) {
      return <FileText className="h-10 w-10 text-blue-500" />
    } else {
      return <File className="h-10 w-10 text-muted-foreground" />
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      {/* Only show the dropzone if we haven't reached maxFiles yet */}
      {files.length < maxFiles && (
        <div
          {...getRootProps()}
          className={cn(
            "flex cursor-pointer items-center justify-center rounded-md border border-dashed p-4 transition-colors",
            isDragActive ? "border-primary/50 bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
            disabled && "cursor-not-allowed opacity-60",
          )}
        >
          <input {...getInputProps({ onBlur })} />
          <div className="flex flex-col items-center justify-center space-y-1 text-center">
            <Paperclip className="h-6 w-6 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-primary">Click to upload</span> or drag and drop
            </div>
            <p className="text-xs text-muted-foreground">
              {maxFiles > 1 ? `Up to ${maxFiles} files` : "Only 1 file"} (max {(maxSize / 1024 / 1024).toFixed(0)}MB each)
            </p>
          </div>
        </div>
      )}

      {fileRejections && fileRejections.length > 0 && (
        <div className="text-sm text-red-500">
          {fileRejections.map(({ file, errors }) => (
            <div key={file.name} className="mt-1">
              {errors.map(e => (
                <p key={e.code}>{e.message}</p>
              ))}
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((file) => (
            <div key={file.id} className="relative flex items-center gap-2 rounded-md border bg-background p-2">
              {getFileIcon(file)}
              <div className="flex flex-col">
                <span className="text-xs font-medium truncate max-w-[150px]" title={file.name}>
                  {file.name}
                </span>
                <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)}kB</span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(file.id)}
                className="ml-2 rounded-full p-1 hover:bg-muted"
                aria-label={`Remove ${file.name}`}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove file</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}