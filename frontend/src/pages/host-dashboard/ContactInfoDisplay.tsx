import {useEffect, useState} from 'react';
import axios from 'axios';
import {Typography, Box, CircularProgress} from '@mui/material';
import {useParams} from 'react-router-dom';

// Define TypeScript type for the contact info response
type ContactInfo = {
  id: number;
  preferred_method: string;
  phone_number: string;
  created_at: string;
};

export function ContactInfoDisplay() {
  const {contactId} = useParams<{contactId: string}>();
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!contactId) return;

    async function fetchContactInfo() {
      try {
        const response = await axios.get(
          `/api/host-dashboard/contact-info/${contactId}`,
        );
        // console.log('Received:', response.data);
        setContactInfo(response.data);
      } catch (error) {
        console.error('Error fetching contact info:', error);
        setError('Failed to load contact info');
      } finally {
        setLoading(false);
      }
    }

    fetchContactInfo();
  }, [contactId]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (
    !contactInfo ||
    !contactInfo.preferred_method ||
    !contactInfo.phone_number
  ) {
    return <Typography>No contact info found.</Typography>;
  }

  // Parse and format created_at safely
  const createdAtDate = new Date(contactInfo.created_at);
  const createdAtDisplay = isNaN(createdAtDate.getTime())
    ? 'Invalid date'
    : createdAtDate.toLocaleString();

  return (
    <Box sx={{p: 4}}>
      <Typography variant="h4" gutterBottom>
        Contact Info
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Preferred Method:</strong> {contactInfo.preferred_method}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Phone Number:</strong> {contactInfo.phone_number}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Created At: {createdAtDisplay}
      </Typography>
    </Box>
  );
}
