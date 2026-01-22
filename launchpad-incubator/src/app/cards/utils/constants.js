// Status configurations with colors for badges

export const APPLICATION_STATUS = {
  APPLIED: {
    label: 'Applied',
    variant: 'info',
    color: '#0091AE',
  },
  ACCEPTED: {
    label: 'Accepted',
    variant: 'success',
    color: '#00A4BD',
  },
  REJECTED: {
    label: 'Rejected',
    variant: 'error',
    color: '#F2545B',
  },
  IN_REVIEW: {
    label: 'In Review',
    variant: 'warning',
    color: '#FF7A59',
  },
};

export const DEPOSIT_STATUS = {
  PENDING: {
    label: 'Pending',
    variant: 'warning',
    color: '#FF7A59',
  },
  PAID: {
    label: 'Paid',
    variant: 'success',
    color: '#00A4BD',
  },
  WAIVED: {
    label: 'Waived',
    variant: 'info',
    color: '#0091AE',
  },
  REFUNDED: {
    label: 'Refunded',
    variant: 'error',
    color: '#F2545B',
  },
};

export const ONBOARDING_STAGES = [
  { key: 'NOT_STARTED', label: 'Not Started', progress: 0 },
  { key: 'PROFILE_SETUP', label: 'Profile Setup', progress: 25 },
  { key: 'AGREEMENT_SIGNED', label: 'Agreement Signed', progress: 50 },
  { key: 'PAYMENT_COMPLETE', label: 'Payment Complete', progress: 75 },
  { key: 'ONBOARDED', label: 'Onboarded', progress: 100 },
];

export const CARD_TITLE = 'Founders';

export const EMPTY_STATE_MESSAGE = 'No founders found for this company.';

export const ERROR_MESSAGE = 'Unable to load founder information. Please try again.';