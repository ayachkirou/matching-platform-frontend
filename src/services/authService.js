const API_BASE_URL = 'http://localhost:8080/api';

export const authService = {
  async login(email, motDePasse) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, motDePasse }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return await response.json();
  },

  async validateToken(token) {
    const response = await fetch(`${API_BASE_URL}/auth/validate-token`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return false;
    }

    const result = await response.json();
    return result.valid;
  },

  async getStudentProfile(email, token) {
  try {
    const response = await fetch(`${API_BASE_URL}/students/me?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // Si c'est une erreur 401/403, déconnecter l'utilisateur
      if (response.status === 401 || response.status === 403) {
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      }
      const errorText = await response.text();
      throw new Error(errorText || 'Erreur lors de la récupération du profil');
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur dans getStudentProfile:', error);
    throw error;
  }
},

  async updateStudentProfile(email, data, token) {
    const response = await fetch(`${API_BASE_URL}/students/profile?email=${encodeURIComponent(email)}`, {
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

  // Nouvelles fonctions pour la gestion des documents
  async uploadCV(email, file, token) {
    const formData = new FormData();
    formData.append('cv', file);
    
    const response = await fetch(`${API_BASE_URL}/students/upload-cv?email=${encodeURIComponent(email)}`, {
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

  async uploadPhotoProfil(email, file, token) {
    const formData = new FormData();
    formData.append('photoProfil', file);
    
    const response = await fetch(`${API_BASE_URL}/students/upload-photo?email=${encodeURIComponent(email)}`, {
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

  async deletePhotoProfil(email, token) {
  const response = await fetch(`${API_BASE_URL}/students/delete-photo?email=${encodeURIComponent(email)}`, {
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
},

  async downloadCV(filename, token) {
    const response = await fetch(`${API_BASE_URL}/students/download-cv/${filename}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erreur lors du téléchargement du CV');
    }

    return await response.blob();
  },
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

};