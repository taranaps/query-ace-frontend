'use client';
import React from 'react';
import AddRecordForm from '../../components/add-record-form/AddRecordForm';
import NavigationTabs from '@/app/components/navigation-tabs/NavigationTabs';
import { Height } from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const AddRecordPage = () => {

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.status === 'INACTIVE') {
      router.push('/pages/login');
    }
  }, [user, router]);

  return (
    <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
      <NavigationTabs />
    </div>
  );
};  

export default AddRecordPage;