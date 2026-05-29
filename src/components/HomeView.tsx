import React, { useState } from 'react';
import { Sparkles, Calendar, BookOpen, Heart, Info, ArrowRight, MessageCircle, HelpCircle } from 'lucide-react';
import { AdminConfig } from '../types';

interface HomeViewProps {
  adminConfig: AdminConfig;
  onNavigate: (view: 'home' | 'booking' | 'faq' | 'admin') => void;
}

const MIND_VITAMINS = [
  "오늘 하루도 고생 많았어. 너는 그 자체로 충분히 눈부신 존재야! 🌸",
  "조금 쉬어가도 괜찮아. 네 속도로 걸어가는 것이 가장 나다운 거야. ✨",
  "남들과 비교하지 마세요. 당신만의 특별한 씨앗이 필 준비를 하고 있으니까요. 🌱",
  "마음 약해지지 마, 언제든 이곳 Wee클래스에 털어놓아 주렴. 네 편이 되어줄게. 🧡",
  "오늘 시험이나 친구 관계가 힘들었지? 따뜻한 코코아 한 잔 마시는 것처럼 마음을 달래 보자. ☕"
];

export default function HomeView({ adminConfig, onNavigate }: HomeViewProps) {
  const [vitaminIndex, setVitaminIndex] = useState(0);
  const [showVitamin, setShowVitamin] = useState(false);

  const getNewVitamin = () => {
    const next = (vitaminIndex + 1) % MIND_VITAMINS.length;
    setVitaminIndex(next);
    setShowVitamin(true);
  };

  return (
    <div id="home-view-container" className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Announcement Bar */}
      {adminConfig.announcement && (
        <div id="nav-announcement" className="mb-8 border-2 border-[#FFD1D1] bg-[#FFF9E6] text-[#334E52] rounded-2xl px-5 py-4 flex items-start gap-3 shadow-sm hover:translate-y-[-2px] transition-transform duration-300">
          <span className="text-xl shrink-0 mt-0.5 animate-bounce">📢</span>
          <div className="text-sm md:text-md leading-relaxed">
            <span className="font-bold text-[#FF8E8E] mr-1">[공지사항]</span>
            {adminConfig.announcement}
          </div>
        </div>
      )}

      {/* Hero Welcome Banner Section */}
      <div id="hero-banner" className="relative text-center bg-gradient-to-br from-[#FFF5F6] via-[#FAF3EC] to-[#FFF9F5] rounded-[40px] p-8 md:p-12 mb-8 border-2 border-[#F2DFD3] shadow-xl shadow-[#83665E]/5 relative overflow-hidden transition-all">

        <h1 className="kitsch-bubble-title text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 select-none leading-tight whitespace-pre-line pb-1">
          {adminConfig.heroTitle.includes(' ') ? (
            <>
              {adminConfig.heroTitle.substring(0, adminConfig.heroTitle.indexOf(' '))}
              <br />
              {adminConfig.heroTitle.substring(adminConfig.heroTitle.indexOf(' ') + 1)}
            </>
          ) : (
            adminConfig.heroTitle
          )}
        </h1>
        <p className="text-[#4A6D73] text-base md:text-lg max-w-xl mx-auto leading-relaxed whitespace-pre-line font-medium">
          {adminConfig.heroSubtitle.includes('마음의 짐을 내려놓고,') ? (
            <>
              {adminConfig.heroSubtitle.substring(0, adminConfig.heroSubtitle.indexOf('마음의 짐을 내려놓고,') + '마음의 짐을 내려놓고,'.length)}
              <br className="sm:hidden" />
              {adminConfig.heroSubtitle.substring(adminConfig.heroSubtitle.indexOf('마음의 짐을 내려놓고,') + '마음의 짐을 내려놓고,'.length)}
            </>
          ) : (
            adminConfig.heroSubtitle
          )}
        </p>

        {/* Hand drawn comforting divider line with warmer peach elements */}
        <div className="w-24 h-1.5 mx-auto my-6 bg-gradient-to-r from-[#FFD1D1] via-[#FFF2CC] to-[#FFE5D9] rounded-full" />

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={() => onNavigate('booking')}
            className="group relative w-full sm:w-auto px-8 py-4 bg-[#FF8E8E] hover:bg-[#ff7a7a] text-white font-extrabold rounded-2xl shadow-lg shadow-[#FF8E8E]/30 active:translate-y-0.5 transition-all duration-150 flex items-center justify-center gap-2 text-md focus:outline-none focus:ring-2 focus:ring-[#FF8E8E] cursor-pointer"
          >
            <Calendar size={20} className="group-hover:rotate-12 transition-transform duration-300" />
            <span>상담 신청하기</span>
            <ArrowRight size={18} className="translate-x-0 group-hover:translate-x-1.5 transition-transform duration-300" />
          </button>

          <button
            onClick={() => onNavigate('faq')}
            className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-slate-50 text-[#4A6D73] font-bold rounded-2xl border-2 border-[#D4E9EC] transition-all duration-150 flex items-center justify-center gap-2 shadow-sm text-md focus:outline-none focus:ring-2 focus:ring-[#D4E9EC] cursor-pointer"
          >
            <Info size={18} className="text-[#9BBCC2]" />
            <span>위클래스 이용 안내</span>
          </button>
        </div>
      </div>

      {/* Two-Column Mid Row */}
      <div id="home-mid-grid" className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
        {/* Daily Comforting Quote Widget */}
        <div id="quote-widget" className="md:col-span-8 bg-[#FFF9E6] rounded-[32px] p-6 border-b-4 border-r-4 border-[#F2E0A1] shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-2 right-3 sm:-top-6 sm:-right-6 text-7xl sm:text-8xl text-[#F2E0A1]/40 font-serif pointer-events-none select-none">
            ”
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="p-1 px-2.5 rounded-full bg-[#FFF2CC] border border-[#F2E0A1] text-[#D4A017] text-xs font-bold font-mono">
                오늘의 한마디 🧸
              </span>
              <Heart size={16} className="text-[#FF8E8E] fill-[#FFD1D1] animate-pulse" />
            </div>
            <p className="text-[#6B5A3D] quote-font-style font-semibold md:text-md leading-relaxed mb-4 whitespace-pre-line">
              "{adminConfig.dailyQuote.text}"
            </p>
          </div>
          <span className="text-right text-xs md:text-sm text-[#6B5A3D]/80 quote-font-style font-semibold italic">
            — {adminConfig.dailyQuote.author}
          </span>
        </div>

        {/* Quick Mind Vitamin Generator Widget */}
        <div id="mind-vitamin-widget" className="md:col-span-4 bg-white/60 backdrop-blur-sm rounded-[32px] p-6 border border-[#D4E9EC] shadow-sm flex flex-col justify-between text-center relative">
          <h3 className="text-[#4A6D73] font-extrabold text-md mb-2 flex items-center justify-center gap-1">
            <span>🍬 오늘의 마음 비타민</span>
          </h3>
          <p className="text-xs text-[#9BBCC2] mb-4">
            지치고 마음이 무거운 오늘, 나만을 위한 행운의 말을 뽑아보세요!
          </p>
          
          <div className="min-h-[4.5rem] flex items-center justify-center bg-[#EBF4F6] rounded-2xl p-3 border border-[#D4E9EC] text-[#334E52] text-sm font-semibold transition-all duration-300">
            {showVitamin ? (
              <span className="animate-fadeIn text-[#4A6D73] text-center">{MIND_VITAMINS[vitaminIndex]}</span>
            ) : (
              <span className="text-[#9BBCC2] italic text-center block leading-relaxed">
                아래 노란 단추를 눌러<br />뽑아보세요!
              </span>
            )}
          </div>

          <button
            onClick={getNewVitamin}
            className="mt-4 w-full py-2.5 px-4 bg-[#FFF2CC] hover:bg-[#FFF9E6] text-[#D4A017] font-extrabold rounded-xl border-2 border-[#F2E0A1] shadow-[0_3px_0_#D4A017] active:translate-y-0.5 active:shadow-[0_0_0_transparent] transition-all duration-100 text-xs cursor-pointer"
          >
            {showVitamin ? "한 번 더 뽑아보기" : "달콤 처방전 뽑기 💛"}
          </button>
        </div>
      </div>

      {/* About Wee Class Info section in Card style */}
      <div id="about-us-grid" className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border-2 border-[#E2EFF2] hover:border-[#FFD1D1] hover:shadow-md transition-all duration-300 group">
          <div className="w-10 h-10 rounded-xl bg-[#FFD1D1]/30 flex items-center justify-center mb-4 text-[#FF8E8E] group-hover:scale-110 transition-transform duration-300">
            <Heart size={20} className="fill-[#FFD1D1]/40" />
          </div>
          <h4 className="font-extrabold text-[#334E52] mb-2">비밀 보장은 필수!</h4>
          <p className="text-sm text-[#4A6D73] leading-relaxed">
            나의 사소한 고민도 절대 타인에게 공유되지 않는 안전한 대화 숲입니다. <b className="text-[10px] text-[#FF8E8E] block mt-1 leading-normal">*단, 자신이나 다른 사람의 안전이 위험한 경우에는 도움을 위해 보호자나 선생님과 함께 이야기할 수 있어요.</b>
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border-2 border-[#E2EFF2] hover:border-[#F2E0A1] hover:shadow-md transition-all duration-300 group">
          <div className="w-10 h-10 rounded-xl bg-[#FFF2CC] flex items-center justify-center mb-4 text-[#D4A017] group-hover:scale-110 transition-transform duration-300">
            <MessageCircle size={20} className="fill-[#FFF2CC]/40" />
          </div>
          <h4 className="font-extrabold text-[#6B5A3D] mb-2">보드게임 하러 놀러올래?</h4>
          <p className="text-sm text-[#6B5A3D]/90 leading-relaxed font-sans">
            언제든 놀러와서 달콤한 간식과 다양하게 준비된 보드게임을 편안하게 즐겨 보세요!
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border-2 border-[#E2EFF2] hover:border-[#D4E9EC] hover:shadow-md transition-all duration-300 group">
          <div className="w-10 h-10 rounded-xl bg-[#EBF4F6] flex items-center justify-center mb-4 text-[#4A6D73] group-hover:scale-110 transition-transform duration-300">
            <BookOpen size={20} />
          </div>
          <h4 className="font-extrabold text-[#334E52] mb-2">나를 알아보는 심리검사</h4>
          <p className="text-sm text-[#4A6D73]/90 leading-relaxed font-sans">
            STS 6요인 기질검사, GOLDEN 성격유형검사, CST-A 성격강점검사 및 K-CDI 아동우울척도가 다 준비되어 있어요.
          </p>
        </div>
      </div>

      {/* Wee Class Detail Metadata Banner */}
      <div id="wee-class-footer-meta" className="bg-white/60 backdrop-blur-sm border-2 border-[#E2EFF2] rounded-3xl p-6 md:p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div>
          <h4 className="text-[#334E52] font-black text-md mb-2">📌 Wee클래스 위치&연락처</h4>
          <p className="text-sm text-[#4A6D73] font-semibold mb-1">📍 {adminConfig.settings.location}</p>
          <p className="text-sm text-[#4A6D73] font-semibold">📞 {adminConfig.settings.counselorName}</p>
        </div>
        <div className="shrink-0 flex flex-col items-center sm:items-end gap-1">
          <a
            href={adminConfig.settings.kakaoLink}
            target="_blank"
            referrerPolicy="no-referrer"
            className="px-5 py-2.5 bg-[#FFF2CC] border border-[#F2E0A1] text-[#D4A017] hover:bg-[#FFF9E6] font-black rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors duration-200"
          >
            <MessageCircle size={16} className="fill-[#D4A017]" />
            카카오 채널 연결하기
          </a>
          <span className="text-[10px] text-[#9BBCC2] mt-1 font-semibold">선생님과 실시간 톡 문의</span>
        </div>
      </div>
    </div>
  );
}
