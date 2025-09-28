'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface OtpInputProps {
  value: string;
  onChange: (otp: string) => void;
  onVerify?: (otp: string) => void;
  onComplete?: (otp: string) => void;
  error?: boolean;
  success?: boolean;
  loading?: boolean;
  length?: number;
  className?: string;
  statusMessage?: string;
  statusType?: 'error' | 'success' | 'timer' | 'info' | '';
  statusBoxColor?: {
    bg?: string;
    border?: string;
    text?: string;
  };
  errorHighlightDuration?: number;
  errorMessageDuration?: number;
  placeholder?: string;
  disabled?: boolean;
  role?: 'user' | 'owner' | 'admin';
  focusOnErrorTrigger?: any;
  errorTrigger?: number; // Counter to trigger error processing
  allowAlphanumeric?: boolean;
  locked?: boolean;
  autoSubmitOnComplete?: boolean;
  onAutoSubmit?: (otp: string) => void;
  direction?: 'ltr' | 'rtl';
  i18n?: Record<string, string>;
  otpCreatedAt?: number | null;
  expirySeconds?: number;
  autoClearOnError?: boolean;
  disableOnError?: boolean;
  hideDigitsOnError?: boolean;
  hideTimerOnMaxAttempts?: boolean; // Hide timer when max attempts reached
  maxAttempts?: number;
  onMaxAttemptsReached?: () => void;
  onResendOtp?: () => void;
}

/**
 * OtpInput Component
 * Features:
 * - Custom length (default 6)
 * - Digit-only or alphanumeric, auto-focus, paste support
 * - Dynamic box coloring: green (all correct), red (all error), green (filled), red (focused), gray (empty)
 * - Real-time verification: calls onVerify(otp) when all digits entered
 * - onComplete callback: fires when all digits filled
 * - Visual feedback: all boxes green on success, all red on error
 * - Error/success auto-reset on change
 * - Input type="tel" for mobile (or text for alphanumeric)
 * - Auto-select on focus
 * - Timer functionality with OTP expiry
 * - Auto-clear on error
 * - Paste animation feedback
 * - Tooltip on hover
 * - Role-based styling
 */
