import React, { useState, useEffect } from 'react';
import axios from 'axios';

function StudentDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState(''); // For apply success/error messages

  const [filters, setFilters] = useState({
    title: '',
    location: '',
    company: '',
  });

  const fetchJobs = async (currentFilters) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
        return;
      }

      const params = new URLSearchParams(currentFilters).toString();
      
      const response = await axios.get(`https://job-portal-server-1-44l9.onrender.com/api/jobs?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setJobs(response.data);
    } catch (err) {
      setError('Failed to fetch jobs.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchJobs(filters);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(filters);
  };

  const handleApply = async (jobId) => {
    setMessage(''); // Clear previous message
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('You must be logged in to apply.');
        return;
      }

      const response = await axios.post(`https://job-portal-server-1-44l9.onrender.com/api/jobs/${jobId}/apply`, 
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      setMessage(response.data.message);
    } catch (err) {
      setMessage(err.response.data.message);
    }
  };

  return (
    <div>
      <h2>Available Jobs</h2>
      
      <form onSubmit={handleSearch}>
        <div className="grid">
          <input type="text" name="title" placeholder="Filter by title..." value={filters.title} onChange={handleFilterChange} />
          <input type="text" name="location" placeholder="Filter by location..." value={filters.location} onChange={handleFilterChange} />
          <input type="text" name="company" placeholder="Filter by company..." value={filters.company} onChange={handleFilterChange} />
        </div>
        <button type="submit">Search</button>
      </form>
      
      {message && <p><strong>{message}</strong></p>}
      
      <hr />

      {loading && <p>Loading jobs...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!loading && !error && (
        jobs.length === 0 ? (
          <p>No jobs found matching your criteria.</p>
        ) : (
          <div>
            {jobs.map((job) => (
              <article key={job._id}>
                <header>
                  <h3>{job.title}</h3>
                </header>
                <p>{job.description}</p>
                <footer>
                  <p><strong>Company:</strong> {job.company}</p>
                  <p><strong>Location:</strong> {job.location}</p>
                </footer>
                <button onClick={() => handleApply(job._id)}>Apply</button>
              </article>
            ))}
          </div>
        )
      )}
    </div>
  );
}

export default StudentDashboard;