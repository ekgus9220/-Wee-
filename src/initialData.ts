import { AdminConfig, Reservation } from './types';

export const INITIAL_ADMIN_CONFIG: AdminConfig = {
  announcement: 'Wee 클래스는 항상 열려 있습니다. 환영해요!',
  heroTitle: '서울정화고 Wee클래스',
  heroSubtitle: '마음의 짐을 내려놓고, 잠시 쉬어가는 따뜻한 쉼터입니다.☘️',
  dailyQuote: {
    text: '지치고 슬픈 고등학생들을 가장 따뜻하게 맞이합니다. 힘든 일이 있을 때는 언제든 Wee클래스 상담실 문을 가볍게 두드려봐요. 언제나 가치 있고 소중한 당신과 함께하겠습니다.',
    author: '다현샘 Wee클래스 전문상담실 소소한 응원 💌'
  },
  faqList: [
    {
      id: 'faq-1',
      category: '이용 안내',
      question: '상담은 어떻게 신청하나요?',
      answer: '메인 화면의 \'상담 신청하기\'를 통해 원하는 날짜와 교시(시간)들을 선택하고 간단한 정보를 입력하면 신청 완료됩니다! 상담 확정은 알림 문자 등이 전송되지 않고, 상단의 \'예약 확인\' 메뉴를 통해 설정한 이름과 비밀번호로 스스로 확인하실 수 있습니다.'
    },
    {
      id: 'faq-2',
      category: '비밀 보장',
      question: '상담한 내용이 담임 선생님이나 부모님께 알려지나요?',
      answer: 'Wee클래스의 모든 상담 내용은 철저한 비밀 유지를 최우선 원칙으로 합니다. 단, 자신이나 다른 사람의 안전이 위험한 경우에는 도움을 위해 보호자나 선생님과 함께 이야기할 수 있어요.'
    },
    {
      id: 'faq-3',
      category: '비밀 보장',
      question: '예약 조회에 비밀번호가 필요한가요?',
      answer: '네, 그렇습니다! Wee클래스는 학생 여러분의 사생활과 예약 사실 조차 철저히 보호하기 위해 모바일 문자 전송 대신, 본 웹 어플리케이션 안에서 직접 설정한 4자리 비밀번호와 이름으로 승인 현황 및 시간 조율 일정, 상담실의 비공개 피드백 노트를 조회할 수 있는 완전 비공개 보안 조회 시스템을 갖추고 있습니다.'
    },
    {
      id: 'faq-4',
      category: '상담 유형',
      question: '또래 상담을 받을 수 있나요?',
      answer: '물론입니다! Wee클래스에는 상담교사 선생님뿐만 아니라 훈련받은 우리 학교 \'또래상담부\' 친구들과 함께 소소한 이야기를 나눌 수 있는 편안한 방이 있습니다. 언제든 편한 교시나 점심시간에 놀러와서 사탕과 보드게임을 함께 편안하게 즐기실 수도 있습니다.'
    },
    {
      id: 'faq-5',
      category: '이용 안내',
      question: '심리 검사는 어떤 것을 받을 수 있나요?',
      answer: "STS 6요인 기질검사, GOLDEN 성격유형검사, CST-A 성격강점검사 및 K-CDI 아동우울척도 등 학생 중심의 가벼운 탐색 도구들이 마련되어 있습니다. 예약 시 '심리 검사 신청' 유형을 체크하시면 맞춤형 검사지와 해석 상담을 준비해 드립니다."
    }
  ],
  settings: {
    workingHours: ['8:30', '9:30', '10:30', '11:40', '12:10', '13:10', '14:10', '15:10'],
    breakTime: '',
    blackoutDates: ['2026-06-15', '2026-06-16', '2026-06-17', '2026-06-18', '2026-06-19'], // Exam week
    kakaoLink: 'https://open.kakao.com/o/sSeoulJeonghwaWee',
    location: '본관 3층 복도 끝 Wee클래스 상담실',
    counselorName: '02-6495-4605'
  }
};

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'res-1',
    date: '2026-05-28',
    timeSlot: '10:30',
    name: '김예은',
    isAnonymous: false,
    grade: '2',
    classGroup: '3',
    contact: '010-1234-5678',
    type: 'peer',
    message: '새 학기 학업 고민이랑 성적에 대한 불안감 때문에 또래 친구들이랑 이야기 나누고 싶어서 신청해요.',
    status: 'approved',
    counselorNotes: '학습 성적 고민. 또래상담 도우미 민서 학생 매칭 예정.',
    createdAt: '2026-05-26T08:30:00.000Z'
  },
  {
    id: 'res-2',
    date: '2026-05-28',
    timeSlot: '14:10',
    name: '하늘이',
    isAnonymous: true,
    grade: '1',
    classGroup: '5',
    contact: 'kakao_haneul9',
    type: 'professional',
    message: '친구 관계가 요즘 들어 너무 꼬여서 힘들어요... 학교 오는 게 조금 스트레스예요.',
    status: 'pending',
    createdAt: '2026-05-27T14:15:00.000Z'
  },
  {
    id: 'res-3',
    date: '2026-05-27',
    timeSlot: '11:40',
    name: '이민호',
    isAnonymous: false,
    grade: '3',
    classGroup: '1',
    contact: '010-9876-5432',
    type: 'test',
    message: '진로 적성 검사랑 MBTI 정밀 검사 진행해 보고 싶어요!',
    status: 'completed',
    counselorNotes: 'MBTI 성격유형 정식 검사지 완료 후 프로파일 해석 완료. 진로 계획 수립에 만족 표현함.',
    createdAt: '2026-05-25T03:00:00.000Z'
  },
  {
    id: 'res-4',
    date: '2026-05-29',
    timeSlot: '15:10',
    name: '정우진',
    isAnonymous: false,
    grade: '2',
    classGroup: '2',
    contact: '010-3333-4444',
    type: 'professional',
    message: '진로에 대해 이야기 나누고 앞으로 수시 원서나 전공 선택을 어떻게 가야 할지 교사 선생님이랑 상의하고 싶습니다.',
    status: 'approved',
    createdAt: '2026-05-27T01:10:00.000Z'
  },
  {
    id: 'res-5',
    date: '2026-06-01',
    timeSlot: '10:30',
    name: '민지의숲',
    isAnonymous: true,
    grade: '1',
    classGroup: '2',
    contact: '010-2222-1111',
    type: 'peer',
    message: '고등학교에 와서 적응하는 게 조금 많이 어색한데 편안하게 사소한 언니/친구 또래 조언들을 얻고 싶습니다.',
    status: 'pending',
    createdAt: '2026-05-28T02:00:00.000Z'
  },
  {
    id: 'res-6',
    date: '2026-06-02',
    timeSlot: '13:10',
    name: '최현우',
    isAnonymous: false,
    grade: '3',
    classGroup: '4',
    contact: '010-5555-6666',
    type: 'professional',
    message: '자주 무기력해지고 아침에 눈뜨는 게 많이 힘든데 부모님께는 비밀로 하고 가벼운 이야기를 나누고 싶어요.',
    status: 'canceled',
    counselorNotes: '예약 신청 후 모의고사 일정 변경으로 학생이 유선 취소 연락 옴.',
    createdAt: '2026-05-27T10:00:00.000Z'
  }
];
