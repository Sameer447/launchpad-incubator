// API service for communicating with Next.js backend
// Note: In production, use HubSpot's serverless functions to proxy requests

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:3000';

/**
 * Fetch founders data
 */
export const fetchFounders = async (companyId, filters = {}) => {
  try {
    const params = new URLSearchParams({
      ...(companyId && { companyId }),
      ...filters,
    });

    const response = await fetch(`${BACKEND_URL}/api/founders?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch founders');
    }

    return data.data;
  } catch (error) {
    console.error('Error fetching founders:', error);
    throw error;
  }
};

/**
 * Update contact properties
 */
export const updateContact = async (contactId, properties) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/contacts/${contactId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ properties }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to update contact');
    }

    return data.data;
  } catch (error) {
    console.error('Error updating contact:', error);
    throw error;
  }
};

/**
 * Get contact by ID
 */
export const getContact = async (contactId) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/contacts/${contactId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch contact');
    }

    return data.data;
  } catch (error) {
    console.error('Error fetching contact:', error);
    throw error;
  }
};