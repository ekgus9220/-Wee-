import React from 'react';

export default function AestheticBackground({ children }: { children: React.ReactNode }) {
  return (
    <div 
      id="aesthetic-bg-root" 
      className="min-h-screen relative overflow-hidden text-[#334E52] font-sans selection:bg-[#FFF2CC] selection:text-[#6B5A3D] transition-colors duration-300"
      style={{
        background: 'linear-gradient(180deg, #EBF6F9 0%, #EBF6F9 58px, #FAF3EC 160px, #FFF9F2 100%)'
      }}
    >
      {/* 2. Sophisticated Pastel Dual-Tone Grid (replaces chunky kitsch dots with warm grid lines) */}
      <div 
        id="aesthetic-grid"
        className="absolute inset-0 pointer-events-none opacity-[0.45] mix-blend-multiply"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 180, 194, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(238, 175, 150, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* 2. Soft Ambient Warm Natural Glows in cozy pink and honey yellow */}
      <div id="ambient-glows" className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Soft Warm Coral/Peach Bubble */}
        <div className="absolute top-[8%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-[#FFE3E8]/50 blur-[130px]" />
        {/* Soft Honey/Warm Peach Bubble */}
        <div className="absolute top-[32%] right-[-8%] w-[48vw] h-[48vw] rounded-full bg-[#FFF4E0]/80 blur-[120px]" />
        {/* Soft Honey/Mellow Yellow Bubble */}
        <div className="absolute bottom-[-5%] left-[10%] w-[35vw] h-[35vw] rounded-full bg-[#FFF8E7]/55 blur-[110px]" />
      </div>

      {/* 3. Floating Natural-toned Clouds (cozy & soft) */}
      <div id="dreamy-clouds" className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Cloud 1 */}
        <div className="absolute top-16 left-[5%] opacity-40 animate-[bounce_10s_infinite_alternate] max-w-[150px] sm:max-w-none">
          <svg width="200" height="90" viewBox="0 0 200 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white drop-shadow-[0_4px_16px_rgba(74,109,115,0.08)]">
            <path d="M40 70C25 70 10 58 10 40C10 22 25 15 40 15C45 15 50 17 55 20C65 8 85 0 105 0C130 0 150 15 155 35C165 30 180 32 188 43C195 52 193 68 180 70H40Z" fill="currentColor"/>
          </svg>
        </div>
        {/* Cloud 2 */}
        <div className="absolute top-[52%] right-[4%] opacity-[0.3] animate-[bounce_12s_infinite_alternate] scale-75 max-w-[150px] sm:max-w-none">
          <svg width="220" height="100" viewBox="0 0 220 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
            <path d="M40 80C20 80 5 65 5 45C5 25 22 18 40 18C44 18 49 19 54 22C64 9 86 0 110 0C138 0 160 18 165 40C178 35 195 38 205 50C215 62 210 78 195 80H40Z" fill="currentColor"/>
          </svg>
        </div>
        {/* Cloud 3 */}
        <div className="absolute bottom-20 left-[6%] opacity-35 animate-[bounce_14s_infinite_alternate-reverse] scale-90 max-w-[150px] sm:max-w-none">
          <svg width="180" height="80" viewBox="0 0 180 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
            <path d="M30 65C17 65 5 54 5 38C5 22 18 15 32 15C36 15 40 16 44 19C52 8 70 0 90 0C113 0 131 15 135 33C144 29 157 31 165 41C172 49 171 63 158 65H30Z" fill="currentColor"/>
          </svg>
        </div>
      </div>

      {/* 4. Natural Accents Hearts (Twinkling & Drifting) */}
      <div id="kitschy-hearts" className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Large Decorative Peach Accent Heart */}
        <div className="absolute top-24 right-[12%] opacity-40 animate-[pulse_6s_infinite] hidden md:block">
          <svg width="45" height="45" viewBox="0 0 24 24" fill="#FFD1D1">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>

        {/* Delicate Heart Outline Mid Left */}
        <div className="absolute top-[35%] left-[16%] opacity-30 animate-[pulse_3.5s_infinite] hidden lg:block">
          <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#4A6D73" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>

        {/* Honey/Yellow Mini Heart */}
        <div className="absolute top-40 left-[40%] opacity-40 animate-[bounce_8s_infinite] scale-75">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFF2CC">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>

        {/* Peach Ribbon Mini Heart */}
        <div className="absolute bottom-[28%] right-[20%] opacity-40 animate-[pulse_4s_infinite] delay-1000">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#FFD1D1">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      </div>

      {/* Main Content Render */}
      <div id="aesthetic-content-wrapper" className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
}
