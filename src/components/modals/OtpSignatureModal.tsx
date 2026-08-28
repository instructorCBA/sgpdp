import React, { useState, useRef, useEffect } from 'react';
import { useCaseContext } from '../../context/CaseContext';

export const OtpSignatureModal: React.FC = () => {
  const { isOtpModalOpen, otpConfig, closeOtpModal, currentUser, showToast } = useCaseContext();
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOtpModalOpen) {
      setDigits(['', '', '', '', '', '']);
      setIsVerifying(false);
      setResendCooldown(60);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 150);
    }
  }, [isOtpModalOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOtpModalOpen && resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpModalOpen, resendCooldown]);

  if (!isOtpModalOpen || !otpConfig) return null;

  const handleDigitChange = (index: number, value: string) => {
    // Only numeric
    const cleanValue = value.replace(/[^0-9]/g, '');
    const newDigits = [...digits];

    if (cleanValue.length > 0) {
      newDigits[index] = cleanValue[cleanValue.length - 1];
      setDigits(newDigits);
      // Advance to next input
      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    } else {
      newDigits[index] = '';
      setDigits(newDigits);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && digits[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (pastedData.length > 0) {
      const newDigits = [...digits];
      for (let i = 0; i < pastedData.length; i++) {
        newDigits[i] = pastedData[i];
      }
      setDigits(newDigits);
      const nextIndex = Math.min(5, pastedData.length);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const isComplete = digits.every(d => d !== '');

  const handleConfirmSignature = () => {
    if (!isComplete) return;

    setIsVerifying(true);
    // Simulate cryptographic verification and SHA generation
    setTimeout(() => {
      const randomHex = Math.random().toString(16).substring(2, 10);
      const signatureHash = `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852${randomHex}`;
      
      otpConfig.onSign(signatureHash);
      setIsVerifying(false);
      closeOtpModal();
      showToast(`Firma electrónica certificada con éxito: ${signatureHash.substring(0, 16)}...`);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn text-white">
      <div className="relative z-10 w-full max-w-lg bg-[#161818] border border-gray-700/80 rounded-2xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#39a900] via-[#50e5f9] to-[#39a900]" />

        {/* Close Button */}
        <button
          type="button"
          onClick={closeOtpModal}
          className="absolute top-5 right-5 text-gray-400 hover:text-white bg-[#252727] w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer"
        >
          ✕
        </button>

        {/* Icon & Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#39a900]/20 border border-[#39a900]/40 text-[#39a900] rounded-2xl mb-3 shadow-[0_0_20px_rgba(57,169,0,0.3)]">
            <span className="material-symbols-outlined text-[28px]">lock_clock</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            {otpConfig.title}
          </h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            {otpConfig.description}
          </p>
        </div>

        {/* User Badge */}
        <div className="p-3 bg-[#121414] border border-gray-800 rounded-xl flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <img 
              src={currentUser.avatarUrl} 
              alt={currentUser.name} 
              className="w-8 h-8 rounded-full object-cover border border-gray-600"
            />
            <div className="text-left">
              <p className="text-xs font-bold text-white leading-none">{currentUser.name}</p>
              <p className="text-[10px] text-gray-400 font-mono mt-0.5">{currentUser.roleTitle}</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-[#39a900] bg-[#39a900]/10 border border-[#39a900]/30 px-2 py-0.5 rounded-full font-semibold">
            Certificador Autorizado
          </span>
        </div>

        {/* 6-Digit OTP Field */}
        <div className="mb-6">
          <label className="block text-center text-xs font-mono text-gray-300 font-semibold mb-3">
            Ingrese el código de seguridad dinámico de 6 dígitos:
          </label>
          <div className="flex justify-center gap-2 sm:gap-3">
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => { inputRefs.current[idx] = el; }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={handlePaste}
                className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-mono font-bold bg-[#121414] border-2 border-gray-700 focus:border-[#39a900] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#39a900]/40 transition-all"
              />
            ))}
          </div>

          <div className="text-center mt-3">
            <p className="text-[11px] text-gray-400 font-mono">
              Código de simulación rápido: <code className="text-[#39a900] font-bold">123456</code>
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="p-3 bg-[#39a900]/10 border border-[#39a900]/30 rounded-xl text-[11px] text-gray-300 mb-6 flex items-start gap-2">
          <span className="material-symbols-outlined text-[#39a900] text-[18px] shrink-0">verified_user</span>
          <p>
            <strong>Human-in-the-Loop Protocol:</strong> La firma digital sella la resolución con estampado cronológico inmutable (SHA-256) cumpliendo con el estándar RNF-02.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={closeOtpModal}
            className="flex-1 py-3 rounded-xl border border-gray-700 text-xs font-semibold text-gray-300 hover:bg-[#252727] transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!isComplete || isVerifying}
            onClick={handleConfirmSignature}
            className={`flex-1 py-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
              isComplete && !isVerifying
                ? 'bg-[#39a900] hover:bg-[#329600] active:scale-98'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-60'
            }`}
          >
            {isVerifying ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Firmando Digitalmente...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">fingerprint</span>
                <span>Firmar Electrónicamente</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