const OtpInput: React.FC<OtpInputProps> = ({
  value = '',
  onChange,
  onVerify,
  onComplete,
  error = false,
  success = false,
  loading = false,
  length = 6,
  className = '',
  statusMessage = '',
  statusType = '',
  statusBoxColor = {},
  errorHighlightDuration = 1200,
  errorMessageDuration = 5000,
  placeholder = '●',
  disabled = false,
  role = 'user',
  focusOnErrorTrigger,
  errorTrigger,
  allowAlphanumeric = false,
  locked: lockedProp = false,
  autoSubmitOnComplete = false,
  onAutoSubmit,
  direction = 'ltr',
  i18n = {},
  otpCreatedAt = null,
  expirySeconds = 300,
  autoClearOnError = true,
  disableOnError = true,
  hideDigitsOnError = true,
  maxAttempts = 5, // Updated default to be more user-friendly
  onMaxAttemptsReached,
  onResendOtp,
  hideTimerOnMaxAttempts = false,
}) => {
  // Local state for error display duration and timer
  const [showLocalError, setShowLocalError] = useState(false);
  const [localErrorMsg, setLocalErrorMsg] = useState('');
  const [timerMessage, setTimerMessage] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isDisabledByAttempts, setIsDisabledByAttempts] = useState(false);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Reset component state when external conditions change
  useEffect(() => {
    setFailedAttempts(0);
    setIsDisabledByAttempts(false);
    currentFailedAttemptsRef.current = 0; // Reset ref too
  }, [maxAttempts]); // Reset when maxAttempts changes (like component remount)

  // Timer calculation logic
  useEffect(() => {
    if (!otpCreatedAt || !expirySeconds) {
      setTimerMessage('');
      return;
    }
    
    function getTimeLeft() {
      const now = Date.now();
      const expiry = Number(otpCreatedAt) + expirySeconds * 1000;
      const diff = Math.max(0, Math.floor((expiry - now) / 1000));
      return diff;
    }
    
    function formatTime(sec: number) {
      const m = Math.floor(sec / 60).toString().padStart(2, '0');
      const s = (sec % 60).toString().padStart(2, '0');
      return `${m}:${s}`;
    }
    
    // Update timer every second
    const update = () => {
      const left = getTimeLeft();
      if (left > 0) setTimerMessage(`OTP will expire in ${formatTime(left)}`);
      else setTimerMessage('');
    };
    update();
    timerIntervalRef.current = setInterval(update, 1000);
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [otpCreatedAt, expirySeconds]);

  // Whenever error statusMessage/statusType comes, show error for 5s, then show timer
  const prevErrorStateRef = useRef(false);
  useEffect(() => {
    // Only show error message box for full errorMessageDuration when error prop transitions from false to true
    if ((error || statusType === 'error') && !prevErrorStateRef.current && statusMessage) {
      setShowLocalError(true);
      setLocalErrorMsg(statusMessage);
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
      
      // Don't auto-hide error if it's max attempts reached message
      const isMaxAttemptsMessage = statusMessage.includes('Maximum') && statusMessage.includes('attempts reached');
      
      if (!isMaxAttemptsMessage) {
        errorTimeoutRef.current = setTimeout(() => {
          setShowLocalError(false);
        }, errorMessageDuration);
      }
    }
    prevErrorStateRef.current = error || statusType === 'error';
  }, [error, statusType, statusMessage, errorMessageDuration]);

  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  // On resend OTP (otpCreatedAt change), focus first box
  useEffect(() => {
    if (otpCreatedAt) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [otpCreatedAt]);
  
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  // Local state to auto-reset error/success on change
  const [localError, setLocalError] = useState(false);
  const [localSuccess, setLocalSuccess] = useState(false);
  const [errorTimerActive, setErrorTimerActive] = useState(false); // Track if error timer is running

  // Red highlight timer + auto-focus first box on error + auto-clear input
  const prevErrorRef = useRef(false);
  const onChangeRef = useRef(onChange);
  const onMaxAttemptsReachedRef = useRef(onMaxAttemptsReached); // Use ref for callback
  const maxAttemptsReachedRef = useRef(false); // Track if max attempts callback already called
  const errorProcessingRef = useRef(false); // Prevent multiple error processing
  const currentFailedAttemptsRef = useRef(0); // Track current failed attempts
  const valueRef = useRef(value); // Track value without causing re-renders
  onChangeRef.current = onChange; // Always keep current onChange reference
  onMaxAttemptsReachedRef.current = onMaxAttemptsReached; // Always keep current callback reference
  valueRef.current = value; // Always keep current value reference

  // Reset refs when component conditions change
  useEffect(() => {
    maxAttemptsReachedRef.current = false;
    errorProcessingRef.current = false;
    prevErrorRef.current = false;
    currentFailedAttemptsRef.current = 0; // Reset failed attempts ref
  }, [maxAttempts, value === '']); // Reset when maxAttempts changes or OTP is cleared

  useEffect(() => {
    // Only trigger red highlight when error transitions from false to true AND not already disabled
    if ((error || statusType === 'error') && !prevErrorRef.current && !errorProcessingRef.current && !maxAttemptsReachedRef.current && !isDisabledByAttempts) {
      errorProcessingRef.current = true; // Mark as processing
      
      // Increment failed attempts counter
      setFailedAttempts(prev => {
        const newFailedAttempts = prev + 1;
        currentFailedAttemptsRef.current = newFailedAttempts; // Update ref
        
        // Check if max attempts reached - only call once
        if (newFailedAttempts >= maxAttempts && !maxAttemptsReachedRef.current) {
          setIsDisabledByAttempts(true);
          maxAttemptsReachedRef.current = true; // Mark as called
          
          // Defer the callback to avoid render cycle issues
          if (onMaxAttemptsReachedRef.current) {
            setTimeout(() => {
              onMaxAttemptsReachedRef.current?.();
            }, 0);
          }
        }
        
        // Focus first input after short delay (only if not disabled)
        if (newFailedAttempts < maxAttempts) {
          setTimeout(() => {
            inputRefs.current[0]?.focus();
          }, 120);
        }
        
        return newFailedAttempts;
      });
      
      setLocalError(true);
      setErrorTimerActive(true); // Mark timer as active
      
      // Reset red highlight after errorHighlightDuration (default 1200ms)
      // Also clear input and focus first box at the same time
      const t = setTimeout(() => {
        setLocalError(false);
        setErrorTimerActive(false); // Mark timer as inactive
        errorProcessingRef.current = false; // Reset processing flag
        
        // Clear input and focus first box after red highlight ends (only if not disabled)
        if (autoClearOnError && valueRef.current && valueRef.current.length > 0 && currentFailedAttemptsRef.current < maxAttempts) {
          onChangeRef.current(''); // Clear the OTP input
          
          // Focus first input after clearing
          setTimeout(() => {
            inputRefs.current[0]?.focus();
          }, 50); // Small delay after clear
        }
      }, errorHighlightDuration);
      return () => {
        clearTimeout(t);
        setErrorTimerActive(false);
        errorProcessingRef.current = false;
      };
    }
    prevErrorRef.current = error || statusType === 'error';
  }, [error, statusType, errorHighlightDuration, autoClearOnError, maxAttempts, isDisabledByAttempts]);

  // Focus first input when focusOnErrorTrigger changes (used for error highlight/focus)
  useEffect(() => {
    if (error && focusOnErrorTrigger !== undefined) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [focusOnErrorTrigger, error]);

  // Handle external error trigger (when RegisterForm gets API error)
  useEffect(() => {
    if (errorTrigger && errorTrigger > 0 && error) {
      // Force error processing by resetting the flag first
      errorProcessingRef.current = false;
      prevErrorRef.current = false;
      
      // Small delay to ensure state is updated
      setTimeout(() => {
        // This will trigger the main error useEffect
        prevErrorRef.current = false;
      }, 10);
    }
  }, [errorTrigger, error]);

  // Reset failed attempts when new OTP is requested (when value becomes empty or otpCreatedAt changes)
  useEffect(() => {
    if (value === '' || otpCreatedAt) {
      setFailedAttempts(0);
      setIsDisabledByAttempts(false);
      maxAttemptsReachedRef.current = false; // Reset the flag when new OTP requested
      errorProcessingRef.current = false; // Reset processing flag
    }
  }, [value, otpCreatedAt]);
  
  // External error/success sync - but don't override timer-controlled localError
  useEffect(() => {
    // Only sync external error if we're not in the middle of error timer
    if (error && !errorTimerActive) {
      setLocalError(true);
    } else if (!error && !errorTimerActive) {
      setLocalError(false);
    }
    
    if (success) setLocalSuccess(true);
    else setLocalSuccess(false);
  }, [error, success, errorTimerActive]);

  // Success state management - show green for longer duration
  const prevSuccessRef = useRef(false);
  useEffect(() => {
    // When success transitions from false to true
    if (success && !prevSuccessRef.current) {
      setLocalSuccess(true);
      // Reset failed attempts on success
      setFailedAttempts(0);
      setIsDisabledByAttempts(false);
      // Keep success state for longer (don't auto-reset)
    }
    prevSuccessRef.current = success;
  }, [success]);

  // Paste feedback animation
  const [pasteAnim, setPasteAnim] = useState(false);

  // Auto-reset error/success on any change (but not immediately for success)
  // Don't reset localError if error timer is active - let the timer handle it
  useEffect(() => {
    // Only reset localError if timer is not active AND not processing error
    if (localError && !errorTimerActive && !errorProcessingRef.current) {
      setLocalError(false);
    }
    // Don't auto-reset success - let it stay green until form submission
  }, [localError, errorTimerActive]); // Remove value dependency to avoid conflicts

  // Reset localError when user starts typing again (only if timer not active)
  useEffect(() => {
    if (value && value.length > 0 && localError && !errorTimerActive && !errorProcessingRef.current) {
      setLocalError(false);
    }
  }, [value, localError, errorTimerActive]);

  // Real-time verification and onComplete
  useEffect(() => {
    const valid = allowAlphanumeric
      ? value.length === length && /^[a-zA-Z0-9]+$/.test(value)
      : value.length === length && /^\d+$/.test(value);
    if (valid) {
      if (onComplete) onComplete(value);
      if (onVerify) onVerify(value);
      if (autoSubmitOnComplete && onAutoSubmit) onAutoSubmit(value);
    }
  }, [value, length, onVerify, onComplete, autoSubmitOnComplete, onAutoSubmit, allowAlphanumeric]);

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  // Handle paste event with feedback
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    let pasted = e.clipboardData.getData('text');
    pasted = allowAlphanumeric
      ? pasted.replace(/[^a-zA-Z0-9]/g, '').slice(0, length)
      : pasted.replace(/\D/g, '').slice(0, length);
    if (pasted.length > 0) {
      onChangeRef.current(pasted.padEnd(length, ''));
      // Focus next empty or last
      const nextIndex = Math.min(pasted.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
      setPasteAnim(true);
      setTimeout(() => setPasteAnim(false), 400);
    }
  }, [allowAlphanumeric, length]); // Removed onChange from deps

  // Handle input change
  const handleInputChange = useCallback((i: number, v: string) => {
    if (v !== '' && !(allowAlphanumeric ? /^[a-zA-Z0-9]$/.test(v) : /^[0-9]$/.test(v))) return;
    const arr = value.split('');
    arr[i] = v;
    onChangeRef.current(arr.join('').slice(0, length));
    if (v && i < length - 1) inputRefs.current[i + 1]?.focus();
  }, [value, length, allowAlphanumeric]); // Removed onChange from deps

  // Handle keydown for backspace and tab
  const handleKeyDown = useCallback((i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && i < length - 1) {
      inputRefs.current[i + 1]?.focus();
    }
    // Tab/Shift+Tab handled by browser
  }, [value, length]);

  // Auto-select on focus
  const handleFocus = useCallback((i: number, e: React.FocusEvent<HTMLInputElement>) => {
    setFocusedIndex(i);
    e.target.select();
  }, []);

  // Determine if OTP is expired
  const isOtpExpired = otpCreatedAt && expirySeconds && (Date.now() > Number(otpCreatedAt) + expirySeconds * 1000);
  const locked = lockedProp || isOtpExpired;
  const isDisabled = disabled || locked || isDisabledByAttempts;

  // Calculate dynamic width class based on message length
  const getDynamicWidthClass = (messageLength: number) => {
    if (messageLength <= 20) return 'w-48';  // 192px
    if (messageLength <= 35) return 'w-64';  // 256px
    if (messageLength <= 50) return 'w-80';  // 320px
    if (messageLength <= 65) return 'w-96';  // 384px
    return 'w-full max-w-md';  // 448px max
  };

  // Tooltip message logic
  let tooltipMsg = '';
  if (isDisabledByAttempts) tooltipMsg = `Too many attempts. Resend OTP to continue.`;
  else if (locked) tooltipMsg = 'OTP expired. Please resend.';
  else if (loading) tooltipMsg = 'Please wait...';
  else tooltipMsg = 'Enter OTP';

  return (
    <div className={`flex flex-col items-center relative ${className}`} dir={direction}>
      <div className={`flex justify-center space-x-2 w-full ${pasteAnim ? 'animate-shake' : ''}`}>
        {[...Array(length)].map((_, i) => {
          // Only disable/hide digits if error message is 'OTP expired. Please resend.'
          const isExpiredError = showLocalError && localErrorMsg === 'OTP expired. Please resend.';
          
          return (
            <div key={i} className="relative group">
              <input
                ref={el => { inputRefs.current[i] = el; }}
                type={allowAlphanumeric ? 'text' : 'tel'}
                maxLength={1}
                value={
                  isExpiredError
                    ? ''
                    : value[i] || ''
                }
                onFocus={e => handleFocus(i, e)}
                onBlur={() => setFocusedIndex(-1)}
                onChange={e => handleInputChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                onPaste={i === 0 ? handlePaste : undefined}
                autoComplete="one-time-code"
                inputMode={allowAlphanumeric ? 'text' : 'numeric'}
                pattern={allowAlphanumeric ? '[a-zA-Z0-9]*' : '[0-9]*'}
                aria-label={`OTP digit ${i + 1}`}
                className={`w-10 h-10 text-center text-lg font-bold border-2 rounded-lg focus:outline-none transition-all duration-200
                  ${(localError || error) && !errorTimerActive
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : (localError || error) && errorTimerActive
                    ? 'border-red-500 bg-red-50 text-red-700 cursor-not-allowed'
                    : localSuccess || success
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : isDisabled || (disableOnError && isExpiredError)
                    ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : value[i]
                    ? 'border-green-500 bg-green-50 text-gray-900'
                    : focusedIndex === i
                    ? 'border-red-500 bg-red-50 text-gray-900'
                    : 'border-gray-300 bg-gray-50 text-gray-900'}
                `}
                placeholder={placeholder}
                disabled={loading || isDisabled || (disableOnError && isExpiredError) || errorTimerActive}
                autoCapitalize="off"
                spellCheck={false}
              />
              {/* Tooltip on hover */}
              <div className="absolute left-1/2 -translate-x-1/2 -top-8 z-20 hidden group-hover:block pointer-events-none">
                <span className="bg-gray-900 text-white text-xs rounded px-2 py-1 shadow-lg whitespace-nowrap opacity-90">
                  {tooltipMsg}
                </span>
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="absolute flex items-center justify-center w-full h-full pointer-events-none top-0 left-0">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
          </div>
        )}
      </div>
      
      {/* Status Message Box (error/success/timer/info) - always below input, centered, no overlap */}
      {(showLocalError && localErrorMsg) ? (
        <div className="mt-2 flex items-center justify-center w-full relative min-h-8">
          <div
            className={`shadow-sm flex items-center justify-center rounded-md py-1 px-4 ${getDynamicWidthClass(localErrorMsg.length)}
              ${statusBoxColor.bg ? statusBoxColor.bg : 'bg-red-50'}
              ${statusBoxColor.border ? statusBoxColor.border : 'border border-red-200'}
            `}
            aria-live="polite"
          >
            <p className={`text-xs font-medium text-center px-2
              ${statusBoxColor.text ? statusBoxColor.text : 'text-red-600'}
            `}>
              {localErrorMsg}
            </p>
          </div>
        </div>
      ) : (!showLocalError && !hideTimerOnMaxAttempts && (timerMessage || (otpCreatedAt && expirySeconds && timerMessage === ''))) ? (
        <div className="mt-2 flex items-center justify-center w-full relative min-h-8">
          {timerMessage ? (
            <div className={`py-1 px-4 ${getDynamicWidthClass(timerMessage.length)}`}>
              <p className="text-xs font-medium text-center px-2 text-gray-500" aria-live="polite">
                {timerMessage}
              </p>
            </div>
          ) : (
            <div className={`py-1 px-4 ${getDynamicWidthClass('OTP expired. Please resend.'.length)}`}>
              <p className="text-xs font-medium text-center px-2 text-red-600" aria-live="polite">
                OTP expired. Please resend.
              </p>
            </div>
          )}
        </div>
      ) : (statusMessage && statusType !== 'error') ? (
        <div className="mt-2 flex items-center justify-center w-full relative min-h-8">
          <div
            className={`shadow-sm flex items-center justify-center rounded-md py-1 px-4 ${getDynamicWidthClass(statusMessage.length)}
              ${statusBoxColor.bg ? statusBoxColor.bg :
                statusType === 'success' ? 'bg-green-50' :
                'bg-gray-50'}
              ${statusBoxColor.border ? statusBoxColor.border :
                statusType === 'success' ? 'border border-green-200' :
                'border border-gray-200'}
            `}
            aria-live="polite"
          >
            <p className={`text-xs font-medium text-center px-2
              ${statusBoxColor.text ? statusBoxColor.text :
                statusType === 'success' ? 'text-green-600' :
                'text-gray-600'}
            `}>
              {statusMessage}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default OtpInput;
