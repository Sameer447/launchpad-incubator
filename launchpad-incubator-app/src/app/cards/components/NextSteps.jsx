import React from 'react';
import { Flex, Text, Alert } from '@hubspot/ui-extensions';

/**
 * NextSteps Component
 * Displays the next action steps for the founder
 */
const NextSteps = ({ nextSteps }) => {
  if (!nextSteps || nextSteps === 'N/A' || nextSteps === 'No action required') {
    return null;
  }

  return (
    <Alert title="Next Steps" variant="info">
      <Text>{nextSteps}</Text>
    </Alert>
  );
};

export default NextSteps;