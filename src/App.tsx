import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, HelpCircle, ShieldCheck, Heart, UserCheck, MessageCircle } from 'lucide-react';
import AestheticBackground from './components/AestheticBackground';
import HomeView from './components/HomeView';
import BookingView from './components/BookingView';
import FAQView from './components/FAQView';
import AdminView from './components/AdminView';
import LookupView from './components/LookupView';

import { Reservation, AdminConfig } from './types';
import { INITIAL_ADMIN_CONFIG, INITIAL_RESERVATIONS } from './initialData';

export default function App() {
  // Navigation Route state: 'home' | 'booking' | 'faq' | 'admin' | 'lookup'
  const [view, setView] = useState<'home' | 'booking' | 'faq' | 'admin' | 'lookup'>('home');

  // Load configuration state from localStorage if available, else load initial
  const [adminConfig, setAdminConfig] = useState<AdminConfig>(() => {
    const saved = localStorage.getItem('wee_class_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.settings) {
          if (
            parsed.settings.location === '본관 3층 2-3 건너편' || 
            parsed.settings.location === '본관 2층 도서실 옆' || 
            parsed.settings.location === '본관 2층 도서실 옆 Wee클래스 상담실' || 
            parsed.settings.location === '본관 3층 복도 끝' || 
            parsed.settings.location === '본관 3층 복도 끝 Wee클래스 상담실' || 
            !parsed.settings.location
          ) {
            parsed.settings.location = '본관 3층 복도 끝 Wee클래스 상담실';
          }
          if (parsed.settings.counselorName === '박다현' || parsed.settings.counselorName === '박다현 Wee클래스 전문상담교사' || parsed.settings.counselorName.includes('김정화') || !parsed.settings.counselorName) {
            parsed.settings.counselorName = '02-6495-4605';
          }
          if (!parsed.settings.workingHours || parsed.settings.workingHours.includes('08:00') || parsed.settings.workingHours.includes('09:00') || parsed.settings.workingHours.length === 9) {
            parsed.settings.workingHours = ['8:30', '9:30', '10:30', '11:40', '12:10', '13:10', '14:10', '15:10'];
          }
        }
        
        // Clean up '너의 이야기를 들려줘' and '너의 이야기를 들려줘♡'
        const cleanupRegex = /너의 이야기를 들려줘♡?/g;
        const cleanupRegex2 = /너의 이야기를 들려줘/g;
        if (parsed.heroSubtitle && typeof parsed.heroSubtitle === 'string') {
          let updatedSubtitle = parsed.heroSubtitle.replace(cleanupRegex, '').replace(cleanupRegex2, '').trim();
          if (updatedSubtitle === '' || updatedSubtitle.includes('마음의 짐을 내려놓고, 잠시 쉬어가는 따뜻한 쉼터입니다')) {
            updatedSubtitle = '마음의 짐을 내려놓고, 잠시 쉬어가는 따뜻한 쉼터입니다.☘️';
          }
          parsed.heroSubtitle = updatedSubtitle;
        }
        if (parsed.heroTitle && typeof parsed.heroTitle === 'string') {
          parsed.heroTitle = parsed.heroTitle.replace(cleanupRegex, '').trim();
          if (parsed.heroTitle === '') {
            parsed.heroTitle = '서울정화고 Wee클래스';
          }
        }
        if (parsed.announcement && typeof parsed.announcement === 'string') {
          parsed.announcement = parsed.announcement.replace(cleanupRegex, '').trim();
        }
        if (parsed.dailyQuote && parsed.dailyQuote.text && typeof parsed.dailyQuote.text === 'string') {
          parsed.dailyQuote.text = parsed.dailyQuote.text.replace(cleanupRegex, '').trim();
        }

        // Migrate default announcement to the new one
        if (parsed.announcement && (parsed.announcement.includes('기말고사') || parsed.announcement.includes('6월 첫째 주') || parsed.announcement.trim() === '')) {
          parsed.announcement = 'Wee 클래스는 항상 열려 있습니다. 환영해요!';
        }

        // Migrate faq list questions and answers to match the latest values
        if (parsed.faqList && Array.isArray(parsed.faqList)) {
          parsed.faqList = parsed.faqList.map((faq: any) => {
            if (faq.id === 'faq-1') {
              faq.answer = "메인 화면의 '상담 신청하기'를 통해 원하는 날짜와 교시(시간)들을 선택하고 간단한 정보를 입력하면 신청 완료됩니다! 상담 확정은 알림 문자 등이 전송되지 않고, 상단의 '예약 확인' 메뉴를 통해 설정한 이름과 비밀번호로 스스로 확인하실 수 있습니다.";
            }
            if (faq.id === 'faq-4' && faq.question === '친구와 같이 가거나 또래 상담을 받을 수 있나요?') {
              faq.question = '또래 상담을 받을 수 있나요?';
            }
            if (faq.id === 'faq-5' && (faq.answer.includes('[K-CDI') || faq.answer.includes('양육 태도') || faq.answer.includes('성격 유형') || faq.answer.includes('Wee클래스에서는 자기 이해'))) {
              faq.answer = "STS 6요인 기질검사, GOLDEN 성격유형검사, CST-A 성격강점검사 및 K-CDI 아동우울척도 등 학생 중심의 가벼운 탐색 도구들이 마련되어 있습니다. 예약 시 '심리 검사 신청' 유형을 체크하시면 맞춤형 검사지와 해석 상담을 준비해 드립니다.";
            }
            if (faq.answer && faq.answer.includes('일정을 배정해 주어야')) {
              faq.answer = "네, 괜찮습니다! 완전 익명으로 예약을 원하시면 이름 항목에 닉네임을 쓰고 '익명 체크박스'를 켜서 신청해 주세요. 본 위클래스 내부 기록 역시 익명으로 보호됩니다.";
            }
            return faq;
          });
        }

        return parsed;
      } catch (e) {
        console.error('Failed to parse config from localStorage', e);
      }
    }
    return INITIAL_ADMIN_CONFIG;
  });

  // Load reservations from localStorage if available, else load preseeded
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem('wee_class_reservations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse reservations from localStorage', e);
      }
    }
    return INITIAL_RESERVATIONS;
  });

  // Save config state updates
  useEffect(() => {
    localStorage.setItem('wee_class_config', JSON.stringify(adminConfig));
  }, [adminConfig]);

  // Save reservations state updates
  useEffect(() => {
    localStorage.setItem('wee_class_reservations', JSON.stringify(reservations));
  }, [reservations]);

  // Action: Add new reservation
  const handleAddReservation = (newRes: Omit<Reservation, 'id' | 'status' | 'createdAt'>) => {
    const created: Reservation = {
      ...newRes,
      id: `res-user-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setReservations((prev) => [created, ...prev]);
  };

  // Action: Update existing reservation (change status, add teacher notes)
  const handleUpdateReservation = (updated: Reservation) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === updated.id ? updated : r))
    );
  };

  // Action: Delete a reservation from state
  const handleDeleteReservation = (id: string) => {
    setReservations((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <AestheticBackground>
      {/* Dynamic Nav Header Bar */}
      <nav id="master-nav-bar" className="sticky top-0 z-40 bg-white/40 backdrop-blur-md border-b border-[#D4E9EC]">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          
          {/* Logo Brand Title */}
          <button
            onClick={() => setView('home')}
            className="flex items-center gap-1.5 sm:gap-3 group text-left focus:outline-none"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#FFD1D1] rounded-full flex items-center justify-center shadow-sm shrink-0 group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <div>
              <span className="block font-black text-[11px] xs:text-xs sm:text-sm md:text-base tracking-tight bg-gradient-to-r from-[#FFA6B7] to-[#B5A5F8] bg-clip-text text-transparent">
                서울정화고 Wee클래스
              </span>
              <span className="block text-[8px] sm:text-[9px] font-extrabold text-[#9BBCC2] uppercase tracking-wider">
                Wee Class Online Center
              </span>
            </div>
          </button>

          {/* Nav Buttons Row */}
          <div className="flex items-center gap-1 xs:gap-1.5 md:gap-3 shrink-0">
            <button
              onClick={() => setView('home')}
              className={`px-1.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-[10px] xs:text-xs md:text-sm font-black transition-all cursor-pointer ${
                view === 'home'
                  ? 'bg-[#FF8E8E] text-white shadow-sm'
                  : 'text-[#4A6D73] hover:text-[#334E52] hover:bg-[#D4E9EC]/50'
              }`}
            >
              홈
            </button>
            
            <button
              onClick={() => setView('booking')}
              className={`px-1.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-[10px] xs:text-xs md:text-sm font-black transition-all cursor-pointer ${
                view === 'booking'
                  ? 'bg-[#FF8E8E] text-white shadow-sm'
                  : 'text-[#4A6D73] hover:text-[#334E52] hover:bg-[#D4E9EC]/50'
              }`}
            >
              예약하기
            </button>

            <button
              onClick={() => setView('faq')}
              className={`px-1.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-[10px] xs:text-xs md:text-sm font-black transition-all cursor-pointer ${
                view === 'faq'
                  ? 'bg-[#FF8E8E] text-white shadow-sm'
                  : 'text-[#4A6D73] hover:text-[#334E52] hover:bg-[#D4E9EC]/50'
              }`}
            >
              이용안내
            </button>

            {/* Separator */}
            <span className="h-4 w-px bg-[#D4E9EC]" />

            {/* Student Self Verification Status Tab */}
            <button
              onClick={() => setView('lookup')}
              className={`px-1.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-[10px] xs:text-xs md:text-sm font-black transition-all cursor-pointer flex items-center gap-1 ${
                view === 'lookup'
                  ? 'bg-[#FF8E8E] text-white shadow-sm'
                  : 'text-[#4A6D73] hover:text-[#334E52] hover:bg-[#D4E9EC]/50'
              }`}
            >
              <span>예약확인</span>
              <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-ping hidden sm:block" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container Views Wrapper */}
      <main className="min-h-[calc(100vh-140px)] pb-20 pt-4">
        {view === 'home' && (
          <HomeView
            adminConfig={adminConfig}
            onNavigate={setView}
          />
        )}

        {view === 'booking' && (
          <BookingView
            adminConfig={adminConfig}
            reservations={reservations}
            onSubmitReservation={handleAddReservation}
            onNavigate={setView}
          />
        )}

        {view === 'faq' && (
          <FAQView
            adminConfig={adminConfig}
            onNavigate={setView}
          />
        )}

        {view === 'admin' && (
          <AdminView
            adminConfig={adminConfig}
            reservations={reservations}
            onUpdateConfig={setAdminConfig}
            onUpdateReservation={handleUpdateReservation}
            onDeleteReservation={handleDeleteReservation}
            onNavigate={setView}
          />
        )}

        {view === 'lookup' && (
          <LookupView
            reservations={reservations}
            onNavigate={setView}
          />
        )}
      </main>

      {/* Footer Branding Area */}
      <footer className="border-t border-[#FFD1D1]/30 bg-white/40 backdrop-blur-sm py-8 text-center text-xs text-[#9BBCC2] font-semibold relative z-10 font-sans">
        <div className="max-w-5xl mx-auto px-4 space-y-2">
          <div className="flex justify-center items-center gap-1.5 text-[#4A6D73]">
            <Heart size={14} className="fill-[#FF8E8E] text-[#FF8E8E]" />
            <span className="bg-gradient-to-r from-[#FFA6B7] to-[#B5A5F8] bg-clip-text text-transparent font-extrabold">서울정화고등학교 Wee클래스 전문상담실</span>
          </div>
          <p className="leading-relaxed text-[#4A6D73]/80 font-bold">
            서울시 동대문구 홍릉로 15길 50 | TEL: 02-6495-4605 | 운영시간: 평일 08:00 ~ 16:00 (점심시간 상시 상담 운영)
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-center mt-3 pt-3 border-t border-[#FFD1D1]/15 text-[10px] text-[#9BBCC2]/60 gap-1 font-semibold">
            <span>© 2026 Seoul Jeonghwa High School Wee Class. All Rights Reserved. All student counselling records are strictly guarded.</span>
            <button
              onClick={() => setView('admin')}
              className="hover:text-[#4A6D73] flex items-center gap-1 transition-colors outline-none cursor-pointer text-[#9BBCC2]/40 shrink-0 font-bold"
              title="관리자 포탈"
            >
              <span>🔑 교사용 본부</span>
            </button>
          </div>
        </div>
      </footer>
    </AestheticBackground>
  );
}
