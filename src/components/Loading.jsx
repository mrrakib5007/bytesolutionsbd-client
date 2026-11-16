'use client';

import React from 'react';
import { LuLoader } from 'react-icons/lu';

const Loading = ({ text = "Loading...", className = "py-16" }) => {
  return (    
    <div className={`flex flex-col justify-center items-center ${className}`}>
        <LuLoader className="w-8 h-8 animate-spin text-(--primary)" /> 
        <p className="mt-3 text-sm text-slate-500">{text}</p>
    </div>
  );
};

export default Loading;
