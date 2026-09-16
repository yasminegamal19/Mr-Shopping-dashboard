import { useMemo, useState } from "react";
import {
  Eye,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
  UserCheck,
  UserX,
  X,
} from "lucide-react";

import "./Users.css";

const mockUsers = [
  {
    id: 1,
    name: "Ahmed Mohamed",
    email: "ahmed.mohamed@gmail.com",
    phone: "+20 100 123 4567",
    location: "Cairo, Egypt",
    status: "Active",
    joinedAt: "Sep 14, 2026",
    orders: 24,
  },
  {
    id: 2,
    name: "Mariam Ali",
    email: "mariam.ali@gmail.com",
    phone: "+20 101 456 7890",
    location: "Giza, Egypt",
    status: "Active",
    joinedAt: "Sep 12, 2026",
    orders: 18,
  },
  {
    id: 3,
    name: "Omar Hassan",
    email: "omar.hassan@gmail.com",
    phone: "+20 102 789 1234",
    location: "Alexandria, Egypt",
    status: "Inactive",
    joinedAt: "Sep 10, 2026",
    orders: 7,
  },
  {
    id: 4,
    name: "Sara Mahmoud",
    email: "sara.mahmoud@gmail.com",
    phone: "+20 109 321 6547",
    location: "Cairo, Egypt",
    status: "Active",
    joinedAt: "Sep 08, 2026",
    orders: 31,
  },
  {
    id: 5,
    name: "Youssef Adel",
    email: "youssef.adel@gmail.com",
    phone: "+20 111 555 8899",
    location: "Beni Suef, Egypt",
    status: "Pending",
    joinedAt: "Sep 05, 2026",
    orders: 0,
  },
  {
    id: 6,
    name: "Nour Ibrahim",
    email: "nour.ibrahim@gmail.com",
    phone: "+20 112 222 7788",
    location: "Giza, Egypt",
    status: "Active",
    joinedAt: "Sep 02, 2026",
    orders: 15,
  },
  {
    id: 7,
    name: "Karim Samir",
    email: "karim.samir@gmail.com",
    phone: "+20 115 333 6677",
    location: "Cairo, Egypt",
    status: "Inactive",
    joinedAt: "Aug 29, 2026",
    orders: 11,
  },
  {
    id: 8,
    name: "Hana Mostafa",
    email: "hana.mostafa@gmail.com",
    phone: "+20 116 444 9988",
    location: "Alexandria, Egypt",
    status: "Active",
    joinedAt: "Aug 26, 2026",
    orders: 42,
  },
];

