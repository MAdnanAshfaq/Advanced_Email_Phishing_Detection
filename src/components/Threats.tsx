import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Badge,
  Text,
  HStack,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { Card, CardBody } from '@chakra-ui/card';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/table';
import {
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
} from '@chakra-ui/stat';
import axios from 'axios';

interface EmailThreat {
  id: string;
  type: string;
  source: string;
  severity: 'high' | 'medium' | 'low';
  detectedAt: string;
  status: 'active' | 'resolved';
}

const Threats: React.FC = () => {
  const [threats, setThreats] = useState<EmailThreat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First, check if the server is responding
        const testResponse = await axios.get('http://localhost:5000/api/test');
        console.log('Server connection test:', testResponse.data);
        
        // If server responds, fetch the actual data
        const response = await axios.get('http://localhost:5000/api/email/complete-analysis');
        console.log('Email analysis response:', response.data);
        
        if (!response.data) {
          throw new Error('No data received from server');
        }

        // Create at least one test threat if no threats are found
        const defaultThreat = {
          id: '0-default',
          type: 'Test Threat',
          source: 'System',
          severity: 'low' as const,
          detectedAt: new Date().toISOString(),
          status: 'active' as const
        };

        const emailData = response.data;
        let transformedThreats: EmailThreat[] = [];

        if (emailData.headers && Array.isArray(emailData.headers)) {
          transformedThreats = emailData.headers.map((header: any, index: number) => ({
            id: `${index}-${Date.now()}`,
            type: 'Email Analysis',
            source: header.from || 'Unknown',
            severity: 'medium',
            detectedAt: header.date || new Date().toISOString(),
            status: 'active'
          }));
        }

        setThreats(transformedThreats.length > 0 ? transformedThreats : [defaultThreat]);
        
      } catch (error) {
        console.error('Connection error:', error);
        setError(error instanceof Error ? error.message : 'Failed to connect to server');
        // Set default threat in case of error
        setThreats([{
          id: '0-error',
          type: 'Connection Error',
          source: 'System',
          severity: 'low',
          detectedAt: new Date().toISOString(),
          status: 'active'
        }]);
      } finally {
        setLoading(false);
      }
    };

    checkConnection();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={5}>
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={5}>
      <Heading size="lg" mb={4}>Threat Dashboard</Heading>

      <StatGroup mb={6}>
        <Card flex="1" mr={4}>
          <CardBody>
            <Stat>
              <StatLabel>Active Threats</StatLabel>
              <StatNumber>{threats.length}</StatNumber>
            </Stat>
          </CardBody>
        </Card>
        <Card flex="1" mr={4}>
          <CardBody>
            <Stat>
              <StatLabel>High Severity</StatLabel>
              <StatNumber>
                {threats.filter(t => t.severity === 'high').length}
              </StatNumber>
            </Stat>
          </CardBody>
        </Card>
        <Card flex="1">
          <CardBody>
            <Stat>
              <StatLabel>Total Analyzed</StatLabel>
              <StatNumber>{threats.length}</StatNumber>
            </Stat>
          </CardBody>
        </Card>
      </StatGroup>

      {threats.length === 0 ? (
        <Alert status="info">
          <AlertIcon />
          No threats detected
        </Alert>
      ) : (
        <Card>
          <CardBody>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Type</Th>
                  <Th>Source</Th>
                  <Th>Severity</Th>
                  <Th>Detected At</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {threats.map((threat) => (
                  <Tr key={threat.id}>
                    <Td>{threat.type}</Td>
                    <Td>
                      <Text overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                        {threat.source}
                      </Text>
                    </Td>
                    <Td>
                      <Badge
                        colorScheme={
                          threat.severity === 'high'
                            ? 'red'
                            : threat.severity === 'medium'
                            ? 'yellow'
                            : 'green'
                        }
                      >
                        {threat.severity}
                      </Badge>
                    </Td>
                    <Td>{new Date(threat.detectedAt).toLocaleString()}</Td>
                    <Td>
                      <Badge
                        colorScheme={threat.status === 'active' ? 'red' : 'green'}
                      >
                        {threat.status}
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      )}
    </Box>
  );
};

export default Threats; 