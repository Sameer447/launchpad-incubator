import React from 'react';
import { Flex, Divider, Text, Box } from '@hubspot/ui-extensions';
import ContactInfo from './ContactInfo';
import StatusBadge from './StatusBadge';
import OnboardingStage from './OnboardingStage';
import NextSteps from './NextSteps';
import {
  getApplicationStatus,
  getDepositStatus,
  getOnboardingStage,
} from '../utils/helpers';

/**
 * FounderCard Component
 * Main card component for displaying founder information
 */
const FounderCard = ({ founder }) => {
  const applicationStatus = getApplicationStatus(founder.applicationStatus);
  const depositStatus = getDepositStatus(founder.depositStatus);
  const onboardingStage = getOnboardingStage(founder.onboardingStage);

  return (
    <Box>
      <Flex direction="column" gap="md">
        {/* Contact Information */}
        <ContactInfo
          name={founder.name}
          email={founder.email}
          phone={founder.phone}
        />

        <Divider />

        {/* Status Information */}
        <Flex direction="column" gap="sm">
          <Flex direction="row" justify="between" align="center">
            <Text format={{ fontWeight: 'medium' }}>Application Status</Text>
            <StatusBadge status={applicationStatus} variant={applicationStatus.variant} />
          </Flex>

          <Flex direction="row" justify="between" align="center">
            <Text format={{ fontWeight: 'medium' }}>Deposit Status</Text>
            <StatusBadge status={depositStatus} variant={depositStatus.variant} />
          </Flex>

          {founder.currentCohort !== 'N/A' && (
            <Flex direction="row" justify="between" align="center">
              <Text format={{ fontWeight: 'medium' }}>Current Cohort</Text>
              <Text>{founder.currentCohort}</Text>
            </Flex>
          )}
        </Flex>

        <Divider />

        {/* Onboarding Progress */}
        <OnboardingStage stage={onboardingStage} />

        {/* Next Steps */}
        <NextSteps nextSteps={founder.nextSteps} />
      </Flex>
    </Box>
  );
};

export default FounderCard;