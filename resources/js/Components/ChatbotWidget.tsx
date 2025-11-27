"use client"

import { useEffect, useRef, useState } from "react"
import { Bot, X } from "lucide-react"

interface ChatbotWidgetProps {
  webhookUrl: string
  darkMode?: boolean
}

export default function ChatbotWidget({ webhookUrl, darkMode = false }: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [chatLoaded, setChatLoaded] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const generateStyles = (isDark: boolean) => `
    #n8n-chat-container {
      --chat--color-primary: #667eea;
      --chat--color-primary-shade-50: #5a6fd6;
      --chat--color-primary-shade-100: #4e61c2;
      --chat--color-secondary: #764ba2;
      --chat--color-secondary-shade-50: #6a4392;
      --chat--color-white: #ffffff;
      --chat--color-light: ${isDark ? "#1e293b" : "#f8fafc"};
      --chat--color-light-shade-50: ${isDark ? "#334155" : "#e2e8f0"};
      --chat--color-light-shade-100: ${isDark ? "#475569" : "#cbd5e1"};
      --chat--color-medium: ${isDark ? "#475569" : "#94a3b8"};
      --chat--color-dark: ${isDark ? "#e2e8f0" : "#1e293b"};
      --chat--color-disabled: #64748b;
      --chat--color-typing: ${isDark ? "#94a3b8" : "#64748b"};
      --chat--spacing: 0.75rem;
      --chat--border-radius: 1rem;
      --chat--transition-duration: 0.2s;
      --chat--window--width: 100%;
      --chat--window--height: 100%;
      --chat--header-height: 0;
      --chat--header--padding: 0;
      --chat--header--background: transparent;
      --chat--textarea--height: 44px;
      --chat--message--font-size: 0.875rem;
      --chat--message--padding: 0.625rem 0.875rem;
      --chat--message--border-radius: 1rem;
      --chat--message-line-height: 1.5;
      --chat--message--bot--background: ${isDark ? "#1e293b" : "#ffffff"};
      --chat--message--bot--color: ${isDark ? "#e2e8f0" : "#1e293b"};
      --chat--message--bot--border: 1px solid ${isDark ? "#334155" : "#e2e8f0"};
      --chat--message--user--background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      --chat--message--user--color: #ffffff;
      --chat--message--user--border: none;
      --chat--toggle--background: transparent;
      --chat--toggle--hover--background: transparent;
      --chat--toggle--active--background: transparent;
      --chat--toggle--color: transparent;
      --chat--toggle--size: 0;
      width: 100%;
      height: 100%;
    }

    #n8n-chat-container .chat-toggle {
      display: none !important;
    }

    #n8n-chat-container .chat-header {
      display: none !important;
    }

    #n8n-chat-container .chat-wrapper,
    #n8n-chat-container .chat-wrapper.n8n-chat {
      position: relative !important;
      width: 100% !important;
      height: 100% !important;
      border: none !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      display: flex !important;
      flex-direction: column !important;
    }

    #n8n-chat-container .chat-layout {
      display: flex !important;
      flex-direction: column !important;
      height: 100% !important;
      background: ${isDark ? "#0f172a" : "#f8fafc"} !important;
    }

    #n8n-chat-container .chat-body {
      flex: 1 !important;
      overflow-y: auto !important;
      padding: 1rem !important;
      display: flex !important;
      flex-direction: column !important;
      gap: 0.5rem !important;
    }

    #n8n-chat-container .chat-messages-list {
      display: flex !important;
      flex-direction: column !important;
      gap: 0.5rem !important;
    }

    #n8n-chat-container .chat-message {
      max-width: 85% !important;
      padding: 0.625rem 0.875rem !important;
      border-radius: 1rem !important;
      font-size: 0.875rem !important;
      line-height: 1.5 !important;
      word-wrap: break-word !important;
      animation: fadeIn 0.2s ease-out !important;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    #n8n-chat-container .chat-message-from-bot {
      align-self: flex-start !important;
      background: ${isDark ? "#1e293b" : "#ffffff"} !important;
      color: ${isDark ? "#e2e8f0" : "#1e293b"} !important;
      border: 1px solid ${isDark ? "#334155" : "#e2e8f0"} !important;
      border-bottom-left-radius: 0.25rem !important;
    }

    #n8n-chat-container .chat-message-from-user {
      align-self: flex-end !important;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      color: #ffffff !important;
      border: none !important;
      border-bottom-right-radius: 0.25rem !important;
    }

    #n8n-chat-container .chat-footer {
      padding: 0.75rem 1rem !important;
      background: ${isDark ? "#1e293b" : "#ffffff"} !important;
      border-top: 1px solid ${isDark ? "#334155" : "#e2e8f0"} !important;
      flex-shrink: 0 !important;
    }

    #n8n-chat-container .chat-input {
      display: flex !important;
      flex-direction: row !important;
      align-items: center !important;
      gap: 0.625rem !important;
      width: 100% !important;
    }

    #n8n-chat-container .chat-inputs {
      display: flex !important;
      flex-direction: row !important;
      align-items: center !important;
      gap: 0.625rem !important;
      width: 100% !important;
    }

    #n8n-chat-container .chat-input textarea,
    #n8n-chat-container textarea {
      flex: 1 !important;
      min-height: 44px !important;
      max-height: 100px !important;
      padding: 0.625rem 1rem !important;
      border-radius: 1.375rem !important;
      border: 1px solid ${isDark ? "#334155" : "#e2e8f0"} !important;
      background: ${isDark ? "#0f172a" : "#f1f5f9"} !important;
      color: ${isDark ? "#e2e8f0" : "#1e293b"} !important;
      font-size: 0.875rem !important;
      line-height: 1.5 !important;
      resize: none !important;
      outline: none !important;
      font-family: inherit !important;
    }

    #n8n-chat-container textarea:focus {
      border-color: #667eea !important;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15) !important;
    }

    #n8n-chat-container textarea::placeholder {
      color: ${isDark ? "#64748b" : "#94a3b8"} !important;
    }

    #n8n-chat-container .chat-inputs-controls {
      display: flex !important;
      align-items: center !important;
      flex-shrink: 0 !important;
    }

    #n8n-chat-container .chat-inputs-controls button,
    #n8n-chat-container .chat-input button[type="submit"] {
      width: 44px !important;
      height: 44px !important;
      min-width: 44px !important;
      padding: 0 !important;
      border-radius: 50% !important;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      border: none !important;
      cursor: pointer !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      transition: all 0.2s ease !important;
      flex-shrink: 0 !important;
    }

    #n8n-chat-container .chat-inputs-controls button:hover {
      transform: scale(1.05) !important;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4) !important;
    }

    #n8n-chat-container .chat-inputs-controls button:active {
      transform: scale(0.95) !important;
    }

    #n8n-chat-container .chat-inputs-controls button svg {
      width: 20px !important;
      height: 20px !important;
      color: white !important;
      fill: white !important;
    }

    #n8n-chat-container .chat-message-typing {
      background: ${isDark ? "#1e293b" : "#ffffff"} !important;
      padding: 0.75rem 1rem !important;
    }

    #n8n-chat-container .chat-body::-webkit-scrollbar {
      width: 6px;
    }

    #n8n-chat-container .chat-body::-webkit-scrollbar-track {
      background: transparent;
    }

    #n8n-chat-container .chat-body::-webkit-scrollbar-thumb {
      background: ${isDark ? "#334155" : "#cbd5e1"};
      border-radius: 3px;
    }

    #n8n-chat-container .chat-body::-webkit-scrollbar-thumb:hover {
      background: ${isDark ? "#475569" : "#94a3b8"};
    }
  `

  useEffect(() => {
    const existingStyle = document.getElementById("n8n-custom-styles")
    if (existingStyle) {
      existingStyle.innerHTML = generateStyles(darkMode)
    }
  }, [darkMode])

  useEffect(() => {
    if (isOpen && !chatLoaded) {
      const loadChat = async () => {
        try {
          const existingLink = document.querySelector('link[href*="@n8n/chat"]')
          if (!existingLink) {
            const link = document.createElement("link")
            link.rel = "stylesheet"
            link.href = "https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css"
            document.head.appendChild(link)
          }

          const existingStyle = document.getElementById("n8n-custom-styles")
          if (!existingStyle) {
            const style = document.createElement("style")
            style.id = "n8n-custom-styles"
            style.innerHTML = generateStyles(darkMode)
            document.head.appendChild(style)
          }

          await new Promise((resolve) => setTimeout(resolve, 100))

          const { createChat } = await import("https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js")

          createChat({
            webhookUrl: webhookUrl,
            target: "#n8n-chat-container",
            mode: "fullscreen",
            showWelcomeScreen: false,
            loadPreviousSession: false,
            initialMessages: ["Hola! 👋", "¿En qué puedo ayudarte hoy?"],
            i18n: {
              es: {
                title: "",
                subtitle: "",
                footer: "",
                getStarted: "Iniciar conversacion",
                inputPlaceholder: "Escribe tu mensaje...",
              },
            },
            defaultLanguage: "es",
          })

          setChatLoaded(true)
        } catch (error) {
          console.error("Error loading n8n chat:", error)
        }
      }

      loadChat()
    }
  }, [isOpen, chatLoaded, webhookUrl])

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
        style={{
          background: isOpen ? (darkMode ? "#475569" : "#64748b") : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          boxShadow: isOpen
            ? darkMode
              ? "0 8px 20px rgba(0, 0, 0, 0.4)"
              : "0 8px 20px rgba(0, 0, 0, 0.25)"
            : "0 8px 25px rgba(102, 126, 234, 0.4)",
        }}
        aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <Bot className="w-6 h-6 text-white" />}
      </button>

      {/* Chat modal - always mounted but hidden when closed */}
      <div
        className="fixed bottom-24 right-6 z-40 rounded-2xl overflow-hidden flex flex-col transition-all duration-300"
        style={{
          width: "380px",
          height: "520px",
          boxShadow: isOpen
            ? darkMode
              ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
              : "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
            : "none",
          border: darkMode ? "1px solid #334155" : "1px solid #e2e8f0",
          background: darkMode ? "#0f172a" : "#ffffff",
          visibility: isOpen ? "visible" : "hidden",
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
        {/* Custom header */}
        <div
          className="px-4 py-3 flex items-center justify-between flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Asistente Virtual</h3>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-white/80 text-xs">En linea</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
            aria-label="Cerrar chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* n8n chat container - always mounted */}
        <div
          id="n8n-chat-container"
          ref={chatContainerRef}
          className="flex-1 overflow-hidden"
          style={{
            minHeight: 0,
            background: darkMode ? "#0f172a" : "#f8fafc",
          }}
        />

        {/* Custom footer */}
        <div
          className="px-4 py-2 flex items-center justify-center flex-shrink-0"
          style={{
            background: darkMode ? "#1e293b" : "#f1f5f9",
            borderTop: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`,
          }}
        >
          <p className="text-xs" style={{ color: darkMode ? "#64748b" : "#94a3b8" }}>
            Powered by{" "}
            <span className="font-medium" style={{ color: darkMode ? "#667eea" : "#764ba2" }}>
              Asistente IA
            </span>
          </p>
        </div>
      </div>
    </>
  )
}
