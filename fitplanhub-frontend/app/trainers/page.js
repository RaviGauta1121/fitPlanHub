'use client';

import { useState, useEffect } from 'react';
import { trainerService } from '@/lib/auth';
import TrainerCard from '@/components/TrainerCard';

export default function Trainers() {
  const [trainers, setTrainers] = useState([]);
  const [followedIds, setFollowedIds] = useState([]);

  useEffect(() => {
    fetchTrainers();
    fetchFollowed();
  }, []);

  const fetchTrainers = async () => {
    try {
      const response = await trainerService.getAllTrainers();
      setTrainers(response.data);
    } catch (error) {
      console.error('Error fetching trainers:', error);
    }
  };

  const fetchFollowed = async () => {
    try {
      const response = await trainerService.getFollowedTrainers();
      setFollowedIds(response.data.map(t => t._id));
    } catch (error) {
      console.error('Error fetching followed trainers:', error);
    }
  };

  const handleFollow = async (id) => {
    try {
      await trainerService.followTrainer(id);
      setFollowedIds([...followedIds, id]);
    } catch (error) {
      alert('Error following trainer');
    }
  };

  const handleUnfollow = async (id) => {
    try {
      await trainerService.unfollowTrainer(id);
      setFollowedIds(followedIds.filter(tid => tid !== id));
    } catch (error) {
      alert('Error unfollowing trainer');
    }
  };

  return (
    <div>
      <h1 style={styles.heading}>All Trainers</h1>
      <div style={styles.grid}>
        {trainers.map(trainer => (
          <TrainerCard
            key={trainer._id}
            trainer={trainer}
            isFollowing={followedIds.includes(trainer._id)}
            onFollow={() => handleFollow(trainer._id)}
            onUnfollow={() => handleUnfollow(trainer._id)}
          />
        ))}
      </div>
    </div>
  );
}

const styles = {
  heading: {
    fontSize: '2rem',
    marginBottom: '2rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem'
  }
};
