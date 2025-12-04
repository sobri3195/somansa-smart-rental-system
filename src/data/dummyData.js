export const dummyProperties = [
  {
    id: 1,
    name: "Luxury Villa Sunset View",
    type: "house",
    category: "House",
    description: "Beautiful 3-bedroom villa with stunning sunset views and modern amenities. Perfect for families.",
    address: "Jl. Sunset Paradise No. 123, Bali",
    city: "Denpasar",
    province: "Bali",
    price: 5000000,
    price_per_day: 500000,
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    facilities: ["WiFi", "AC", "Pool", "Parking", "Kitchen", "Garden"],
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"
    ],
    rating: 4.8,
    reviews_count: 156,
    available: true,
    verified: true,
    featured: true
  },
  {
    id: 2,
    name: "Modern Kos Exclusive",
    type: "boarding",
    category: "Boarding",
    description: "Comfortable boarding house with private bathroom, perfect for students and young professionals.",
    address: "Jl. Pendidikan No. 45, Yogyakarta",
    city: "Yogyakarta",
    province: "DIY",
    price: 1200000,
    price_per_day: 40000,
    bedrooms: 1,
    bathrooms: 1,
    area: 20,
    facilities: ["WiFi", "AC", "Bed", "Desk", "Wardrobe", "Water Heater"],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800"
    ],
    rating: 4.6,
    reviews_count: 89,
    available: true,
    verified: true,
    featured: true
  },
  {
    id: 3,
    name: "Toyota Avanza 2022",
    type: "car",
    category: "Car",
    description: "Well-maintained Toyota Avanza, perfect for family trips. Includes driver option.",
    address: "Rental Center, Jakarta",
    city: "Jakarta",
    province: "DKI Jakarta",
    price: 350000,
    price_per_day: 350000,
    seats: 7,
    transmission: "Manual",
    fuel_type: "Petrol",
    year: 2022,
    facilities: ["AC", "Audio System", "GPS", "Child Seat Available"],
    images: [
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800"
    ],
    rating: 4.7,
    reviews_count: 234,
    available: true,
    verified: true,
    featured: true
  },
  {
    id: 4,
    name: "Minimalist House in City Center",
    type: "house",
    category: "House",
    description: "2-bedroom minimalist house in strategic location, close to shopping centers and public transport.",
    address: "Jl. Sudirman No. 789, Surabaya",
    city: "Surabaya",
    province: "East Java",
    price: 3500000,
    price_per_day: 350000,
    bedrooms: 2,
    bathrooms: 1,
    area: 90,
    facilities: ["WiFi", "AC", "Parking", "Kitchen", "Laundry"],
    images: [
      "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"
    ],
    rating: 4.5,
    reviews_count: 67,
    available: true,
    verified: true,
    featured: false
  },
  {
    id: 5,
    name: "Student Kos Budget Friendly",
    type: "boarding",
    category: "Boarding",
    description: "Affordable boarding house for students, shared facilities, friendly environment.",
    address: "Jl. Kampus Raya No. 12, Bandung",
    city: "Bandung",
    province: "West Java",
    price: 750000,
    price_per_day: 25000,
    bedrooms: 1,
    bathrooms: 1,
    area: 12,
    facilities: ["WiFi", "Bed", "Desk", "Shared Kitchen", "Laundry"],
    images: [
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800"
    ],
    rating: 4.3,
    reviews_count: 45,
    available: true,
    verified: true,
    featured: false
  },
  {
    id: 6,
    name: "Honda Brio 2023",
    type: "car",
    category: "Car",
    description: "Compact and fuel-efficient Honda Brio, perfect for city driving.",
    address: "Rental Center, Bandung",
    city: "Bandung",
    province: "West Java",
    price: 250000,
    price_per_day: 250000,
    seats: 5,
    transmission: "Automatic",
    fuel_type: "Petrol",
    year: 2023,
    facilities: ["AC", "Audio System", "USB Charging"],
    images: [
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800"
    ],
    rating: 4.6,
    reviews_count: 178,
    available: true,
    verified: true,
    featured: false
  }
];

