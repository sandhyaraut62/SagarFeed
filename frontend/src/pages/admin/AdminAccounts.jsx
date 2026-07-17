import { useEffect, useState } from "react";
import api from "../../api.js";

function AdminAccounts({ role }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [areaDrafts, setAreaDrafts] = useState({});

  const loadUsers = () => {
    api
      .get("/admin/users", { params: { role } })
      .then((res) => {
        setUsers(res.data.users);
        const drafts = {};
        res.data.users.forEach((u) => (drafts[u.id] = u.service_area || ""));
        setAreaDrafts(drafts);
      })
      .catch(() => setError(`Could not load ${role.toLowerCase()} accounts.`))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const toggleStatus = async (user) => {
    const nextStatus = user.status === "active" ? "blocked" : "active";
    const confirmMsg =
      nextStatus === "blocked"
        ? `Block ${user.full_name}'s account? They won't be able to log in until unblocked.`
        : `Unblock ${user.full_name}'s account?`;
    if (!window.confirm(confirmMsg)) return;

    setBusyId(user.id);
    try {
      await api.patch(`/admin/users/${user.id}/status`, { status: nextStatus });
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u)));
    } catch {
      alert("Could not update account status.");
    } finally {
      setBusyId(null);
    }
  };

  const deleteAccount = async (user) => {
    if (
      !window.confirm(
        `Permanently delete ${user.full_name}'s account? This cannot be undone.`
      )
    )
      return;

    setBusyId(user.id);
    try {
      await api.delete(`/admin/users/${user.id}`);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch {
      alert("Could not delete account.");
    } finally {
      setBusyId(null);
    }
  };

  const saveServiceArea = async (user) => {
    setBusyId(user.id);
    try {
      await api.patch(`/admin/users/${user.id}/service-area`, {
        serviceArea: areaDrafts[user.id] || null,
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, service_area: areaDrafts[user.id] || null } : u))
      );
    } catch {
      alert("Could not update service area.");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <p className="dash-loading">Loading {role.toLowerCase()} accounts...</p>;
  if (error) return <p className="dash-error">{error}</p>;

  return (
    <section className="dash-panel">
      <div className="dash-panel-head">
        <h2>{role} Accounts ({users.length})</h2>
      </div>

      {role === "Dealer" && users.length > 0 && (
        <p className="dash-muted-small" style={{ marginBottom: 14 }}>
          Assign each dealer a district (service area) to scope which orders they see in their
          Orders/Deliveries tabs. Leave blank to let a dealer see all orders (fine for a
          single-dealer setup).
        </p>
      )}

      {users.length === 0 ? (
        <p className="dash-empty">No {role.toLowerCase()} accounts registered yet.</p>
      ) : (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Registered</th>
                {role === "Dealer" && <th>Service Area</th>}
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.full_name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone || "—"}</td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  {role === "Dealer" && (
                    <td>
                      <div className="dash-actions">
                        <input
                          type="text"
                          placeholder="e.g. Sunsari"
                          className="dash-qty-input"
                          style={{ width: 110 }}
                          value={areaDrafts[user.id] ?? ""}
                          onChange={(e) =>
                            setAreaDrafts((prev) => ({ ...prev, [user.id]: e.target.value }))
                          }
                        />
                        <button
                          type="button"
                          className="dash-btn-small"
                          disabled={busyId === user.id}
                          onClick={() => saveServiceArea(user)}
                        >
                          Save
                        </button>
                      </div>
                    </td>
                  )}
                  <td>
                    <span className={`badge badge-account-${user.status}`}>{user.status}</span>
                  </td>
                  <td className="dash-actions">
                    <button
                      type="button"
                      className="dash-btn-small"
                      disabled={busyId === user.id}
                      onClick={() => toggleStatus(user)}
                    >
                      {user.status === "active" ? "Block" : "Unblock"}
                    </button>
                    <button
                      type="button"
                      className="dash-btn-small dash-btn-danger"
                      disabled={busyId === user.id}
                      onClick={() => deleteAccount(user)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default AdminAccounts;
