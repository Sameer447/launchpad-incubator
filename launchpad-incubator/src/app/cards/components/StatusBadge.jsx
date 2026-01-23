import React from 'react';
import { Tag } from '@hubspot/ui-extensions';

/**
 * StatusBadge Component
 * Displays a colored badge with status label
 */
const StatusBadge = ({ status, variant = 'default' }) => {
  return (
    <Tag variant={variant}>
      {typeof status === 'object' && status.label ? status.label : status}
    </Tag>
  );
};

export default StatusBadge;