import { message } from 'antd';
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AllUsers = () => {
   const [allUser, setAllUser] = useState([]);
   const [search, setSearch] = useState('');

   useEffect(() => {
      getAllUser();
   }, []);

   const getAllUser = async () => {
      try {
         const response = await api.get('/admin/getallusers');
         if (response.data.success) {
            setAllUser(response.data.data);
         } else {
            message.error(response.data.message);
         }
      } catch (error) {
         console.log(error);
      }
   };

   const handleStatus = async (userid, status) => {
      try {
         const res = await api.post('/admin/handlestatus', { userid, status });
         if (res.data.success) {
            message.success(res.data.message);
            getAllUser();
         }
      } catch (error) {
         console.log(error);
      }
   };

   const handleActiveToggle = async (userid, currentStatus) => {
      try {
         const newStatus = currentStatus === false ? true : false;
         const res = await api.post('/admin/handleuseractive', { userid, isActive: newStatus });
         if (res.data.success) {
            message.success(res.data.message);
            getAllUser();
         }
      } catch (error) {
         console.log(error);
      }
   };

   const filteredUsers = allUser.filter(u =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.type?.toLowerCase().includes(search.toLowerCase())
   );

   const owners = filteredUsers.filter(u => u.type === 'Owner');
   const renters = filteredUsers.filter(u => u.type === 'Renter');
   const admins = filteredUsers.filter(u => u.type === 'Admin');

   const renderUserCard = (user) => {
      const isActive = user.isActive !== false; // default true if undefined
      return (
         <div key={user._id} style={styles.userCard}>
            <div style={styles.cardTop}>
               <div style={styles.userAvatar}>
                  {user.name?.charAt(0).toUpperCase()}
               </div>
               <div style={{ flex: 1 }}>
                  <h4 style={styles.userName}>{user.name}</h4>
                  <p style={styles.userEmail}>{user.email}</p>
               </div>
               <div style={{
                  ...styles.statusPill,
                  background: isActive ? 'rgba(46,204,113,0.15)' : 'rgba(231,76,60,0.15)',
                  color: isActive ? '#2ecc71' : '#e74c3c',
               }}>
                  {isActive ? '● Active' : '● Disabled'}
               </div>
            </div>

            <div style={styles.cardMeta}>
               <span style={styles.metaItem}>
                  <span style={styles.metaLabel}>Type</span>
                  <span style={{
                     ...styles.typeBadge,
                     background: user.type === 'Owner' ? 'rgba(201,168,76,0.15)' : user.type === 'Admin' ? 'rgba(155,89,182,0.15)' : 'rgba(52,152,219,0.15)',
                     color: user.type === 'Owner' ? 'var(--accent-color)' : user.type === 'Admin' ? '#9b59b6' : '#3498db',
                  }}>{user.type}</span>
               </span>
               {user.type === 'Owner' && (
                  <span style={styles.metaItem}>
                     <span style={styles.metaLabel}>Grant Status</span>
                     <span style={{
                        ...styles.typeBadge,
                        background: user.granted === 'granted' ? 'rgba(46,204,113,0.15)' : 'rgba(243,156,18,0.15)',
                        color: user.granted === 'granted' ? '#2ecc71' : '#f39c12',
                     }}>{user.granted || 'ungranted'}</span>
                  </span>
               )}
               <span style={styles.metaItem}>
                  <span style={styles.metaLabel}>ID</span>
                  <span style={styles.metaValue}>{user._id.slice(-8)}</span>
               </span>
            </div>

            <div style={styles.cardActions}>
               {/* Grant/Ungrant for Owners */}
               {user.type === 'Owner' && user.granted === 'ungranted' && (
                  <button
                     onClick={() => handleStatus(user._id, 'granted')}
                     style={{ ...styles.actionBtn, ...styles.grantBtn }}
                  >
                     ✓ Grant Access
                  </button>
               )}
               {user.type === 'Owner' && user.granted === 'granted' && (
                  <button
                     onClick={() => handleStatus(user._id, 'ungranted')}
                     style={{ ...styles.actionBtn, ...styles.ungrantBtn }}
                  >
                     ✕ Revoke Access
                  </button>
               )}

               {/* Active/Disable for ALL users (not Admin) */}
               {user.type !== 'Admin' && (
                  <button
                     onClick={() => handleActiveToggle(user._id, isActive)}
                     style={{
                        ...styles.actionBtn,
                        ...(isActive ? styles.disableBtn : styles.enableBtn),
                     }}
                  >
                     {isActive ? '⏸ Disable' : '▶ Activate'}
                  </button>
               )}
            </div>
         </div>
      );
   };

   return (
      <div>
         {/* Search bar */}
         <div style={styles.searchBar}>
            <span style={styles.searchIcon}>🔍</span>
            <input
               type="text"
               placeholder="Search users by name, email, or type..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               style={styles.searchInput}
            />
            {search && (
               <button onClick={() => setSearch('')} style={styles.clearBtn}>✕</button>
            )}
         </div>

         {/* Stats */}
         <div style={styles.statsRow}>
            <div style={{ ...styles.statCard, borderLeft: '3px solid #c9a84c' }}>
               <div style={styles.statNumber}>{allUser.length}</div>
               <div style={styles.statLabel}>Total Users</div>
            </div>
            <div style={{ ...styles.statCard, borderLeft: '3px solid #3498db' }}>
               <div style={styles.statNumber}>{allUser.filter(u => u.type === 'Renter').length}</div>
               <div style={styles.statLabel}>Renters</div>
            </div>
            <div style={{ ...styles.statCard, borderLeft: '3px solid #e67e22' }}>
               <div style={styles.statNumber}>{allUser.filter(u => u.type === 'Owner').length}</div>
               <div style={styles.statLabel}>Owners</div>
            </div>
            <div style={{ ...styles.statCard, borderLeft: '3px solid #2ecc71' }}>
               <div style={styles.statNumber}>{allUser.filter(u => u.isActive !== false).length}</div>
               <div style={styles.statLabel}>Active</div>
            </div>
         </div>

         {/* User sections */}
         {admins.length > 0 && (
            <div style={styles.section}>
               <h3 style={styles.sectionTitle}>👑 Administrators</h3>
               <div style={styles.userGrid}>{admins.map(renderUserCard)}</div>
            </div>
         )}

         {owners.length > 0 && (
            <div style={styles.section}>
               <h3 style={styles.sectionTitle}>🏠 Property Owners ({owners.length})</h3>
               <div style={styles.userGrid}>{owners.map(renderUserCard)}</div>
            </div>
         )}

         {renters.length > 0 && (
            <div style={styles.section}>
               <h3 style={styles.sectionTitle}>🔑 Renters ({renters.length})</h3>
               <div style={styles.userGrid}>{renters.map(renderUserCard)}</div>
            </div>
         )}

         {filteredUsers.length === 0 && (
            <div style={styles.emptyState}>
               <span style={{ fontSize: 48 }}>🔍</span>
               <p style={{ color: 'var(--text-light)', marginTop: 12 }}>No users found matching your search.</p>
            </div>
         )}
      </div>
   );
};

