const hubspot = require('@hubspot/api-client');

exports.main = async (context = {}, sendResponse) => {
  const hs = new hubspot.Client({ accessToken: process.env.PRIVATE_APP_ACCESS_TOKEN });

  const contactId = context.propertiesToSend.hs_object_id;
  if (!contactId) {
    sendResponse({
      statusCode: 400,
      body: { error: 'contactId is required' },
    });
    return;
  }

  try {
    const fromObjectType = 'contact';
    const toObjectType = '2-47111273';

    // Step 1: Get associated custom object IDs
    const assocResponse = await hs.crm.objects.associationsApi.getAll(
      fromObjectType,
      contactId,
      toObjectType
    );

    const customObjectIds = assocResponse.results.map(r => r.id);

    if (!customObjectIds || !Array.isArray(customObjectIds) || customObjectIds.length === 0) {

      return;
    }
    // Step 2: Fetch custom object properties
    const propertiesToFetch = ['status', 'invoice_pdf', 'hs_object_id', 'amount', 'hs_createdate', 'paid_at', 'due_date'];

    const customObjectData = await hs.crm.objects.batchApi.read(toObjectType, {
      inputs: customObjectIds.map(id => ({ id })),
      properties: propertiesToFetch,
    });

    const customObjects = customObjectData.results.map(obj => ({
      id: obj.id,
      properties: obj.properties,
    }));


    return customObjects;
  } catch (error) {
    console.error('Error fetching custom objects:', error.message || error);

    sendResponse({
      statusCode: 500,
      body: { error: 'Internal server error' },
    });
  }
};
