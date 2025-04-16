"use client"

import { useState, useEffect, useRef } from "react"
import { Search, MoreVertical, ArrowLeft, Image as ImageIcon, Check, Send } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { io } from "socket.io-client"
import { jwtAuthMiddleware } from "./utils/jwt"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import crypto from 'crypto-js'

const ChatPage = () => {
  const [socket, setSocket] = useState(null)
  const [users, setUsers] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [showChatOnMobile, setShowChatOnMobile] = useState(false)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [onlineStatus, setOnlineStatus] = useState({})
  const [searchQuery, setSearchQuery] = useState("")
  const [mediaFile, setMediaFile] = useState(null)
  const [mediaPreview, setMediaPreview] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()
  const chatContainerRef = useRef(null)
  const fileInputRef = useRef(null)
  const token = localStorage.getItem("token")

  // Cloudinary credentials
  const cloudName = 'diane1tak'
  const apiKey = '595487194871695'
  const apiSecret = 'mxA23kc58ZihQbGwPuM5mNicdFo'
  const uploadPreset = 'sesmanagement'

  // Initialize Socket.IO and fetch users
  useEffect(() => {
    const initSocket = async () => {
      const newSocket = io("http://localhost:3000", {
        query: { token },
      })
      setSocket(newSocket)

      fetchChatUsers()

      newSocket.on('updateChatList', () => {
        fetchChatUsers()
      })

      return () => {
        newSocket.off('updateChatList')
        newSocket.disconnect()
      }
    }
    initSocket()
  }, [token])

  // Fetch chat users
  const fetchChatUsers = async () => {
    try {
      const response = await fetch("http://localhost:3000/messages/chat-users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error("Error fetching chat users:", error)
    }
  }

  // Handle socket events
  useEffect(() => {
    if (!socket) return

    socket.on("newMessage", (message) => {
      if (
        (message.sender === selectedChat?._id && message.receiver === jwtAuthMiddleware(token).id) ||
        (message.receiver === selectedChat?._id && message.sender === jwtAuthMiddleware(token).id)
      ) {
        setMessages((prev) => [...prev, message])
        if (message.receiver === jwtAuthMiddleware(token).id && selectedChat?._id === message.sender) {
          socket.emit("markAsSeen", { messageId: message._id })
        }
      } else if (message.receiver === jwtAuthMiddleware(token).id) {
        toast.info(`New message from ${message.senderName}`, {
          position: "top-right",
          autoClose: 5000,
        })
      }
    })

    socket.on("messageSeen", (updatedMessage) => {
      setMessages((prev) =>
        prev.map((msg) => (msg._id === updatedMessage._id ? updatedMessage : msg))
      )
    })

    socket.on("userStatus", ({ userId, isOnline }) => {
      setOnlineStatus((prev) => ({ ...prev, [userId]: isOnline }))
    })

    return () => {
      socket.off("newMessage")
      socket.off("messageSeen")
      socket.off("userStatus")
    }
  }, [socket, selectedChat, token])

  // Handle selected user and fetch chat history
  useEffect(() => {
    if (location.state?.selectedUser) {
      setSelectedChat(location.state.selectedUser)
      setShowChatOnMobile(true)
      fetchChatHistory(location.state.selectedUser._id)
      if (socket) {
        socket.emit("subscribeToUserStatus", location.state.selectedUser._id)
      }
    }
  }, [location.state, socket])

  // Fetch chat history and mark unseen messages as seen
  const fetchChatHistory = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3000/messages/history/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      setMessages(data.messages || [])

      // Mark any unseen messages from the selected chat as seen
      const currentUserId = jwtAuthMiddleware(token).id
      if (socket && data.messages) {
        data.messages.forEach((message) => {
          if (!message.isSeen && message.receiver === currentUserId) {
            socket.emit("markAsSeen", { messageId: message._id })
          }
        })
      }
    } catch (error) {
      console.error("Error fetching chat history:", error)
    }
  }

  // Scroll to bottom when messages change or chat is selected
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages, selectedChat])

  // Handle chat selection
  const handleChatSelect = (user) => {
    setSelectedChat(user)
    setShowChatOnMobile(true)
    fetchChatHistory(user._id)
    if (socket) {
      socket.emit("subscribeToUserStatus", user._id)
    }
  }

  // Handle sending a message
  const handleSendMessage = async () => {
    if ((!newMessage.trim() && !mediaFile) || !selectedChat || !socket) return

    let mediaUrl = null
    if (mediaFile) {
      mediaUrl = await uploadMedia(mediaFile)
      if (!mediaUrl) {
        toast.error('Failed to upload media')
        return
      }
    }

    const message = {
      receiver: selectedChat._id,
      content: newMessage,
      mediaUrl,
      messageType: mediaFile ? (mediaFile.type.startsWith('image/') ? 'image' : 'file') : 'text',
    }

    try {
      const response = await fetch("http://localhost:3000/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(message),
      })
      const data = await response.json()
      if (data.success) {
        setMessages((prev) => [...prev, data.message])
        setNewMessage("")
        setMediaFile(null)
        setMediaPreview(null)
      }
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  // Upload media to Cloudinary
  const uploadMedia = async (file) => {
    const timestamp = Math.floor(Date.now() / 1000)
    const paramsToSign = { timestamp, upload_preset: uploadPreset }
    const signature = generateSignature(paramsToSign, apiSecret)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', uploadPreset)
    formData.append('api_key', apiKey)
    formData.append('timestamp', timestamp)
    formData.append('signature', signature)

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      return data.secure_url || null
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Error uploading media')
      return null
    }
  }

  // Generate Cloudinary signature
  const generateSignature = (paramsToSign, apiSecret) => {
    const sortedParams = Object.keys(paramsToSign).sort().reduce((acc, key) => {
      acc[key] = paramsToSign[key]
      return acc
    }, {})
    const paramString = Object.entries(sortedParams).map(([key, value]) => `${key}=${value}`).join('&')
    return crypto.SHA1(paramString + apiSecret).toString()
  }

  // Handle media selection
  const handleMediaChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setMediaFile(file)
      setMediaPreview(URL.createObjectURL(file))
    }
  }

  // Render media preview
  const renderMediaPreview = () => {
    if (!mediaPreview) return null
    return (
      <div className="mt-2">
        {mediaFile.type.startsWith('image/') ? (
          <img src={mediaPreview} alt="Preview" className="max-w-[200px] h-auto" />
        ) : (
          <p>{mediaFile.name}</p>
        )}
      </div>
    )
  }

  return (
    <div className="container mx-auto h-screen flex flex-col">
      <ToastContainer />
      <div className="flex flex-1 overflow-hidden">
        {/* Chat List */}
        <div
          className={`w-full lg:w-2/5 bg-white border-r border-gray-200 flex flex-col ${
            showChatOnMobile ? "hidden" : "flex"
          } lg:flex`}
        >
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-3xl font-bold mb-4">Chats</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-100 rounded-full py-2 pl-10 pr-4 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {users
              .filter(user =>
                `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((user) => (
                <div
                  key={user._id}
                  className="flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleChatSelect(user)}
                >
                  <div className="relative">
                    <img
                      src={user.picture || "/placeholder.svg"}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        onlineStatus[user._id] ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></div>
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-semibold">{user.firstName} {user.lastName}</h3>
                    <p className="text-sm text-gray-500 truncate">{user.lastMessage}</p>
                  </div>
                  {user.unreadCount > 0 && (
                    <div className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {user.unreadCount}
                    </div>
                  )}
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical size={18} />
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* Divider */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="h-full">
            <img src="https://i.ibb.co/rBZSJDk/Line-61.png" alt="Divider" className="h-full object-contain" />
          </div>
        </div>

        {/* Chat Window */}
        <div
          className={`w-full lg:w-3/5 bg-gray-50 flex flex-col ${
            showChatOnMobile ? "flex" : "hidden"
          } lg:flex`}
        >
          {selectedChat ? (
            <>
              <div className="bg-white p-4 border-b border-gray-200 flex items-center">
                <button
                  onClick={() => setShowChatOnMobile(false)}
                  className="mr-2 lg:hidden text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft size={20} />
                </button>
                <img
                  src={selectedChat.picture || "/placeholder.svg"}
                  alt={`${selectedChat.firstName} ${selectedChat.lastName}`}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="ml-3 flex-1">
                  <h3 className="font-semibold">{selectedChat.firstName} {selectedChat.lastName}</h3>
                  <p className={`text-xs ${onlineStatus[selectedChat._id] ? "text-green-500" : "text-black"}`}>
                    {onlineStatus[selectedChat._id] ? "Online" : "Offline"}
                  </p>
                </div>
              </div>

              <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4">
                {messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).map((message) => (
                  <div
                    key={message._id}
                    className={`mb-4 flex ${message.sender === jwtAuthMiddleware(token).id ? "justify-end" : "justify-start"}`}
                  >
                    {message.sender !== jwtAuthMiddleware(token).id && (
                      <img
                        src={selectedChat.picture || "/placeholder.svg"}
                        alt={`${selectedChat.firstName} ${selectedChat.lastName}`}
                        className="w-8 h-8 rounded-full object-cover mr-2 self-end"
                      />
                    )}
                    <div
                      className={`max-w-[70%] px-4 py-2 rounded-lg relative ${
                        message.sender === jwtAuthMiddleware(token).id
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-gray-200 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      {message.messageType === 'text' ? (
                        <p>{message.content}</p>
                      ) : message.messageType === 'image' ? (
                        <img src={message.mediaUrl} alt="Sent image" className="max-w-full h-auto" />
                      ) : (
                        <a href={message.mediaUrl} target="_blank" rel="noopener noreferrer">
                          {message.mediaUrl.split('/').pop()}
                        </a>
                      )}
                      <div className="flex items-center justify-end mt-1">
                        <span
                          className={`text-xs ${message.sender === jwtAuthMiddleware(token).id ? "text-blue-100" : "text-gray-500"}`}
                        >
                          {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        {message.sender === jwtAuthMiddleware(token).id && (
                          <span className="ml-1 flex items-center">
                            {message.isSeen ? (
                              <>
                                <Check size={14} color="#00aaff" />
                                <Check size={14} color="#00aaff" style={{ marginLeft: '-5px' }} />
                              </>
                            ) : (
                              <Check size={14} color="#000" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white p-4 border-t border-gray-200 flex items-center">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleMediaChange}
                  style={{ display: 'none' }}
                />
                <button onClick={() => fileInputRef.current.click()} className="text-blue-600 mr-4">
                  <ImageIcon size={24} />
                </button>
                <input
                  type="text"
                  placeholder="Type your message here..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 bg-gray-100 rounded-full py-3 px-4 focus:outline-none"
                />
                {renderMediaPreview()}
                <button onClick={handleSendMessage} className="ml-4 bg-blue-600 text-white p-2 rounded-full">
                  <Send size={20} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center flex-col p-8 text-center">
              <h3 className="text-xl font-semibold mb-2">No chat selected</h3>
              <p className="text-gray-500">Select a conversation from the list to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatPage
