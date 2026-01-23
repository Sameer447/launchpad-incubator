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
import InvestorCard from './components/InvestorCard';

const CARD_TITLE = 'Investors';
const EMPTY_STATE_MESSAGE = 'No investors found for this company.';
const ERROR_MESSAGE = 'Unable to load investor information. Please try again.';

// Define the CRM card
hubspot.extend<'crm.record.tab'>(({ context, actions }) => (
    <InvestorsCardExtension context={context} actions={actions} />
));

interface Investor {
    id: string;
    name: string;
    email: string;
    phone: string;
    investorFocus: string;
    investorStage: string;
    investorTicketSize: string;
}

const InvestorsCardExtension = ({ context, actions }: any) => {
    const [investors, setInvestors] = useState<Investor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchInvestors();
    }, [context.crm.objectId]);

    const fetchInvestors = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('Fetching investors for:', context.crm.objectTypeId, context.crm.objectId);

            const backendUrl = 'https://launchpad-incubator-backend.vercel.app';
            const isCompanyPage = context.crm.objectTypeId === '0-2';

            let apiUrl = '';
            if (isCompanyPage) {
                apiUrl = `${backendUrl}/api/investors?companyId=${context.crm.objectId}`;
            } else {
                apiUrl = `${backendUrl}/api/investors`;
            }

            const response = await hubspot.fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const result = await response.json();

            if (result?.error) {
                throw new Error(result.error);
            }

            const investorsData = result?.data?.investors || [];
            setInvestors(investorsData);
        } catch (err: any) {
            console.error('Error loading investors:', err);
            setError(err.message || 'Failed to load investors');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Flex direction="column" align="center" justify="center" gap="md">
                <LoadingSpinner label="Loading investors..." />
            </Flex>
        );
    }

    if (error) {
        return (
            <Flex direction="column" gap="md">
                <EmptyState title="Error Loading Data" layout="vertical">
                    <Text>{error}</Text>
                    <Button onClick={fetchInvestors} variant="primary">
                        Retry
                    </Button>
                </EmptyState>
            </Flex>
        );
    }

    if (investors.length === 0) {
        return (
            <Flex direction="column" gap="md">
                <EmptyState title="Investors" layout="vertical">
                    <Text>No investors found for this company.</Text>
                    <Text variant="microcopy">
                        Make sure investor contacts are associated with this company.
                    </Text>
                    <Button onClick={fetchInvestors} variant="secondary">
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
                    {CARD_TITLE} ({investors.length})
                </Text>
                <Button onClick={fetchInvestors} variant="secondary" size="xs">
                    Refresh
                </Button>
            </Flex>

            <Divider />

            {investors.map((investor, index) => (
                <React.Fragment key={investor.id}>
                    <InvestorCard investor={investor} />
                    {index < investors.length - 1 && <Divider distance="md" />}
                </React.Fragment>
            ))}
        </Flex>
    );
};
