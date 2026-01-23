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
    Link,
} from '@hubspot/ui-extensions';

// Define the CRM card
hubspot.extend<'crm.record.tab'>(({ context, actions }) => (
    <SponsorsCardExtension context={context} actions={actions} />
));

interface Sponsor {
    id: string;
    name: string;
    email: string;
    phone: string;
    sponsorshipLevel: string;
    contributionAmount: string;
    sponsorshipStatus: string;
}

const SponsorsCardExtension = ({ context, actions }: any) => {
    const [sponsors, setSponsors] = useState<Sponsor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchSponsors();
    }, [context.crm.objectId]);

    const fetchSponsors = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('Fetching sponsors for:', context.crm.objectTypeId, context.crm.objectId);

            const backendUrl = 'https://launchpad-incubator-backend.vercel.app';
            const isCompanyPage = context.crm.objectTypeId === '0-2';

            let apiUrl = '';
            if (isCompanyPage) {
                apiUrl = `${backendUrl}/api/sponsors?companyId=${context.crm.objectId}`;
            } else {
                apiUrl = `${backendUrl}/api/sponsors`;
            }

            const response = await hubspot.fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const result = await response.json();

            if (result?.error) {
                throw new Error(result.error);
            }

            const sponsorsData = result?.data?.sponsors || [];
            setSponsors(sponsorsData);
        } catch (err: any) {
            console.error('Error loading sponsors:', err);
            setError(err.message || 'Failed to load sponsors');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Flex direction="column" align="center" justify="center" gap="md">
                <LoadingSpinner label="Loading sponsors..." />
            </Flex>
        );
    }

    if (error) {
        return (
            <Flex direction="column" gap="md">
                <EmptyState title="Error Loading Data" layout="vertical">
                    <Text>{error}</Text>
                    <Button onClick={fetchSponsors} variant="primary">
                        Retry
                    </Button>
                </EmptyState>
            </Flex>
        );
    }

    if (sponsors.length === 0) {
        return (
            <Flex direction="column" gap="md">
                <EmptyState title="Sponsors" layout="vertical">
                    <Text>No sponsors found for this company.</Text>
                    <Text variant="microcopy">
                        Make sure sponsor contacts are associated with this company.
                    </Text>
                    <Button onClick={fetchSponsors} variant="secondary">
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
                    Sponsors ({sponsors.length})
                </Text>
                <Button onClick={fetchSponsors} variant="secondary" size="xs">
                    Refresh
                </Button>
            </Flex>

            <Divider />

            {sponsors.map((sponsor, index) => (
                <React.Fragment key={sponsor.id}>
                    <Flex direction="column" gap="sm">
                        <Text format={{ fontWeight: 'bold' }}>{sponsor.name}</Text>
                        <Flex direction="column" gap="xs">
                            <Flex direction="row" gap="xs">
                                <Text variant="microcopy">Email:</Text>
                                <Link href={`mailto:${sponsor.email}`}>{sponsor.email}</Link>
                            </Flex>
                            {sponsor.phone && sponsor.phone !== 'N/A' && (
                                <Flex direction="row" gap="xs">
                                    <Text variant="microcopy">Phone:</Text>
                                    <Text>{sponsor.phone}</Text>
                                </Flex>
                            )}
                            {sponsor.sponsorshipLevel && sponsor.sponsorshipLevel !== 'N/A' && (
                                <Flex direction="row" gap="xs">
                                    <Text variant="microcopy">Sponsorship Level:</Text>
                                    <Text>{sponsor.sponsorshipLevel}</Text>
                                </Flex>
                            )}
                            {sponsor.contributionAmount && sponsor.contributionAmount !== 'N/A' && (
                                <Flex direction="row" gap="xs">
                                    <Text variant="microcopy">Contribution Amount:</Text>
                                    <Text>{sponsor.contributionAmount}</Text>
                                </Flex>
                            )}
                            {sponsor.sponsorshipStatus && sponsor.sponsorshipStatus !== 'N/A' && (
                                <Flex direction="row" gap="xs">
                                    <Text variant="microcopy">Status:</Text>
                                    <Text>{sponsor.sponsorshipStatus}</Text>
                                </Flex>
                            )}
                        </Flex>
                    </Flex>
                    {index < sponsors.length - 1 && <Divider distance="md" />}
                </React.Fragment>
            ))}
        </Flex>
    );
};
