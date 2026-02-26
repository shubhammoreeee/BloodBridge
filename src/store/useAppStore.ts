import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';
export type Urgency = 'Normal' | 'Urgent' | 'Critical';
export type RequestStatus = 'Pending' | 'Accepted' | 'Completed' | 'Cancelled';
export type DonationProgress = 'Waiting' | 'Accepted' | 'Traveling' | 'At Hospital' | 'Donating' | 'Completed';
export type UserRole = 'donor' | 'admin' | null;

export interface BloodRequest {
    id: string;
    bloodType: BloodGroup;
    units: number;
    hospital: string;
    location: string;
    lat: number;
    lng: number;
    urgency: Urgency;
    status: RequestStatus;
    timestamp: number;
    donorId?: string;
    acceptedBy?: string; // Donor Name
    progress?: DonationProgress;
}

export interface UserProfile {
    name: string;
    phone: string;
    bloodGroup: BloodGroup;
    location: string;
    lat: number;
    lng: number;
    points: number;
    lastDonation: string;
    donationsCount: number;
    onboarded: boolean;
}

export interface AdminProfile {
    name: string;
    hospitalName: string;
    adminId: string;
    onboarded: boolean;
}

export interface MockDonor {
    id: string;
    name: string;
    bloodGroup: BloodGroup;
    lat: number;
    lng: number;
    distance: string;
}

interface AppState {
    role: UserRole;
    donorProfile: UserProfile;
    adminProfile: AdminProfile;
    requests: BloodRequest[];
    inventory: Record<BloodGroup, number>;
    notifications: Array<{ id: string; message: string; type: 'info' | 'success' | 'alert' }>;
    mockDonors: MockDonor[];
    isDemoRunning: boolean;

    // Actions
    setRole: (role: UserRole) => void;
    updateDonorProfile: (updates: Partial<UserProfile>) => void;
    updateAdminProfile: (updates: Partial<AdminProfile>) => void;
    addRequest: (request: Omit<BloodRequest, 'id' | 'timestamp' | 'status'>) => void;
    updateRequestStatus: (id: string, status: RequestStatus, donorId?: string, progress?: DonationProgress) => void;
    addNotification: (message: string, type: 'info' | 'success' | 'alert') => void;
    removeNotification: (id: string) => void;
    runSystemDemo: () => void;
    resetApp: () => void;
}

const DEFAULT_DONOR: UserProfile = {
    name: '',
    phone: '',
    bloodGroup: 'O+',
    location: 'Downtown',
    lat: 40.7128,
    lng: -74.006,
    points: 1250,
    lastDonation: '2023-10-15',
    donationsCount: 9,
    onboarded: false,
};

const DEFAULT_ADMIN: AdminProfile = {
    name: '',
    hospitalName: '',
    adminId: '',
    onboarded: false,
};

