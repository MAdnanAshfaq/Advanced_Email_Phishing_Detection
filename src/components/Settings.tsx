import React from 'react';
import {
  Box,
  Switch,
  FormControl,
  FormLabel,
  VStack,
  useColorMode,
  Heading,
  Divider,
  Card,
  CardBody,
} from '@chakra-ui/react';

const Settings = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box p={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="lg">Settings</Heading>

        <Card>
          <CardBody>
            <VStack spacing={6} align="stretch">
              <Heading size="md">Appearance</Heading>
              <FormControl display="flex" alignItems="center">
                <FormLabel mb={0}>Dark Mode</FormLabel>
                <Switch isChecked={colorMode === 'dark'} onChange={toggleColorMode} />
              </FormControl>
            </VStack>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <VStack spacing={6} align="stretch">
              <Heading size="md">Notifications</Heading>
              <FormControl display="flex" alignItems="center">
                <FormLabel mb={0}>Email Alerts</FormLabel>
                <Switch defaultChecked />
              </FormControl>
              <FormControl display="flex" alignItems="center">
                <FormLabel mb={0}>Threat Alerts</FormLabel>
                <Switch defaultChecked />
              </FormControl>
            </VStack>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <VStack spacing={6} align="stretch">
              <Heading size="md">Analysis Settings</Heading>
              <FormControl display="flex" alignItems="center">
                <FormLabel mb={0}>Auto-analyze new emails</FormLabel>
                <Switch defaultChecked />
              </FormControl>
              <FormControl display="flex" alignItems="center">
                <FormLabel mb={0}>Deep URL scanning</FormLabel>
                <Switch defaultChecked />
              </FormControl>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default Settings; 