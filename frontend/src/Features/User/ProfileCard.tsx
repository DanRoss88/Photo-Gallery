import { Card, CardContent, Typography, Avatar } from '@mui/material';

interface ProfileCardProps {
  username: string;
  avatarUrl?: string; // Optional URL for the avatar
}

const ProfileCard: React.FC<ProfileCardProps> = ({ username, avatarUrl }) => (
  <Card
    sx={{
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      padding: 1,
      borderRadius: 2,
      boxShadow: 3,
      maxWidth: 240,
      margin: 1,
    }}
  >
    <Avatar src={avatarUrl || 'https://via.placeholder.com/40'} alt={username} sx={{ width: 40, height: 40, marginRight: 1 }} />
    <CardContent sx={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Typography className="sixtyfour-convergence-new" variant="body1" sx={{ fontWeight: 'bold', color: '#333', fontSize: '0.875rem' }}>
        *{username}
      </Typography>
    </CardContent>
  </Card>
);

export default ProfileCard;
