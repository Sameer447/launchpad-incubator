import React from 'react';
import { Flex, Text, Link } from '@hubspot/ui-extensions';
import { formatPhoneNumber } from '../utils/helpers';

/**
 * ContactInfo Component
 * Displays contact's basic information (name, email, phone)
 */
const ContactInfo = ({ name, email, phone }) => {
  return (
    <Flex direction="column" gap="xs">
      <Text format={{ fontWeight: 'bold', fontSize: 'large' }}>
        {name}
      </Text>
      
      {email !== 'N/A' && (
        <Flex direction="row" gap="xs" align="center">
          <Text variant="microcopy">Email:</Text>
          <Link href={`mailto:${email}`}>
            {email}
          </Link>
        </Flex>
      )}
      
      {phone !== 'N/A' && (
        <Flex direction="row" gap="xs" align="center">
          <Text variant="microcopy">Phone:</Text>
          <Text>{formatPhoneNumber(phone)}</Text>
        </Flex>
      )}
    </Flex>
  );
};

export default ContactInfo;