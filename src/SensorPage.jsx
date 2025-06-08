import React, { useState } from 'react';
import AddSensorForm from './AddSensorForm';
import SensorList from './SensorList';

const SensorsPage = () => {
  const [refreshFlag, setRefreshFlag] = useState(false);

  const handleSensorAdded = () => {
    setRefreshFlag(prev => !prev);
  };

  return (
    <div>
      <AddSensorForm onSensorAdded={handleSensorAdded} />
      <SensorList refreshFlag={refreshFlag} />
    </div>
  );
};

export default SensorsPage;