export const dummyTestimonials = [
  {
    id: 1,
    name: "Rina Wijaya",
    avatar: "https://i.pravatar.cc/150?img=1",
    rating: 5,
    comment: "Pelayanan sangat memuaskan! Villa yang saya sewa sangat bersih dan sesuai foto. Pasti akan booking lagi!",
    property: "Luxury Villa Sunset View",
    date: "2024-01-15"
  },
  {
    id: 2,
    name: "Budi Santoso",
    avatar: "https://i.pravatar.cc/150?img=2",
    rating: 5,
    comment: "Kos yang nyaman dengan harga terjangkau. Fasilitas lengkap dan pemilik sangat ramah.",
    property: "Modern Kos Exclusive",
    date: "2024-01-12"
  },
  {
    id: 3,
    name: "Sarah Ahmad",
    avatar: "https://i.pravatar.cc/150?img=3",
    rating: 4,
    comment: "Mobil dalam kondisi bagus, proses rental cepat. Sangat membantu untuk liburan keluarga.",
    property: "Toyota Avanza 2022",
    date: "2024-01-10"
  },
  {
    id: 4,
    name: "Ahmad Fauzi",
    avatar: "https://i.pravatar.cc/150?img=4",
    rating: 5,
    comment: "Rumah strategis, dekat dengan kampus. Sangat cocok untuk mahasiswa!",
    property: "Minimalist House in City Center",
    date: "2024-01-08"
  },
  {
    id: 5,
    name: "Linda Kusuma",
    avatar: "https://i.pravatar.cc/150?img=5",
    rating: 5,
    comment: "Sistem booking online sangat mudah. Customer service responsif. Highly recommended!",
    property: "Luxury Villa Sunset View",
    date: "2024-01-05"
  },
  {
    id: 6,
    name: "Dedi Setiawan",
    avatar: "https://i.pravatar.cc/150?img=6",
    rating: 4,
    comment: "Harga kompetitif, lokasi strategis. Saya sangat puas dengan pelayanannya.",
    property: "Student Kos Budget Friendly",
    date: "2024-01-03"
  }
];

export const dummyStats = {
  total_properties: 1250,
  total_bookings: 8500,
  happy_customers: 5200,
  cities_covered: 34
};

export const dummyPartners = [
  { id: 1, name: "Bank Mandiri", logo: "🏦" },
  { id: 2, name: "BCA", logo: "💳" },
  { id: 3, name: "GoPay", logo: "💰" },
  { id: 4, name: "OVO", logo: "💵" },
  { id: 5, name: "Dana", logo: "💸" },
  { id: 6, name: "LinkAja", logo: "🏧" }
];

export const dummyFAQs = [
  {
    id: 1,
    question: "Bagaimana cara melakukan booking?",
    answer: "Anda dapat melakukan booking dengan memilih properti yang diinginkan, mengisi form booking, dan mengikuti instruksi pembayaran. Konfirmasi akan dikirim melalui email."
  },
  {
    id: 2,
    question: "Apakah bisa membatalkan booking?",
    answer: "Ya, pembatalan dapat dilakukan maksimal 3 hari sebelum tanggal check-in dengan pengembalian dana 80%. Untuk kebijakan detail, silakan hubungi customer service."
  },
  {
    id: 3,
    question: "Metode pembayaran apa saja yang tersedia?",
    answer: "Kami menerima pembayaran melalui transfer bank, e-wallet (GoPay, OVO, Dana), dan virtual account dari berbagai bank."
  },
  {
    id: 4,
    question: "Apakah ada biaya tambahan?",
    answer: "Harga yang tertera sudah termasuk pajak. Biaya tambahan mungkin berlaku untuk layanan ekstra seperti antar jemput atau extra person."
  },
  {
    id: 5,
    question: "Bagaimana cara menghubungi customer service?",
    answer: "Customer service kami tersedia 24/7 melalui WhatsApp, email, dan live chat. Anda juga dapat menemukan nomor kontak di halaman properti."
  }
];

