import React from 'react';
import { Flex, Divider, Text, Box } from '@hubspot/ui-extensions';
import ContactInfo from './ContactInfo';
import StatusBadge from './StatusBadge';

/**
 * SponsorCard Component
 * Main card component for displaying sponsor information
 */
const SponsorCard = ({ sponsor }) => {
  const getSponsorshipLevelVariant = (level) => {
    const normalizedLevel = level?.toLowerCase();
    if (normalizedLevel === 'platinum') return 'success';
    if (normalizedLevel === 'gold') return 'warning';
    if (normalizedLevel === 'silver') return 'info';
    if (normalizedLevel === 'bronze') return 'default';
    return 'default';
  };

  const getSponsorshipStatusVariant = (status) => {
    const normalizedStatus = status?.toLowerCase();
    if (normalizedStatus === 'active') return 'success';
    if (normalizedStatus === 'pending') return 'warning';
    if (normalizedStatus === 'expired') return 'error';
    return 'default';
  };

  return (
    <Box>
      <Flex direction="column" gap="md">
        {/* Contact Information */}
        <ContactInfo
          name={sponsor.name}
          email={sponsor.email}
          phone={sponsor.phone}
        />

        <Divider />

        {/* Sponsorship Information */}
        <Flex direction="column" gap="sm">
          {sponsor.sponsorshipLevel && (
            <Flex direction="row" justify="between" align="center">
              <Text format={{ fontWeight: 'medium' }}>Sponsorship Level</Text>
              <StatusBadge
                status={sponsor.sponsorshipLevel}
                variant={getSponsorshipLevelVariant(sponsor.sponsorshipLevel)}
              />
            </Flex>
          )}

          {sponsor.contributionAmount && (
            <Flex direction="row" justify="between" align="center">
              <Text format={{ fontWeight: 'medium' }}>Contribution Amount</Text>
              <Text>${sponsor.contributionAmount}</Text>
            </Flex>
          )}

          {sponsor.sponsorshipStatus && (
            <Flex direction="row" justify="between" align="center">
              <Text format={{ fontWeight: 'medium' }}>Sponsorship Status</Text>
              <StatusBadge
                status={sponsor.sponsorshipStatus}
                variant={getSponsorshipStatusVariant(sponsor.sponsorshipStatus)}
              />
            </Flex>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default SponsorCard;