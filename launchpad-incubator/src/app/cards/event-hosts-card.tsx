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
    <EventHostsCardExtension context={context} actions={actions} />
));

interface EventHost {
    id: string;
    name: string;
    email: string;
    phone: string;
    organizationType: string;
    eventsHosted: string;
    nextEvent: string;
}

const EventHostsCardExtension = ({ context, actions }: any) => {
    const [eventHosts, setEventHosts] = useState<EventHost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchEventHosts();
    }, [context.crm.objectId]);

    const fetchEventHosts = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('Fetching event hosts for:', context.crm.objectTypeId, context.crm.objectId);

            const backendUrl = 'https://launchpad-incubator-backend.vercel.app';
            const isCompanyPage = context.crm.objectTypeId === '0-2';

            let apiUrl = '';
            if (isCompanyPage) {
                apiUrl = `${backendUrl}/api/event-hosts?companyId=${context.crm.objectId}`;
            } else {
                apiUrl = `${backendUrl}/api/event-hosts`;
            }

            const response = await hubspot.fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const result = await response.json();

            if (result?.error) {
                throw new Error(result.error);
            }

            const eventHostsData = result?.data?.eventHosts || [];
            setEventHosts(eventHostsData);
        } catch (err: any) {
            console.error('Error loading event hosts:', err);
            setError(err.message || 'Failed to load event hosts');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Flex direction="column" align="center" justify="center" gap="md">
                <LoadingSpinner label="Loading event hosts..." />
            </Flex>
        );
    }

    if (error) {
        return (
            <Flex direction="column" gap="md">
                <EmptyState title="Error Loading Data" layout="vertical">
                    <Text>{error}</Text>
                    <Button onClick={fetchEventHosts} variant="primary">
                        Retry
                    </Button>
                </EmptyState>
            </Flex>
        );
    }

    if (eventHosts.length === 0) {
        return (
            <Flex direction="column" gap="md">
                <EmptyState title="Event Hosts" layout="vertical">
                    <Text>No event hosts found for this company.</Text>
                    <Text variant="microcopy">
                        Make sure event host contacts are associated with this company.
                    </Text>
                    <Button onClick={fetchEventHosts} variant="secondary">
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
                    Event Hosts ({eventHosts.length})
                </Text>
                <Button onClick={fetchEventHosts} variant="secondary" size="xs">
                    Refresh
                </Button>
            </Flex>

            <Divider />

            {eventHosts.map((host, index) => (
                <React.Fragment key={host.id}>
                    <Flex direction="column" gap="sm">
                        <Text format={{ fontWeight: 'bold' }}>{host.name}</Text>
                        <Flex direction="column" gap="xs">
                            <Flex direction="row" gap="xs">
                                <Text variant="microcopy">Email:</Text>
                                <Link href={`mailto:${host.email}`}>{host.email}</Link>
                            </Flex>
                            {host.phone && host.phone !== 'N/A' && (
                                <Flex direction="row" gap="xs">
                                    <Text variant="microcopy">Phone:</Text>
                                    <Text>{host.phone}</Text>
                                </Flex>
                            )}
                            {host.organizationType && host.organizationType !== 'N/A' && (
                                <Flex direction="row" gap="xs">
                                    <Text variant="microcopy">Organization Type:</Text>
                                    <Text>{host.organizationType}</Text>
                                </Flex>
                            )}
                            {host.eventsHosted && host.eventsHosted !== 'N/A' && (
                                <Flex direction="row" gap="xs">
                                    <Text variant="microcopy">Events Hosted:</Text>
                                    <Text>{host.eventsHosted}</Text>
                                </Flex>
                            )}
                            {host.nextEvent && host.nextEvent !== 'N/A' && (
                                <Flex direction="row" gap="xs">
                                    <Text variant="microcopy">Next Event:</Text>
                                    <Text>{host.nextEvent}</Text>
                                </Flex>
                            )}
                        </Flex>
                    </Flex>
                    {index < eventHosts.length - 1 && <Divider distance="md" />}
                </React.Fragment>
            ))}
        </Flex>
    );
};