const styles = {
   searchBar: {
      display: 'flex', alignItems: 'center',
      background: 'var(--bg-secondary)',
      border: '1px solid #eaeaea',
      borderRadius: 12,
      padding: '0 16px',
      marginBottom: 24,
      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
   },
   searchIcon: { fontSize: 16, marginRight: 10, color: '#a0a0c0' },
   searchInput: {
      flex: 1, border: 'none', outline: 'none',
      background: 'transparent',
      color: 'var(--text-main)',
      padding: '14px 0',
      fontSize: 14,
      fontFamily: "'DM Sans', sans-serif",
   },
   clearBtn: {
      background: 'none', border: 'none',
      color: 'var(--text-light)', cursor: 'pointer', fontSize: 14,
   },
   statsRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 16,
      marginBottom: 32,
   },
   statCard: {
      background: 'var(--bg-secondary)',
      borderRadius: 12,
      padding: '20px 16px',
      border: '1px solid #eaeaea',
      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
   },
   statNumber: { fontSize: 28, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 },
   statLabel: { fontSize: 12, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 },
   section: { marginBottom: 32 },
   sectionTitle: {
      color: 'var(--text-main)', fontSize: 18, fontWeight: 600,
      marginBottom: 16, paddingBottom: 8,
      borderBottom: '1px solid #eaeaea',
   },
   userGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
      gap: 16,
   },
   userCard: {
      background: 'var(--bg-secondary)',
      border: '1px solid #eaeaea',
      borderRadius: 14,
      padding: 20,
      transition: 'all 0.2s',
      boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
   },
   cardTop: {
      display: 'flex', alignItems: 'center', gap: 14,
      marginBottom: 16,
   },
   userAvatar: {
      width: 44, height: 44, borderRadius: 12,
      background: 'linear-gradient(135deg, #c9a84c, #e8c84c)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: 18, color: 'var(--text-main)',
      flexShrink: 0,
   },
   userName: {
      color: 'var(--text-main)', fontSize: 15, fontWeight: 600, margin: 0,
   },
   userEmail: {
      color: 'var(--text-light)', fontSize: 13, margin: 0, marginTop: 2,
   },
   statusPill: {
      padding: '4px 12px', borderRadius: 20,
      fontSize: 12, fontWeight: 600,
      flexShrink: 0,
   },
   cardMeta: {
      display: 'flex', gap: 16,
      marginBottom: 16,
      flexWrap: 'wrap',
   },
   metaItem: {
      display: 'flex', flexDirection: 'column', gap: 4,
   },
   metaLabel: {
      fontSize: 10, color: 'var(--text-light)', textTransform: 'uppercase',
      letterSpacing: 0.5, fontWeight: 600
   },
   metaValue: { color: 'var(--text-main)', fontSize: 13, fontFamily: 'monospace' },
   typeBadge: {
      padding: '3px 10px', borderRadius: 6,
      fontSize: 12, fontWeight: 600,
   },
   cardActions: {
      display: 'flex', gap: 8,
      paddingTop: 14,
      borderTop: '1px solid #eaeaea',
   },
   actionBtn: {
      padding: '7px 16px',
      borderRadius: 8,
      fontSize: 12,
      fontWeight: 600,
      cursor: 'pointer',
      border: 'none',
      transition: 'all 0.2s',
      fontFamily: "'DM Sans', sans-serif",
   },
   grantBtn: {
      background: 'rgba(46,204,113,0.15)',
      color: '#2ecc71',
   },
   ungrantBtn: {
      background: 'rgba(231,76,60,0.15)',
      color: '#e74c3c',
   },
   enableBtn: {
      background: 'rgba(46,204,113,0.15)',
      color: '#2ecc71',
   },
   disableBtn: {
      background: 'rgba(243,156,18,0.15)',
      color: '#f39c12',
   },
   emptyState: {
      textAlign: 'center', padding: '60px 0',
   },
};

export default AllUsers;