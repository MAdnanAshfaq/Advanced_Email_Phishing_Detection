import { useEffect, useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Card,
  CardBody,
  Heading,
  Text,
  Spinner,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  Link,
  Collapse,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Icon,
} from '@chakra-ui/react';
import axios from 'axios';
import { FaLink } from 'react-icons/fa';

interface EmailAnalysis {
  headers: {
    subject: string;
    from: string;
    to: string;
    date: string;
  }[];
  bodies: string[];
  urls: string[][];
  vendorAnalysis: {
    status: string;
    totalEmails: number;
    analyzedEmails: number;
    suspiciousCount: number;
    timestamp: string;
  };
  maliciousUrls: string[];
  timestamp: string;
}

interface EmailHeader {
  subject: string;
  from: string;
  to: string;
  date: string;
}

interface SelectedEmail {
  header: EmailHeader;
  body: string;
  urls: string[];
  index: number;
}

const EmailModal = ({ email, isOpen, onClose }: { 
  email: SelectedEmail | null; 
  isOpen: boolean; 
  onClose: () => void; 
}) => {
  if (!email) return null;

  // Convert HTML content to readable text
  const createMarkup = (htmlContent: string) => {
    return { __html: htmlContent };
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {email.header.subject}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack align="stretch" spacing={4}>
            <Box p={4} bg="gray.50" borderRadius="md">
              <Text fontWeight="bold">From: {email.header.from}</Text>
              <Text fontWeight="bold">Date: {new Date(email.header.date).toLocaleString()}</Text>
            </Box>
            <Box 
              p={4} 
              borderRadius="md" 
              className="email-content"
              dangerouslySetInnerHTML={createMarkup(email.body)}
              sx={{
                'img': {
                  maxWidth: '100%',
                  height: 'auto'
                },
                'a': {
                  color: 'blue.500',
                  textDecoration: 'underline'
                }
              }}
            />
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const LinkAnalysisDrawer = ({ 
  isOpen, 
  onClose, 
  emailData 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  emailData: EmailAnalysis | null; 
}) => {
  if (!emailData) return null;

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Link Analysis Results</DrawerHeader>
        <DrawerBody>
          <VStack align="stretch" spacing={6}>
            {emailData.headers.map((header, index) => (
              <Box key={index} p={4} borderWidth={1} borderRadius="md">
                <Text fontWeight="bold" mb={2}>{header.from}</Text>
                <Text fontSize="sm" color="gray.600" mb={4}>
                  {new Date(header.date).toLocaleDateString()}
                </Text>
                {emailData.urls[index]?.length > 0 ? (
                  emailData.urls[index].map((url, urlIndex) => (
                    <Box key={urlIndex} p={2} bg="gray.50" borderRadius="sm" mb={2}>
                      <Link color="blue.500" href={url} isExternal>
                        {url}
                      </Link>
                      <Badge 
                        ml={2} 
                        colorScheme={emailData.maliciousUrls.includes(url) ? 'red' : 'green'}
                      >
                        {emailData.maliciousUrls.includes(url) ? 'Malicious' : 'Safe'}
                      </Badge>
                    </Box>
                  ))
                ) : (
                  <Text color="gray.500">No URLs found in this email</Text>
                )}
              </Box>
            ))}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

const EmailDashboard = () => {
  const [emailData, setEmailData] = useState<EmailAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState<SelectedEmail | null>(null);
  const [expandedRows, setExpandedRows] = useState<{ [key: number]: boolean }>({});
  const { 
    isOpen: isEmailOpen, 
    onOpen: onEmailOpen, 
    onClose: onEmailClose 
  } = useDisclosure();
  const {
    isOpen: isAnalysisOpen,
    onOpen: onAnalysisOpen,
    onClose: onAnalysisClose
  } = useDisclosure();

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/email/complete-analysis');
        setEmailData(response.data);
      } catch (error) {
        console.error('Error fetching emails:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, []);

  const handleOpenEmail = (index: number) => {
    if (emailData) {
      setSelectedEmail({
        header: emailData.headers[index],
        body: emailData.bodies[index],
        urls: emailData.urls[index],
        index
      });
      onEmailOpen();
    }
  };

  const toggleUrlAnalysis = (index: number) => {
    setExpandedRows(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
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
          <Heading size="lg" mb={4}>Email Analysis Dashboard</Heading>
          <Button 
            colorScheme="teal" 
            mb={4} 
            onClick={onAnalysisOpen}
            leftIcon={<Icon as={FaLink} />}
          >
            View Link Analysis
          </Button>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Sender</Th>
                <Th>Subject</Th>
                <Th>Date</Th>
                <Th>URLs Found</Th>
                <Th>Analysis</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {emailData?.headers.map((header, index) => (
                <>
                  <Tr key={index}>
                    <Td>{header.from}</Td>
                    <Td>
                      <Text overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                        {header.subject}
                      </Text>
                    </Td>
                    <Td>{new Date(header.date).toLocaleDateString()}</Td>
                    <Td>{emailData.urls[index]?.length || 0} URLs</Td>
                    <Td>
                      <Badge
                        colorScheme={
                          emailData.urls[index]?.some(url => 
                            emailData.maliciousUrls.includes(url)
                          )
                            ? 'red'
                            : 'green'
                        }
                      >
                        {emailData.urls[index]?.some(url => 
                          emailData.maliciousUrls.includes(url)
                        )
                          ? 'Suspicious'
                          : 'Clean'
                        }
                      </Badge>
                    </Td>
                    <Td>
                      <Button size="sm" colorScheme="blue" mr={2} onClick={() => handleOpenEmail(index)}>
                        Open Email
                      </Button>
                      <Button 
                        size="sm" 
                        colorScheme="teal"
                        onClick={() => toggleUrlAnalysis(index)}
                      >
                        {expandedRows[index] ? 'Hide URLs' : 'Show URLs'}
                      </Button>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td colSpan={6}>
                      <Collapse in={expandedRows[index]}>
                        <Box p={4} bg="gray.50">
                          <VStack align="stretch">
                            <Text fontWeight="bold">URLs found in this email:</Text>
                            {emailData.urls[index]?.map((url, urlIndex) => (
                              <Box key={urlIndex} p={2} bg="white" borderRadius="md">
                                <Link color="blue.500" href={url} isExternal>
                                  {url}
                                </Link>
                                <Badge 
                                  ml={2} 
                                  colorScheme={emailData.maliciousUrls.includes(url) ? 'red' : 'green'}
                                >
                                  {emailData.maliciousUrls.includes(url) ? 'Malicious' : 'Safe'}
                                </Badge>
                              </Box>
                            ))}
                          </VStack>
                        </Box>
                      </Collapse>
                    </Td>
                  </Tr>
                </>
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>

      <EmailModal 
        email={selectedEmail} 
        isOpen={isEmailOpen} 
        onClose={onEmailClose} 
      />

      <LinkAnalysisDrawer 
        isOpen={isAnalysisOpen} 
        onClose={onAnalysisClose} 
        emailData={emailData} 
      />
    </Box>
  );
};

export default EmailDashboard; 