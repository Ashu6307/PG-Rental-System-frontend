import React, { useState } from 'react';
import { 
  FaWhatsapp, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaComments, 
  FaTimes,
  FaUserTie
} from 'react-icons/fa';

interface ChatWidgetProps {
  propertyId: string;
  ownerName: string;
  ownerPhone?: string;
  propertyTitle: string;
  propertyType: 'PG' | 'Room' | 'Flat';
}

const ChatWidget: React.FC<ChatWidgetProps> = ({
  propertyId,
  ownerName,
  ownerPhone,
  propertyTitle,
  propertyType
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isOnline] = useState(Math.random() > 0.3); // Simulate online status

  const quickMessages = [
    "Hi! I'm interested in this property.",
    "Is this property still available?",
    "Can we schedule a visit?",
    "What are the nearby amenities?",
    "Are there any additional charges?",
    "What is the minimum lease period?"
  ];

  const handleQuickMessage = (msg: string) => {
    setMessage(msg);
    setSelectedOption(msg);
  };

  const handleWhatsAppContact = () => {
    const whatsappMessage = encodeURIComponent(
      `Hi ${ownerName}! I'm interested in your ${propertyType}: "${propertyTitle}". ${message || 'Could you please provide more details?'}`
    );
    window.open(`https://wa.me/${ownerPhone?.replace(/\D/g, '')}?text=${whatsappMessage}`);
  };

  const handlePhoneCall = () => {
    window.open(`tel:${ownerPhone}`);
  };

  const handleEmailContact = () => {
    const subject = encodeURIComponent(`Inquiry about ${propertyType}: ${propertyTitle}`);
    const body = encodeURIComponent(
      `Dear ${ownerName},\n\nI am interested in your ${propertyType} listing: "${propertyTitle}".\n\n${message || 'Could you please provide more details about this property?'}\n\nThank you for your time.\n\nBest regards`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
          aria-label="Open chat"
        >
          {isOpen ? <FaTimes className="text-xl" /> : <FaComments className="text-xl" />}
        </button>
      </div>

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 bg-white rounded-xl shadow-xl border z-50 max-h-[500px] flex flex-col">
          {/* Header */}
          <div className="bg-blue-500 text-white p-4 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <FaUserTie className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">{ownerName}</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                    <span>{isOnline ? 'Online' : 'Offline'}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white"
                aria-label="Close chat"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="mb-4">
              <div className="bg-gray-100 rounded-lg p-3 mb-3">
                <p className="text-sm text-gray-600">
                  Hello! I'm {ownerName}, the owner of "{propertyTitle}". How can I help you today?
                </p>
              </div>
            </div>

            {/* Quick Messages */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Messages:</h4>
              <div className="space-y-2">
                {quickMessages.map((msg, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickMessage(msg)}
                    className={`w-full text-left p-2 rounded-lg text-sm transition-colors ${
                      selectedOption === msg
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {msg}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Message */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Custom Message:</h4>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="border-t p-4">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleWhatsAppContact}
                className="flex flex-col items-center gap-1 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                disabled={!ownerPhone}
              >
                <FaWhatsapp className="text-lg" />
                <span className="text-xs">WhatsApp</span>
              </button>
              
              <button
                onClick={handlePhoneCall}
                className="flex flex-col items-center gap-1 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                disabled={!ownerPhone}
              >
                <FaPhoneAlt className="text-lg" />
                <span className="text-xs">Call</span>
              </button>
              
              <button
                onClick={handleEmailContact}
                className="flex flex-col items-center gap-1 p-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <FaEnvelope className="text-lg" />
                <span className="text-xs">Email</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;