import api from './api';

// Owner Dashboard Interfaces
export interface TenantActivity {
  _id: string;
  tenantName: string;
  tenantPhone: string;
  propertyType: string;
  propertyName: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate?: string;
  isActive: boolean;
  lastUpdated: string;
  totalStayDays: number;
  activityType: 'check-in' | 'check-out' | 'payment' | 'update';
}

export interface OccupancyStatus {
  propertyId: string;
  propertyName: string;
  propertyType: 'PG' | 'Room' | 'Flat';
  totalRooms: number;
  occupiedRooms: number;
  occupancyRate: number;
  availableRooms: number;
  pendingCheckouts: number;
}

export interface DashboardOverview {
  totalProperties: number;
  totalRooms: number;
  occupiedRooms: number;
  totalTenants: number;
  monthlyRevenue: number;
  pendingPayments: number;
  recentActivities: TenantActivity[];
}

export interface PaymentOverview {
  totalRevenue: number;
  monthlyRevenue: number;
  pendingAmount: number;
  collectedThisMonth: number;
  overdueTenants: number;
  recentPayments: Array<{
    _id: string;
    tenantName: string;
    amount: number;
    date: string;
    type: string;
  }>;
}

// Owner Dashboard Service Class
class OwnerDashboardService {
  
  // Get enhanced dashboard overview
  async getEnhancedDashboardOverview(): Promise<DashboardOverview> {
    try {
      const response = await api.get('/owner/dashboard/overview');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard overview:', error);
      // Return mock data for development
      return {
        totalProperties: 5,
        totalRooms: 45,
        occupiedRooms: 38,
        totalTenants: 42,
        monthlyRevenue: 125000,
        pendingPayments: 15000,
        recentActivities: []
      };
    }
  }

  // Get recent tenant activities
  async getRecentTenantActivities(limit: number = 20): Promise<TenantActivity[]> {
    try {
      const response = await api.get(`/owner/dashboard/tenant-activities?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tenant activities:', error);
      // Return mock data for development
      return this.generateMockTenantActivities(limit);
    }
  }

  // Get occupancy status
  async getOccupancyStatus(): Promise<OccupancyStatus[]> {
    try {
      const response = await api.get('/owner/dashboard/occupancy');
      return response.data;
    } catch (error) {
      console.error('Error fetching occupancy status:', error);
      // Return mock data for development
      return [
        {
          propertyId: 'prop1',
          propertyName: 'Green Valley PG',
          propertyType: 'PG',
          totalRooms: 20,
          occupiedRooms: 18,
          occupancyRate: 90,
          availableRooms: 2,
          pendingCheckouts: 1
        },
        {
          propertyId: 'prop2',
          propertyName: 'City Center Rooms',
          propertyType: 'Room',
          totalRooms: 15,
          occupiedRooms: 12,
          occupancyRate: 80,
          availableRooms: 3,
          pendingCheckouts: 0
        }
      ];
    }
  }

  // Get payment overview
  async getPaymentOverview(): Promise<PaymentOverview> {
    try {
      const response = await api.get('/owner/dashboard/payments');
      return response.data;
    } catch (error) {
      console.error('Error fetching payment overview:', error);
      // Return mock data for development
      return {
        totalRevenue: 450000,
        monthlyRevenue: 125000,
        pendingAmount: 15000,
        collectedThisMonth: 110000,
        overdueTenants: 3,
        recentPayments: [
          {
            _id: 'pay1',
            tenantName: 'Rahul Sharma',
            amount: 8000,
            date: new Date().toISOString(),
            type: 'Rent'
          }
        ]
      };
    }
  }

  // Generate mock tenant activities for development
  private generateMockTenantActivities(limit: number): TenantActivity[] {
    const mockNames = [
      'Rahul Sharma', 'Priya Singh', 'Amit Kumar', 'Sneha Patel', 'Vikash Yadav',
      'Anjali Gupta', 'Rohit Mehta', 'Kavya Reddy', 'Suresh Jain', 'Pooja Agarwal'
    ];

    const properties = [
      { name: 'Green Valley PG', type: 'PG' as const },
      { name: 'City Center Rooms', type: 'Room' as const },
      { name: 'Modern Flats', type: 'Flat' as const },
      { name: 'Student Hub PG', type: 'PG' as const },
      { name: 'Executive Stays', type: 'Room' as const }
    ];

    const activities: TenantActivity[] = [];
    
    for (let i = 0; i < Math.min(limit, 50); i++) {
      const property = properties[i % properties.length];
      const isActive = Math.random() > 0.3; // 70% active tenants
      const checkInDate = new Date();
      checkInDate.setDate(checkInDate.getDate() - Math.floor(Math.random() * 365));
      
      let checkOutDate: string | undefined;
      let totalStayDays: number;
      
      if (!isActive) {
        const checkout = new Date(checkInDate);
        checkout.setDate(checkout.getDate() + Math.floor(Math.random() * 200) + 30);
        checkOutDate = checkout.toISOString();
        totalStayDays = Math.floor((checkout.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
      } else {
        totalStayDays = Math.floor((new Date().getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
      }

      activities.push({
        _id: `activity_${i}`,
        tenantName: mockNames[i % mockNames.length],
        tenantPhone: `98765${String(i).padStart(5, '0')}`,
        propertyType: property.type,
        propertyName: property.name,
        roomNumber: `R${String(101 + (i % 20)).padStart(3, '0')}`,
        checkInDate: checkInDate.toISOString(),
        checkOutDate,
        isActive,
        lastUpdated: new Date().toISOString(),
        totalStayDays,
        activityType: isActive ? 'check-in' : 'check-out'
      });
    }

    // Sort by most recent activity
    return activities.sort((a, b) => 
      new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    );
  }
}

// Export service instance
export const ownerDashboardService = new OwnerDashboardService();

// Export service class for testing
export default OwnerDashboardService;