function Users() {
  const [users, setUsers] = useState(mockUsers);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedUser, setSelectedUser] = useState(null);

  const [openMenu, setOpenMenu] = useState(null);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        user.name.toLowerCase().includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue) ||
        user.phone.includes(searchValue);

      const matchesStatus =
        statusFilter === "All" || user.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [users, search, statusFilter]);

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const handleStatusChange = (userId, newStatus) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: newStatus,
            }
          : user,
      ),
    );

    setOpenMenu(null);
  };

  return (
    <div className="users-page">
    
      <div className="users-header">
        <div>
          <span className="users-eyebrow">Management</span>

          <h1>Users</h1>

          <p>Manage and monitor all registered users across the platform.</p>
        </div>

        <button type="button" className="users-add-button">
          <Plus size={18} />

          <span>Add User</span>
        </button>
      </div>

      <div className="users-stats">
        <div className="users-stat">
          <div className="users-stat-icon">
            <UserCheck size={19} />
          </div>

          <div>
            <span>Total Users</span>
            <strong>{users.length}</strong>
          </div>
        </div>

        <div className="users-stat">
          <div className="users-stat-icon active">
            <UserCheck size={19} />
          </div>

          <div>
            <span>Active Users</span>
            <strong>
              {users.filter((user) => user.status === "Active").length}
            </strong>
          </div>
        </div>

        <div className="users-stat">
          <div className="users-stat-icon pending">
            <SlidersHorizontal size={19} />
          </div>

          <div>
            <span>Pending</span>
            <strong>
              {users.filter((user) => user.status === "Pending").length}
            </strong>
          </div>
        </div>

        <div className="users-stat">
          <div className="users-stat-icon inactive">
            <UserX size={19} />
          </div>

          <div>
            <span>Inactive Users</span>
            <strong>
              {users.filter((user) => user.status === "Inactive").length}
            </strong>
          </div>
        </div>
      </div>

      <div className="users-panel">

        <div className="users-toolbar">
          <div className="users-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="users-filter">
            <SlidersHorizontal size={17} />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter users by status"
            >
              <option value="All">All Status</option>

              <option value="Active">Active</option>

              <option value="Inactive">Inactive</option>

              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>


        <div className="users-table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Contact</th>
                <th>Location</th>
                <th>Orders</th>
                <th>Status</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>

                    <td>
                      <div className="user-cell">
                        <div className="user-avatar">
                          {getInitials(user.name)}
                        </div>

                        <div className="user-info">
                          <strong>{user.name}</strong>

                          <span>
                            User #{user.id.toString().padStart(4, "0")}
                          </span>
                        </div>
                      </div>
                    </td>


                    <td>
                      <div className="contact-cell">
                        <span>{user.email}</span>

                        <span>{user.phone}</span>
                      </div>
                    </td>


                    <td>
                      <span className="table-text">{user.location}</span>
                    </td>


                    <td>
                      <span className="orders-count">{user.orders}</span>
                    </td>


                    <td>
                      <span
                        className={`user-status status-${user.status.toLowerCase()}`}
                      >
                        <span className="status-dot" />

                        {user.status}
                      </span>
                    </td>


                    <td>
                      <span className="table-text">{user.joinedAt}</span>
                    </td>


                    <td>
                      <div className="user-actions">
                        <button
                          type="button"
                          className="view-user-button"
                          onClick={() => setSelectedUser(user)}
                          aria-label={`View ${user.name}`}
                        >
                          <Eye size={17} />
                        </button>

                        <div className="user-menu-wrapper">
                          <button
                            type="button"
                            className="more-button"
                            onClick={() =>
                              setOpenMenu(openMenu === user.id ? null : user.id)
                            }
                            aria-label="More actions"
                          >
                            <MoreHorizontal size={18} />
                          </button>

                          {openMenu === user.id && (
                            <div className="user-action-menu">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setOpenMenu(null);
                                }}
                              >
                                <Eye size={15} />
                                View Details
                              </button>

                              {user.status !== "Active" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleStatusChange(user.id, "Active")
                                  }
                                >
                                  <UserCheck size={15} />
                                  Activate
                                </button>
                              )}

                              {user.status === "Active" && (
                                <button
                                  type="button"
                                  className="danger-action"
                                  onClick={() =>
                                    handleStatusChange(user.id, "Inactive")
                                  }
                                >
                                  <UserX size={15} />
                                  Deactivate
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="users-empty-cell">
                    <div className="users-empty">
                      <div className="empty-icon">
                        <UsersIcon />
                      </div>

                      <h3>No users found</h3>

                      <p>Try changing your search or filter.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>


        <div className="users-table-footer">
          <span>
            Showing <strong>{filteredUsers.length}</strong> of{" "}
            <strong>{users.length}</strong> users
          </span>

          <div className="pagination">
            <button type="button" disabled>
              Previous
            </button>

            <button type="button" className="pagination-active">
              1
            </button>

            <button type="button">Next</button>
          </div>
        </div>
      </div>

      {selectedUser && (
        <div
          className="user-modal-overlay"
          onClick={() => setSelectedUser(null)}
        >
          <div className="user-modal" onClick={(e) => e.stopPropagation()}>
            <div className="user-modal-header">
              <div>
                <span>User Details</span>

                <h2>{selectedUser.name}</h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                aria-label="Close"
              >
                <X size={19} />
              </button>
            </div>

            <div className="user-modal-profile">
              <div className="modal-avatar">
                {getInitials(selectedUser.name)}
              </div>

              <div>
                <strong>{selectedUser.name}</strong>

                <span>User #{selectedUser.id.toString().padStart(4, "0")}</span>
              </div>
            </div>

            <div className="user-details-grid">
              <div>
                <span>Email</span>
                <strong>{selectedUser.email}</strong>
              </div>

              <div>
                <span>Phone</span>
                <strong>{selectedUser.phone}</strong>
              </div>

              <div>
                <span>Location</span>
                <strong>{selectedUser.location}</strong>
              </div>

              <div>
                <span>Orders</span>
                <strong>{selectedUser.orders}</strong>
              </div>

              <div>
                <span>Status</span>
                <strong>{selectedUser.status}</strong>
              </div>

              <div>
                <span>Joined</span>
                <strong>{selectedUser.joinedAt}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function UsersIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export default Users;
