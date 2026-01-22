// Simplified version - fetches data using HubSpot's built-in CRM APIs
// No external dependencies or secrets needed

exports.main = async (context = {}, sendResponse) => {
  const { hs_object_id } = context.parameters || {};

  try {
    console.log('Fetching founders for company:', hs_object_id);

    if (!hs_object_id) {
      return {
        founders: [],
        total: 0,
        message: 'No company ID provided',
      };
    }

    // Use HubSpot's context to fetch associated contacts
    // The context provides built-in methods to access CRM data
    const contactAssociations = await context.crm.fetchAssociations(
      'company',
      hs_object_id,
      'contact'
    );

    console.log('Contact associations found:', contactAssociations?.length || 0);

    if (!contactAssociations || contactAssociations.length === 0) {
      return {
        founders: [],
        total: 0,
        message: 'No contacts associated with this company',
      };
    }

    // Fetch contact details for each associated contact
    const contactPromises = contactAssociations.map(async (assoc) => {
      try {
        const contact = await context.crm.fetchCrmObjectProperties(
          'contact',
          assoc.id,
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
        return contact;
      } catch (err) {
        console.error('Error fetching contact:', assoc.id, err);
        return null;
      }
    });

    const contacts = (await Promise.all(contactPromises)).filter(c => c !== null);

    console.log('Contacts fetched:', contacts.length);

    // Transform to founder card format
    const founders = contacts.map(contact => {
      const props = contact.properties || {};
      
      return {
        id: contact.id || contact.hs_object_id,
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

    console.log('Returning founders:', founders);

    return {
      founders,
      total: founders.length,
      status: 'success',
    };

  } catch (error) {
    console.error('Error in serverless function:', error);
    return {
      founders: [],
      total: 0,
      error: error.message,
      status: 'error',
    };
  }
};