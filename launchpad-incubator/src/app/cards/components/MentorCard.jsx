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
          {mentor.mentorExpertise && (
            <Flex direction="column" gap="xs">
              <Text format={{ fontWeight: 'medium' }}>Expertise Areas</Text>
              <Text variant="microcopy">{mentor.mentorExpertise}</Text>
            </Flex>
          )}

          {mentor.mentorAvailability && (
            <Flex direction="row" justify="between" align="center">
              <Text format={{ fontWeight: 'medium' }}>Availability</Text>
              <StatusBadge
                status={mentor.mentorAvailability}
                variant={
                  mentor.mentorAvailability?.toLowerCase() === 'available' ? 'success' :
                  mentor.mentorAvailability?.toLowerCase() === 'limited' ? 'warning' : 'error'
                }
              />
            </Flex>
          )}

          {mentor.mentorSessionsCompleted && (
            <Flex direction="row" justify="between" align="center">
              <Text format={{ fontWeight: 'medium' }}>Sessions Completed</Text>
              <Text>{mentor.mentorSessionsCompleted}</Text>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default MentorCard;