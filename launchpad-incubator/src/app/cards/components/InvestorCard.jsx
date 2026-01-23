import React from 'react';
import { Flex, Divider, Text, Box } from '@hubspot/ui-extensions';
import ContactInfo from './ContactInfo';
import StatusBadge from './StatusBadge';

/**
 * InvestorCard Component
 * Main card component for displaying investor information
 */
const InvestorCard = ({ investor }) => {
  return (
    <Box>
      <Flex direction="column" gap="md">
        {/* Contact Information */}
        <ContactInfo
          name={investor.name}
          email={investor.email}
          phone={investor.phone}
        />

        <Divider />

        {/* Investment Information */}
        <Flex direction="column" gap="sm">
          {investor.investmentFocus && (
            <Flex direction="row" justify="between" align="center">
              <Text format={{ fontWeight: 'medium' }}>Investment Focus</Text>
              <Text>{investor.investmentFocus}</Text>
            </Flex>
          )}

          {investor.investmentStage && (
            <Flex direction="row" justify="between" align="center">
              <Text format={{ fontWeight: 'medium' }}>Investment Stage</Text>
              <Text>{investor.investmentStage}</Text>
            </Flex>
          )}

          {investor.ticketSize && (
            <Flex direction="row" justify="between" align="center">
              <Text format={{ fontWeight: 'medium' }}>Ticket Size</Text>
              <Text>{investor.ticketSize}</Text>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default InvestorCard;