// API service for making requests to the backend

const API_BASE_URL = "http://192.168.1.15:5000/api";

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "An error occurred");
  }
  return data;
};

// Create headers with authentication token
const createAuthHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// API services organized by feature
export const api = {
  // Visitor related endpoints
  visitors: {
    getAll: async (token: string) => {
      const response = await fetch(`${API_BASE_URL}/visitors`, {
        headers: createAuthHeaders(token),
      });
      return handleResponse(response);
    },
    
    getById: async (id: string, token: string) => {
      const response = await fetch(`${API_BASE_URL}/visitors/${id}`, {
        headers: createAuthHeaders(token),
      });
      return handleResponse(response);
    },
    
    create: async (visitorData: any, token: string) => {
      const response = await fetch(`${API_BASE_URL}/visitors`, {
        method: 'POST',
        headers: createAuthHeaders(token),
        body: JSON.stringify(visitorData),
      });
      return handleResponse(response);
    },
    
    update: async (id: string, status: string, token: string) => {
      const response = await fetch(`${API_BASE_URL}/visitors/${id}`, {
        method: 'PUT',
        headers: createAuthHeaders(token),
        body: JSON.stringify({ status }),
      });
      return handleResponse(response);
    },
  },
  
  // Notices related endpoints
  notices: {
    getAll: async (token: string) => {
      const response = await fetch(`${API_BASE_URL}/notices/active`, {
        headers: createAuthHeaders(token),
      });
      return handleResponse(response);
    },
    
    getById: async (id: string, token: string) => {
      const response = await fetch(`${API_BASE_URL}/notices/${id}`, {
        headers: createAuthHeaders(token),
      });
      return handleResponse(response);
    },
    
    create: async (noticeData: any, token: string) => {
      const response = await fetch(`${API_BASE_URL}/notices`, {
        method: 'POST',
        headers: createAuthHeaders(token),
        body: JSON.stringify(noticeData),
      });
      return handleResponse(response);
    },
  },
  
  // Complaints related endpoints
  complaints: {
    getAll: async (token: string) => {
      const response = await fetch(`${API_BASE_URL}/api/complaints/my`, {
        headers: createAuthHeaders(token),
      });
      return handleResponse(response);
    },
    
    getById: async (id: string, token: string) => {
      const response = await fetch(`${API_BASE_URL}/complaints/${id}`, {
        headers: createAuthHeaders(token),
      });
      return handleResponse(response);
    },
    
    create: async (complaintData: any, token: string) => {
      const response = await fetch(`${API_BASE_URL}/api/complaints`, {
        method: 'POST',
        headers: createAuthHeaders(token),
        body: JSON.stringify(complaintData),
      });
      return handleResponse(response);
    },
    
    update: async (id: string, status: string, token: string) => {
      const response = await fetch(`${API_BASE_URL}/complaints/${id}`, {
        method: 'PUT',
        headers: createAuthHeaders(token),
        body: JSON.stringify({ status }),
      });
      return handleResponse(response);
    },
  },
  
  // Dues related endpoints
  dues: {
    getAll: async (id:string ,token: string) => {
      const response = await fetch(`${API_BASE_URL}/dues/${id}`, {
        headers: createAuthHeaders(token),
      });
      return handleResponse(response);
    },
    
    getById: async (id: string, token: string) => {
      const response = await fetch(`${API_BASE_URL}/dues/${id}`, {
        headers: createAuthHeaders(token),
      });
      return handleResponse(response);
    },
    
    pay: async (id: string, paymentDetails: any, token: string) => {
      const response = await fetch(`${API_BASE_URL}/dues/${id}/pay`, {
        method: 'POST',
        headers: createAuthHeaders(token),
        body: JSON.stringify(paymentDetails),
      });
      return handleResponse(response);
    },
  },
  
  // Vehicles related endpoints
  vehicles: {
    getAll: async (token: string) => {
      const response = await fetch(`${API_BASE_URL}/vehicles`, {
        headers: createAuthHeaders(token),
      });
      return handleResponse(response);
    },
    
    create: async (vehicleData: any, token: string) => {
      const response = await fetch(`${API_BASE_URL}/vehicles`, {
        method: 'POST',
        headers: createAuthHeaders(token),
        body: JSON.stringify(vehicleData),
      });
      return handleResponse(response);
    },
    
    update: async (id: string, vehicleData: any, token: string) => {
      const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
        method: 'PUT',
        headers: createAuthHeaders(token),
        body: JSON.stringify(vehicleData),
      });
      return handleResponse(response);
    },
    
    delete: async (id: string, token: string) => {
      const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
        method: 'DELETE',
        headers: createAuthHeaders(token),
      });
      return handleResponse(response);
    },
  },
  
  // Notifications related endpoints
  notifications: {
    getAll: async (token: string) => {
      const response = await fetch(`${API_BASE_URL}/notifications`, {
        headers: createAuthHeaders(token),
      });
      return handleResponse(response);
    },
    
    markAsRead: async (id: string, token: string) => {
      const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
        method: 'PUT',
        headers: createAuthHeaders(token),
      });
      return handleResponse(response);
    },
  },
};