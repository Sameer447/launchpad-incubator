import React, { useState, useEffect } from 'react';
import {
  hubspot,
  Flex,
  Text,
  LoadingSpinner,
  EmptyState,
  Divider,
  Button,
} from '@hubspot/ui-extensions';
import FounderCard from '../../components/FounderCard';
import { CARD_TITLE, EMPTY_STATE_MESSAGE, ERROR_MESSAGE } from '../../utils/constants';

// Define the extension for HubSpot Platform 2025.2
hubspot.extend(({ context, runServerless }) => (
  <Extension context={context} runServerless={runServerless} />
));

/**
 * Main Extension Component
 * Updated for HubSpot Platform 2025.2 - Using runServerless
 */
const Extension = ({ context, runServerless }) => {
  const [founders, setFounders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch founders data on component mount
  useEffect(() => {
    const fetchFounders = async () => {
      try {
        setLoading(true);
        setError(null);

        // Call serverless function using runServerless
        const response = await runServerless({
          name: 'crm-card',
          parameters: {
            hs_object_id: context.crm.objectId,
          },
        });

        // Check for errors in response
        if (response.status === 'error') {
          throw new Error(response.message || 'Failed to fetch founders');
        }

        if (response.error) {
          throw new Error(response.error);
        }

        // Handle the response data
        const responseData = response.response || response;
        setFounders(responseData.founders || []);
        
      } catch (err) {
        console.error('Error loading founders:', err);
        setError(err.message || ERROR_MESSAGE);
      } finally {
        setLoading(false);
      }
    };

    fetchFounders();
  }, [context.crm.objectId, runServerless]);

  // Refresh handler
  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await runServerless({
        name: 'crm-card',
        parameters: {
          hs_object_id: context.crm.objectId,
        },
      });

      if (response.status === 'error') {
        throw new Error(response.message || 'Failed to refresh founders');
      }

      if (response.error) {
        throw new Error(response.error);
      }

      const responseData = response.response || response;
      setFounders(responseData.founders || []);
      
    } catch (err) {
      console.error('Error refreshing founders:', err);
      setError(err.message || ERROR_MESSAGE);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Flex direction="column" align="center" justify="center" gap="md">
        <LoadingSpinner label="Loading founders..." />
      </Flex>
    );
  }

  // Error state
  if (error) {
    return (
      <Flex direction="column" gap="md">
        <EmptyState
          title="Error Loading Data"
          layout="vertical"
        >
          <Text>{error}</Text>
          <Button onClick={handleRefresh} variant="primary">
            Retry
          </Button>
        </EmptyState>
      </Flex>
    );
  }

  // Empty state
  if (founders.length === 0) {
    return (
      <Flex direction="column" gap="md">
        <EmptyState
          title={CARD_TITLE}
          layout="vertical"
        >
          <Text>{EMPTY_STATE_MESSAGE}</Text>
          <Text variant="microcopy">
            Make sure contacts are associated with this company using the "Founder" label.
          </Text>
          <Button onClick={handleRefresh} variant="secondary">
            Refresh
          </Button>
        </EmptyState>
      </Flex>
    );
  }

  // Display founders
  return (
    <Flex direction="column" gap="lg">
      {/* Header */}
      <Flex direction="row" justify="between" align="center">
        <Text format={{ fontWeight: 'bold', fontSize: 'large' }}>
          {CARD_TITLE} ({founders.length})
        </Text>
        <Button onClick={handleRefresh} variant="secondary" size="xs">
          Refresh
        </Button>
      </Flex>

      <Divider />

      {/* Founder Cards */}
      {founders.map((founder, index) => (
        <React.Fragment key={founder.id}>
          <FounderCard founder={founder} />
          {index < founders.length - 1 && <Divider distance="md" />}
        </React.Fragment>
      ))}
    </Flex>
  );
};

export default Extension;