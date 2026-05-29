import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, Edit, Trash2, Plus, CheckCircle, XCircle, AlertTriangle, Save, Settings, Play, LogOut, Check, FileText, Clock, MapPin, Link as LinkIcon, User } from 'lucide-react';
import { Reservation, AdminConfig, FaqItem, CounselingType, ReservationStatus } from '../types';

interface AdminViewProps {
  adminConfig: AdminConfig;
  reservations: Reservation[];
  onUpdateConfig: (newConfig: AdminConfig) => void;
  onUpdateReservation: (updatedRes: Reservation) => void;
  onDeleteReservation: (id: string) => void;
  onNavigate: (view: 'home' | 'booking' | 'faq' | 'admin') => void;
}

export default function AdminView({
  adminConfig,
  reservations,
  onUpdateConfig,
  onUpdateReservation,
  onDeleteReservation,
  onNavigate
}: AdminViewProps) {
  // Authentication states
  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState(false);

  // General navigation tabs
  const [activeTab, setActiveTab] = useState<'reservations' | 'content' | 'settings'>('reservations');

  // Filter state for reservations view
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'completed' | 'canceled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>('2026-05-28'); // Set anchor around mock dates

  // Selected reservation for review/editing notes
  const [editingResId, setEditingResId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  // CMS/Content customizer states (initialized on mount/prop updates)
  const [cmsHeroTitle, setCmsHeroTitle] = useState(adminConfig.heroTitle);
  const [cmsHeroSubtitle, setCmsHeroSubtitle] = useState(adminConfig.heroSubtitle);
  const [cmsAnnouncement, setCmsAnnouncement] = useState(adminConfig.announcement);
  const [cmsQuoteText, setCmsQuoteText] = useState(adminConfig.dailyQuote.text);
  const [cmsQuoteAuthor, setCmsQuoteAuthor] = useState(adminConfig.dailyQuote.author);

  // FAQ addition form states
  const [newFaqCategory, setNewFaqCategory] = useState('이용 안내');
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');

  // General Settings states
  const [workingHoursStr, setWorkingHoursStr] = useState(adminConfig.settings.workingHours.join(', '));
  const [location, setLocation] = useState(adminConfig.settings.location);
  const [counselorName, setCounselorName] = useState(adminConfig.settings.counselorName);
  const [kakaoLink, setKakaoLink] = useState(adminConfig.settings.kakaoLink);
  const [newBlackoutDate, setNewBlackoutDate] = useState('');

  // Toast confirmation feedback trigger
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Mock Authentication handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'wee' || passwordInput === '1234') {
      setIsAuthenticated(true);
      setLoginError(false);
      showToast('성공적으로 관리자 인증에 로그인 완료하였습니다.');
    } else {
      setLoginError(true);
    }
  };

  const triggerMockLogin = () => {
    setIsAuthenticated(true);
    setLoginError(false);
    showToast('체험 계정으로 바로 접속하였습니다. 👩‍🏫');
  };

  // Reservation Status Toggle
  const handleUpdateStatus = (res: Reservation, newStatus: ReservationStatus) => {
    const updated = { ...res, status: newStatus };
    onUpdateReservation(updated);
    showToast(`예약 일정을 [${newStatus === 'approved' ? '승인' : newStatus === 'completed' ? '완료' : newStatus === 'canceled' ? '취소' : '대기'}] 상태로 변경하였습니다.`);
  };

  // Save private internal counselor notes
  const handleSaveNotes = (res: Reservation) => {
    const updated = { ...res, counselorNotes: tempNotes };
    onUpdateReservation(updated);
    setEditingResId(null);
    showToast('상담 교사 개별 메모 작성을 완료하였습니다.');
  };

  // Apply general CMS updates
  const handleSaveCMS = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedConfig: AdminConfig = {
      ...adminConfig,
      heroTitle: cmsHeroTitle,
      heroSubtitle: cmsHeroSubtitle,
      announcement: cmsAnnouncement,
      dailyQuote: {
        text: cmsQuoteText,
        author: cmsQuoteAuthor
      }
    };
    onUpdateConfig(updatedConfig);
    showToast('홈페이지 메인 텍스트 및 안내 문구가 즉시 웹뷰에 저장되었습니다!');
  };

  // FAQ CRUD handlers
  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) {
      showToast('질문과 답변을 모두 채워주세요.');
      return;
    }

    const newItem: FaqItem = {
      id: `faq-${Date.now()}`,
      category: newFaqCategory,
      question: newFaqQuestion,
      answer: newFaqAnswer
    };

    const updatedConfig = {
      ...adminConfig,
      faqList: [...adminConfig.faqList, newItem]
    };
    onUpdateConfig(updatedConfig);
    setNewFaqQuestion('');
    setNewFaqAnswer('');
    showToast('새로운 FAQ 항목이 성공적으로 게시되었습니다.');
  };

  const handleDeleteFaq = (id: string) => {
    const updatedFaqs = adminConfig.faqList.filter(f => f.id !== id);
    const updatedConfig = {
      ...adminConfig,
      faqList: updatedFaqs
    };
    onUpdateConfig(updatedConfig);
    showToast('선택한 도움말 항목을 영구 삭제하였습니다.');
  };

  // Settings handlers
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const listHours = workingHoursStr.split(',').map(s => s.trim()).filter(Boolean);
    const updatedConfig: AdminConfig = {
      ...adminConfig,
      settings: {
        ...adminConfig.settings,
        workingHours: listHours,
        location: location,
        counselorName: counselorName,
        kakaoLink: kakaoLink
      }
    };
    onUpdateConfig(updatedConfig);
    showToast('위클래스 운영 시간 및 인프라 설정을 성공적으로 저장했습니다.');
  };

  const handleAddBlackoutDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlackoutDate) return;
    if (adminConfig.settings.blackoutDates.includes(newBlackoutDate)) {
      showToast('이미 등록된 차단 기한입니다.');
      return;
    }
    const updatedConfig = {
      ...adminConfig,
      settings: {
        ...adminConfig.settings,
        blackoutDates: [...adminConfig.settings.blackoutDates, newBlackoutDate]
      }
    };
    onUpdateConfig(updatedConfig);
    setNewBlackoutDate('');
    showToast(`[${newBlackoutDate}] 일자를 상담 불가능 기한(시험기간)으로 등록했습니다.`);
  };

  const handleRemoveBlackoutDate = (date: string) => {
    const remaining = adminConfig.settings.blackoutDates.filter(d => d !== date);
    const updatedConfig = {
      ...adminConfig,
      settings: {
        ...adminConfig.settings,
        blackoutDates: remaining
      }
    };
    onUpdateConfig(updatedConfig);
    showToast(`[${date}] 일자를 차단 목록에서 해제했습니다.`);
  };

  // Generated Calendar range to easily choose and filter by date
  const calendarDatesToRender = useMemo(() => {
    // Generate dates around May 25 to Jun 7, 2026 to comfortably fit preseed and realistic scheduling
    return [
      '2026-05-25', '2026-05-26', '2026-05-27', '2026-05-28', '2026-05-29', 
      '2026-06-01', '2026-06-02', '2026-06-03', '2026-06-04', '2026-06-05'
    ];
  }, []);

  // Filter reservations depending on:
  // 1. Status Filter
  // 2. Search query (matches student name, contact numbers or reasons)
  // 3. Optional date click inside Calendar strip
  const filteredReservations = useMemo(() => {
    return reservations.filter(res => {
      const matchStatus = statusFilter === 'all' || res.status === statusFilter;
      const matchSearch = searchQuery.trim() === '' || 
        res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.message.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchStatus && matchSearch;
    });
  }, [reservations, statusFilter, searchQuery]);

  // If unauthorized, return secure Lockscreen
  if (!isAuthenticated) {
    return (
      <div id="admin-auth-pnl" className="max-w-md mx-auto px-4 py-16 animate-fadeIn">
        <div className="bg-white rounded-[40px] p-8 border-2 border-white shadow-xl shadow-[#4A6D73]/5 text-center relative">
          <div className="absolute top-[-16px] left-1/2 -translate-x-1/2 bg-[#FF8E8E] text-white text-xs font-black py-1 px-4 rounded-full uppercase tracking-widest shadow-sm">
            School Counselor Portal 🔐
          </div>

          <div className="w-16 h-16 rounded-full bg-[#EBF4F6] text-[#4A6D73] flex items-center justify-center mx-auto mb-6">
            <Settings size={32} className="animate-spin" style={{ animationDuration: '8s' }} />
          </div>

          <h3 className="text-2xl font-black text-[#334E52] mb-1 font-sans">상담 비밀창 로그인</h3>
          <p className="text-xs text-[#9BBCC2] font-semibold mb-6">
            서울정화고 위클래스 통제 및 웹 수정 관리자 전용 구역입니다.
          </p>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <label htmlFor="admin-pw-field" className="block text-[11px] font-bold text-[#4A6D73] uppercase tracking-widest">
                상담실 비밀번호 (체험용 비밀번호: <b className="text-[#FF8E8E]">wee</b>)
              </label>
              <input
                id="admin-pw-field"
                type="password"
                placeholder="교사 비밀번호 입력"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#FFD1D1] focus:bg-white text-center text-sm font-bold tracking-widest text-[#334E52]"
              />
            </div>

            {loginError && (
              <div className="p-3 bg-[#FFF9E6] border border-[#F2E0A1] text-[#6B5A3D] rounded-xl text-xs font-semibold flex items-center gap-1.5 justify-center">
                <AlertTriangle size={14} className="text-[#D4A017]" />
                <span>비밀번호가 맞지 않습니다. ('wee' 또는 '1234')</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-[#FF8E8E] hover:bg-[#ff7a7a] text-white font-extrabold rounded-2xl text-sm transition-all duration-200 shadow-lg shadow-[#FF8E8E]/20"
            >
              선생님 인증하기
            </button>
          </form>

          <div className="my-5 flex items-center gap-1.5 justify-center">
            <div className="h-px bg-slate-100 flex-1" />
            <span className="text-[10px] text-[#9BBCC2] font-semibold">OR VIEW PREVIEW</span>
            <div className="h-px bg-slate-100 flex-1" />
          </div>

          <button
            onClick={triggerMockLogin}
            className="w-full py-3 bg-[#EBF4F6] hover:bg-[#D4E9EC] text-[#4A6D73] font-extrabold rounded-2xl text-xs flex items-center justify-center gap-1.5 border border-[#D4E9EC] cursor-pointer"
          >
            <Play size={14} className="fill-[#4A6D73] stroke-[#4A6D73]" />
            <span>비밀번호 없이 빠른 체험 대시보드 열기</span>
          </button>

          <button
            onClick={() => onNavigate('home')}
            className="mt-6 text-xs font-bold text-[#9BBCC2] hover:text-[#4A6D73] block mx-auto underline"
          >
            학생 화면으로 되돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="admin-dashboard-container" className="max-w-5xl mx-auto px-4 py-6 animate-fadeIn">
      {/* Toast Prompt Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold py-3.5 px-5 rounded-2xl shadow-lg flex items-center gap-2 border border-slate-700 animate-slideUp">
          <Check size={16} className="text-teal-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-200/50 pb-5">
        <div>
          <span className="text-[10px] font-extrabold text-[#D4A017] bg-[#FFF2CC] border border-[#F2E0A1] px-2.5 py-0.5 rounded-full uppercase tracking-wider block w-fit mb-1">
            WEE CLASS ADMINISTRATOR CONSOLE
          </span>
          <h2 className="text-2xl font-black text-[#334E52] flex items-center gap-1.5 font-sans">
            <span>위클래스 전용 통제실 👩‍🏫</span>
            <span className="text-xs font-semibold text-[#4A6D73] bg-[#EBF4F6] px-2 py-0.5 rounded">
              다현샘 모드
            </span>
          </h2>
        </div>
        
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('home')}
            className="px-4 py-2 bg-[#FF8E8E] hover:bg-[#ff7a7a] text-white font-extrabold rounded-xl shadow-md shadow-[#FF8E8E]/25 hover:shadow-lg hover:shadow-[#FF8E8E]/30 transition-all text-xs flex items-center gap-1 cursor-pointer"
          >
            학생용 홈페이지 보기 🌿
          </button>
          
          <button
            onClick={() => setIsAuthenticated(false)}
            className="p-2 bg-slate-100 hover:bg-[#FFD1D1]/30 text-[#4A6D73] hover:text-[#FF8E8E] rounded-xl transition-all cursor-pointer"
            title="대시보드 로그아웃"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Tabs list row */}
      <div className="flex bg-[#EBF4F6] p-1 rounded-2xl gap-1 mb-6 max-w-sm border border-[#D4E9EC]">
        <button
          onClick={() => setActiveTab('reservations')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'reservations' ? 'bg-white text-[#334E52] shadow-sm' : 'text-[#4A6D73] hover:text-[#334E52]'
          }`}
        >
          📅 예약 일정관리
        </button>
        <button
          onClick={() => setActiveTab('content')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'content' ? 'bg-white text-[#334E52] shadow-sm' : 'text-[#4A6D73] hover:text-[#334E52]'
          }`}
        >
          ✍️ 미디어·글 수정 (CMS)
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'settings' ? 'bg-white text-[#334E52] shadow-sm' : 'text-[#4A6D73] hover:text-[#334E52]'
          }`}
        >
          ⚙️ 상담소 정책설정
        </button>
      </div>

      {/* TAB 1: Real-time Reservations Dashboard */}
      {activeTab === 'reservations' && (
        <div id="admin-reservations-pnl" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Calendar Agenda Date picker Sidebar */}
            <div className="md:col-span-4 bg-white p-5 rounded-[30px] border-2 border-white shadow-xl shadow-[#4A6D73]/5 shrink-0 font-sans">
              <h4 className="text-xs font-black text-[#334E52] uppercase tracking-widest mb-2 flex items-center gap-1.5 font-sans">
                <CalendarIcon size={14} className="text-[#FF8E8E]" />
                <span>Wee클래스 스케줄 현황판 📅</span>
              </h4>
              <p className="text-[10px] text-[#4A6D73] font-semibold mb-4 leading-relaxed bg-[#EBF4F6]/60 p-2.5 rounded-xl border border-[#D4E9EC]/50 font-sans">
                원하는 날짜 칸을 클릭하여 해당 일자 예약만 요약 확인하세요. 점 색상: <b className="text-[#FF8E8E]">대기</b> | <b className="text-[#4D6F73]">승인</b> | <b className="text-slate-400">완료</b>
              </p>

              {/* Day of week labels */}
              <div className="grid grid-cols-5 text-center text-[9px] font-black text-[#4A6D73] bg-[#EBF4F6] py-1.5 rounded-xl mb-2.5 border border-[#D4E9EC]/40 font-sans">
                <span>월 (M)</span>
                <span>화 (T)</span>
                <span>수 (W)</span>
                <span>목 (T)</span>
                <span>금 (F)</span>
              </div>

              <div id="custom-calendar-matrix-grid" className="grid grid-cols-5 gap-2 mb-4 font-sans">
                {calendarDatesToRender.map((dateStr) => {
                  const dayNum = dateStr.split('-')[2];
                  const mNum = dateStr.split('-')[1];
                  const isBlack = adminConfig.settings.blackoutDates.includes(dateStr);
                  const isCurrent = selectedCalendarDate === dateStr;
                  
                  // Count total reservations on this day per status
                  const dReservations = reservations.filter(r => r.date === dateStr);
                  const pendingCount = dReservations.filter(r => r.status === 'pending').length;
                  const approvedCount = dReservations.filter(r => r.status === 'approved').length;
                  const completedCount = dReservations.filter(r => r.status === 'completed').length;
                  
                  const totalActive = dReservations.filter(r => r.status !== 'canceled').length;

                  return (
                    <button
                      key={dateStr}
                      type="button"
                      onClick={() => {
                        setSelectedCalendarDate(dateStr);
                        setSearchQuery(''); // Clear general search to focus on dates
                      }}
                      className={`min-h-[4.5rem] p-1.5 rounded-xl text-center flex flex-col justify-between border transition-all cursor-pointer ${
                        isCurrent 
                          ? 'bg-[#4A6D73] border-[#4A6D73] text-white shadow-md' 
                          : isBlack 
                            ? 'bg-rose-50 border-rose-100 text-rose-300' 
                            : 'bg-slate-50 border-slate-150 hover:border-[#FFD1D1] text-[#334E52] hover:bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className={`text-[8px] font-mono font-bold leading-none ${isCurrent ? 'text-[#D5ECEF]' : 'text-[#9BBCC2]'}`}>
                          {mNum}/{dayNum}
                        </span>
                        {totalActive > 0 && (
                          <span className={`text-[8px] px-1 rounded-md font-black leading-none ${isCurrent ? 'bg-white text-[#4A6D73]' : 'bg-[#FF8E8E] text-white'}`}>
                            {totalActive}
                          </span>
                        )}
                      </div>

                      <span className="text-xs font-black block my-1">
                        {dayNum}일
                      </span>
                      
                      {/* Interactive dots with color based on statuses */}
                      <div className="flex gap-1 justify-center w-full">
                        {pendingCount > 0 && (
                          <div className={`w-1.5 h-1.5 rounded-full ${isCurrent ? 'bg-[#FFF2CC]' : 'bg-amber-400'}`} title={`대기 ${pendingCount}건`} />
                        )}
                        {approvedCount > 0 && (
                          <div className={`w-1.5 h-1.5 rounded-full ${isCurrent ? 'bg-teal-200' : 'bg-teal-500'}`} title={`승인 ${approvedCount}건`} />
                        )}
                        {completedCount > 0 && (
                          <div className={`w-1.5 h-1.5 rounded-full ${isCurrent ? 'bg-slate-300' : 'bg-slate-400'}`} title={`완료 ${completedCount}건`} />
                        )}
                        {totalActive === 0 && !isBlack && (
                          <div className="w-1 h-1 rounded-full bg-slate-200" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Reset to see all dates */}
              <button
                type="button"
                onClick={() => {
                  setSelectedCalendarDate('');
                  showToast('모든 예약 기한 조회가 복원되었습니다.');
                }}
                className={`w-full py-2.5 text-center text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                  !selectedCalendarDate 
                    ? 'bg-[#334E52] text-white border-[#334E52]' 
                    : 'bg-white hover:bg-slate-50 text-[#4A6D73] border-[#D4E9EC]'
                }`}
              >
                필터 해제 (전체 보기)
              </button>
            </div>

            {/* Reservations List and Action tools */}
            <div className="md:col-span-8 space-y-4">
              {/* Toolbar */}
              <div className="bg-white rounded-3xl p-4 border-2 border-white shadow-xl shadow-[#4A6D73]/5 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                  {['all', 'pending', 'approved', 'completed', 'canceled'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatusFilter(st as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black capitalize transition-all cursor-pointer ${
                        statusFilter === st 
                          ? 'bg-[#334E52] text-white shadow-sm' 
                          : 'bg-[#EBF4F6] hover:bg-[#D4E9EC] text-[#4A6D73]'
                      }`}
                    >
                      {st === 'all' && '전체'}
                      {st === 'pending' && '대기 ⏳'}
                      {st === 'approved' && '승인 ✅'}
                      {st === 'completed' && '완료 🌻'}
                      {st === 'canceled' && '취소 ❌'}
                    </button>
                  ))}
                </div>

                <div className="w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="이름, 연락처, 사유 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-[#FFD1D1] focus:bg-white text-xs text-[#334E52] font-semibold"
                  />
                </div>
              </div>

              {/* Dynamic Filtering results notification */}
              {selectedCalendarDate && (
                <div className="flex items-center justify-between text-xs font-semibold px-2 text-slate-500">
                  <span>📅 선택된 날짜: <b className="text-[#FF8E8E]">{selectedCalendarDate}</b> 예약 내역</span>
                  <button onClick={() => setSelectedCalendarDate('')} className="underline hover:text-[#334E52] cursor-pointer">
                    날짜 해제
                  </button>
                </div>
              )}

              {/* Reservations Grid List */}
              <div className="space-y-4">
                {(() => {
                  const finalFiltered = filteredReservations.filter(r => !selectedCalendarDate || r.date === selectedCalendarDate);
                  
                  if (finalFiltered.length === 0) {
                    return (
                      <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-[#D4E9EC] text-[#4A6D73] font-medium">
                        <AlertTriangle className="mx-auto mb-2 text-[#9BBCC2]" size={32} />
                        <p className="text-sm">해당 조건에 부합하는 학생 상담 예약이 없습니다.</p>
                      </div>
                    );
                  }

                  return finalFiltered.map((res) => {
                    const isEditingNotes = editingResId === res.id;
                    return (
                      <div
                        key={res.id}
                        className={`bg-white rounded-[26px] p-5 border-2 transition-all relative ${
                          res.status === 'pending' ? 'border-amber-200 bg-amber-50/10' :
                          res.status === 'approved' ? 'border-[#D4E9EC] bg-[#EBF4F6]/10' :
                          res.status === 'completed' ? 'border-slate-200' : 'border-slate-100 opacity-60'
                        }`}
                      >
                        {/* Status Label upper right */}
                        <div className="absolute top-4 right-4 flex items-center gap-1.5">
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                            res.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                            res.status === 'approved' ? 'bg-[#EBF4F6] text-[#4A6D73] animate-pulse' :
                            res.status === 'completed' ? 'bg-slate-100 text-slate-500' : 'bg-slate-200 text-slate-400'
                          }`}>
                            {res.status === 'pending' && '대기'}
                            {res.status === 'approved' && '승인됨'}
                            {res.status === 'completed' && '상담완료'}
                            {res.status === 'canceled' && '예약취소'}
                          </span>
                        </div>

                        {/* Top Header info */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3">
                          <span className="text-sm font-extrabold text-[#334E52] flex items-center gap-1">
                            <span className="text-xs p-1 bg-[#EBF4F6] text-[#4A6D73] font-bold rounded">
                              {res.grade}학년 {res.classGroup}반
                            </span>
                            {res.isAnonymous ? (
                              <span className="text-xs text-[#FF8E8E] bg-[#FFF2CC] px-2 py-0.5 rounded font-extrabold border border-[#FFD1D1]">
                                가명나비 (익명)
                              </span>
                            ) : (
                              <span>{res.name}</span>
                            )}
                          </span>

                          <span className="h-3 w-px bg-slate-200" />
                          <span className="text-xs font-mono text-slate-400 font-semibold">
                            {res.date} ({res.timeSlot})
                          </span>

                          <span className="h-3 w-px bg-slate-200" />
                          <span className="text-[10px] font-bold text-[#4A6D73] font-mono bg-[#EBF4F6] px-2 rounded">
                            {res.contact}
                          </span>
                        </div>

                        {/* Middle message details */}
                        <p className="text-xs md:text-sm text-slate-700 bg-slate-50/55 p-3.5 rounded-xl border border-slate-100 mb-3 whitespace-pre-line leading-relaxed font-semibold">
                          <span className="text-[10px] text-[#4A6D73] uppercase block font-black mb-1">
                            {res.type === 'peer' && '🏫 또래 친구 상담 희망사항'}
                            {res.type === 'professional' && '👩‍🏫 전문교사 상담 고민편지'}
                            {res.type === 'test' && '📋 심리 발굴 검사 요청서'}
                          </span>
                          "{res.message}"
                        </p>

                        {/* Private Counselor Annotations section */}
                        {res.counselorNotes || isEditingNotes ? (
                          <div className="bg-[#FFF9E6] p-4 border border-[#F2E0A1] rounded-2xl mb-4 text-xs">
                            <span className="font-extrabold text-[#6B5A3D] block mb-1">📝 상담 비공개 메모 (교사용):</span>
                            
                            {isEditingNotes ? (
                              <div className="space-y-2">
                                <textarea
                                  value={tempNotes}
                                  onChange={(e) => setTempNotes(e.target.value)}
                                  className="w-full bg-white p-2.5 rounded-lg border border-[#F2E0A1] font-medium text-xs focus:ring-1 focus:ring-[#FFD1D1] outline-none resize-none"
                                  rows={2}
                                  placeholder="기록하고 싶은 학생 특징이나 후속 예약 일정 기입..."
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleSaveNotes(res)}
                                    className="px-2.5 py-1 bg-[#334E52] text-white rounded font-bold text-[10px] uppercase cursor-pointer"
                                  >
                                    기록 완료
                                  </button>
                                  <button
                                    onClick={() => setEditingResId(null)}
                                    className="px-2.5 py-1 bg-slate-200 text-slate-600 rounded font-semibold text-[10px] cursor-pointer"
                                  >
                                    취소
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-start justify-between gap-4">
                                <p className="text-[#6B5A3D] leading-relaxed font-semibold">{res.counselorNotes}</p>
                                <button
                                  onClick={() => {
                                    setEditingResId(res.id);
                                    setTempNotes(res.counselorNotes || '');
                                  }}
                                  className="text-[#D4A017] hover:text-[#FF8E8E] font-bold underline shrink-0 cursor-pointer"
                                >
                                  수정
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingResId(res.id);
                              setTempNotes('');
                            }}
                            className="text-[11px] font-bold text-[#4A6D73] hover:text-[#FF8E8E] underline mb-4 block cursor-pointer hover:no-underline"
                          >
                            + 상담 기록 및 메모 추가
                          </button>
                        )}

                        {/* Lower Action buttons */}
                        <div className="flex items-center justify-between border-t border-slate-100 pt-3.5">
                          <span className="text-[10px] font-mono text-slate-400">
                            접수일: {new Date(res.createdAt).toLocaleDateString()}
                          </span>

                          <div className="flex items-center gap-1.5">
                            {res.status === 'pending' && (
                              <button
                                onClick={() => handleUpdateStatus(res, 'approved')}
                                className="px-3 py-1.5 bg-[#FF8E8E] hover:bg-[#ff7a7a] text-white font-extrabold rounded-xl text-xs flex items-center gap-1 shadow-sm shadow-[#FF8E8E]/10 cursor-pointer"
                              >
                                <span>예약 승인</span>
                              </button>
                            )}

                            {res.status === 'approved' && (
                              <button
                                onClick={() => handleUpdateStatus(res, 'completed')}
                                className="px-3 py-1.5 bg-[#334E52] hover:bg-[#25393B] text-white font-extrabold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                              >
                                <span>상담 완료 처리 🌻</span>
                              </button>
                            )}

                            {res.status !== 'canceled' && (
                              <button
                                onClick={() => handleUpdateStatus(res, 'canceled')}
                                className="px-3 py-1.5 bg-[#EBF4F6] hover:bg-[#D4E9EC] text-[#4A6D73] font-bold rounded-xl text-xs transition-colors cursor-pointer"
                              >
                                취소 처리
                              </button>
                            )}

                            <button
                              onClick={() => {
                                if (confirm('정말로 이 예약 신청서를 학생 기록부에서 영구 삭제하겠습니까?')) {
                                  onDeleteReservation(res.id);
                                  showToast('고민 접수 예약이 성공적으로 삭제되었습니다.');
                                }
                              }}
                              className="p-1.5 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-400 hover:text-rose-600 rounded-xl transition-colors cursor-pointer"
                              title="신청서 영구삭제"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  });
                })()}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: Content Management (CMS) */}
      {activeTab === 'content' && (
        <div id="admin-cms-pnl" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

            {/* Form list for General banner and hero headings */}
            <form onSubmit={handleSaveCMS} className="md:col-span-12 bg-white p-6 rounded-[30px] border-2 border-white shadow-xl shadow-[#4A6D73]/5 space-y-5">
              <h3 className="font-extrabold text-lg text-[#334E52] border-b border-slate-100 pb-3 flex items-center gap-1.5">
                <Edit size={18} className="text-[#FF8E8E]" />
                <span>홈페이지 메인 및 안내 정보 실시간 편집</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="cms-title-input" className="block text-xs font-bold text-[#4A6D73] uppercase tracking-wider">
                    홈페이지 대제목 (Hero Title)
                  </label>
                  <input
                    id="cms-title-input"
                    type="text"
                    value={cmsHeroTitle}
                    onChange={(e) => setCmsHeroTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 text-[#334E52] font-extrabold rounded-2xl outline-none focus:border-[#FFD1D1] focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="cms-subtitle-input" className="block text-xs font-bold text-[#4A6D73] uppercase tracking-wider">
                    가치 소개 소제목 (Hero Subtitle)
                  </label>
                  <input
                    id="cms-subtitle-input"
                    type="text"
                    value={cmsHeroSubtitle}
                    onChange={(e) => setCmsHeroSubtitle(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 text-[#334E52] font-semibold rounded-2xl outline-none focus:border-[#FFD1D1] focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="cms-announcement-input" className="block text-xs font-bold text-[#4A6D73] uppercase tracking-wider">
                  📢 실시간 전단 / 공지사항 바 문구
                </label>
                <textarea
                  id="cms-announcement-input"
                  rows={2}
                  value={cmsAnnouncement}
                  onChange={(e) => setCmsAnnouncement(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 text-[#334E52] font-semibold rounded-2xl outline-none focus:border-[#FFD1D1] focus:bg-white"
                  placeholder="대외 공지사항 문구를 채우세요. 비어 둘 시 보이지 않습니다."
                />
              </div>

              <div className="p-4 bg-[#FFF9E6] rounded-2xl border border-[#F2E0A1] space-y-3">
                <span className="text-xs font-black text-[#6B5A3D] block">🧸 오늘의 한마디 (동반 격려 문구)</span>
                
                <div className="space-y-2">
                  <textarea
                    id="cms-quote-text"
                    rows={2}
                    value={cmsQuoteText}
                    onChange={(e) => setCmsQuoteText(e.target.value)}
                    className="w-full bg-white px-3 py-2.5 border-2 border-amber-200/50 rounded-xl outline-none text-[#334E52] text-xs font-bold focus:border-[#FF8E8E]"
                    placeholder="지치고 슬픈 고등학생들을 격려하는 문구..."
                  />
                  <input
                    id="cms-quote-author"
                    type="text"
                    value={cmsQuoteAuthor}
                    onChange={(e) => setCmsQuoteAuthor(e.target.value)}
                    className="w-full sm:w-80 bg-white px-3 py-2 border-2 border-amber-200/50 rounded-xl outline-none text-[#4A6D73] text-[11px] font-bold focus:border-[#FF8E8E]"
                    placeholder="출처 또는 저자 이름"
                  />
                </div>
              </div>

              <div className="flex justify-start">
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-[#FF8E8E] hover:bg-[#ff7a7a] text-white font-extrabold rounded-2xl shadow-lg shadow-[#FF8E8E]/25 transition-all text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Save size={16} />
                  <span>홈페이지 글로벌 텍스트 저장하기</span>
                </button>
              </div>
            </form>

            {/* FAQ Creator & Editor List */}
            <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* FAQ Add Form */}
              <form onSubmit={handleAddFaq} className="md:col-span-5 bg-white p-6 rounded-[30px] border-2 border-white shadow-xl shadow-[#4A6D73]/5 space-y-4">
                <span className="text-[10px] font-black text-[#FF8E8E] bg-[#FFF2CC] border border-[#FFD1D1] px-2 py-0.5 rounded uppercase">
                  FAQ CREATOR
                </span>
                <h4 className="font-extrabold text-[#334E52] text-sm">도움말 질문 추가 목록</h4>

                <div className="space-y-1.5">
                  <label htmlFor="faq-cat-picker" className="block text-xs font-bold text-[#4A6D73]">
                    도움말 카테고리
                  </label>
                  <select
                    id="faq-cat-picker"
                    value={newFaqCategory}
                    onChange={(e) => setNewFaqCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs font-bold outline-none text-[#334E52] focus:border-[#FFD1D1]"
                  >
                    <option value="이용 안내">이용 안내</option>
                    <option value="비밀 보장">비밀 보장</option>
                    <option value="상담 유형">상담 유형</option>
                    <option value="기타 문의">기타 문의</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="faq-q-input" className="block text-xs font-bold text-[#4A6D73]">
                    자주 묻는 질문 (Question)
                  </label>
                  <input
                    id="faq-q-input"
                    type="text"
                    required
                    placeholder="Q. 예시 질문 입력"
                    value={newFaqQuestion}
                    onChange={(e) => setNewFaqQuestion(e.target.value)}
                    className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none text-[#334E52] font-extrabold text-xs focus:border-[#FFD1D1]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="faq-ans-input" className="block text-xs font-bold text-[#4A6D73]">
                    친절한 대답 (Answer)
                  </label>
                  <textarea
                    id="faq-ans-input"
                    required
                    rows={4}
                    placeholder="A. 학생들에게 보장되는 구체적 절차 설명 기록..."
                    value={newFaqAnswer}
                    onChange={(e) => setNewFaqAnswer(e.target.value)}
                    className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none text-[#4A6D73] font-medium text-xs resize-none focus:border-[#FFD1D1]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#334E52] hover:bg-[#25393B] text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>질문 및 대답 게시하기</span>
                </button>
              </form>

              {/* FAQ lists and Deletions */}
              <div className="md:col-span-7 bg-white p-6 rounded-[30px] border-2 border-white shadow-xl shadow-[#4A6D73]/5 space-y-4">
                <span className="text-[10px] font-black text-[#4A6D73] uppercase tracking-widest">
                  LISTED FAQS ({adminConfig.faqList.length})
                </span>
                <h4 className="font-extrabold text-[#334E52] text-sm">목록에 활성화된 FAQ 요약</h4>

                <div className="space-y-3 max-h-[24rem] overflow-y-auto pr-1">
                  {adminConfig.faqList.map((faq) => (
                    <div key={faq.id} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-start justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-extrabold bg-[#EBF4F6] text-[#4A6D73] px-1.5 rounded">
                            {faq.category}
                          </span>
                          <span className="font-extrabold text-[#334E52]">{faq.question}</span>
                        </div>
                        <p className="text-[#4A6D73] leading-relaxed max-w-sm truncate whitespace-pre-line">{faq.answer}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteFaq(faq.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="질문 삭제"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* TAB 3: Global Counseling Settings */}
      {activeTab === 'settings' && (
        <div id="admin-settings-pnl" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

            {/* Counselors settings and basic setup files */}
            <form onSubmit={handleSaveSettings} className="md:col-span-6 bg-white p-6 rounded-[30px] border-2 border-white shadow-xl shadow-[#4A6D73]/5 space-y-4">
              <span className="text-[10px] font-black text-[#4A6D73] bg-[#EBF4F6] border border-[#D4E9EC] px-2.5 py-0.5 rounded uppercase font-mono">
                SCHOOL SYSTEM CORE
              </span>
              <h3 className="font-extrabold text-md text-[#334E52]">위클래스 기본 운영체계 설정</h3>

              <div className="space-y-1.5">
                <label htmlFor="settings-hours-list" className="block text-xs font-bold text-[#4A6D73] uppercase tracking-widest">
                  신청 가능한 교시 목록 (쉼표 구분)
                </label>
                <input
                  id="settings-hours-list"
                  type="text"
                  value={workingHoursStr}
                  onChange={(e) => setWorkingHoursStr(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-100 text-[#334E52] font-extrabold rounded-2xl outline-none focus:border-[#FFD1D1] focus:bg-white"
                />
                <span className="text-[10px] text-[#9BBCC2] block font-semibold">
                  인기 시간: 09:00, 10:00, 11:00, 13:00, 14:00, 15:00
                </span>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="settings-loc-text" className="block text-xs font-bold text-[#4A6D73]">
                  교내 상담실 하드웨어 위치
                </label>
                <input
                  id="settings-loc-text"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-100 text-[#334E52] font-semibold rounded-2xl outline-none focus:border-[#FFD1D1] focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="settings-counselor-name" className="block text-xs font-bold text-[#4A6D73]">
                  안내 연락처 (Wee클래스 직통 전화번호)
                </label>
                <input
                  id="settings-counselor-name"
                  type="text"
                  value={counselorName}
                  onChange={(e) => setCounselorName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-100 text-[#334E52] font-semibold rounded-2xl outline-none focus:border-[#FFD1D1] focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="settings-kakao-link" className="block text-xs font-bold text-[#4A6D73]">
                  카카오 상담 공식 채널 링크 Url
                </label>
                <input
                  id="settings-kakao-link"
                  type="text"
                  value={kakaoLink}
                  onChange={(e) => setKakaoLink(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-100 text-[#334E52] font-semibold rounded-2xl outline-none focus:border-[#FFD1D1] focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-[#334E52] hover:bg-[#25393B] text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Save size={14} />
                <span>체계 설정 저장</span>
              </button>
            </form>

            {/* Blackout dates management form */}
            <div className="md:col-span-6 bg-white p-6 rounded-[30px] border-2 border-white shadow-xl shadow-[#4A6D73]/5 space-y-4">
              <span className="text-[10px] font-black text-[#FF8E8E] bg-[#FFF2CC] border border-[#FFD1D1] px-2.5 py-0.5 rounded uppercase font-mono">
                BLACKOUT LIMITS
              </span>
              <h3 className="font-extrabold text-md text-[#334E52]">예약 제한 기한 관리 (시험 기한 등)</h3>
              <p className="text-[11px] text-[#4A6D73] leading-relaxed font-semibold">
                기말고사, 수능일, 학교 축제, 방학 등으로 Wee클래스 면대면 상담 진행이 어려운 날들을 지정하세요.
                해당 기간은 학생들이 예약 1단계에서 일자를 고를 때 "신청 불가"로 강제 락 처리됩니다.
              </p>

              <form onSubmit={handleAddBlackoutDate} className="flex gap-2 font-sans">
                <input
                  type="date"
                  required
                  value={newBlackoutDate}
                  onChange={(e) => setNewBlackoutDate(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none text-xs text-[#334E52] font-extrabold focus:border-[#FFD1D1]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#FF8E8E] hover:bg-[#ff7a7a] text-white font-black rounded-xl text-xs shrink-0 cursor-pointer"
                >
                  제한 등록
                </button>
              </form>

              <div className="space-y-2 mt-4 font-sans">
                <span className="block text-xs font-bold text-[#4A6D73]">지정된 예약 제한 일 목록:</span>
                
                <div className="flex flex-wrap gap-1.5">
                  {adminConfig.settings.blackoutDates.length === 0 ? (
                    <span className="text-xs text-[#9BBCC2] block font-medium bg-slate-50 px-2 py-1 rounded">
                      현재 지정된 차단 일자가 없습니다. (연중 아지트 상시 개방)
                    </span>
                  ) : (
                    adminConfig.settings.blackoutDates.map((date) => (
                      <div key={date} className="px-3 py-1 bg-[#FFF2CC] border border-[#FFD1D1] rounded-full flex items-center gap-1.5 text-xs text-[#FF8E8E] font-extrabold shadow-sm">
                        <span>{date}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveBlackoutDate(date)}
                          className="hover:text-red-600 font-black cursor-pointer"
                          title="제한 해제"
                        >
                          ×
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