const INITIAL_REQUESTS: BloodRequest[] = [
    {
        id: '1',
        bloodType: 'O+',
        units: 2,
        hospital: 'City General Hospital',
        location: 'Downtown',
        lat: 40.7128,
        lng: -74.006,
        urgency: 'Critical',
        status: 'Pending',
        timestamp: Date.now() - 120000,
    }
];

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            role: null,
            donorProfile: DEFAULT_DONOR,
            adminProfile: DEFAULT_ADMIN,
            requests: INITIAL_REQUESTS,
            inventory: {
                'A+': 85, 'A-': 20, 'B+': 65, 'B-': 15,
                'O+': 110, 'O-': 12, 'AB+': 45, 'AB-': 8
            },
            notifications: [],
            mockDonors: [
                { id: 'd1', name: 'Alice Smith', bloodGroup: 'O+', lat: 40.7242, lng: -74.0012, distance: '1.2 km' },
                { id: 'd2', name: 'Bob Johnson', bloodGroup: 'A-', lat: 40.7012, lng: -74.0122, distance: '2.5 km' },
                { id: 'd3', name: 'Cody Miller', bloodGroup: 'O+', lat: 40.7312, lng: -73.9922, distance: '0.8 km' },
                { id: 'd4', name: 'Diana Ross', bloodGroup: 'B+', lat: 40.7092, lng: -73.9822, distance: '3.1 km' },
            ],
            isDemoRunning: false,

            setRole: (role) => set({ role }),

            updateDonorProfile: (updates) => set((state) => ({
                donorProfile: { ...state.donorProfile, ...updates }
            })),

            updateAdminProfile: (updates) => set((state) => ({
                adminProfile: { ...state.adminProfile, ...updates }
            })),

            addRequest: (req) => set((state) => ({
                requests: [
                    {
                        ...req,
                        id: Math.random().toString(36).substr(2, 9),
                        timestamp: Date.now(),
                        status: 'Pending',
                    },
                    ...state.requests
                ]
            })),

            updateRequestStatus: (id, status, donorId, progress) => set((state) => {
                const updatedRequests = state.requests.map((r) =>
                    r.id === id ? {
                        ...r,
                        status,
                        donorId: donorId || r.donorId,
                        progress: progress || (status === 'Accepted' ? 'Accepted' : status === 'Completed' ? 'Completed' : r.progress),
                        acceptedBy: donorId === 'me' ? state.donorProfile.name : (donorId || r.acceptedBy)
                    } : r
                );

                let newDonorProfile = { ...state.donorProfile };
                let newInventory = { ...state.inventory };

                if (status === 'Completed') {
                    const req = state.requests.find(r => r.id === id);
                    if (req) {
                        const isActiveUser = donorId === 'me' || req.donorId === 'me' || req.acceptedBy === state.donorProfile.name;
                        if (isActiveUser) {
                            newDonorProfile.points += 100; // Increased points for MVP feel
                            newDonorProfile.donationsCount += 1;
                            newDonorProfile.lastDonation = new Date().toISOString().split('T')[0];
                        }
                        newInventory[req.bloodType] += req.units;
                    }
                }

                return {
                    requests: updatedRequests,
                    donorProfile: newDonorProfile,
                    inventory: newInventory
                };
            }),

            addNotification: (message, type) => {
                const id = Math.random().toString(36).substr(2, 9);
                set((state) => ({
                    notifications: [...state.notifications, { id, message, type }]
                }));
                setTimeout(() => get().removeNotification(id), 5000);
            },

            removeNotification: (id) => set((state) => ({
                notifications: state.notifications.filter((n) => n.id !== id)
            })),

            runSystemDemo: () => {
                if (get().isDemoRunning) return;
                set({ isDemoRunning: true });
                const { addRequest, addNotification, updateRequestStatus } = get();

                addNotification("DEMO: Admin broadcasting emergency alert...", "info");

                let requestId = '';

                // Step 1: Create Request
                setTimeout(() => {
                    addRequest({
                        bloodType: 'O+',
                        units: 3,
                        hospital: 'Central Mercy Hospital',
                        location: 'Sector 5',
                        lat: 40.7128,
                        lng: -74.006,
                        urgency: 'Critical',
                    });
                    requestId = get().requests[0].id;
                    addNotification("DEMO: Emergency signal broadcasted!", "info");
                }, 500);

                // Step 2: Donor Accepts (3 sec)
                setTimeout(() => {
                    updateRequestStatus(requestId, 'Accepted', 'Rahul Sharma', 'Accepted');
                    addNotification("DEMO: Donor Rahul Sharma (O+) has accepted!", "success");
                }, 3000);

                // Step 3: Traveling (5 sec)
                setTimeout(() => {
                    updateRequestStatus(requestId, 'Accepted', 'Rahul Sharma', 'Traveling');
                    addNotification("DEMO: Donor is traveling to facility", "info");
                }, 5000);

                // Step 4: Hospital Reached (8 sec)
                setTimeout(() => {
                    updateRequestStatus(requestId, 'Accepted', 'Rahul Sharma', 'At Hospital');
                    addNotification("DEMO: Donor reached hospital. Verification complete.", "info");
                }, 8000);

                // Step 5: Donation Completed (12 sec)
                setTimeout(() => {
                    updateRequestStatus(requestId, 'Completed', 'Rahul Sharma', 'Completed');
                    addNotification("DEMO: Donation complete! Donor rewarded +100 pts.", "success");
                    set({ isDemoRunning: false });
                }, 12000);
            },

            resetApp: () => set({
                role: null,
                donorProfile: DEFAULT_DONOR,
                adminProfile: DEFAULT_ADMIN,
                requests: INITIAL_REQUESTS,
                isDemoRunning: false
            })
        }),
        {
            name: 'blood-bridge-persist-v3',
        }
    )
);
