const hubspot = require('@hubspot/api-client');

exports.main = async (context = {}) => {
  const { hs_object_id } = context.parameters || {};

  try {
    console.log('=== Serverless Function Start ===');
    console.log('Company ID:', hs_object_id);

    if (!hs_object_id) {
      return {
        founders: [],
        total: 0,
        error: 'No company ID provided',
      };
    }

    // Get account credentials from context
    const hubspotClient = new hubspot.Client({
      accessToken: context.accountCredentials.accessToken || process.env.PRIVATE_APP_ACCESS_TOKEN,
    });

    console.log('Fetching associations...');

    // Get all contacts associated with this company
    const associations = await hubspotClient.crm.companies.associationsApi.getAll(
      hs_object_id,
      'contacts'
    );

    console.log('Associations found:', associations.results?.length || 0);

    if (!associations.results || associations.results.length === 0) {
      return {
        founders: [],
        total: 0,
      };
    }

    // Get contact IDs
    const contactIds = associations.results.map(assoc => assoc.id);
    console.log('Contact IDs:', contactIds);

    // Fetch contact details in batch
    const contactPromises = contactIds.map(async (contactId) => {
      try {
        return await hubspotClient.crm.contacts.basicApi.getById(
          contactId,
          [
            'firstname',
            'lastname',
            'email',
            'phone',
            'onboarding_status',
            'payment_status',
            'next_step',
            'cohort',
          ]
        );
      } catch (err) {
        console.error('Error fetching contact', contactId, err.message);
        return null;
      }
    });

    const contacts = (await Promise.all(contactPromises)).filter(c => c !== null);
    console.log('Contacts fetched:', contacts.length);

    // Transform to founder card format
    const founders = contacts.map(contact => {
      const props = contact.properties || {};
      
      return {
        id: contact.id,
        name: `${props.firstname || ''} ${props.lastname || ''}`.trim() || 'N/A',
        email: props.email || 'N/A',
        phone: props.phone || 'N/A',
        applicationStatus: props.onboarding_status || 'Applied',
        depositStatus: props.payment_status || 'Pending',
        onboardingStage: props.onboarding_status || 'Not Started',
        currentCohort: props.cohort || 'N/A',
        nextSteps: props.next_step || 'No action required',
      };
    });

    console.log('=== Returning founders:', founders.length, '===');

    return {
      founders,
      total: founders.length,
    };

  } catch (error) {
    console.error('=== Serverless Function Error ===');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    
    return {
      founders: [],
      total: 0,
      error: error.message || 'Failed to load founder data',
    };
  }
};