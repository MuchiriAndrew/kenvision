export type CourseCategory =
  | 'Security Systems'
  | 'Automotive Technology'
  | 'Facilities & Property'
  | 'Electrical & Power'
  | 'ICT & Technical'
  | 'Professional & Management'

export interface Course {
  id: string
  num: number
  title: string
  category: CourseCategory
  tags: string[]
  price: number
  was?: number
  image?: string
  summary?: string
  duration?: string
  featured?: boolean
  updatedAt?: string
  meta?: { title?: string | null; description?: string | null; image?: { url?: string | null } | number | null }
  description?: unknown
  requirements?: string[]
  outcomes?: string[]
  deliveryModes?: string[]
  upcomingDate?: string | null
  level?: string | null
}

export const courses: Course[] = [
  {
    id: 'accounting-records-management',
    num: 1,
    title: 'Accounting Records Management Skills Training',
    category: 'Professional & Management',
    tags: ['Accounting Records'],
    price: 85000,
    was: 101100,
  },
  {
    id: 'executive-personal-secretaries',
    num: 2,
    title: 'Executive Personal and Administrative Secretaries Skills Training',
    category: 'Professional & Management',
    tags: ['Secretarial Skills'],
    price: 85000,
    was: 109620,
  },
  {
    id: 'fire-detection-suppression',
    num: 3,
    title: 'Fire Detection, Suppression & Alarm System Installation',
    category: 'Security Systems',
    tags: ['Fire', 'Installation'],
    price: 60000,
  },
  {
    id: 'facilities-property-management',
    num: 4,
    title: 'Facilities & Property Management Specialist Training',
    category: 'Facilities & Property',
    tags: ['Facilities'],
    price: 90000,
    was: 102400,
  },
  {
    id: 'advanced-supervisory-skills',
    num: 5,
    title: 'Advanced Supervisory Skills Certificate Course',
    category: 'Professional & Management',
    tags: ['Supervisory Skills'],
    price: 150000,
    was: 206400,
  },
  {
    id: 'total-property-security',
    num: 6,
    title: 'Total Property Security Systems Installation Course',
    category: 'Security Systems',
    tags: ['Property Security'],
    price: 128000,
    was: 152000,
  },
  {
    id: 'integrated-facility-security-electric-fencing',
    num: 7,
    title: 'Integrated Facility Security Systems Installation + Electric Fencing Skills',
    category: 'Security Systems',
    tags: ['Access Control', 'Electric Fencing'],
    price: 76000,
  },
  {
    id: 'integrated-facilities-security',
    num: 8,
    title: 'Integrated Facilities Security Systems Installation Program',
    category: 'Security Systems',
    tags: ['Security Systems'],
    price: 59500,
    was: 65000,
  },
  {
    id: 'practical-electric-fencing-2026',
    num: 9,
    title: 'Practical Electric Fencing Specialist Skills Training – 2026',
    category: 'Security Systems',
    tags: ['Perimeter Protection', 'Electric Fencing'],
    price: 18000,
  },
  {
    id: 'cctv-operator-control-room',
    num: 10,
    title: 'CCTV System Operator & Control Room Management Skills Training',
    category: 'Security Systems',
    tags: ['CCTV Operations'],
    price: 30000,
  },
  {
    id: 'ecu-programming-remapping-a',
    num: 11,
    title: 'ECU Programming & Remapping Skills Training',
    category: 'Automotive Technology',
    tags: ['Auto', 'Car'],
    price: 78000,
    was: 166000,
  },
  {
    id: 'ecu-programming-remapping-b',
    num: 12,
    title: 'ECU Programming & Remapping Skills Training',
    category: 'Automotive Technology',
    tags: ['Auto', 'Auto Engine Diagnosis'],
    price: 78000,
    was: 166000,
  },
  {
    id: 'biometric-access-control-time-attendance',
    num: 13,
    title: 'Biometric Access Control & Time Attendance Skills Training',
    category: 'Security Systems',
    tags: ['Access Control', 'Installation'],
    price: 30000,
  },
  {
    id: 'cctv-operator-control-room-b',
    num: 14,
    title: 'CCTV System Operator & Control Room Management Skills Training',
    category: 'Security Systems',
    tags: ['CCTV Operations'],
    price: 30000,
    was: 48000,
  },
  {
    id: 'cctv-architecture-design-management-a',
    num: 15,
    title: 'CCTV Architecture, Design & Management Skills Training',
    category: 'Security Systems',
    tags: ['CCTV'],
    price: 20000,
  },
  {
    id: 'burglar-alarm-installation-a',
    num: 16,
    title: 'Burglar & Intruder Alarm Specialist Installation Training',
    category: 'Security Systems',
    tags: ['Alarm Systems'],
    price: 15000,
    was: 18000,
  },
  {
    id: 'practical-ecu-master-automotive',
    num: 17,
    title: 'Practical ECU Programming & Remapping Skills Training – Master Automotive Electronics',
    category: 'Automotive Technology',
    tags: ['Car ECU Programming', 'Car Security'],
    price: 78000,
  },
  {
    id: 'generator-synchronization-ups-comap',
    num: 18,
    title: 'Generator Synchronization & UPS Management with ComAp InteliGen 4 200 Skills Training',
    category: 'Electrical & Power',
    tags: ['Generator Synchronization', 'Generators', 'UPS'],
    price: 113200,
    was: 230400,
  },
  {
    id: 'practical-ecu-programming-skills',
    num: 19,
    title: 'Practical ECU Programming Skills Training – Master Automotive Electronics',
    category: 'Automotive Technology',
    tags: ['Auto Engine Diagnosis', 'Car ECU Programming'],
    price: 78000,
  },
  {
    id: 'fibre-optic-installation',
    num: 20,
    title: 'Fibre Optic Installation, Maintenance & Repair Skills Training',
    category: 'ICT & Technical',
    tags: ['Fibre Optics'],
    price: 51200,
  },
  {
    id: 'mobile-phone-repair',
    num: 21,
    title: 'Mobile Phone Repair & Maintenance Skills Training',
    category: 'ICT & Technical',
    tags: ['Mobile Phone Repair'],
    price: 55000,
    was: 65000,
  },
  {
    id: 'cctv-architecture-design-management-b',
    num: 22,
    title: 'CCTV Architecture, Design & Management',
    category: 'Security Systems',
    tags: ['CCTV'],
    price: 20000,
  },
  {
    id: 'executive-public-speaking',
    num: 23,
    title: 'Executive Public Speaking Skills Workshop',
    category: 'Professional & Management',
    tags: ['Public Speaking'],
    price: 78000,
    was: 90000,
  },
  {
    id: 'archicad-specialist',
    num: 24,
    title: 'ArchiCAD Specialist Skills',
    category: 'Facilities & Property',
    tags: ['Design', 'Facilities', 'ArchiCAD'],
    price: 80000,
    was: 83850,
  },
  {
    id: 'corporate-document-control',
    num: 25,
    title: 'Corporate Document Control Training',
    category: 'Professional & Management',
    tags: ['Document Control'],
    price: 85000,
    was: 90000,
  },
  {
    id: 'car-key-programming',
    num: 26,
    title: 'Car Key Programming & Duplication Skills Training',
    category: 'Automotive Technology',
    tags: ['Auto', 'Car Key Programming'],
    price: 47500,
    was: 57600,
  },
  {
    id: 'car-audio-installation',
    num: 27,
    title: 'Car Audio Systems Installation & Servicing Skills Certificate Training',
    category: 'Automotive Technology',
    tags: ['Audio', 'Auto', 'Car Audio'],
    price: 48000,
    was: 64000,
  },
  {
    id: 'car-alarm-immobilizer-tracking',
    num: 28,
    title: 'Car Alarm, Engine Immobilizer & Tracking Systems Installation & Management Skills Training',
    category: 'Automotive Technology',
    tags: ['Auto', 'Car Security'],
    price: 48000,
    was: 63000,
  },
  {
    id: 'fimm-training',
    num: 29,
    title: 'Facilities Infrastructure, Maintenance and Management (FIMM) Training',
    category: 'Facilities & Property',
    tags: ['Facilities', 'FIMM'],
    price: 150000,
    was: 192000,
  },
  {
    id: 'cctv-architecture-design-installation',
    num: 30,
    title: 'CCTV Architecture, Design, Installation & Maintenance Skills Training',
    category: 'Security Systems',
    tags: ['CCTV'],
    price: 20000,
    was: 25000,
  },
  {
    id: 'car-engine-diagnostics',
    num: 31,
    title: 'Car Engine Diagnostics Skills Training',
    category: 'Automotive Technology',
    tags: ['Auto', 'Engine Diagnostics'],
    price: 47500,
    was: 57600,
  },
  {
    id: 'burglar-alarm-installation-b',
    num: 32,
    title: 'Burglar & Intruder Alarm Specialist Installation Training',
    category: 'Security Systems',
    tags: ['Access Control', 'Alarm'],
    price: 15000,
  },
  {
    id: 'cctv-ip-networking',
    num: 33,
    title: 'CCTV Installation over IP & Basic Networking Skills Training',
    category: 'Security Systems',
    tags: ['CCTV Installation'],
    price: 20000,
    was: 25000,
  },
  {
    id: 'emergency-generator-repair',
    num: 34,
    title: 'Emergency Power Generator Repair & Maintenance Skills Training',
    category: 'Electrical & Power',
    tags: ['Generators'],
    price: 102000,
    was: 166400,
  },
  {
    id: 'intruder-alarm-installation-2026',
    num: 35,
    title: 'Intruder Alarm System Installation Skills Training – 2026',
    category: 'Security Systems',
    tags: ['Alarm'],
    price: 15000,
  },
  {
    id: 'basic-auto-electrics',
    num: 36,
    title: 'Basic Auto Electrics, Electronics & Diagnostics Skills',
    category: 'Automotive Technology',
    tags: ['Auto', 'Auto Electrics'],
    price: 135000,
  },
  {
    id: 'biometric-access-control-installation',
    num: 37,
    title: 'Biometric Access Control Installation',
    category: 'Security Systems',
    tags: ['Access Control'],
    price: 30000,
  },
  {
    id: 'auto-electrical-systems',
    num: 38,
    title: 'Auto (Car) Electrical Systems Skills Training',
    category: 'Automotive Technology',
    tags: ['Auto Engine Diagnosis', 'Engine Diagnostics'],
    price: 47500,
    was: 65000,
  },
  {
    id: 'car-engine-component-diagnostics',
    num: 39,
    title: 'Car Engine Component Diagnostics Skills Training',
    category: 'Automotive Technology',
    tags: ['Auto', 'Auto Engine Diagnosis'],
    price: 46000,
    was: 76000,
  },
  {
    id: 'basic-electricity-non-electricians',
    num: 40,
    title: 'Basic Electricity Skills for Non-Electricians Skills Training',
    category: 'Electrical & Power',
    tags: ['Electricity', 'Installation'],
    price: 52000,
    was: 57600,
  },
]

export const categories: CourseCategory[] = [
  'Security Systems',
  'Automotive Technology',
  'Facilities & Property',
  'Electrical & Power',
  'ICT & Technical',
  'Professional & Management',
]

export function formatPrice(n: number) {
  return `KSh ${n.toLocaleString('en-KE')}`
}
