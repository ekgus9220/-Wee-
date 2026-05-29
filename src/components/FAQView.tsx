import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, BookOpen, Coffee, MessageSquare, Compass, ArrowLeft } from 'lucide-react';
import { AdminConfig } from '../types';

interface FAQViewProps {
  adminConfig: AdminConfig;
  onNavigate: (view: 'home' | 'booking' | 'faq' | 'admin') => void;
}

export default function FAQView({ adminConfig, onNavigate }: FAQViewProps) {
  const [openId, setOpenId] = useState<string | null>('faq-0'); // Open first by default

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div id="faq-view-container" className="max-w-3xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Navigation back and header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-1.5 text-xs md:text-sm font-bold text-[#4A6D73] hover:text-[#334E52]"
        >
          <ArrowLeft size={16} />
          <span>메인 홈으로</span>
        </button>
        <div className="font-mono text-xs font-bold text-[#4A6D73] bg-[#EBF4F6] border border-[#D4E9EC] px-2.5 py-1 rounded-full">
          FAQ & PROCESS GUIDE
        </div>
      </div>

      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-[#334E52] tracking-tight mb-2 font-sans">
          이용안내 및 자주 묻는 질문 🌸
        </h2>
        <p className="text-[#4A6D73] text-sm font-medium">
          위클래스 상담에 참여하는 방법과 궁금해하는 일들을 모았어요.
        </p>
      </div>

      {/* Accordion Component for FAQs */}
      <div className="bg-white rounded-[40px] p-6 md:p-8 border-2 border-white shadow-xl shadow-[#4A6D73]/5 mb-12 space-y-3">
        {adminConfig.faqList.length === 0 ? (
          <div className="text-center py-8 text-[#9BBCC2] text-sm font-medium">
            공개된 가이드 질문이 현재 비어 있습니다. 관리자가 질문을 작성 중이에요!
          </div>
        ) : (
          adminConfig.faqList.map((faq, index) => {
            const isOpen = openId === faq.id || (openId === 'faq-0' && index === 0);
            return (
              <div
                key={faq.id}
                className={`border-2 rounded-2xl overflow-hidden transition-all duration-300 ${
                  isOpen 
                    ? 'border-[#FFD1D1] bg-[#FFF9E6]/30 shadow-sm' 
                    : 'border-slate-100 bg-slate-50/40 hover:border-[#FFD1D1]/40'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-4 md:p-5 flex items-center justify-between gap-3 text-left outline-none cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-[#4A6D73] mt-0.5 shrink-0">
                      <HelpCircle size={18} />
                    </span>
                    <div>
                      {faq.category && (
                        <span className="text-[9px] font-bold text-[#FF8E8E] border border-[#FFD1D1] bg-[#FFF2CC] px-1.5 py-0.5 rounded mr-2 uppercase tracking-tight">
                          {faq.category}
                        </span>
                      )}
                      <span className="font-extrabold text-[#334E52] text-sm md:text-base">
                        {faq.question}
                      </span>
                    </div>
                  </div>
                  <span className="text-[#4A6D73] shrink-0">
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-0 text-xs md:text-sm text-[#415D61] border-t border-slate-100/60 leading-relaxed bg-white/70 whitespace-pre-line font-medium animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Visual Infographic Journey Section */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-[#334E52] flex items-center justify-center gap-1.5">
          <Compass size={20} className="text-[#FF8E8E]" />
          <span>Wee클래스 4단계 상담 여정</span>
        </h3>
        <p className="text-xs text-[#9BBCC2] mt-1 font-semibold leading-relaxed">
          고민 접수에서부터 따뜻한 대화가 끝난 이후까지 일들이에요.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Step 1 Card */}
        <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border-2 border-[#D4E9EC] text-center shadow-sm relative">
          <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-[#EBF4F6] text-[#4A6D73] text-[10px] font-black flex items-center justify-center">
            01
          </div>
          <div className="text-2xl mb-2 mt-2">✉️</div>
          <h4 className="font-extrabold text-xs text-[#334E52] mb-1">온라인 상담 신청</h4>
          <p className="text-[10px] text-[#4A6D73] leading-relaxed font-semibold">
            이름 대신 가명을 포함하여 비밀 보장형 폼을 스마트폰으로 간편히 작성합니다.
          </p>
        </div>

        {/* Step 2 Card */}
        <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border-2 border-[#D4E9EC] text-center shadow-sm relative">
          <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-[#EBF4F6] text-[#4A6D73] text-[10px] font-black flex items-center justify-center">
            02
          </div>
          <div className="text-2xl mb-2 mt-2">💌</div>
          <h4 className="font-extrabold text-xs text-[#334E52] mb-1">상담 예약 확인</h4>
          <p className="text-[10px] text-[#4A6D73] leading-relaxed font-semibold">
            웹사이트 상단의 '예약 확인' 메뉴를 통해 설정한 이름과 비밀번호로 스스로 확인하실 수 있습니다.
          </p>
        </div>

        {/* Step 3 Card */}
        <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border-2 border-[#D4E9EC] text-center shadow-sm relative">
          <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-[#EBF4F6] text-[#4A6D73] text-[10px] font-black flex items-center justify-center">
            03
          </div>
          <div className="text-2xl mb-2 mt-2">🍵</div>
          <h4 className="font-extrabold text-xs text-[#334E52] mb-1">아늑한 쉼터 상담</h4>
          <p className="text-[10px] text-[#4A6D73] leading-relaxed font-semibold">
            차나 간식과 함께 고민을 나누거나 심리검사를 통해 스스로에 대해 알아보는 시간을 가집니다.
          </p>
        </div>

        {/* Step 4 Card */}
        <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border-2 border-[#D4E9EC] text-center shadow-sm relative">
          <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-[#EBF4F6] text-[#4A6D73] text-[10px] font-black flex items-center justify-center">
            04
          </div>
          <div className="text-2xl mb-2 mt-2">Sunflower🌻</div>
          <h4 className="font-extrabold text-xs text-[#334E52] mb-1">마음 관리 & 격려</h4>
          <p className="text-[10px] text-[#4A6D73] leading-relaxed font-semibold">
            상담 완료 후 필요할 때마다 언제든지 다시 들르는 지속적인 마이 힐링 아지트가 됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
