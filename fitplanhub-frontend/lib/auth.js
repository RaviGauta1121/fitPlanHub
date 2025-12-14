import api from './api';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  }
};

export const planService = {
  getAllPlans: async () => {
    const response = await api.get('/plans');
    return response.data;
  },

  searchPlans: async (params) => {
    const response = await api.get('/plans/search', { params });
    return response.data;
  },

  getPlanById: async (id) => {
    const response = await api.get(`/plans/${id}`);
    return response.data;
  },

  createPlan: async (planData) => {
    const response = await api.post('/plans', planData);
    return response.data;
  },

  updatePlan: async (id, planData) => {
    const response = await api.put(`/plans/${id}`, planData);
    return response.data;
  },

  deletePlan: async (id) => {
    const response = await api.delete(`/plans/${id}`);
    return response.data;
  },

  getTrainerPlans: async () => {
    const response = await api.get('/plans/my-plans');
    return response.data;
  }
};

export const subscriptionService = {
  subscribe: async (planId) => {
    const response = await api.post('/subscriptions', { planId });
    return response.data;
  },

  getUserSubscriptions: async () => {
    const response = await api.get('/subscriptions');
    return response.data;
  }
};

export const trainerService = {
  getAllTrainers: async () => {
    const response = await api.get('/trainers');
    return response.data;
  },

  getTrainerById: async (id) => {
    const response = await api.get(`/trainers/${id}`);
    return response.data;
  },

  followTrainer: async (id) => {
    const response = await api.post(`/trainers/${id}/follow`);
    return response.data;
  },

  unfollowTrainer: async (id) => {
    const response = await api.delete(`/trainers/${id}/unfollow`);
    return response.data;
  },

  getFollowedTrainers: async () => {
    const response = await api.get('/trainers/followed');
    return response.data;
  },

  getFeed: async () => {
    const response = await api.get('/trainers/feed');
    return response.data;
  },

  // NEW: Add these methods here in trainerService
  getMyFollowers: async () => {
    const response = await api.get('/trainers/my-followers');
    return response.data;
  },

  getMySubscribers: async () => {
    const response = await api.get('/trainers/my-subscribers');
    return response.data;
  }
};

export const reviewService = {
  createReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  getPlanReviews: async (planId) => {
    const response = await api.get(`/reviews/plan/${planId}`);
    return response.data;
  },

  updateReview: async (id, reviewData) => {
    const response = await api.put(`/reviews/${id}`, reviewData);
    return response.data;
  },

  deleteReview: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  }
};

export const workoutLogService = {
  createLog: async (logData) => {
    const response = await api.post('/workout-logs', logData);
    return response.data;
  },

  getUserLogs: async (params) => {
    const response = await api.get('/workout-logs', { params });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/workout-logs/stats');
    return response.data;
  },

  deleteLog: async (id) => {
    const response = await api.delete(`/workout-logs/${id}`);
    return response.data;
  }
};

export const notificationService = {
  getNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },

  deleteNotification: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  }
};

export const achievementService = {
  getUserAchievements: async () => {
    const response = await api.get('/achievements');
    return response.data;
  }
};
