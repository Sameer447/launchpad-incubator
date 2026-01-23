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
import MentorCard from './components/MentorCard';

const CARD_TITLE = 'Mentors';
const EMPTY_STATE_MESSAGE = 'No mentors found for this company.';
const ERROR_MESSAGE = 'Unable to load mentor information. Please try again.';

// Define the CRM card
hubspot.extend<'crm.record.tab'>(({ context, actions }) => (
    <MentorsCardExtension context={context} actions={actions} />
));

interface Mentor {
    id: string;
    name: string;
    email: string;
    phone: string;
    mentorExpertise: string;
    mentorAvailability: string;
    mentorSessionsCompleted: string;
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
                    {CARD_TITLE} ({mentors.length})
                </Text>
                <Button onClick={fetchMentors} variant="secondary" size="xs">
                    Refresh
                </Button>
            </Flex>

            <Divider />

            {mentors.map((mentor, index) => (
                <React.Fragment key={mentor.id}>
                    <MentorCard mentor={mentor} />
                    {index < mentors.length - 1 && <Divider distance="md" />}
                </React.Fragment>
            ))}
        </Flex>
    );
};
