import React from 'react';
import Statistics from './Statistics';
import { useParams } from 'react-router-dom';

const AdminStatistics = () => {
    const { userId } = useParams();

    return (
        <Statistics adminView userId={userId} />
    );
};

export default AdminStatistics;
