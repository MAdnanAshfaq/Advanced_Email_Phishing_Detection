import { useState, useEffect } from 'react';
import {
  Box,
  Input,
  Button,
  VStack,
  Text,
  Badge,
  Card,
  CardBody,
  Heading,
  Link,
  Spinner,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import axios from 'axios';

interface EmailAnalysis {
  headers: {
    subject: string;
    from: string;
    to: string;
    date: string;
  }[];
  urls: string[][];
  maliciousUrls: string[];
}

const LinkAnalysis = () => {
  const [emailData, setEmailData] = useState<EmailAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAndAnalyzeEmails();
  }, []);

  const fetchAndAnalyzeEmails = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/email/complete-analysis');
      setEmailData(response.data);
    } catch (error) {
      console.error('Error fetching emails:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box p={8}>
      <Card mb={6}>
        <CardBody>
          <Heading size="lg" mb={6}>URL Analysis Results</Heading>
          
          <Accordion allowMultiple>
            {emailData?.headers.map((header, index) => (
              <AccordionItem key={index}>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      <Text fontWeight="bold">{header.from}</Text>
                      <Text fontSize="sm" color="gray.600">
                        {new Date(header.date).toLocaleDateString()}
                      </Text>
                    </Box>
                    <Badge 
                      ml={2} 
                      colorScheme={
                        emailData.urls[index]?.some(url => 
                          emailData.maliciousUrls.includes(url)
                        ) ? 'red' : 'green'
                      }
                    >
                      {emailData.urls[index]?.length || 0} URLs
                    </Badge>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <VStack align="stretch" spacing={3}>
                    {emailData.urls[index]?.length > 0 ? (
                      emailData.urls[index].map((url, urlIndex) => (
                        <Box 
                          key={urlIndex} 
                          p={3} 
                          bg="gray.50" 
                          borderRadius="md"
                          borderLeft="4px solid"
                          borderLeftColor={
                            emailData.maliciousUrls.includes(url) ? 'red.500' : 'green.500'
                          }
                        >
                          <Link href={url} isExternal color="blue.500" wordBreak="break-all">
                            {url}
                          </Link>
                          <Badge 
                            ml={2} 
                            colorScheme={emailData.maliciousUrls.includes(url) ? 'red' : 'green'}
                          >
                            {emailData.maliciousUrls.includes(url) ? 'Malicious' : 'Safe'}
                          </Badge>
                          {emailData.maliciousUrls.includes(url) && (
                            <Text color="red.500" fontSize="sm" mt={2}>
                              ⚠️ This URL has been flagged as potentially malicious
                            </Text>
                          )}
                        </Box>
                      ))
                    ) : (
                      <Text color="gray.500">No URLs found in this email</Text>
                    )}
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </CardBody>
      </Card>
    </Box>
  );
};

export default LinkAnalysis; 