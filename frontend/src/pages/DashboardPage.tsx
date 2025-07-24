import { useEffect, useState } from 'react';
import apiClient from '../services/api';
// ... importa i componenti

const DashboardPage = () => {
    const [candidates, setCandidates] = useState([]);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        apiClient.get('/candidates')
            .then(response => setCandidates(response.data))
            .catch(error => console.error('Failed to fetch candidates', error));
    }, []);

    const filteredCandidates = candidates.filter(c => 
        c.fullName.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div>
            <h1>Dashboard Candidati</h1>
            <FilterBar value={filter} onChange={setFilter} />
            <CandidateTable candidates={filteredCandidates} />
            {/* Aggiungeremo qui la paginazione */}
        </div>
    );
};
export default DashboardPage;