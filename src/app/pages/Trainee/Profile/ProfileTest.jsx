// Test component để debug API call
import React, { useState, useEffect } from 'react';
import { Card, Button, Spin, Alert } from 'antd';
import { getAuthToken } from '../../../libs/cookies';
import { getTraineeProfileById } from '../../../apis/Trainee/TraineeProfileApi';

export default function ProfileTest() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [testId, setTestId] = useState('8'); // Default test ID

  const fetchProfile = async () => {
    const token = getAuthToken();
    
    console.log('=== Test Fetch ===');
    console.log('Token:', token);
    console.log('Test ID:', testId);
    
    if (!token) {
      setError('No token found. Please login.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getTraineeProfileById(testId, token);
      console.log('Success:', data);
      setProfileData(data);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card title="Profile API Test">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Trainee ID:</label>
            <input
              type="text"
              value={testId}
              onChange={(e) => setTestId(e.target.value)}
              className="border rounded px-3 py-2 w-full max-w-xs"
            />
          </div>
          
          <Button type="primary" onClick={fetchProfile} loading={loading}>
            Fetch Profile
          </Button>

          {loading && <Spin />}
          
          {error && (
            <Alert type="error" message={error} showIcon />
          )}
          
          {profileData && (
            <div className="mt-4">
              <h3 className="font-bold mb-2">Profile Data:</h3>
              <pre className="bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(profileData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
