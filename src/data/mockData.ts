export const stats = [
    { label: 'Lives Saved', value: '12,450+', icon: 'Heart' },
    { label: 'Active Donors', value: '8,200', icon: 'Users' },
    { label: 'Emergency Requests', value: '142', icon: 'AlertCircle' },
];

export const emergencyRequests = [
    { id: 1, type: 'O+', location: 'City Hospital', distance: '2.3km', urgency: 'Critical', time: '2 mins ago' },
    { id: 2, type: 'A-', location: 'St. Mary\'s', distance: '5.1km', urgency: 'Urgent', time: '10 mins ago' },
    { id: 3, type: 'B+', location: 'General Clinic', distance: '1.2km', urgency: 'High', time: '15 mins ago' },
];

export const donorHistory = [
    { date: '2023-12-15', location: 'City Hospital', units: 1, points: 50 },
    { date: '2023-08-20', location: 'Red Cross Center', units: 1, points: 50 },
    { date: '2023-04-10', location: 'Metro Blood Bank', units: 1, points: 50 },
];

export const leaderboard = [
    { id: 1, name: 'Alex Johnson', donations: 15, points: 750, rank: 1 },
    { id: 2, name: 'Sarah Chen', donations: 12, points: 600, rank: 2 },
    { id: 3, name: 'Michael Ross', donations: 10, points: 500, rank: 3 },
    { id: 4, name: 'Emma Wilson', donations: 8, points: 400, rank: 4 },
    { id: 5, name: 'David Kim', donations: 7, points: 350, rank: 5 },
];

export const bloodInventory = [
    { group: 'A+', stock: 85, status: 'Stable' },
    { group: 'A-', stock: 20, status: 'Low' },
    { group: 'B+', stock: 65, status: 'Stable' },
    { group: 'B-', stock: 15, status: 'Critical' },
    { group: 'O+', stock: 110, status: 'Stable' },
    { group: 'O-', stock: 12, status: 'Critical' },
    { group: 'AB+', stock: 45, status: 'Stable' },
    { group: 'AB-', stock: 8, status: 'Critical' },
];
