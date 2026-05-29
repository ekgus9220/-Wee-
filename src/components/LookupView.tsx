import React, { useState } from 'react';
import { Search, Key, ShieldAlert, ArrowLeft, Calendar, Clock, Sparkles, MessageSquare, CheckCircle, HelpCircle } from 'lucide-react';
import { Reservation } from '../types';

interface LookupViewProps {
  reservations: Reservation[];
  onNavigate: (view: 'home' | 'booking' | 'faq' | 'admin' | 'lookup') => void;
}

export default function LookupView({ reservations, onNavigate }: LookupViewProps) {
  const [searchName, setSearchName] = useState('');
  const [searchPassword, setSearchPassword] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<Reservation[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchName.trim()) return;

    // Filter by name and password
    const matched = reservations.filter(
      (r) =>
        r.name.trim().toLowerCase() === searchName.trim().toLowerCase() &&
        r.password === searchPassword.trim()
    );

    setResults(matched);
    setHasSearched(true);
  };

  const statusTags = {
    pending: { label: '승인 대기 중', bg: 'bg-[#FFF2CC] text-[#D4A017] border-[#F2E0A1]' },
    approved: { label: '예약 확정', bg: 'bg-teal-50 text-teal-700 border-teal-200' },
    completed: { label: '상담 완료', bg: 'bg-[#EBF4F6] text-[#4A6D73] border-[#D4E9EC]' },
    canceled: { label: '취소됨', bg: 'bg-rose-50 text-rose-600 border-rose-100' },
  };

  return (
    <div id="lookup-view-root" className="max-w-2xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Navigation and Title */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-1.5 text-xs md:text-sm font-bold text-[#4A6D73] hover:text-[#334E52] cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>메인 홈으로</span>
        </button>
        <div className="font-mono text-xs font-bold text-[#FF8E8E] bg-[#FFF2CC]/40 border border-[#FFD1D1] px-2.5 py-1 rounded-full">
          SECURE STATUS PORTAL
        </div>
      </div>

      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-[#334E52] tracking-tight mb-2">
          나의 예약 확인하기 🔐
        </h2>
        <p className="text-[#4A6D73] text-xs md:text-sm font-medium whitespace-pre-line leading-relaxed">
          예약할 때 남기신 이름(또는 닉네임)과 비밀번호로 예약을 검증합니다.
          타인에게 전송되는 알림 문자 없이, 이곳에서 안전하게 진행 여부 및 피드백을 조회하세요.
        </p>
      </div>

      {/* Query Form Box */}
      <div className="bg-white rounded-[32px] p-6 md:p-8 border-2 border-white shadow-xl shadow-[#4A6D73]/5 mb-8">
        <form onSubmit={handleSearch} className="space-y-5 font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="lookup-name" className="block text-xs font-bold text-[#4A6D73]">
                예약자명 또는 닉네임
              </label>
              <div className="relative">
                <input
                  id="lookup-name"
                  type="text"
                  required
                  placeholder="예약하신 이름을 적어주세요"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-100 text-[#334E52] font-semibold rounded-2xl outline-none focus:border-[#FFD1D1] focus:bg-white text-sm"
                />
                <Search size={16} className="absolute left-3.5 top-3.5 text-[#9BBCC2]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="lookup-password" className="block text-xs font-bold text-[#4A6D73]">
                보안 비밀번호
              </label>
              <div className="relative">
                <input
                  id="lookup-password"
                  type="password"
                  required
                  maxLength={10}
                  placeholder="비밀번호를 입력하세요"
                  value={searchPassword}
                  onChange={(e) => setSearchPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-100 text-[#334E52] font-semibold rounded-2xl outline-none focus:border-[#FFD1D1] focus:bg-white text-sm"
                />
                <Key size={16} className="absolute left-3.5 top-3.5 text-[#9BBCC2]" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#FF8E8E] hover:bg-[#ff7a7a] text-white font-extrabold rounded-2xl shadow-md cursor-pointer flex items-center justify-center gap-1.5 text-sm transition-colors duration-150"
          >
            <Search size={16} />
            <span>내 예약 안전 조회하기</span>
          </button>
        </form>
      </div>

      {/* Query Results */}
      {hasSearched && (
        <div className="space-y-6">
          <h3 className="text-sm font-black text-[#334E52] px-1">
            조회 결과 총 <span className="text-[#FF8E8E]">{results.length}</span>건이 발견되었습니다
          </h3>

          {results.length === 0 ? (
            <div className="bg-white/70 backdrop-blur-sm border-2 border-dashed border-[#D4E9EC] p-10 rounded-[30px] text-center space-y-3 animate-fadeIn">
              <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500">
                <ShieldAlert size={24} />
              </div>
              <h4 className="font-extrabold text-[#334E52] text-sm md:text-base">일치하는 예약 내역이 없습니다</h4>
              <p className="text-xs text-[#9BBCC2] max-w-sm mx-auto leading-relaxed">
                입력하신 이름이나 비밀번호가 맞는지 다시 한 번 확인해 주세요.<br />
                가명/닉네임으로 신청하셨다면 가명을 올바르게 타이핑하셔야 조회됩니다!
              </p>
              <button
                onClick={() => {
                  setHasSearched(false);
                  setSearchName('');
                  setSearchPassword('');
                }}
                className="mt-2 px-4 py-1.5 bg-[#EBF4F6] border border-[#D4E9EC] text-[#4A6D73] text-xs font-bold rounded-lg hover:bg-slate-50"
              >
                다시 쓰기
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-slideUp">
              {results.map((res) => {
                const tag = statusTags[res.status] || statusTags.pending;
                return (
                  <div key={res.id} className="bg-white rounded-[30px] border-2 border-white shadow-xl shadow-[#4A6D73]/5 p-6 space-y-4 relative overflow-hidden text-sm">
                    {/* Corner Tag */}
                    <div className="absolute top-0 right-0">
                      <span className={`inline-block px-4 py-1.5 text-xs font-black border-b border-l rounded-bl-[15px] ${tag.bg}`}>
                        {tag.label}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[10px] font-black text-[#9BBCC2] uppercase tracking-wider">
                        <span>Wee Class Reservation Details</span>
                        <span>•</span>
                        <span>{res.type === 'peer' ? '또래 교실' : res.type === 'professional' ? '전문 상담' : '심리 검사'}</span>
                      </div>
                      <h4 className="text-base font-black text-[#334E52]">
                        {res.name} {res.grade && `(${res.grade}학년 ${res.classGroup}반)`} 학생의 예약 💌
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#4A6D73]">
                        <Calendar size={14} className="text-[#FF8E8E]" />
                        <span>예약 일자:</span>
                        <span className="text-[#334E52] font-black">{res.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-[#4A6D73]">
                        <Clock size={14} className="text-[#FF8E8E]" />
                        <span>희망 시간(교시):</span>
                        <span className="text-[#334E52] font-black">{res.timeSlot}</span>
                      </div>
                    </div>

                    {res.message && (
                      <div className="space-y-1 bg-[#FFF9E6]/30 p-4 rounded-2xl border border-[#F2E0A1]/50">
                        <span className="block text-[11px] font-black text-[#D4A017] uppercase tracking-widest flex items-center gap-1">
                          <MessageSquare size={12} />
                          작성한 나의 메시지
                        </span>
                        <p className="text-xs text-[#6B5A3D] font-medium leading-relaxed whitespace-pre-line">
                          {res.message}
                        </p>
                      </div>
                    )}

                    {/* Counselor Response Message */}
                    <div className="pt-2 border-t border-slate-100/80">
                      {res.status === 'approved' || res.counselorNotes ? (
                        <div className="bg-[#EBF4F6]/60 p-4 rounded-2xl border border-[#D4E9EC]/80 space-y-2">
                           <span className="block text-[11px] font-black text-[#4A6D73] uppercase tracking-widest flex items-center gap-1.5">
                            <Sparkles size={13} className="text-[#FF8E8E] animate-pulse" />
                            상담 교사 다현샘의 답서 (심사 의견)
                          </span>
                          <p className="text-xs text-[#334E52] font-bold leading-relaxed whitespace-pre-line bg-white/70 p-3 rounded-xl border border-[#D4E9EC]/40">
                            {res.counselorNotes || "상담 일정이 승인되었습니다. 지정된 교시에 맞춰 본관 3층 복도 끝 Wee클래스 편안한 상담실 아지트로 찾아오셔요. 차와 다과를 따뜻하게 내어드릴게요! 🌸"}
                          </p>
                        </div>
                      ) : res.status === 'pending' ? (
                        <div className="bg-[#FFF9E6]/30 p-4 rounded-2xl border border-[#F2E0A1]/40 text-center">
                          <p className="text-xs text-[#D4A017] font-bold leading-relaxed">
                            ⏳ 담당 다현샘이 예약을 확인하고 시간 일정을 조율 중입니다.<br />
                            조금만 편안한 마음으로 기다려 주신 후 이곳에서 다시 학급 이름으로 스스로 조회해 주세요!
                          </p>
                        </div>
                      ) : res.status === 'completed' ? (
                        <div className="bg-teal-50/50 p-4 rounded-2xl border border-teal-100 text-center flex items-center justify-center gap-2">
                          <CheckCircle size={15} className="text-teal-600" />
                          <p className="text-xs text-teal-700 font-bold">
                            상담 완료된 일자입니다! 늘 마음 따뜻하고 든든하게 응원합니다! 🌱
                          </p>
                        </div>
                      ) : (
                        <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100/50 text-center">
                          <p className="text-xs text-rose-600 font-bold">
                            본 에이전트 내역은 기한 만료 또는 수동 조율 과정에서 취소 처리되었습니다. 궁금한 점은 카카오 채널로 여쭤보셔요.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
