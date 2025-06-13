import { Box } from '@mantine/core';
import AuthButtons from '@/components/AuthButtons/AuthButtons';

export default function ProfessionalExperiencePage() {
  return (
    <>
      <Box style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box
          pl={{ base: 8, sm: 16, md: 24 }}
          pb={{ base: 8, sm: 16, md: 24 }}
          style={{ flex: '0 0 auto' }}
        >
          <h1>Professional Experience</h1>
          <AuthButtons />
        </Box>
      </Box>
    </>
  );
}
