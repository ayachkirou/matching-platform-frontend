const API_BASE_URL = 'http://localhost:8080/api';

export const companyService = {
  async getCompanyProfile(email, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/companies/me?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        }
        const errorText = await response.text();
        throw new Error(errorText || 'Erreur lors de la récupération du profil');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur dans getCompanyProfile:', error);
      throw error;
    }
  },

  async updateCompanyProfile(email, data, token) {
    const response = await fetch(`${API_BASE_URL}/companies/profile?email=${encodeURIComponent(email)}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return await response.json();
  },

  async uploadLogo(email, file, token) {
    const formData = new FormData();
    formData.append('logo', file);
    
    const response = await fetch(`${API_BASE_URL}/companies/upload-logo?email=${encodeURIComponent(email)}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return await response.json();
  },

  async deleteLogo(email, token) {
    const response = await fetch(`${API_BASE_URL}/companies/delete-logo?email=${encodeURIComponent(email)}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return await response.json();
  }
};