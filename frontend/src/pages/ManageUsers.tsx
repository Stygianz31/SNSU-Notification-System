import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonMenuButton,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonSearchbar,
  IonBadge,
  IonAvatar,
  IonToast,
  IonAlert,
  IonRefresher,
  IonRefresherContent,
  IonSkeletonText,
  IonChip,
  IonFab,
  IonFabButton
} from '@ionic/react';
import {
  addOutline,
  refreshOutline,
  createOutline,
  trashOutline,
  personOutline
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { userService } from '../services/api';
import Sidebar from '../components/Sidebar';
import './ManageUsers.css';

interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  role: string;
  department?: string;
  course?: string;
  yearLevel?: number;
  profilePicture?: string;
  createdAt: string;
}

const ManageUsers: React.FC = () => {
  const history = useHistory();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', color: 'success' });
  const [deleteAlert, setDeleteAlert] = useState({ show: false, id: 0 });

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchText, filterRole]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const response = await userService.getAllUsers();
      console.log('Users loaded:', response.data);
      
      // API returns {teachers: [], students: [], admins: []}
      // Combine them into one array
      const allUsers = [
        ...(response.data.admins || []),
        ...(response.data.teachers || []),
        ...(response.data.students || [])
      ];
      
      setUsers(allUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      setToast({ show: true, message: 'Error loading users', color: 'danger' });
      setUsers([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    // Ensure users is an array
    if (!Array.isArray(users)) {
      setFilteredUsers([]);
      return;
    }

    let filtered = users;

    if (filterRole !== 'all') {
      filtered = filtered.filter(u => u.role === filterRole);
    }

    if (searchText) {
      filtered = filtered.filter(u =>
        u.username.toLowerCase().includes(searchText.toLowerCase()) ||
        u.email.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  const handleDelete = async (id: number) => {
    try {
      await userService.deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
      setToast({ show: true, message: 'User deleted', color: 'success' });
    } catch (error) {
      setToast({ show: true, message: 'Error deleting user', color: 'danger' });
    }
  };

  const handleRefresh = async (event: any) => {
    await loadUsers();
    event.detail.complete();
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: any = {
      admin: 'danger',
      teacher: 'primary',
      student: 'success'
    };
    return colors[role] || 'medium';
  };

  return (
    <>
      <Sidebar />
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Manage Users</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={loadUsers}>
                <IonIcon icon={refreshOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>

          <IonToolbar>
            <IonSearchbar
              value={searchText}
              onIonInput={(e: any) => setSearchText(e.target.value)}
              placeholder="Search users..."
              animated
            />
          </IonToolbar>

          <IonToolbar>
            <div className="filter-chips">
              <IonChip
                color={filterRole === 'all' ? 'primary' : 'medium'}
                onClick={() => setFilterRole('all')}
              >
                All ({Array.isArray(users) ? users.length : 0})
              </IonChip>
              <IonChip
                color={filterRole === 'admin' ? 'danger' : 'medium'}
                onClick={() => setFilterRole('admin')}
              >
                Admins ({Array.isArray(users) ? users.filter(u => u.role === 'admin').length : 0})
              </IonChip>
              <IonChip
                color={filterRole === 'teacher' ? 'primary' : 'medium'}
                onClick={() => setFilterRole('teacher')}
              >
                Teachers ({Array.isArray(users) ? users.filter(u => u.role === 'teacher').length : 0})
              </IonChip>
              <IonChip
                color={filterRole === 'student' ? 'success' : 'medium'}
                onClick={() => setFilterRole('student')}
              >
                Students ({Array.isArray(users) ? users.filter(u => u.role === 'student').length : 0})
              </IonChip>
            </div>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent />
          </IonRefresher>

          <div className="users-container">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <IonCard key={index}>
                  <IonCardContent>
                    <div className="user-card-loading">
                      <IonSkeletonText animated style={{ width: '60px', height: '60px', borderRadius: '50%' }} />
                      <div style={{ flex: 1 }}>
                        <IonSkeletonText animated style={{ width: '60%', height: '20px' }} />
                        <IonSkeletonText animated style={{ width: '80%', height: '16px', marginTop: '8px' }} />
                      </div>
                    </div>
                  </IonCardContent>
                </IonCard>
              ))
            ) : filteredUsers.length === 0 ? (
              <div className="empty-state">
                <IonIcon icon={personOutline} size="large" />
                <h2>No users found</h2>
                <p>Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <IonCard key={user.id} className="user-card">
                  <IonCardContent>
                    <div className="user-card-content">
                      <IonAvatar className="user-avatar">
                        {user.profilePicture ? (
                          <img src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/${user.profilePicture}`} alt={user.username} />
                        ) : (
                          <div className="avatar-placeholder">
                            {user.username[0].toUpperCase()}
                          </div>
                        )}
                      </IonAvatar>

                      <div className="user-info">
                        <div className="user-name-row">
                          <h3>{user.username}</h3>
                          <IonBadge color={getRoleBadgeColor(user.role)}>
                            {user.role}
                          </IonBadge>
                        </div>
                        <p className="user-email">{user.email}</p>
                        <p className="user-phone">{user.phone}</p>
                        {user.role === 'teacher' && user.department && (
                          <p className="user-meta">📚 {user.department}</p>
                        )}
                        {user.role === 'student' && user.course && (
                          <p className="user-meta">🎓 {user.course} - Year {user.yearLevel}</p>
                        )}
                      </div>

                      <div className="user-actions">
                        <IonButton
                          fill="clear"
                          size="small"
                          onClick={() => history.push(`/edit-user/${user.id}`)}
                        >
                          <IonIcon slot="icon-only" icon={createOutline} />
                        </IonButton>
                        <IonButton
                          fill="clear"
                          size="small"
                          color="danger"
                          onClick={() => setDeleteAlert({ show: true, id: user.id })}
                        >
                          <IonIcon slot="icon-only" icon={trashOutline} />
                        </IonButton>
                      </div>
                    </div>
                  </IonCardContent>
                </IonCard>
              ))
            )}
          </div>

          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton onClick={() => history.push('/create-user')}>
              <IonIcon icon={addOutline} />
            </IonFabButton>
          </IonFab>

          <IonToast
            isOpen={toast.show}
            message={toast.message}
            duration={3000}
            color={toast.color}
            onDidDismiss={() => setToast({ ...toast, show: false })}
          />

          <IonAlert
            isOpen={deleteAlert.show}
            onDidDismiss={() => setDeleteAlert({ show: false, id: 0 })}
            header="Delete User"
            message="Are you sure you want to delete this user? This action cannot be undone."
            buttons={[
              { text: 'Cancel', role: 'cancel' },
              { text: 'Delete', role: 'destructive', handler: () => handleDelete(deleteAlert.id) }
            ]}
          />
        </IonContent>
      </IonPage>
    </>
  );
};

export default ManageUsers;
