export const sampleProperties = [
  {
    id: 'sample-1', propertyName: 'Green Valley PG', propertyType: 'pg', roomType: 'double', gender: 'boys',
    location: 'Chandlodia, near Nirma University', city: 'Ahmedabad', state: 'Gujarat', pincode: '382481',
    lat: 23.0442, lng: 72.536, monthlyRent: 8500, securityDeposit: 17000, availableRooms: 12,
    availability: 'available', description: 'Spacious double-sharing rooms, mess with home-style food and high-speed Wi-Fi.',
    facilities: ['wifi', 'meals', 'security', 'housekeeping'], contactNumber: '9876501234', ownerEmail: 'owner@greenvalley.in',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'], createdAt: '2026-01-01T09:00:00.000Z'
  },
  {
    id: 'sample-2', propertyName: 'Sunrise Boys Hostel', propertyType: 'hostel', roomType: 'triple', gender: 'boys',
    location: 'Sarkhej, SG Highway', city: 'Ahmedabad', state: 'Gujarat', pincode: '382210', lat: 23.0355, lng: 72.5,
    monthlyRent: 7000, securityDeposit: 14000, availableRooms: 8, availability: 'available',
    description: 'Budget hostel with gym access, cafeteria and 24x7 power backup.', facilities: ['wifi', 'laundry', 'powerBackup', 'cctv'],
    contactNumber: '9822334455', ownerEmail: 'info@sunrisehostel.in', image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
    images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800'], createdAt: '2026-01-02T09:00:00.000Z'
  },
  {
    id: 'sample-3', propertyName: 'Kamla Girls PG', propertyType: 'pg', roomType: 'single', gender: 'girls',
    location: 'Nirma University Road', city: 'Ahmedabad', state: 'Gujarat', pincode: '382481', lat: 23.04, lng: 72.53,
    monthlyRent: 9800, securityDeposit: 20000, availableRooms: 5, availability: 'available',
    description: 'Premium girls PG with AC rooms, study lounge and canteen on campus.', facilities: ['wifi', 'ac', 'meals', 'security', 'studyArea'],
    contactNumber: '9979876543', ownerEmail: 'kamla@example.com', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800',
    images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800'], createdAt: '2026-01-03T09:00:00.000Z'
  },
  {
    id: 'sample-4', propertyName: 'Crystal Unisex PG', propertyType: 'pg', roomType: 'dormitory', gender: 'unisex',
    location: 'SG Highway, near Mahagujarat', city: 'Ahmedabad', state: 'Gujarat', pincode: '380054', lat: 23.025, lng: 72.52,
    monthlyRent: 6500, securityDeposit: 13000, availableRooms: 20, availability: 'available',
    description: 'Hygienic dormitory beds with lockers, common kitchen and TV lounge.', facilities: ['wifi', 'laundry', 'water', 'cctv'],
    contactNumber: '9090909090', ownerEmail: 'crystal@example.com', image: 'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=800',
    images: ['https://images.unsplash.com/photo-1501183638710-841dd1904471?w=800'], createdAt: '2026-01-04T09:00:00.000Z'
  },
  {
    id: 'sample-5', propertyName: 'Shree Sai Residency', propertyType: 'apartment', roomType: 'double', gender: 'boys',
    location: 'Chandlodia, near EWS Hostel', city: 'Ahmedabad', state: 'Gujarat', pincode: '382481', lat: 23.05, lng: 72.54,
    monthlyRent: 8200, securityDeposit: 16000, availableRooms: 7, availability: 'available',
    description: 'Fully-furnished apartment-style PG with weekly housekeeping.', facilities: ['wifi', 'housekeeping', 'powerBackup', 'security'],
    contactNumber: '9123456780', ownerEmail: 'sai.residency@example.com', image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
    images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800'], createdAt: '2026-01-05T09:00:00.000Z'
  },
  {
    id: 'sample-6', propertyName: 'Lake View Hostel', propertyType: 'hostel', roomType: 'single', gender: 'unisex',
    location: 'Science City Road', city: 'Ahmedabad', state: 'Gujarat', pincode: '380060', lat: 23.03, lng: 72.51,
    monthlyRent: 10500, securityDeposit: 21000, availableRooms: 4, availability: 'pending',
    description: 'Premium hostel facing the lake with rooftop cafe and co-working space.', facilities: ['wifi', 'gym', 'meals', 'ac', 'studyArea'],
    contactNumber: '9234567890', ownerEmail: 'lakeview@example.com', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
    images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'], createdAt: '2026-01-06T09:00:00.000Z'
  }
]

export const facilityOptions = [
  ['wifi', 'Wi-Fi'], ['meals', 'Meals'], ['parking', 'Parking'], ['laundry', 'Laundry'],
  ['housekeeping', 'Housekeeping'], ['powerBackup', 'Power Backup'], ['ac', 'AC'], ['water', 'Water Supply'],
  ['security', 'Security'], ['cctv', 'CCTV'], ['gym', 'Gym'], ['studyArea', 'Study Area']
]

export const labels = {
  gender: { boys: 'Boys', girls: 'Girls', unisex: 'Unisex' },
  room: { single: 'Single', double: 'Double', triple: 'Triple', dormitory: 'Dormitory' },
  status: { available: 'Available', occupied: 'Occupied', pending: 'Pending' },
  type: { pg: 'PG', hostel: 'Hostel', apartment: 'Apartment' }
}
