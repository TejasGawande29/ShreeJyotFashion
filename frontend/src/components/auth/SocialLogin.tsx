import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebookF } from 'react-icons/fa';

interface SocialLoginProps {
  onGoogleLogin?: () => void;
  onFacebookLogin?: () => void;
  text?: 'login' | 'signup';
}

export default function SocialLogin({ 
  onGoogleLogin, 
  onFacebookLogin,
  text = 'login' 
}: SocialLoginProps) {
  const actionText = text === 'login' ? 'Sign in' : 'Sign up';

  const handleGoogleLogin = () => {
    if (onGoogleLogin) {
      onGoogleLogin();
    } else {
      // Mock Google OAuth - In production, this would trigger actual OAuth flow
      console.log('Google OAuth login initiated');
      alert('Google login would be triggered here. Backend integration required.');
    }
  };

  const handleFacebookLogin = () => {
    if (onFacebookLogin) {
      onFacebookLogin();
    } else {
      // Mock Facebook OAuth - In production, this would trigger actual OAuth flow
      console.log('Facebook OAuth login initiated');
      alert('Facebook login would be triggered here. Backend integration required.');
    }
  };

  return (
    <div className="space-y-3">
      {/* Google Login */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
      >
        <FcGoogle className="w-5 h-5" />
        <span className="text-gray-700 font-medium">
          {actionText} with Google
        </span>
      </button>

      {/* Facebook Login */}
      <button
        type="button"
        onClick={handleFacebookLogin}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#1877F2] hover:bg-[#166FE5] rounded-lg transition-colors duration-200"
      >
        <FaFacebookF className="w-5 h-5 text-white" />
        <span className="text-white font-medium">
          {actionText} with Facebook
        </span>
      </button>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">
            Or {text} with email
          </span>
        </div>
      </div>
    </div>
  );
}
