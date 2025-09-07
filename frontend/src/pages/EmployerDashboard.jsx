import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EmployerDashboard() {
  const [jobDetails, setJobDetails] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
  });

  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchMyJobs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/my-jobs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyJobs(response.data.jobs);
    } catch (err) {
      setError('Failed to fetch your jobs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobDetails(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/jobs', jobDetails, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Job posted successfully!');
      setJobDetails({ title: '', company: '', location: '', description: '' });
      fetchMyJobs(); // Refresh the job list
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to post job.');
    }
  };

  return (
    <div>
      <h2>Employer Dashboard</h2>

      <article>
        <header><h3>Post a New Job</h3></header>
        <form onSubmit={handlePostJob}>
          <div className="grid">
            <input type="text" name="title" placeholder="Job Title" value={jobDetails.title} onChange={handleInputChange} required />
            <input type="text" name="company" placeholder="Company Name" value={jobDetails.company} onChange={handleInputChange} required />
          </div>
          <input type="text" name="location" placeholder="Location" value={jobDetails.location} onChange={handleInputChange} required />
          <textarea name="description" placeholder="Job Description" value={jobDetails.description} onChange={handleInputChange} required />
          <button type="submit">Post Job</button>
        </form>
        {message && <p><strong>{message}</strong></p>}
      </article>

      <hr />

      <div className="jobs-section">
        <h3>Your Posted Jobs</h3>
        {loading && <p>Loading your jobs...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && myJobs.length === 0 && <p>You have not posted any jobs yet.</p>}
        
        {myJobs.map(job => (
          <article key={job._id}>
            <header>
              <h4>{job.title} at {job.company}</h4>
              <small>{job.location}</small>
            </header>
            
            <h5>Applicants ({job.applicants.length})</h5>
            {job.applicants.length > 0 ? (
              <ul>
                {job.applicants.map(applicant => (
                  <li key={applicant._id}>
                    {applicant.name} ({applicant.email})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No applicants yet.</p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

export default EmployerDashboard;