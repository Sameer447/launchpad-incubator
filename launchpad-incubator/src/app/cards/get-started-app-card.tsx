//@ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  Flex,
  Text,
  LoadingSpinner,
  EmptyState,
  Divider,
  Button,
  hubspot,
} from '@hubspot/ui-extensions';
import FounderCard from './components/FounderCard';
import { CARD_TITLE, EMPTY_STATE_MESSAGE, ERROR_MESSAGE } from './utils/constants';

// Define the CRM card
hubspot.extend<'crm.record.tab'>(({ context, actions }) => (
  <FounderCardExtension context={context} actions={actions} />
));

interface Founder {
  id: string;
  name: string;
  email: string;
  phone: string;
  applicationStatus: string;
  depositStatus: string;
  onboardingStage: string;
  currentCohort: string;
  nextSteps: string;
}

const FounderCardExtension = ({ context, actions }: any) => {
  const [founders, setFounders] = useState<Founder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFounders();
  }, [context.crm.objectId]);

  const fetchFounders = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching founders for company:', context.crm.objectId);

      // Use hubspot.fetch for external API calls
      const backendUrl = 'https://launchpad-incubator-backend.vercel.app';
      const response = await hubspot.fetch(`${backendUrl}/api/founders?companyId=${context.crm.objectId}`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      console.log('Response data:', result);

      if (result?.error) {
        throw new Error(result.error);
      }

      // API response structure: { success, data: { founders: [...] } }
      const foundersData = result?.data?.founders || result?.founders || [];
      console.log('Founders array:', foundersData);
      setFounders(foundersData);
    } catch (err: any) {
      console.error('Error loading founders:', err);
      setError(err.message || ERROR_MESSAGE);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Flex direction="column" align="center" justify="center" gap="md">
        <LoadingSpinner label="Loading founders..." />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex direction="column" gap="md">
        <EmptyState title="Error Loading Data" layout="vertical">
          <Text>{error}</Text>
          <Button onClick={fetchFounders} variant="primary">
            Retry
          </Button>
        </EmptyState>
      </Flex>
    );
  }

  if (founders.length === 0) {
    return (
      <Flex direction="column" gap="md">
        <EmptyState title={CARD_TITLE} layout="vertical">
          <Text>{EMPTY_STATE_MESSAGE}</Text>
          <Text variant="microcopy">
            Make sure contacts are associated with this company.
          </Text>
          <Button onClick={fetchFounders} variant="secondary">
            Refresh
          </Button>
        </EmptyState>
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap="lg">
      <Flex direction="row" justify="between" align="center">
        <Text format={{ fontWeight: 'bold', fontSize: 'large' }}>
          {CARD_TITLE} ({founders.length})
        </Text>
        <Button onClick={fetchFounders} variant="secondary" size="xs">
          Refresh
        </Button>
      </Flex>

      <Divider />

      {founders.map((founder, index) => (
        <React.Fragment key={founder.id}>
          <FounderCard founder={founder} />
          {index < founders.length - 1 && <Divider distance="md" />}
        </React.Fragment>
      ))}
    </Flex>
  );
};