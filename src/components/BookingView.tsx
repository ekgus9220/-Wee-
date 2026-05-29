import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, User, MessageSquare, Check, AlertCircle, ArrowLeft, ArrowRight, Clock, ShieldCheck, Key } from 'lucide-react';
import { Reservation, CounselingType, AdminConfig } from '../types';

interface BookingViewProps {
  adminConfig: AdminConfig;
  reservations: Reservation[];
  onSubmitReservation: (newRes: Omit<Reservation, 'id' | 'status' | 'createdAt'> & { password?: string }) => void;
  onNavigate: (view: 'home' | 'booking' | 'faq' | 'admin' | 'lookup') => void;
}

export default function BookingView({ adminConfig, reservations, onSubmitReservation, onNavigate }: BookingViewProps) {
  const [step, setStep] = useState(1);
  
  // Form State
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    if (date.getDay() === 0) date.setDate(date.getDate() + 1);
    if (date.getDay() === 6) date.setDate(date.getDate() + 2);
    return date.toISOString().split('T')[0];
  });
  
  // Support multiple selection of time slots
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [studentName, setStudentName] = useState('');
  const [password, setPassword] = useState('');
  const [grade, setGrade] = useState<'1' | '2' | '3'>('1');
  const [classGroup, setClassGroup] = useState('1');
  const [contact, setContact] = useState('');
  const [counselingType, setCounselingType] = useState<CounselingType>('professional');
  const [message, setMessage] = useState('');
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Derive unavailable slots for the selected date
  const unavailableSlots = useMemo(() => {
    if (adminConfig.settings.blackoutDates.includes(selectedDate)) {
      return adminConfig.settings.workingHours; // All slots blocked
    }
    
    // Split and map any multi-slotted reservations on this day to individual busy states
    const busy: string[] = [];
    reservations
      .filter(r => r.date === selectedDate && r.status !== 'canceled')
      .forEach(r => {
        if (r.timeSlot) {
          const slots = r.timeSlot.split(',').map(s => s.trim());
          busy.push(...slots);
        }
      });
    return busy;
  }, [selectedDate, reservations, adminConfig.settings.blackoutDates, adminConfig.settings.workingHours]);

  // Handle slot click (supporting multi-selection)
  const handleSlotClick = (slot: string) => {
    if (unavailableSlots.includes(slot)) return;
    
    setSelectedTimeSlots((prev) => {
      if (prev.includes(slot)) {
        return prev.filter((s) => s !== slot); // Deselect
      } else {
        return [...prev, slot]; // Select multiple
      }
    });
  };

  // Check if selected date is weekend
  const isWeekend = useMemo(() => {
    if (!selectedDate) return false;
    const day = new Date(selectedDate).getDay();
    return day === 0 || day === 6;
  }, [selectedDate]);

  // Check if date is under blackout
  const isBlackout = useMemo(() => {
    return adminConfig.settings.blackoutDates.includes(selectedDate);
  }, [selectedDate, adminConfig.settings.blackoutDates]);

  // Form Validation
  const canGoToStep2 = selectedDate && selectedTimeSlots.length > 0 && !isWeekend && !isBlackout;
  const canGoToStep3 = studentName.trim() !== '' && contact.trim() !== '' && password.trim().length >= 4;
  const canSubmit = message.trim() !== '' && privacyAgreed;

  // Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    onSubmitReservation({
      date: selectedDate,
      timeSlot: selectedTimeSlots.join(', '),
      name: studentName,
      isAnonymous: false,
      grade,
      classGroup,
      contact,
      type: counselingType,
      message,
      password: password.trim(),
    });

    setSubmissionSuccess(true);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedTimeSlots([]);
    setStudentName('');
    setPassword('');
    setGrade('1');
    setClassGroup('1');
    setContact('');
    setCounselingType('professional');
    setMessage('');
    setPrivacyAgreed(false);
    setSubmissionSuccess(false);
  };

  if (submissionSuccess) {
    return (
      <div id="booking-success-pnl" className="max-w-xl mx-auto px-4 py-8 animate-fadeIn text-center">
        <div className="bg-white rounded-[40px] p-8 md:p-10 border-2 border-white shadow-xl shadow-[#4A6D73]/5">
          <div className="w-16 h-16 rounded-full bg-[#EBF4F6] text-[#4A6D73] flex items-center justify-center mx-auto mb-6">
            <Check size={36} className="stroke-[3]" />
          </div>
          
          <h2 className="text-2xl md:text-3xl font-black text-[#334E52] mb-2 font-sans">예약 신청 완료! 🎉</h2>
          <p className="text-sm md:text-md text-[#4A6D73] font-bold mb-6 font-sans">
            정화고 Wee클래스에 소중한 사연이 안전하게 도착했어요 💌
          </p>

          <div className="bg-[#EBF4F6]/80 rounded-2xl p-6 text-left border border-[#D4E9EC] text-xs md:text-sm max-w-sm mx-auto mb-8 space-y-2.5 font-sans">
            <div className="flex justify-between border-b border-[#D4E9EC] pb-2">
              <span className="text-[#4A6D73] font-medium">상담 방식</span>
              <span className="text-[#334E52] font-black">
                {counselingType === 'peer' && '🏫 또래 친구 상담'}
                {counselingType === 'professional' && '👩‍🏫 전문교사 심층 상담'}
                {counselingType === 'test' && '📋 종합 심리 검사'}
              </span>
            </div>
            <div className="flex justify-between border-b border-[#D4E9EC] pb-2">
              <span className="text-[#4A6D73] font-medium">예약 일자</span>
              <span className="text-[#334E52] font-black">{selectedDate}</span>
            </div>
            <div className="flex justify-between border-b border-[#D4E9EC] pb-2">
              <span className="text-[#4A6D73] font-medium">희망 교시</span>
              <span className="text-[#334E52] font-black">{selectedTimeSlots.join(', ')}</span>
            </div>
            <div className="flex justify-between border-b border-[#D4E9EC] pb-2">
              <span className="text-[#4A6D73] font-medium">신청자명</span>
              <span className="text-[#334E52] font-black">
                {grade}학년 {classGroup}반 {studentName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#4A6D73] font-medium">설정한 비밀번호</span>
              <span className="text-[#334E52] font-mono font-black">{password}</span>
            </div>
          </div>

          <div className="bg-[#EBF4F6] border-2 border-dashed border-[#D4E9EC] p-4 rounded-2xl text-left text-xs text-[#334E52] leading-relaxed mb-8 max-w-sm mx-auto font-sans font-bold">
            💡 <span className="text-[#FF8E8E] font-black">중요: 예약 상태 자가 조회 안내</span><br />
            개인 식별 연락이나 민감한 문자 전송 없이, 직접 <b>상단 메뉴의 [예약확인] 탭</b>에 접속한 뒤 이름과 상기 설정한 주간 <b>비밀번호({password})</b>를 치면 상담실 현황(확정 시간대 및 다현샘의 편지 메세지)을 완전히 비밀 보장 속에서 조회하실 수 있습니다!
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleReset}
              className="flex-1 py-3.5 px-4 bg-white border-2 border-[#D4E9EC] text-[#4A6D73] hover:bg-slate-50 font-black rounded-2xl transition-colors duration-150 text-xs md:text-sm cursor-pointer"
            >
              새로 신청하기
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="flex-1 py-3.5 px-4 bg-[#FF8E8E] hover:bg-[#ff7a7a] text-white font-black rounded-2xl shadow-lg shadow-[#FF8E8E]/30 active:translate-y-0.5 transition-all duration-150 text-xs md:text-sm cursor-pointer"
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="booking-wizard-container" className="max-w-2xl mx-auto px-4 py-8 animate-fadeIn font-sans">
      {/* Upper Navigation Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-1.5 text-xs md:text-sm font-bold text-[#4A6D73] hover:text-[#334E52] cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>메인 홈으로</span>
        </button>
        <span className="text-[11px] font-extrabold text-[#D4A017] bg-[#FFF2CC] border border-[#F2E0A1] px-2.5 py-1 rounded-full uppercase tracking-wider">
          Step {step} of 3
        </span>
      </div>

      {/* Booking Form Card Container */}
      <div className="bg-white rounded-[40px] p-6 md:p-8 border-2 border-white shadow-xl shadow-[#4A6D73]/5 relative">
        <div className="absolute top-[-16px] left-8 px-4 py-1.5 bg-[#FFD1D1] text-white text-xs font-black rounded-full select-none shadow-sm font-mono">
          SECURE BOOKING 🧸
        </div>

        {/* 3 Step Indicator Bars */}
        <div className="flex gap-2 mb-8 mt-2">
          <div className={`h-2 flex-1 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-[#FF8E8E]' : 'bg-slate-100'}`} />
          <div className={`h-2 flex-1 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-[#FF8E8E]' : 'bg-slate-100'}`} />
          <div className={`h-2 flex-1 rounded-full transition-all duration-300 ${step >= 3 ? 'bg-[#FF8E8E]' : 'bg-slate-100'}`} />
        </div>

        {/* STEP 1: Date and Time Slot choosing */}
        {step === 1 && (
          <div id="booking-step-1" className="space-y-6 animate-fadeIn">
            <div className="text-center sm:text-left mb-4">
              <h3 className="text-xl font-extrabold text-[#334E52] flex items-center justify-center sm:justify-start gap-2">
                <CalendarIcon size={22} className="text-[#4A6D73]" />
                <span>언제 대화하고 싶나요?</span>
              </h3>
              <p className="text-xs text-[#9BBCC2] mt-1 font-semibold leading-relaxed">
                희망하는 날짜를 선택하시고, 상담 받고 싶은 교시들을 중복하여 모두 클릭해 주세요.
              </p>
            </div>

            {/* Date Picker Input */}
            <div className="space-y-2">
              <label htmlFor="res-date-picker" className="block text-xs font-bold text-[#4A6D73] uppercase tracking-wider">
                상담 희망일 선택
              </label>
              <input
                id="res-date-picker"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedTimeSlots([]); // Reset slot selection when date changes
                }}
                className="w-full p-4 bg-slate-50 border-2 border-slate-100 text-[#334E52] font-black rounded-2xl focus:border-[#FFD1D1] focus:bg-white outline-none transition-colors cursor-pointer text-sm"
              />
            </div>

            {/* Warnings Container for Holidays or Weekends */}
            {isWeekend && (
              <div className="flex items-center gap-2 p-4 bg-[#FFF2CC]/30 border border-[#FFD1D1] text-[#334E52] rounded-2xl text-xs font-bold">
                <AlertCircle size={16} className="text-rose-500 shrink-0" />
                <span>Wee클래스는 평일만 운영해요! 주말(토/일요일) 외 평일 중 다른 일자를 골라주세요.</span>
              </div>
            )}

            {isBlackout && (
              <div className="flex items-center gap-2 p-4 bg-[#FFF2CC]/30 border border-[#FFD1D1] text-[#334E52] rounded-2xl text-xs font-bold">
                <AlertCircle size={16} className="text-rose-500 shrink-0" />
                <span>선택하신 날짜는 시험 기한이나 학교 휴무일 지정으로 이용할 수 없는 날입니다.</span>
              </div>
            )}

            {/* Time Slot Selector Grid (only display when weekday/not blackout) */}
            {!isWeekend && !isBlackout && (
              <div className="space-y-3">
                <span className="block text-xs font-bold text-[#4A6D73] uppercase tracking-wider">
                  신청 가능한 교시 (중복 선택이 가능해요!)
                </span>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {adminConfig.settings.workingHours.map((slot) => {
                    const isBusy = unavailableSlots.includes(slot);
                    const isCurrent = selectedTimeSlots.includes(slot);
                    
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => handleSlotClick(slot)}
                        disabled={isBusy}
                        className={`py-3.5 px-2 rounded-xl text-xs font-extrabold flex flex-col items-center justify-center gap-1.5 transition-all text-center border-2 cursor-pointer ${
                          isBusy 
                            ? 'bg-slate-100/50 border-slate-100 text-slate-350 cursor-not-allowed line-through' 
                            : isCurrent
                              ? 'bg-[#FF8E8E] border-[#FF8E8E] text-white shadow-sm'
                              : 'bg-white border-[#D4E9EC] text-[#4A6D73] hover:border-[#FFD1D1] hover:bg-[#FFD1D1]/5'
                        }`}
                      >
                        <Clock size={13} className={isCurrent ? "text-white animate-pulse" : isBusy ? "text-slate-300" : "text-[#4A6D73]"} />
                        <span>{slot}</span>
                        <span className={`text-[9px] font-bold ${
                          isBusy 
                            ? 'text-slate-350' 
                            : isCurrent
                              ? 'text-white'
                              : 'text-[#4A6D73]/70'
                        }`}>
                          {isBusy ? '신청완료' : isCurrent ? '선택됨' : '신청가능'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Navigation action bar */}
            <div className="pt-4 border-t border-slate-100 flex justify-between">
              <span />
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!canGoToStep2}
                className={`py-3 px-6 bg-[#FF8E8E] hover:bg-[#ff7a7a] text-white font-extrabold rounded-2xl flex items-center gap-1 text-xs md:text-sm shadow-lg shadow-[#FF8E8E]/30 active:translate-y-0.5 active:shadow-[0_0_0_transparent] transition-all cursor-pointer ${
                  !canGoToStep2 ? 'opacity-40 cursor-not-allowed shadow-none active:translate-y-0' : ''
                }`}
              >
                <span>인적 사항 입력</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Student information input */}
        {step === 2 && (
          <div id="booking-step-2" className="space-y-6 animate-fadeIn">
            <div className="text-center sm:text-left mb-4">
              <h3 className="text-xl font-extrabold text-[#334E52] flex items-center justify-center sm:justify-start gap-2">
                <User size={22} className="text-[#4A6D73]" />
                <span>상담 보안 인적 사항 기입 📝</span>
              </h3>
              <p className="text-xs text-[#9BBCC2] mt-1 font-semibold leading-relaxed">
                Wee클래스는 철저 비밀 보장을 위해 알림 문자 대신 이곳에서 보안 비밀번호로 직접 확인합니다.
              </p>
            </div>

            {/* School Grade & Class Info Selector */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="student-grade-picker" className="block text-xs font-bold text-[#4A6D73] uppercase tracking-wider">
                  학년
                </label>
                <select
                  id="student-grade-picker"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value as any)}
                  className="w-full p-3.5 bg-slate-50 border-2 border-slate-100 text-[#334E52] font-black rounded-2xl outline-none focus:border-[#FFD1D1] focus:bg-white text-sm"
                >
                  <option value="1">1학년</option>
                  <option value="2">2학년</option>
                  <option value="3">3학년</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="student-class-picker" className="block text-xs font-bold text-[#4A6D73] uppercase tracking-wider">
                  학급 (반)
                </label>
                <select
                  id="student-class-picker"
                  value={classGroup}
                  onChange={(e) => setClassGroup(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 border-2 border-slate-100 text-[#334E52] font-black rounded-2xl outline-none focus:border-[#FFD1D1] focus:bg-white text-sm"
                >
                  {Array.from({ length: 6 }, (_, i) => String(i + 1)).map(n => (
                    <option key={n} value={n}>{n}반</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Name Input Field */}
            <div className="space-y-2">
              <label htmlFor="student-name-input" className="block text-xs font-bold text-[#4A6D73] uppercase tracking-wider">
                이름 또는 나만의 닉네임
              </label>
              <input
                id="student-name-input"
                type="text"
                required
                placeholder="상담을 진행할 본인 이름을 적어주세요 (필수)"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full p-3.5 bg-slate-50 border-2 border-slate-100 text-[#334E52] font-extrabold rounded-2xl outline-none focus:border-[#FFD1D1] focus:bg-white transition-colors text-sm"
              />
            </div>

            {/* Password Input Field */}
            <div className="space-y-2">
              <label htmlFor="student-password-input" className="block text-xs font-bold text-[#4A6D73] uppercase tracking-wider flex items-center gap-1 text-[#FF8E8E]">
                <Key size={14} />
                <span>예약 결과 확인용 비밀번호 설정 (최소 4자리 숫자 등)</span>
              </label>
              <input
                id="student-password-input"
                type="password"
                required
                minLength={4}
                maxLength={10}
                placeholder="조회 시 사용할 나만의 비밀번호 4자리 이상을 적어주세요"
                value={password}
                onChange={(e) => setPassword(e.target.value.replace(/\s/g, ''))}
                className="w-full p-3.5 bg-slate-50 border-2 border-slate-100 text-[#334E52] font-extrabold rounded-2xl outline-none focus:border-[#FFD1D1] focus:bg-white transition-colors text-sm"
              />
              <span className="text-[10px] text-[#9BBCC2] font-semibold block leading-relaxed">
                * 담임 선생님이나 친구 무리에게 알리지 않고 본 홈피의 [예약확인] 창에서 비밀번호를 침으로써 내 예약 승인 일정을 극비리에 안전히 확인할 수 있습니다!
              </span>
            </div>

            {/* Contact Info */}
            <div className="space-y-2">
              <label htmlFor="student-contact-input" className="block text-xs font-bold text-[#4A6D73] uppercase tracking-wider">
                선생님 소통용 연락처 (휴대폰 번호)
              </label>
              <input
                id="student-contact-input"
                type="text"
                required
                placeholder="예: 010-1234-5678"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full p-3.5 bg-slate-50 border-2 border-slate-100 text-[#334E52] font-extrabold rounded-2xl outline-none focus:border-[#FFD1D1] focus:bg-white transition-colors text-sm"
              />
            </div>

            {/* Navigation buttons */}
            <div className="pt-4 border-t border-slate-100 flex justify-between gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-3 px-6 bg-[#EBF4F6] text-[#4A6D73] hover:bg-[#D4E9EC] font-bold rounded-2xl flex items-center gap-1 text-xs md:text-sm transition-colors cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>이전 단계</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={!canGoToStep3}
                className={`py-3 px-6 bg-[#FF8E8E] hover:bg-[#ff7a7a] text-white font-extrabold rounded-2xl flex items-center gap-1 text-xs md:text-sm shadow-lg shadow-[#FF8E8E]/30 active:translate-y-0.5 active:shadow-[0_0_0_transparent] transition-all cursor-pointer ${
                  !canGoToStep3 ? 'opacity-40 cursor-not-allowed shadow-none active:translate-y-0' : ''
                }`}
              >
                <span>상담 및 사유 작성</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Selecting Counselling Type and brief message */}
        {step === 3 && (
          <form id="booking-step-3" onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
            <div className="text-center sm:text-left mb-4">
              <h3 className="text-xl font-extrabold text-[#334E52] flex items-center justify-center sm:justify-start gap-2">
                <MessageSquare size={22} className="text-[#4A6D73]" />
                <span>어떤 이야기를 나누고 싶나요?</span>
              </h3>
              <p className="text-xs text-[#9BBCC2] mt-1 font-semibold leading-relaxed">
                마음속 고민 테마를 정하면 다현샘이 딱 맞춤으로 예방하고 상담을 준비할 수 있어요.
              </p>
            </div>

            {/* Selection of 상담종류 Card-style buttons */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#4A6D73] uppercase tracking-wider">
                상담 유형
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Professional */}
                <button
                  type="button"
                  onClick={() => setCounselingType('professional')}
                  className={`p-4 rounded-2xl border-2 text-left flex flex-col justify-between transition-all cursor-pointer ${
                    counselingType === 'professional'
                      ? 'bg-[#EBF4F6]/80 border-[#4D6F73] text-[#334E52] shadow-sm'
                      : 'bg-white border-[#D4E9EC] text-[#4A6D73] hover:border-[#FFD1D1]'
                  }`}
                >
                  <span className="text-lg mb-1">👩‍🏫</span>
                  <span className="font-extrabold text-xs block">전문 교사 상담 (Professional)</span>
                  <span className="text-[10px] text-[#4A6D73]/80 mt-1 font-semibold leading-normal">
                    안심 쉼터 Wee클래스의 전문상담교사 다현샘과 프라이빗 1:1 감정 정리 및 심층 솔루션 나누기!
                  </span>
                </button>

                {/* Psychological Test */}
                <button
                  type="button"
                  onClick={() => setCounselingType('test')}
                  className={`p-4 rounded-2xl border-2 text-left flex flex-col justify-between transition-all cursor-pointer ${
                    counselingType === 'test'
                      ? 'bg-[#FFF9E6] border-[#F2E0A1] text-[#6B5A3D] shadow-sm'
                      : 'bg-white border-[#D4E9EC] text-[#4A6D73] hover:border-[#FFD1D1]'
                  }`}
                >
                  <span className="text-lg mb-1">📋</span>
                  <span className="font-extrabold text-xs block">전문 표준 심리 검사 (Test)</span>
                  <span className="text-[10px] text-[#4A6D73]/80 mt-1 font-semibold leading-normal">
                    STS 기질검사, GOLDEN 성격유형, CST-A 강점 분석 혹은 K-CDI 우울 체크 해석상담 요청하기!
                  </span>
                </button>

                {/* Peer */}
                <button
                  type="button"
                  onClick={() => setCounselingType('peer')}
                  className={`p-4 rounded-2xl border-2 text-left flex flex-col justify-between transition-all cursor-pointer ${
                    counselingType === 'peer'
                      ? 'bg-[#FFD1D1]/30 border-[#FF8E8E] text-[#FF8E8E] shadow-sm'
                      : 'bg-white border-[#D4E9EC] text-[#4A6D73] hover:border-[#FFD1D1]'
                  }`}
                >
                  <span className="text-lg mb-1">🏫</span>
                  <span className="font-extrabold text-xs block">또래 친구 상담 (Peer)</span>
                  <span className="text-[10px] text-[#4A6D73]/80 mt-1 font-semibold leading-normal">
                    사랑방 무리에서 달콤한 과자와 사탕을 함께 먹으며 또래 도우미 친구와 가볍고 편안하게 수다 나누기!
                  </span>
                </button>
              </div>
            </div>

            {/* Brief Message Input */}
            <div className="space-y-2">
              <label htmlFor="student-msg-input" className="block text-xs font-bold text-[#4A6D73] uppercase tracking-wider">
                고민 핵심 사유나 요청하고 싶은 부분 (비공개 처리)
              </label>
              <textarea
                id="student-msg-input"
                rows={3}
                maxLength={400}
                required
                placeholder="예시: 성적 고민 때문에 요새 머리가 아파요 / 심리검사를 받아보고 해석하고 싶습니다 / 편한 마음으로 얘기하고 가고 싶어요"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-4 bg-slate-50 border-2 border-slate-100 text-[#334E52] font-semibold rounded-2xl outline-none focus:border-[#FFD1D1] focus:bg-white resize-none transition-colors text-sm"
              />
              <span className="text-[10px] text-[#9BBCC2] font-bold block text-right">
                {message.length} / 400자
              </span>
            </div>

            {/* Privacy disclaimer and safety reassurance */}
            <div id="confidentiality-pact-box" className="p-4 bg-[#EBF4F6]/60 border border-[#D4E9EC] rounded-2xl text-xs">
              <div className="flex items-start gap-2.5">
                <ShieldCheck size={18} className="text-[#4A6D73] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-xs font-extrabold text-[#334E52] block">Wee클래스 비밀 보장 엄수 조항</span>
                  <p className="text-[10px] text-[#4A6D73] leading-relaxed font-semibold">
                    Wee클래스에 신청 및 상담한 모든 사안은 전문 법적 윤리에 의거하여 본인의 수락 없이 학교나 외부 담임 교원에게 절대 유출되거나 조서화되지 않음을 안심 보장합니다.
                    (단, 자신이나 타인에게 해를 입힐 가능성이 판단되는 일부 위기 사유 시에는 예외가 있음을 확인하세요)
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-[#D4E9EC] flex items-center gap-2">
                <input
                  id="privacy-chk-input"
                  type="checkbox"
                  required
                  checked={privacyAgreed}
                  onChange={(e) => setPrivacyAgreed(e.target.checked)}
                  className="w-4 h-4 text-[#FF8E8E] border-slate-300 rounded focus:ring-[#FF8E8E] cursor-pointer"
                />
                <label htmlFor="privacy-chk-input" className="text-[11px] font-extrabold text-[#4A6D73] select-none cursor-pointer">
                  안심 규정과 극비 수집의 내용에 동의합니다 (동의 필수).
                </label>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="pt-4 border-t border-slate-100 flex justify-between gap-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="py-3 px-6 bg-[#EBF4F6] text-[#4A6D73] hover:bg-[#D4E9EC] font-bold rounded-2xl flex items-center gap-1 text-xs md:text-sm transition-colors cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>이전 단계</span>
              </button>

              <button
                type="submit"
                disabled={!canSubmit}
                className={`flex-1 py-3.5 px-6 bg-[#FF8E8E] hover:bg-[#ff7a7a] text-white font-black rounded-2xl text-xs md:text-sm flex items-center justify-center gap-1 shadow-lg shadow-[#FF8E8E]/30 active:translate-y-0.5 active:shadow-[0_0_0_transparent] transition-all cursor-pointer ${
                  !canSubmit ? 'opacity-40 cursor-not-allowed shadow-none active:translate-y-0' : ''
                }`}
              >
                <span>상담 대기 신청 접수하기 💌</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
