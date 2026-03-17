import axios from "axios";
import { useEffect, useState } from "react";

function ProfessorDashboard() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const res = await axios.get("http://localhost:5000/requests");
    setRequests(res.data);
  };

  const approve = async (id) => {
    await axios.put(`http://localhost:5000/approve/${id}`);
    fetchRequests(); // refresh data
  };

  const reject = async (id) => {
    await axios.put(`http://localhost:5000/reject/${id}`);
    fetchRequests(); // refresh data
  };

  return (
    <div>
      <h2>Professor Dashboard</h2>

      {requests.map((req) => (
        <div key={req._id} style={{border: "1px solid black", margin: "10px", padding: "10px"}}>
          
          <p>Name: {req.name}</p>
          <p>Pin: {req.pin}</p>
          <p>Status: {req.status}</p>

          {/* ✅ Buttons */}
          <button onClick={() => approve(req._id)}>Approve</button>
          <button onClick={() => reject(req._id)}>Reject</button>

        </div>
      ))}
    </div>
  );
}

export default ProfessorDashboard;