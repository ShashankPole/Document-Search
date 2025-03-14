"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import {
  MessageCircle,
  Settings,
  FileUp,
  Info,
  ChevronDown,
  FileText,
  ChevronLeft,
  ChevronRight,
  File,
  X,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { pdfjs } from 'react-pdf';
import PdfComp from "@/components/PdfComp"

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString(); 


export default function ChatDocAI() {

  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false)
  const [rightSidebarWidth, setRightSidebarWidth] = useState(800) // Default width
  const [isDraggingRightSidebar, setIsDraggingRightSidebar] = useState(false)
  const [selectedLLM, setSelectedLLM] = useState("Qwen 2.5 3B")
  const [selectedEmbedding, setSelectedEmbedding] = useState("BGE Small")
  const [temperature, setTemperature] = useState(0.3)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [showIndexingHeader, setShowIndexingHeader] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pdfFile, setPdfFile] = useState<File | null>(null)

  const toggleLeftSidebar = () => {
    setLeftSidebarOpen(!leftSidebarOpen)
   
  }

  const toggleRightSidebar = () => {
    setRightSidebarOpen(!rightSidebarOpen)
  }

  // Handle right sidebar resize
  const handleRightSidebarResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDraggingRightSidebar(true)

    // Store initial mouse position and sidebar width
    const initialX = e.clientX
    const initialWidth = rightSidebarWidth

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate how far the mouse has moved
      const deltaX = initialX - e.clientX
      // Calculate new width by adding the delta to the initial width
      const newWidth = initialWidth + deltaX

      // Set min and max width limits
      if (newWidth >= 370 && newWidth <= 900) {
        setRightSidebarWidth(newWidth)
      }
    }

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
      setIsDraggingRightSidebar(false)
    }

     // Add event listeners
     document.addEventListener("mousemove", handleMouseMove)
     document.addEventListener("mouseup", handleMouseUp)
     document.body.style.cursor = "ew-resize"
     document.body.style.userSelect = "none" // Prevent text selection during drag
   }

    // Add event listeners for dragging
  useEffect(() => {
    return () => {
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }
  }, [])

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const file = files[0]
      // Check if file is one of the supported formats
      const validTypes = [
        ".pdf",
        ".txt",
        ".csv",
        ".docx",
        "application/pdf",
        "text/plain",
        "text/csv",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]
      const fileType = file.type
      const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase()

      if (validTypes.includes(fileType) || validTypes.includes(fileExtension)) {
        setUploadedFile(file)
        setPdfFile(file)
      } else {
        alert("Please upload a supported file format (PDF, TXT, CSV, DOCX)")
      }
    }
    // Reset the input value so the same file can be uploaded again if needed
    if (event.target) {
      event.target.value = ""
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      // Check if file is one of the supported formats
      const validTypes = [
        ".pdf",
        ".txt",
        ".csv",
        ".docx",
        "application/pdf",
        "text/plain",
        "text/csv",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]
      const fileType = file.type
      const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase()

      if (validTypes.includes(fileType) || validTypes.includes(fileExtension)) {
        setUploadedFile(file)
        setPdfFile(file)
      } else {
        alert("Please upload a supported file format (PDF, TXT, CSV, DOCX)")
      }
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
    setRightSidebarOpen(false)
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.substring(fileName.lastIndexOf(".")).toLowerCase()

    switch (extension) {
      case ".pdf":
        return <File className="h-4 w-4 text-red-500" />
      case ".txt":
        return <File className="h-4 w-4 text-blue-500" />
      case ".csv":
        return <File className="h-4 w-4 text-green-500" />
      case ".docx":
        return <File className="h-4 w-4 text-blue-700" />
      default:
        return <File className="h-4 w-4" />
    }
  }

  const handleTemperatureChange = (value: number[]) => {
    setTemperature(value[0])
  }

  const handleIndexFile = () => {
    console.log("Indexing file:", uploadedFile?.name)
    setShowIndexingHeader(true)
  }

  const handleNewChat = () => {
    console.log("Starting new chat with file:", uploadedFile?.name)
    setShowIndexingHeader(false)
    setRightSidebarOpen(false)
    setUploadedFile(null)
  }




  const handleViewContext = () => {
    setRightSidebarOpen(true)
  }


  return (
    <div className="flex h-screen bg-[#1a1a24] text-white">
      {/* Left Sidebar */}
      <div
        className={`${leftSidebarOpen ? "w-[372px]" : "w-[50px]"} flex flex-col border-r border-gray-800 transition-all duration-300 relative`}
      >
        {/* Toggle button */}
        <button
          onClick={toggleLeftSidebar}
          className="absolute -right-3 top-4 z-10 flex items-center justify-center h-6 w-6 rounded-full bg-gray-700 text-white"
        >
          {leftSidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>

        <div className="p-4 flex items-center gap-2">
          <Settings className="h-5 w-5 text-white" />
          {leftSidebarOpen && <span className="font-medium">Settings</span>}
        </div>

        <div className="flex-1 overflow-auto">
          {/* Model Settings */}
          <Collapsible defaultOpen={leftSidebarOpen} className="border-b border-gray-800">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-400"></span>
                {leftSidebarOpen && <span>Model Settings</span>}
              </div>
              {leftSidebarOpen && <ChevronDown className="h-4 w-4" />}
            </CollapsibleTrigger>
            {leftSidebarOpen && (
              <CollapsibleContent>
                <div className="px-4 pb-4 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">LLM Model</span>
                      <Info className="h-3 w-3 text-gray-400" />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="w-full bg-[#27272f] rounded flex items-center justify-between p-2 text-xs">
                        <span>{selectedLLM}</span>
                        <ChevronDown className="h-3 w-3" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[160px] bg-[#27272f] text-white border-gray-700">
                        <DropdownMenuItem
                          className="text-xs cursor-pointer"
                          onClick={() => setSelectedLLM("Qwen 2.5 3B")}
                        >
                          Qwen 2.5 3B
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-xs cursor-pointer"
                          onClick={() => setSelectedLLM("Llama 3 8B")}
                        >
                          Llama 3 8B
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-xs cursor-pointer"
                          onClick={() => setSelectedLLM("Mistral 7B")}
                        >
                          Mistral 7B
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-xs cursor-pointer"
                          onClick={() => setSelectedLLM("Phi-3 Mini")}
                        >
                          Phi-3 Mini
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Embedding Model</span>
                      <Info className="h-3 w-3 text-gray-400" />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="w-full bg-[#27272f] rounded flex items-center justify-between p-2 text-xs">
                        <span>{selectedEmbedding}</span>
                        <ChevronDown className="h-3 w-3" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[160px] bg-[#27272f] text-white border-gray-700">
                        <DropdownMenuItem
                          className="text-xs cursor-pointer"
                          onClick={() => setSelectedEmbedding("BGE Small")}
                        >
                          BGE Small
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-xs cursor-pointer"
                          onClick={() => setSelectedEmbedding("BGE Base")}
                        >
                          BGE Base
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-xs cursor-pointer"
                          onClick={() => setSelectedEmbedding("E5 Small")}
                        >
                          E5 Small
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-xs cursor-pointer"
                          onClick={() => setSelectedEmbedding("BAAI Embeddings")}
                        >
                          BAAI Embeddings
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Temperature</span>
                      <Info className="h-3 w-3 text-gray-400" />
                    </div>
                    <div className="text-xs text-center">{temperature.toFixed(2)}</div>
                    <Slider
                      defaultValue={[temperature]}
                      max={1}
                      step={0.01}
                      className="py-2"
                      onValueChange={handleTemperatureChange}
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>0.00</span>
                      <span>1.00</span>
                    </div>
                  </div>


                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Switch defaultChecked />
                      <span className="text-xs">Stream responses</span>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            )}
          </Collapsible>

          {/* RAG Settings */}
          <Collapsible className="border-b border-gray-800">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-gray-400"></span>
                {leftSidebarOpen && <span>RAG Settings</span>}
              </div>
              {leftSidebarOpen && <ChevronDown className="h-4 w-4" />}
            </CollapsibleTrigger>
          </Collapsible>

          {/* Upload Tabs */}
          {leftSidebarOpen && (
            <div className="mt-4">
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="w-full grid grid-cols-3 bg-transparent h-auto p-0">
                  <TabsTrigger
                    value="upload"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:text-white rounded-none text-xs py-2 bg-transparent"
                  >
                    Upload
                  </TabsTrigger>
                  <TabsTrigger
                    value="manage"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:text-white rounded-none text-xs py-2 bg-transparent"
                  >
                    Manage
                  </TabsTrigger>
                  <TabsTrigger
                    value="settings"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:text-white rounded-none text-xs py-2 bg-transparent"
                  >
                    Settings
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          )}

          {/* Upload Document */}
          {leftSidebarOpen && (
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <FileUp className="h-4 w-4" />
                <span className="text-sm font-medium">Upload Document</span>
              </div>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.txt,.csv,.docx"
                className="hidden"
              />

              {/* Drag and drop area */}
              <div
                className={`border border-dashed ${isDragging ? "border-blue-500 bg-blue-500/10" : "border-gray-700"} rounded-md p-4 flex flex-col items-center justify-center text-center transition-colors`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {uploadedFile ? (
                  <div className="w-full">
                    <div className="flex items-center justify-between bg-[#27272f] p-2 rounded mb-2">
                      <div className="flex items-center gap-2">
                        {getFileIcon(uploadedFile.name)}
                        <span className="text-xs truncate max-w-[180px]">{uploadedFile.name}</span>
                      </div>
                      <button onClick={removeFile} className="text-gray-400 hover:text-white">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="text-xs text-green-500 mb-2">File ready for processing</div>
                    {/* Two buttons: Index and Upload */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-8 bg-[#27272f] hover:bg-[#32323d] border-gray-700"
                        onClick={handleIndexFile}
                      >
                        Index
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        className="text-xs h-8 bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-1"
                        onClick={handleNewChat}
                      >
                        
                        New Chat
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-xs mb-1">Drag and drop file here</p>
                    <p className="text-xs text-gray-500 mb-2">Limit 200MB per file • TXT, PDF, CSV, DOCX</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-8 bg-[#27272f] hover:bg-[#32323d] border-gray-700"
                      onClick={handleBrowseClick}
                    >
                      Browse files
                    </Button>
                  </>
                )}
              </div>

              <div className="mt-4 text-xs text-gray-500">Supported formats: .txt, .pdf, .csv, .docx</div>
            </div>
          )}
        </div>

        {/* Footer */}
        {leftSidebarOpen && (
          <div className="mt-auto p-4 text-xs text-gray-500 space-y-1">
            <div>ChatDoc AI v2.0</div>
            <div>Built with LangChain and Ollama</div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4">
          <div></div>
          <Button variant="outline" size="sm" className="text-xs bg-transparent border-gray-700 hover:bg-gray-800">
            Deploy
          </Button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-8 pt-4 overflow-auto">
          <div className="flex flex-col h-full">
            {/* Indexing Header - Only shown when Index button is clicked */}
          {showIndexingHeader && uploadedFile && (
              <div className="mb-6 bg-[#1e2a3f] rounded-md p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <File className="h-5 w-5 text-blue-400" />
                    <div>
                      <h3 className="text-lg font-medium">Indexing Document</h3>
                      <p className="text-xs text-gray-400">{uploadedFile.name}</p>
                    </div>
                  </div>
                  <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-8 bg-[#27272f] hover:bg-[#32323d] border-gray-700 flex items-center gap-1"
                      onClick={handleViewContext}
                    >
                      View
                    </Button>
                  
                </div>
              </div>
            )}

            {/* ChatDoc AI Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-1">
                <MessageCircle className="h-6 w-6 text-blue-400 fill-blue-400" />
                <h1 className="text-2xl font-bold">ChatDoc AI</h1>
              </div>
              <p className="text-gray-400 text-sm">Chat with your documents using local LLMs</p>
            </div>

           
            {/* Empty Space */}
            <div className="flex-1"></div>

            {/* Input Area */}
            <div className="mt-auto relative">
              <input
                type="text"
                placeholder="Ask a question..."
                className="w-full bg-[#27272f] rounded-md py-3 px-4 pr-12 text-sm focus:outline-none"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M22 2L11 13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 2L15 22L11 13L2 9L22 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>



      {rightSidebarOpen && (
        <div
          className="w-2 cursor-ew-resize flex items-center justify-center hover:bg-gray-700/30 z-20"
          onMouseDown={handleRightSidebarResizeStart}
          style={{ touchAction: "none" }}
        >
          <div className="h-16 w-1 bg-gray-600 rounded-full"></div>
        </div>
      )}

      {/* Right Sidebar - Document Context */}
      <div
        className={`${rightSidebarOpen ? "flex" : "w-0 hidden"} flex-col border-l border-gray-800 overflow-hidden`}
        style={{ width: rightSidebarOpen ? `${rightSidebarWidth}px` : "0"}} >

        {/* Toggle button */}
        {rightSidebarOpen && (
          <div className=" flex justify-end px-4  ">
            <button
            onClick={toggleRightSidebar}
            className="relative top-4  z-10 flex items-center justify-center h-6 w-6 rounded-full bg-gray-700 text-white"
          >
            <X className="h-4 w-4" />
          </button>
          </div>
        )}

        {rightSidebarOpen && (
          <div className="p-4 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-gray-300" />
              <h2 className="text-lg font-medium">Document Context</h2>
            </div>

            {pdfFile ? (<div className="flex-1 overflow-y-auto ">
           <PdfComp pdfFile={pdfFile}/>
           </div>) : ( <div className="bg-[#1e3a5f] rounded-md p-4 text-sm">Process a document to view its context here.</div>) }
           
           
          </div>
        )}
      </div>
    </div>
  )
}

