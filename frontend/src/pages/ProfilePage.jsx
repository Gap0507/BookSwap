import { useParams } from 'react-router-dom';
import UserProfile from '../components/UserProfile';

const ProfilePage = () => {
  const { userId } = useParams();
  
  return (
    <div className="min-h-screen py-12">
      <UserProfile userId={userId} />
    </div>
  );
};

export default ProfilePage;