import React, { useState, useEffect } from "react";

function App() {

  const [page, setPage] = useState("login");
  const [requests, setRequests] = useState([]);
  const [selectedSection, setSelectedSection] = useState("");

  const [studentName, setStudentName] = useState("");
  const [studentSection, setStudentSection] = useState("");

  const periodTimes = {
    1: "9:10", 2: "10:10", 3: "11:10", 4: "12:10",
    5: "1:00", 6: "2:00", 7: "3:00", 8: "4:00"
  };

  // 🔥 AUTO REMOVE EXPIRED
  useEffect(() => {
    const interval = setInterval(() => {
      setRequests(prev =>
        prev.filter(r => {
          if (r.expiryTime) {
            return new Date(r.expiryTime) > new Date();
          }
          return true;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (page === "dashboard") loadRequests();
  }, [page]);

  const loadRequests = async () => {
    const res = await fetch("http://localhost:5000/requests");
    const data = await res.json();
    setRequests(data);
  };

  const login = async () => {
    const pin = document.getElementById("pin").value;

    const res = await fetch("http://localhost:5000/prof-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin })
    });

    const data = await res.json();

    if (data.status === "success") setPage("dashboard");
    else alert("Invalid PIN");
  };

  const handlePinChange = async (e) => {
    const pin = e.target.value;

    if (pin.length < 10) return;

    const res = await fetch(`http://localhost:5000/student/${pin}`);
    const data = await res.json();

    if (data.status === "found") {
      setStudentName(data.name);
      setStudentSection(data.section);
    }
  };

  const sendRequest = async () => {

    const pin = document.getElementById("studentPin").value;
    const reason = document.getElementById("reason").value;
    const fromPeriod = document.getElementById("fromPeriod").value;
    const toPeriod = document.getElementById("toPeriod").value;

    if (!pin || !reason || !fromPeriod || !toPeriod) {
      alert("Fill all fields");
      return;
    }

    await fetch("http://localhost:5000/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pin,
        reason,
        fromPeriod: Number(fromPeriod),
        toPeriod: Number(toPeriod)
      })
    });

    alert("Request Sent");
    loadRequests();
  };

  // 🔥 SECTION COUNTS (APPROVED ONLY)
  const sectionCounts = ["A","B","C","D","E"].map(sec => ({
    section: sec,
    count: requests.filter(r => r.section === sec && r.status === "approved").length
  }));

  // LOGIN PAGE
  if (page === "login") {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Professor Login</h1>
        <input id="pin" placeholder="PIN" />
        <button onClick={login}>Login</button>

        <hr />

        <h2>Student Request</h2>

        <input id="studentPin" onChange={handlePinChange} placeholder="Roll" />
        <input value={studentName} placeholder="Name" disabled />
        <input value={studentSection} placeholder="Section" disabled />

        <input id="reason" placeholder="Reason" />

        <select id="fromPeriod">
          <option value="">From</option>
          {Object.keys(periodTimes).map(p => (
            <option key={p} value={p}>{p} ({periodTimes[p]})</option>
          ))}
        </select>

        <select id="toPeriod">
          <option value="">To</option>
          {Object.keys(periodTimes).map(p => (
            <option key={p} value={p}>{p} ({periodTimes[p]})</option>
          ))}
        </select>

        <button onClick={sendRequest}>Request</button>
      </div>
    );
  }

  // DASHBOARD
  return (
    <div style={{ padding: "20px", background: "#f5f7fa", minHeight: "100vh" }}>

      <h1 style={{ textAlign: "center" }}>📊 Professor Dashboard</h1>

      {/* 🔥 SECTION DASHBOARD */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "15px",
        margin: "20px"
      }}>
        {sectionCounts.map(s => (
          <div
            key={s.section}
            onClick={() => setSelectedSection(s.section)}
            style={{
              background: "#2563eb",
              color: "white",
              padding: "15px",
              borderRadius: "10px",
              cursor: "pointer",
              minWidth: "100px",
              textAlign: "center"
            }}
          >
            <h3>{s.section}</h3>
            <p>{s.count} Approved</p>
          </div>
        ))}
        <div onClick={() => setSelectedSection("")}
          style={{
            background: "#111",
            color: "white",
            padding: "15px",
            borderRadius: "10px",
            cursor: "pointer"
          }}>
          All
        </div>
      </div>

      {/* 🔥 CARDS */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        justifyContent: "center"
      }}>
        {requests
          .filter(r => r.status !== "rejected")
          .filter(r => !selectedSection || r.section === selectedSection)
          .map(r => (

            <div key={r._id} style={{
              background: "white",
              padding: "15px",
              borderRadius: "10px",
              width: "260px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
            }}>

              <h3>{r.name}</h3>

              <p><b>Section:</b> {r.section}</p>
              <p><b>Reason:</b> {r.reason}</p>

              {/* PERIOD DISPLAY */}
              <p>
                <b>Time:</b> {r.fromPeriod} ({periodTimes[r.fromPeriod]}) → {r.toPeriod} ({periodTimes[r.toPeriod]})
              </p>

              {/* DATE */}
              <p>
                <b>Date:</b> {new Date(r.createdAt).toLocaleDateString()}
              </p>

              {/* EXPIRY */}
              {r.expiryTime && (
                <p>
                  ⏳ {Math.floor((new Date(r.expiryTime) - new Date()) / 1000)} sec left
                </p>
              )}

              {/* STATUS */}
              <p style={{
                background:
                  r.status === "approved" ? "green" :
                  r.status === "pending" ? "orange" : "red",
                color: "white",
                padding: "5px",
                textAlign: "center",
                borderRadius: "5px"
              }}>
                {r.status.toUpperCase()}
              </p>

              {/* BUTTONS */}
              {r.status === "pending" && (
                <div style={{ display: "flex", gap: "10px" }}>
                  <button style={{ flex: 1 }}
                    onClick={async () => {
                      await fetch(`http://localhost:5000/approve/${r._id}`, { method: "PUT" });
                      loadRequests();
                    }}>
                    Approve
                  </button>

                  <button style={{ flex: 1, background: "red", color: "white" }}
                    onClick={async () => {
                      await fetch(`http://localhost:5000/reject/${r._id}`, { method: "PUT" });
                      setRequests(prev => prev.filter(req => req._id !== r._id));
                    }}>
                    Reject
                  </button>
                </div>
              )}

            </div>
          ))}
      </div>
    </div>
  );
}

export default App;