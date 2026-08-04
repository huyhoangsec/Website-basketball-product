import React from "react";
import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const sizeMap = {
    sm: { icon: "w-8 h-8", text: "text-sm md:text-base", subtext: "text-[9px]" },
    md: { icon: "w-10 h-10 md:w-12 md:h-12", text: "text-base md:text-xl", subtext: "text-[10px] md:text-xs" },
    lg: { icon: "w-14 h-14 md:w-16 md:h-16", text: "text-xl md:text-2xl", subtext: "text-xs md:text-sm" },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 group ${className}`}>
      <div className={`relative ${currentSize.icon} flex-shrink-0 transition-transform duration-300 group-hover:scale-105 filter drop-shadow-md`}>
        <Image
          src="/images/logo.svg"
          alt="OceanBasketball Logo"
          width={64}
          height={64}
          className="w-full h-full object-contain"
          priority
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-extrabold text-white ${currentSize.text} leading-tight tracking-wide font-display`}>
            OCEAN<span className="text-orange">BASKETBALL</span>
          </span>
          <span className={`${currentSize.subtext} text-slate-300 font-medium tracking-widest uppercase opacity-90`}>
            Vinhomes Ocean Park
          </span>
        </div>
      )}
    </div>
  );
}
