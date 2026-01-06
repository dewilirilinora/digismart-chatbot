import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, BookOpen, Shield, AlertCircle, Lock, MessageCircle, Eye } from 'lucide-react';

const DigiSmartChatbot = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Halo! 👋 Saya DigiSmart, teman belajar literasi digital Anda. Saya siap membantu Anda memahami dunia digital dengan lebih baik!\n\nAnda bisa bertanya tentang:\n• Jejak Digital - Bagaimana aktivitas online meninggalkan "jejak"\n• Keamanan Password - Tips membuat password yang kuat\n• Hoaks & Misinformasi - Cara mengenali berita palsu\n• Cyberbullying - Apa itu dan bagaimana menghadapinya\n• Privasi Data - Melindungi informasi pribadi Anda\n• Etika Online - Berperilaku baik di dunia maya\n\nSilakan tanya apa saja! 😊'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const topics = [
    { icon: Eye, label: 'Jejak Digital', query: 'Apa itu jejak digital dan mengapa penting?' },
    { icon: Lock, label: 'Keamanan Password', query: 'Bagaimana cara membuat password yang aman?' },
    { icon: AlertCircle, label: 'Hoaks', query: 'Bagaimana cara mengenali hoaks?' },
    { icon: Shield, label: 'Cyberbullying', query: 'Apa itu cyberbullying dan bagaimana menghadapinya?' },
    { icon: BookOpen, label: 'Privasi Data', query: 'Bagaimana cara melindungi privasi data saya?' },
    { icon: MessageCircle, label: 'Etika Online', query: 'Apa saja etika yang baik saat berinteraksi online?' }
  ];

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Cek apakah API key tersedia
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      
      if (!apiKey) {
        throw new Error('API Key tidak ditemukan');
      }

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant', 
          messages: [
            {
              role: 'system',
              content: `Anda adalah DigiSmart, asisten AI yang ramah dan edukatif yang membantu pengguna belajar tentang literasi digital. Fokus Anda adalah menjelaskan topik-topik berikut dengan cara yang mudah dipahami:

1. Jejak Digital - Jejak aktivitas online yang tertinggal
2. Keamanan Password - Praktik terbaik untuk password
3. Hoaks & Misinformasi - Cara mengidentifikasi berita palsu
4. Cyberbullying - Pemahaman dan cara menghadapi
5. Privasi Data - Melindungi informasi pribadi
6. Etika Online - Berperilaku baik di internet

Gunakan bahasa Indonesia yang sederhana, berikan contoh konkret, dan gunakan emoji sesekali untuk membuat penjelasan lebih menarik. Berikan tips praktis yang bisa langsung diterapkan. Jawaban Anda harus edukatif namun tidak menggurui.`
            },
            ...messages.concat(userMessage)
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const assistantMessage = {
        role: 'assistant',
        content: data.choices[0].message.content
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ Maaf, terjadi kesalahan: ${error.message}\n\n💡 Solusi:\n• Pastikan API key valid\n• Cek koneksi internet Anda`
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleTopicClick = (query) => {
    setInput(query);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white rounded-t-2xl shadow-lg p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">DigiSmart</h1>
              <p className="text-sm text-gray-600">Teman Belajar Literasi Digital Anda</p>
            </div>
          </div>

          {/* Topic Pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {topics.map((topic, idx) => (
              <button
                key={idx}
                onClick={() => handleTopicClick(topic.query)}
                className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 rounded-full text-sm text-gray-700 transition-all duration-200 hover:scale-105"
              >
                <topic.icon className="w-4 h-4" />
                {topic.label}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 bg-white overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-br from-green-400 to-blue-500' 
                  : 'bg-gradient-to-br from-blue-500 to-purple-600'
              }`}>
                {msg.role === 'user' ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>
              <div
                className={`max-w-2xl rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white rounded-b-2xl shadow-lg p-4 border-t border-gray-200">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !loading && handleSend()}
              placeholder="Ketik pertanyaan Anda tentang literasi digital..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            💡 Tips: Klik topik di atas atau ketik pertanyaan langsung
          </p>
        </div>
      </div>
    </div>
  );
};

export default DigiSmartChatbot;