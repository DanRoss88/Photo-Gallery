import { CardContent, Card, Typography } from "@mui/material";


const ProfileCard: React.FC<{ username: string }> = ({ username }) => (
    <Card sx={{ display: 'inline-block', backgroundColor: '#fff', padding: 1, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="body2" sx={{ color: 'gray' }}>
          @{username}
        </Typography>
      </CardContent>
    </Card>
  );
  
  export default ProfileCard;