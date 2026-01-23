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
    <MentorsCardExtension context={context} actions={actions} />
));

interface Mentor {
    id: string;
    name: string;
    email: string;
    phone: string;
    expertise: string;
    availability: string;
    sessionsCompleted: string;
}

const MentorsCardExtension = ({ context, actions }: any) => {
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchMentors();
    }, [context.crm.objectId]);

    const fetchMentors = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('Fetching mentors for:', context.crm.objectTypeId, context.crm.objectId);

            const backendUrl = 'https://launchpad-incubator-backend.vercel.app';
            const isCompanyPage = context.crm.objectTypeId === '0-2';

            let apiUrl = '';
            if (isCompanyPage) {
                apiUrl = `${backendUrl}/api/mentors?companyId=${context.crm.objectId}`;
            } else {
                apiUrl = `${backendUrl}/api/mentors`;
            }

            const response = await hubspot.fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const result = await response.json();

            if (result?.error) {
                throw new Error(result.error);
            }

            const mentorsData = result?.data?.mentors || [];
            setMentors(mentorsData);
        } catch (err: any) {
            console.error('Error loading mentors:', err);
            setError(err.message || 'Failed to load mentors');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Flex direction="column" align="center" justify="center" gap="md">
                <LoadingSpinner label="Loading mentors..." />
            </Flex>
        );
    }

    if (error) {
        return (
            <Flex direction="column" gap="md">
                <EmptyState title="Error Loading Data" layout="vertical">
                    <Text>{error}</Text>
                    <Button onClick={fetchMentors} variant="primary">
                        Retry
                    </Button>
                </EmptyState>
            </Flex>
        );
    }

    if (mentors.length === 0) {
        return (
            <Flex direction="column" gap="md">
                <EmptyState title="Mentors" layout="vertical">
                    <Text>No mentors found for this company.</Text>
                    <Text variant="microcopy">
                        Make sure mentor contacts are associated with this company.
                    </Text>
                    <Button onClick={fetchMentors} variant="secondary">
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
                    Mentors ({mentors.length})
                </Text>
                <Button onClick={fetchMentors} variant="secondary" size="xs">
                    Refresh
                </Button>
            </Flex>

            <Divider />

            {mentors.map((mentor, index) => (
                <React.Fragment key={mentor.id}>
                    <Flex direction="column" gap="sm">
                        <Text format={{ fontWeight: 'bold' }}>{mentor.name}</Text>
                        <Flex direction="column" gap="xs">
                            <Flex direction="row" gap="xs">
                                <Text variant="microcopy">Email:</Text>
                                <Link href={`mailto:${mentor.email}`}>{mentor.email}</Link>
                            </Flex>
                            {mentor.phone && mentor.phone !== 'N/A' && (
                                <Flex direction="row" gap="xs">
                                    <Text variant="microcopy">Phone:</Text>
                                    <Text>{mentor.phone}</Text>
                                </Flex>
                            )}
                            {mentor.expertise && mentor.expertise !== 'N/A' && (
                                <Flex direction="row" gap="xs">
                                    <Text variant="microcopy">Expertise:</Text>
                                    <Text>{mentor.expertise}</Text>
                                </Flex>
                            )}
                            {mentor.availability && mentor.availability !== 'N/A' && (
                                <Flex direction="row" gap="xs">
                                    <Text variant="microcopy">Availability:</Text>
                                    <Text>{mentor.availability}</Text>
                                </Flex>
                            )}
                            {mentor.sessionsCompleted && mentor.sessionsCompleted !== 'N/A' && (
                                <Flex direction="row" gap="xs">
                                    <Text variant="microcopy">Sessions Completed:</Text>
                                    <Text>{mentor.sessionsCompleted}</Text>
                                </Flex>
                            )}
                        </Flex>
                    </Flex>
                    {index < mentors.length - 1 && <Divider distance="md" />}
                </React.Fragment>
            ))}
        </Flex>
    );
};
