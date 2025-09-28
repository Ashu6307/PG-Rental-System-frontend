export const exportToCsv = (data: any[], filename: string) => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  // Get all unique keys from the data
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle nested objects and arrays
        if (typeof value === 'object' && value !== null) {
          if (Array.isArray(value)) {
            return `"${value.join('; ')}"`;
          }
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
        }
        // Escape quotes and wrap in quotes if contains comma
        const stringValue = String(value || '');
        return stringValue.includes(',') ? `"${stringValue.replace(/"/g, '""')}"` : stringValue;
      }).join(',')
    )
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

export const exportToJson = (data: any[], filename: string) => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

export const formatDataForExport = (bookings: any[]) => {
  return bookings.map(booking => ({
    'Booking ID': booking._id,
    'Property Name': booking.pgId?.pg_name || 'N/A',
    'Property Address': booking.pgId?.address || 'N/A',
    'Room Number': booking.roomId?.room_number || 'N/A',
    'Room Type': booking.roomId?.type || 'N/A',
    'Status': booking.status,
    'Check-in Date': new Date(booking.checkInDate).toLocaleDateString(),
    'Check-out Date': booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString() : 'N/A',
    'Duration (Days)': booking.duration,
    'Total Amount': `₹${booking.totalAmount}`,
    'Payment Status': booking.paymentStatus,
    'Booking Date': new Date(booking.bookingDate).toLocaleDateString(),
    'Last Updated': new Date(booking.lastUpdate).toLocaleDateString()
  }));
};

export const formatFavoritesForExport = (favorites: any[]) => {
  return favorites.map(favorite => ({
    'Property Name': favorite.pgId?.pg_name || 'N/A',
    'Address': favorite.pgId?.address || 'N/A',
    'Rating': favorite.pgId?.rating || 'N/A',
    'Min Rent': `₹${favorite.pgId?.rent?.min || 0}`,
    'Max Rent': `₹${favorite.pgId?.rent?.max || 0}`,
    'Amenities': favorite.pgId?.amenities?.join(', ') || 'N/A',
    'Verified': favorite.pgId?.verified ? 'Yes' : 'No',
    'Added Date': new Date(favorite.addedAt).toLocaleDateString()
  }));
};

// Format analytics data for export
export const formatAnalyticsForExport = (analytics: any, timeSeriesData: any[]) => {
  return {
    summary: {
      totalBookings: analytics?.totalBookings || 0,
      totalSpent: analytics?.totalSpent || 0,
      averageRating: analytics?.averageRating || 0,
      profileCompleteness: analytics?.engagementMetrics?.profileCompleteness || 0,
      favoriteLocations: analytics?.favoriteLocations || [],
      exportDate: new Date().toISOString()
    },
    timeSeriesData: timeSeriesData || [],
    computedMetrics: analytics?.computedMetrics || {}
  };
};

// Format notifications for export
export const formatNotificationsForExport = (notifications: any[]) => {
  return notifications.map(notification => ({
    id: notification._id,
    title: notification.title,
    message: notification.message,
    type: notification.type,
    read: notification.read,
    createdAt: notification.createdAt,
    priority: notification.priority || 'normal',
    exportDate: new Date().toISOString()
  }));
};