import React from 'react';
import {
  Box,
  VStack,
  Icon,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import { 
  MdEmail, 
  MdLink, 
  MdWarning,
  MdSettings,
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  onNavigate: (route: string) => void;
}

interface SidebarButtonProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  isActive?: boolean;
}

const SidebarButton: React.FC<SidebarButtonProps> = ({ icon, label, onClick, isActive = false }) => {
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const hoverBg = useColorModeValue('gray.200', 'gray.600');
  const activeBg = useColorModeValue('blue.100', 'blue.700');

  return (
    <Tooltip label={label} placement="right">
      <Box
        p={3}
        cursor="pointer"
        borderRadius="md"
        bg={isActive ? activeBg : 'transparent'}
        _hover={{ bg: isActive ? activeBg : hoverBg }}
        onClick={onClick}
      >
        <Icon as={icon} boxSize={6} />
      </Box>
    </Tooltip>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
  const navigate = useNavigate();
  
  return (
    <Box
      h="100vh"
      w="16"
      bg={useColorModeValue('white', 'gray.800')}
      borderRight="1px"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      py={4}
    >
      <VStack spacing={4}>
        <SidebarButton
          icon={MdEmail}
          label="Emails"
          onClick={() => navigate('/emails')}
        />
        <SidebarButton
          icon={MdLink}
          label="Link Analysis"
          onClick={() => navigate('/link-analysis')}
        />
        <SidebarButton
          icon={MdWarning}
          label="Threats"
          onClick={() => navigate('/threats')}
        />
        <SidebarButton
          icon={MdSettings}
          label="Settings"
          onClick={() => navigate('/settings')}
        />
      </VStack>
    </Box>
  );
};

export default Sidebar; 