import React, { useState } from 'react';
import { 
  FaCreditCard, 
  FaUniversity, 
  FaMobile, 
  FaLock, 
  FaCheck, 
  FaTimes, 
  FaSpinner,
  FaShieldAlt,
  FaRupeeSign,
  FaQrcode,
  FaArrowLeft,
  FaExclamationTriangle
} from 'react-icons/fa';

interface PaymentGatewayProps {
  amount: number;
  orderId: string;
  propertyTitle: string;
  propertyType: string;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (transactionId: string) => void;
  onPaymentFailure: (error: string) => void;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ComponentType<{className?: string}>;
  type: 'card' | 'upi' | 'netbanking' | 'wallet';
  popular?: boolean;
}

interface CardDetails {
  number: string;
  expiry: string;
  cvv: string;
  name: string;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({
  amount,
  orderId,
  propertyTitle,
  propertyType,
  customerDetails,
  isOpen,
  onClose,
  onPaymentSuccess,
  onPaymentFailure
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('card');
  const [step, setStep] = useState<'method' | 'details' | 'processing' | 'success' | 'failure'>('method');
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [processingMessage, setProcessingMessage] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [error, setError] = useState('');

  const paymentMethods: PaymentMethod[] = [
    { id: 'card', name: 'Credit/Debit Card', icon: FaCreditCard, type: 'card', popular: true },
    { id: 'upi', name: 'UPI', icon: FaMobile, type: 'upi', popular: true },
    { id: 'netbanking', name: 'Net Banking', icon: FaUniversity, type: 'netbanking' },
    { id: 'wallet', name: 'Digital Wallet', icon: FaMobile, type: 'wallet' }
  ];

  const popularBanks = [
    'State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank',
    'Punjab National Bank', 'Bank of Baroda', 'Canara Bank', 'Union Bank'
  ];

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const validateCard = (): boolean => {
    const errors: string[] = [];
    if (cardDetails.number.replace(/\s/g, '').length !== 16) {
      errors.push('Card number must be 16 digits');
    }
    if (!cardDetails.expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
      errors.push('Invalid expiry date format (MM/YY)');
    }
    if (cardDetails.cvv.length !== 3) {
      errors.push('CVV must be 3 digits');
    }
    if (!cardDetails.name.trim()) {
      errors.push('Cardholder name is required');
    }
    
    if (errors.length > 0) {
      setError(errors.join(', '));
      return false;
    }
    return true;
  };

  const validateUPI = (): boolean => {
    if (!upiId.includes('@') || upiId.length < 5) {
      setError('Please enter a valid UPI ID');
      return false;
    }
    return true;
  };

  const processPayment = async () => {
    setStep('processing');
    setProcessingMessage('Initializing payment...');
    
    try {
      // Simulate payment processing steps
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProcessingMessage('Connecting to payment gateway...');
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      setProcessingMessage('Verifying payment details...');
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      setProcessingMessage('Processing payment...');
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate success/failure (90% success rate)
      const success = Math.random() > 0.1;
      
      if (success) {
        const txnId = 'TXN' + Date.now();
        setTransactionId(txnId);
        setStep('success');
        onPaymentSuccess(txnId);
      } else {
        throw new Error('Payment declined by bank');
      }
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Payment failed');
      setStep('failure');
      onPaymentFailure(error instanceof Error ? error.message : 'Payment failed');
    }
  };

  const handlePayment = async () => {
    setError('');
    
    if (selectedMethod === 'card' && !validateCard()) {
      return;
    }
    
    if (selectedMethod === 'upi' && !validateUPI()) {
      return;
    }
    
    if (selectedMethod === 'netbanking' && !selectedBank) {
      setError('Please select your bank');
      return;
    }
    
    await processPayment();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {step === 'method' ? 'Choose Payment Method' : 
                 step === 'details' ? 'Payment Details' :
                 step === 'processing' ? 'Processing Payment' :
                 step === 'success' ? 'Payment Successful' :
                 'Payment Failed'}
              </h2>
              <p className="text-gray-600 text-sm">{propertyTitle}</p>
            </div>
            {step !== 'processing' && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-2"
                aria-label="Close payment"
              >
                <FaTimes />
              </button>
            )}
          </div>
          
          {/* Amount Display */}
          <div className="mt-4 bg-blue-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Total Amount</span>
              <span className="text-2xl font-bold text-blue-600">
                <FaRupeeSign className="inline text-lg" />{amount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Payment Method Selection */}
          {step === 'method' && (
            <div className="space-y-4">
              {paymentMethods.map((method) => {
                const IconComponent = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`w-full p-4 border rounded-lg text-left transition-all ${
                      selectedMethod === method.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <IconComponent className="text-xl text-gray-600" />
                        <div>
                          <div className="font-medium">{method.name}</div>
                          {method.popular && (
                            <div className="text-sm text-green-600">Popular</div>
                          )}
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedMethod === method.id 
                          ? 'border-blue-500 bg-blue-500' 
                          : 'border-gray-300'
                      }`}>
                        {selectedMethod === method.id && (
                          <FaCheck className="text-white text-xs" />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
              
              <button
                onClick={() => setStep('details')}
                className="w-full mt-6 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Payment Details */}
          {step === 'details' && (
            <div className="space-y-4">
              <button
                onClick={() => setStep('method')}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
              >
                <FaArrowLeft />
                Change Payment Method
              </button>

              {/* Card Payment */}
              {selectedMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({
                        ...cardDetails, 
                        number: formatCardNumber(e.target.value)
                      })}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({
                          ...cardDetails, 
                          expiry: formatExpiry(e.target.value)
                        })}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="password"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({
                          ...cardDetails, 
                          cvv: e.target.value.replace(/\D/g, '').slice(0, 3)
                        })}
                        placeholder="123"
                        maxLength={3}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({
                        ...cardDetails, 
                        name: e.target.value
                      })}
                      placeholder="Name as on card"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* UPI Payment */}
              {selectedMethod === 'upi' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      UPI ID
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="yourname@paytm"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FaQrcode className="text-blue-500 text-xl" />
                      <div>
                        <div className="font-medium">Scan QR Code</div>
                        <div className="text-sm text-gray-600">
                          Or use any UPI app to scan and pay
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Net Banking */}
              {selectedMethod === 'netbanking' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Your Bank
                  </label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="Select bank"
                  >
                    <option value="">Choose your bank</option>
                    {popularBanks.map((bank) => (
                      <option key={bank} value={bank}>{bank}</option>
                    ))}
                  </select>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                  <FaExclamationTriangle />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
                <FaShieldAlt className="text-green-500" />
                <div className="text-sm">
                  <div className="font-medium">Secure Payment</div>
                  <div className="text-gray-600">256-bit SSL encrypted transaction</div>
                </div>
              </div>

              <button
                onClick={handlePayment}
                className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <FaLock />
                Pay <FaRupeeSign className="inline" />{amount.toLocaleString()}
              </button>
            </div>
          )}

          {/* Step 3: Processing */}
          {step === 'processing' && (
            <div className="text-center py-8">
              <FaSpinner className="text-4xl text-blue-500 mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-semibold mb-2">Processing Payment</h3>
              <p className="text-gray-600 mb-4">{processingMessage}</p>
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <FaExclamationTriangle />
                  <span className="text-sm">Please do not close this window</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheck className="text-2xl text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-green-600 mb-2">Payment Successful!</h3>
              <p className="text-gray-600 mb-4">
                Your booking for {propertyType} has been confirmed.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Transaction ID:</span>
                    <span className="font-mono">{transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount Paid:</span>
                    <span><FaRupeeSign className="inline" />{amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Order ID:</span>
                    <span className="font-mono">{orderId}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Done
              </button>
            </div>
          )}

          {/* Step 5: Failure */}
          {step === 'failure' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTimes className="text-2xl text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-red-600 mb-2">Payment Failed</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setStep('details');
                    setError('');
                  }}
                  className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="w-full bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;