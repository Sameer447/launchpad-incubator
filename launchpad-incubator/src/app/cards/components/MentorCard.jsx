import React from 'react';
import { Flex, Divider, Text, Box } from '@hubspot/ui-extensions';
import ContactInfo from './ContactInfo';
import StatusBadge from './StatusBadge';

/**
 * MentorCard Component
 * Main card component for displaying mentor information
 */
const MentorCard = ({ mentor }) => {
  return (
    <Box>
      <Flex direction="column" gap="md">
        {/* Contact Information */}
        <ContactInfo
          name={mentor.name}
          email={mentor.email}
          phone={mentor.phone}
        />

        <Divider />

        {/* Mentoring Information */}
        <Flex direction="column" gap="sm">
          {mentor.expertise && (
            <Flex direction="column" gap="xs">
              <Text format={{ fontWeight: 'medium' }}>Expertise Areas</Text>
              <Text variant="microcopy">{mentor.expertise}</Text>
            </Flex>
          )}

          {mentor.availability && (
            <Flex direction="row" justify="between" align="center">
              <Text format={{ fontWeight: 'medium' }}>Availability</Text>
              <StatusBadge
                status={mentor.availability}
                variant={
                  mentor.availability?.toLowerCase() === 'available' ? 'success' :
                  mentor.availability?.toLowerCase() === 'limited' ? 'warning' : 'error'
                }
              />
            </Flex>
          )}

          {mentor.sessionsCompleted && (
            <Flex direction="row" justify="between" align="center">
              <Text format={{ fontWeight: 'medium' }}>Sessions Completed</Text>
              <Text>{mentor.sessionsCompleted}</Text>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default MentorCard;