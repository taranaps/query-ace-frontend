// pages/add.tsx
import React from 'react';
import AddRecordForm from '../../components/add-record-form/AddRecordForm';
import NavigationTabs from '@/app/components/navigation-tabs/NavigationTabs';
import { Height } from '@mui/icons-material';


const AddRecordPage = () => {
  return (
    <div style={{ height: "100%", width: "100%" , display:"flex", flexDirection:"column"}}>
      <NavigationTabs />
    </div>
  );
};


export default AddRecordPage;