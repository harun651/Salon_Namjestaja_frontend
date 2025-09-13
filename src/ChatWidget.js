import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/",
});

function ChatWidget({ token, user }) {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (token && user?.is_staff) {
      api
        .get("users/", { headers: { Authorization: `Token ${token}` } })
        .then((res) => {
          const filtered = res.data.filter((u) => u.id !== user.id);
          setUsers(filtered);
          if (!selectedUser && filtered.length > 0) {
            const prvi = filtered[0];
            setSelectedUser(prvi);
            loadMessages(prvi);
          }
        })
        .catch((err) => console.error("Greška pri učitavanju korisnika:", err));
    }
  }, [token, user]);

  useEffect(() => {
    const fetchAdmin = async () => {
      if (!token || !user || user.is_staff) return;
      try {
        const res = await api.get("admin-korisnik/", {
          headers: { Authorization: `Token ${token}` },
        });
        setAdminUser(res.data);
        setSelectedUser(res.data);
        loadMessages(res.data);
      } catch (err) {
        console.error("Neuspješno dobavljanje admin korisnika", err);
      }
    };

    fetchAdmin();
  }, [token, user]);

  const loadMessages = async (targetUser = selectedUser) => {
    if (!token || !user?.id || !targetUser?.id) return;

    const params = user.is_staff ? { user_id: targetUser.id } : {};

    try {
      const res = await api.get("poruke/", {
        headers: { Authorization: `Token ${token}` },
        params,
      });
      setMessages(res.data);
    } catch (err) {
      console.error("Greška pri učitavanju poruka:", err);
    }
  };

  useEffect(() => {
    if (open && selectedUser) {
      loadMessages();
    }
  }, [open, selectedUser]);

  useEffect(() => {
    if (!open || !selectedUser) return;
    const interval = setInterval(() => loadMessages(), 3000);
    return () => clearInterval(interval);
  }, [open, selectedUser]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    const primalacId = user.is_staff ? selectedUser.id : adminUser?.id;
    if (!primalacId) return;

    try {
      const res = await api.post(
        "poruke/",
        { primalac: primalacId, tekst: newMessage },
        { headers: { Authorization: `Token ${token}` } }
      );

      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
      loadMessages();
    } catch (err) {
      console.error("Greška pri slanju poruke:", err);
    }
  };

  const toggleOpen = () => setOpen((prev) => !prev);
  if (!token || !user) return null;

  return (
    <>
      
      <div
        onClick={toggleOpen}
        style={{
          position: "fixed",
          bottom: 30,
          right: 30,
          width: 60,
          height: 60,
          borderRadius: "50%",
          backgroundColor: "red",
          color: "white",
          fontSize: 30,
          fontWeight: "bold",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          zIndex: 1000,
        }}
        title={open ? "Zatvori chat" : "Otvori chat"}
      >
        💬
      </div>

      
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 100,
            right: 30,
            width: 350,
            height: 500,
            border: "1px solid #ccc",
            borderRadius: 5,
            backgroundColor: "#ffffff", 
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            zIndex: 1001,
            fontFamily: "Arial, sans-serif",
            color: "#000000", 
          }}
        >
          
          {user?.is_staff && (
            <div
              style={{
                height: 100,
                overflowY: "auto",
                borderBottom: "1px solid #ddd",
                padding: 10,
              }}
            >
              <strong>Odaberi korisnika:</strong>
              {users.length === 0 && <p>Nema dostupnih korisnika za chat.</p>}
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {users.map((u) => (
                  <li key={u.id}>
                    <button
                      onClick={() => {
                        setSelectedUser(u);
                        loadMessages(u);
                      }}
                      style={{
                        backgroundColor:
                          selectedUser?.id === u.id ? "#e60000" : "transparent",
                        color:
                          selectedUser?.id === u.id ? "#ffffff" : "#000000",
                        border: "none",
                        padding: "5px 10px",
                        cursor: "pointer",
                        width: "100%",
                        textAlign: "left",
                      }}
                    >
                      {u.username}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

         
          <div
            style={{
              flex: 1,
              padding: 10,
              overflowY: "auto",
              backgroundColor: "#f9f9f9",
            }}
          >
            {selectedUser ? (
              messages.length ? (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      marginBottom: 10,
                      textAlign: msg.posiljalac === user.id ? "right" : "left",
                    }}
                  >
                    <div
                      style={{
                        display: "inline-block",
                        padding: "8px 12px",
                        borderRadius: 15,
                        backgroundColor:
                          msg.posiljalac === user.id
                            ? "#e60000"
                            : "#e0e0e0",
                        color:
                          msg.posiljalac === user.id ? "#ffffff" : "#000000",
                        maxWidth: "70%",
                        wordBreak: "break-word",
                      }}
                    >
                      {msg.tekst}
                      <div
                        style={{
                          fontSize: 10,
                          color:
                            msg.posiljalac === user.id ? "#f4cfcf" : "#666",
                          marginTop: 3,
                        }}
                      >
                        {new Date(msg.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>Nema poruka.</p>
              )
            ) : (
              <p>Odaberite korisnika za chat.</p>
            )}
            <div ref={messagesEndRef} />
          </div>

          
          <div
            style={{
              borderTop: "1px solid #ddd",
              padding: 10,
              display: "flex",
              gap: 10,
              backgroundColor: "#ffffff",
            }}
          >
            <input
              type="text"
              placeholder="Napiši poruku..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              style={{
                flex: 1,
                padding: 8,
                border: "1px solid #ccc",
                borderRadius: 4,
                color: "#000000",
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              disabled={!selectedUser}
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim() || !selectedUser}
              style={{
                padding: "8px 12px",
                backgroundColor: "#e60000",
                color: "#ffffff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Pošalji
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatWidget;
