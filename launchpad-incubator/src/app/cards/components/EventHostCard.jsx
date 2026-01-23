import React from 'react';
import { Flex, Divider, Text, Box } from '@hubspot/ui-extensions';
import ContactInfo from './ContactInfo';
import StatusBadge from './StatusBadge';

/**
 * EventHostCard Component
 * Main card component for displaying event host information
 */
const EventHostCard = ({ eventHost }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Box>
      <Flex direction="column" gap="md">
        {/* Contact Information */}
        <ContactInfo
          name={eventHost.name}
          email={eventHost.email}
          phone={eventHost.phone}
        />

        <Divider />

        {/* Event Hosting Information */}
        <Flex direction="column" gap="sm">
          {eventHost.eventHostOrganizationType && (
            <Flex direction="row" justify="between" align="center">
              <Text format={{ fontWeight: 'medium' }}>Organization Type</Text>
              <Text>{eventHost.eventHostOrganizationType}</Text>
            </Flex>
          )}

          {eventHost.eventsHosted !== undefined && (
            <Flex direction="row" justify="between" align="center">
              <Text format={{ fontWeight: 'medium' }}>Events Hosted</Text>
              <Text>{eventHost.eventsHosted}</Text>
            </Flex>
          )}

          {eventHost.nextEvent && (
            <Flex direction="row" justify="between" align="center">
              <Text format={{ fontWeight: 'medium' }}>Next Event</Text>
              <Text>{formatDate(eventHost.nextEvent)}</Text>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default EventHostCard;