export const dummyPromotions = [
  {
    id: 1,
    title: "Diskon 30% untuk Booking Pertama!",
    description: "Dapatkan diskon spesial untuk booking pertama Anda",
    code: "FIRST30",
    discount: 30,
    valid_until: "2024-12-31"
  },
  {
    id: 2,
    title: "Weekend Special - Diskon 20%",
    description: "Booking weekend sekarang lebih hemat!",
    code: "WEEKEND20",
    discount: 20,
    valid_until: "2024-06-30"
  },
  {
    id: 3,
    title: "Early Bird - Diskon 15%",
    description: "Booking 2 minggu sebelumnya dapat extra diskon",
    code: "EARLY15",
    discount: 15,
    valid_until: "2024-12-31"
  }
];

export const dummyRecentActivities = [
  { id: 1, user: "Andi", action: "booked", property: "Luxury Villa", time: "2 menit lalu" },
  { id: 2, user: "Siti", action: "reviewed", property: "Modern Kos", time: "5 menit lalu" },
  { id: 3, user: "Budi", action: "booked", property: "Toyota Avanza", time: "8 menit lalu" },
  { id: 4, user: "Dewi", action: "booked", property: "Minimalist House", time: "12 menit lalu" },
  { id: 5, user: "Rizki", action: "reviewed", property: "Student Kos", time: "15 menit lalu" }
];

export const dummyFeatures = [
  {
    icon: "✅",
    title: "Verified Properties",
    description: "All properties are verified and quality-checked"
  },
  {
    icon: "💰",
    title: "Best Prices",
    description: "Competitive pricing with no hidden fees"
  },
  {
    icon: "🔒",
    title: "Secure Booking",
    description: "Your data is protected with encryption"
  },
  {
    icon: "⚡",
    title: "Instant Confirmation",
    description: "Get booking confirmation immediately"
  },
  {
    icon: "🎯",
    title: "Easy Cancellation",
    description: "Flexible cancellation policy"
  },
  {
    icon: "💬",
    title: "24/7 Support",
    description: "Customer support available anytime"
  }
];

export const dummyUnits = {
  1: [ // Luxury Villa Sunset View
    {
      id: 101,
      property_id: 1,
      unit_number: "A1",
      floor: 1,
      price: 5000000,
      status: "available",
      description: "Main villa with pool access"
    },
    {
      id: 102,
      property_id: 1,
      unit_number: "A2",
      floor: 2,
      price: 5500000,
      status: "available",
      description: "Upper floor with sea view"
    }
  ],
  2: [ // Modern Kos Exclusive
    {
      id: 201,
      property_id: 2,
      unit_number: "Room 1",
      floor: 1,
      price: 1200000,
      status: "available",
      description: "Ground floor room"
    },
    {
      id: 202,
      property_id: 2,
      unit_number: "Room 2",
      floor: 2,
      price: 1200000,
      status: "available",
      description: "Second floor room"
    },
    {
      id: 203,
      property_id: 2,
      unit_number: "Room 3",
      floor: 2,
      price: 1300000,
      status: "booked",
      description: "Premium room with balcony"
    }
  ],
  3: [ // Toyota Avanza 2022
    {
      id: 301,
      property_id: 3,
      unit_number: "B 1234 CD",
      price: 350000,
      status: "available",
      description: "Manual transmission, silver color"
    },
    {
      id: 302,
      property_id: 3,
      unit_number: "B 5678 EF",
      price: 350000,
      status: "available",
      description: "Manual transmission, black color"
    }
  ],
  4: [ // Minimalist House in City Center
    {
      id: 401,
      property_id: 4,
      unit_number: "House A",
      price: 3500000,
      status: "available",
      description: "Complete unit"
    }
  ],
  5: [ // Student Kos Budget Friendly
    {
      id: 501,
      property_id: 5,
      unit_number: "Room 1",
      floor: 1,
      price: 750000,
      status: "available",
      description: "Ground floor"
    },
    {
      id: 502,
      property_id: 5,
      unit_number: "Room 2",
      floor: 1,
      price: 750000,
      status: "booked",
      description: "Ground floor"
    },
    {
      id: 503,
      property_id: 5,
      unit_number: "Room 3",
      floor: 2,
      price: 750000,
      status: "available",
      description: "Second floor"
    }
  ],
  6: [ // Honda Brio 2023
    {
      id: 601,
      property_id: 6,
      unit_number: "B 9012 GH",
      price: 250000,
      status: "available",
      description: "Automatic transmission, white color"
    }
  ]
};
