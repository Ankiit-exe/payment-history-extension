import React, { useState, useEffect } from 'react';
import {
  Alert,
  LoadingSpinner,
  Text,
  Card,
  Divider,
  Box,
  Flex,
  Button,
  Link,
} from '@hubspot/ui-extensions';
import { hubspot } from '@hubspot/ui-extensions';

hubspot.extend(({ actions }) => (
  <PaymentHistoryCard fetchProperties={actions.fetchCrmObjectProperties} />
));

const PaymentHistoryCard = ({ fetchProperties }) => {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentsData, setPaymentsData] = useState([]);

  useEffect(() => {
    hubspot
      .serverless('PaymentsHistory', {
        propertiesToSend: ['hs_object_id'],
      })
      .then((response) => {
        setPaymentsData(Array.isArray(response) ? response : []);
      })
      .catch((error) => {
        console.error('Error fetching payments:', error);
        setErrorMessage(error.message || 'Unable to fetch payment data');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Loading state
  if (loading) {
    return (
      <Card>
        <Box padding="medium">
          <Text format={{ fontWeight: 'bold' }}>💳 Payment History</Text>
          <Divider spacing="medium" />
          <Box align="center" padding="medium">
            <LoadingSpinner />
            <Text>Loading payment data...</Text>
          </Box>
        </Box>
      </Card>
    );
  }

  // Error state
  if (errorMessage) {
    return (
      <Card>
        <Box padding="medium">
          <Text format={{ fontWeight: 'bold' }}>💳 Payment History</Text>
          <Divider spacing="medium" />
          <Alert title="Unable to get payment data" variant="error">
            {errorMessage}
          </Alert>
        </Box>
      </Card>
    );
  }

  // Calculate summary statistics
  const totalRevenue = paymentsData
    .filter(p => p?.properties?.status?.toLowerCase() === 'paid')
    .reduce((sum, payment) => {
      const amount = parseFloat(payment.properties.amount) || 0;
      return sum + amount;
    }, 0);

  const openPayments = paymentsData.filter(
    (p) => p?.properties?.status?.toLowerCase() === 'open'
  ).length;

  // Get 5 most recent payments
  const recentPayments = [...paymentsData]
    .filter(p => p?.properties)
    .sort(
      (a, b) =>
        new Date(b.properties.hs_createdate) -
        new Date(a.properties.hs_createdate)
    )
    .slice(0, 5);

  // Function to format currency
  const formatCurrency = (amount) => {
    return `$${(amount / 100).toFixed(2)}`;
  };

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString();
  };

  // Function to get status color/style
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return { color: 'green' };
      case 'open':
        return { color: 'orange' };
      case 'uncollectable':
        return { color: 'red' };
      default:
        return { color: 'gray' };
    }
  };

  return (
    <Card>
      <Box padding="medium">
        {/* Card Title */}
        <Text format={{ fontWeight: 'bold', fontSize: 'large' }}>
          💳 Payment History
        </Text>
        <Divider spacing="medium" />

        {/* Summary View */}
        <Box padding="small">
          <Text format={{ fontWeight: 'bold' }}>Summary</Text>
          <Divider spacing="small" />

          {/* Total Revenue */}
          <Flex justify="between" align="center">
            <Text format={{ fontWeight: 'medium' }}>Total Revenue:</Text>
            <Text format={{ fontWeight: 'bold', fontSize: 'large' }}>
              {formatCurrency(totalRevenue)}
            </Text>
          </Flex>

          <Divider spacing="small" />

          {/* Open Payments */}
          <Flex justify="between" align="center">
            <Text format={{ fontWeight: 'medium' }}>Open Payments:</Text>
            <Text format={{ fontWeight: 'bold', fontSize: 'large' }}>
              {openPayments}
            </Text>
          </Flex>
        </Box>

        <Divider spacing="medium" />

        {/* Recent Payments List */}
        <Box padding="small">
          <Text format={{ fontWeight: 'bold' }}>Recent Payments</Text>
          <Divider spacing="small" />

          {recentPayments.length > 0 ? (
            recentPayments.map((payment, index) => (
              <Box key={payment.id || index} padding="small">
                <Flex direction="column" gap="xs">
                  {/* Payment Status and Amount */}
                  <Flex justify="between" align="center">
                    <Text format={getStatusStyle(payment.properties.status)}>
                      ● {(payment.properties.status || 'Unknown').toUpperCase()}
                    </Text>
                    <Text format={{ fontWeight: 'bold' }}>
                      {payment.properties.amount
                        ? formatCurrency(parseFloat(payment.properties.amount))
                        : '—'}
                    </Text>
                  </Flex>

                  {/* Payment Date */}
                  <Text format={{ fontSize: 'small' }}>
                    Paid: {formatDate(payment.properties.paid_at)}
                  </Text>
                  {/* Invoice PDF Link */}
                  <Text format={{ fontSize: 'small' }}>
                    Due Date: {payment.properties.due_date ? formatDate(payment.properties.due_date) : '—'}
                  </Text>

                  <Link
                    href={payment.properties.invoice_pdf}
                    target="_blank" // 👈 This tells the browser to open in a new tab
                    rel="noopener noreferrer" // ✅ Safe practice to prevent tab hijacking
                    variant="secondary"
                    size="xs"
                  >
                    View Invoice PDF
                  </Link>


                </Flex>

                {/* Divider between payments */}
                {index < recentPayments.length - 1 && (
                  <Divider spacing="small" />
                )}
              </Box>
            ))
          ) : (
            <Box padding="medium" align="center">
              <Text>No payment data available</Text>
            </Box>
          )}
        </Box>

        {/* Footer */}
        <Divider spacing="medium" />
        <Box align="center">
          <Text format={{ fontSize: 'small' }}>
            Showing {Math.min(recentPayments.length, 5)} of {paymentsData.length} payments
          </Text>
        </Box>
      </Box>
    </Card>
  );
};