import { APPLICATION_STATUS, DEPOSIT_STATUS, ONBOARDING_STAGES } from './constants';

/**
 * Get status configuration by value
 */
export const getApplicationStatus = (status) => {
  const normalizedStatus = status?.toUpperCase().replace(/ /g, '_');
  return APPLICATION_STATUS[normalizedStatus] || {
    label: status || 'N/A',
    variant: 'default',
    color: '#516f90',
  };
};

/**
 * Get deposit status configuration by value
 */

export const getDepositStatus = (status) => {
  const normalizedStatus = status?.toUpperCase().replace(/ /g, '_');
  return DEPOSIT_STATUS[normalizedStatus] || {
    label: status || 'N/A',
    variant: 'default',
    color: '#516f90',
  };
};

/**
 * Get onboarding status
*/

export const getOnboardingStatus = (status) => {
  const normalizedStatus = status?.toUpperCase().replace(/ /g, '_');
  return ONBOARDING_STAGES.find(s => s.key === normalizedStatus) || {
    key: 'NOT_STARTED',
    label: status || 'N/A',
    color: '#516f90',
  };
}

/**
 * Get onboarding stage with progress percentage
 */
export const getOnboardingStage = (stage) => {
  const normalizedStage = stage?.toUpperCase().replace(/ /g, '_');
  return ONBOARDING_STAGES.find(s => s.key === normalizedStage) || {
    key: 'NOT_STARTED',
    label: stage || 'Not Started',
    progress: 0,
  };
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone || phone === 'N/A') return 'N/A';
  
  const cleaned = ('' + phone).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  
  return phone;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || text === 'N/A') return text;
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Get initials from name for avatar
 */
export const getInitials = (name) => {
  if (!name || name === 'N/A') return '?';
  
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};