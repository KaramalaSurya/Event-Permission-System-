import React, { useState, useEffect } from "react";

function App() {

  const [page, setPage] = useState("login");
  const [requests, setRequests] = useState([]);

  // ✅ AUTO LOAD when dashboard opens
  useEffect(() => {
    if (page === "dashboard") {
      loadRequests();
    }
  }, [page]);

  const login = async () => {

    const pin = document.getElementById("pin").value;

    const res = await fetch("http://localhost:5000/prof-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ pin })
    });

    const data = await res.json();

    if (data.status === "success") {
      setPage("dashboard");  // ❌ removed loadRequests from here
    } else {
      alert("Invalid PIN");
    }
  };

  const sendRequest = async () => {

    const name = document.getElementById("name").value;
    const pin = document.getElementById("studentPin").value;

    await fetch("http://localhost:5000/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, pin })
    });

    alert("Request Sent");
  };

  const loadRequests = async () => {
    const res = await fetch("http://localhost:5000/requests");
    const data = await res.json();

    setRequests([...data]); // 🔥 ensures re-render
  };

  if (page === "login") {
    return (
      <div>
        <h1>Professor Login</h1>
        <input id="pin" placeholder="Enter PIN" />
        <button onClick={login}>Login</button>

        <hr />

        <h2>Student Request</h2>
        <input id="name" placeholder="Student Name" />
        <input id="studentPin" placeholder="Student PIN" />
        <button onClick={sendRequest}>Request Permission</button>
      </div>
    )
  }
if (page === "dashboard") {
  return (
    <div style={{
      backgroundColor: "#f4f6f8",
      minHeight: "100vh",
      padding: "20px"
    }}>
      
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Professor Dashboard
      </h1>

      <div style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "20px"
      }}>

        {requests.map((r) => (
          <div key={r._id} style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
            width: "250px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
          }}>

            <h3 style={{ marginBottom: "10px" }}>{r.name}</h3>
            <p><b>PIN:</b> {r.pin}</p>

            {/* ✅ Status Badge */}
            <p style={{
              marginTop: "10px",
              padding: "5px 10px",
              borderRadius: "5px",
              textAlign: "center",
              color: "white",
              backgroundColor:
                r.status === "approved" ? "green" :
                r.status === "rejected" ? "red" : "orange"
            }}>
              {r.status.toUpperCase()}
            </p>

            {/* ✅ Buttons */}
            {r.status === "pending" && (
              <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                
                <button style={{
                  flex: 1,
                  padding: "8px",
                  backgroundColor: "green",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}
                onClick={async () => {
                  await fetch(`http://localhost:5000/approve/${r._id}`, {
                    method: "PUT"
                  });
                  loadRequests();
                }}>
                  Approve
                </button>

                <button style={{
                  flex: 1,
                  padding: "8px",
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}
                onClick={async () => {
                  await fetch(`http://localhost:5000/reject/${r._id}`, {
                    method: "PUT"
                  });
                  loadRequests();
                }}>
                  Reject
                </button>

              </div>
            )}

          </div>
        ))}

      </div>
    </div>
  )
}
  }

export default App;