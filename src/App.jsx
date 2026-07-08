import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from './services/supabase';
import { authService } from './services/authService';
import { studentService } from './services/studentService';

// Layout & Common Components
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import Toast from './components/common/Toast';
import ConfirmModal from './components/common/ConfirmModal';
import EmptyState from './components/common/EmptyState';
import ErrorPage from './components/common/ErrorPage';

// Auth Components
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import ForgotPassword from './components/auth/ForgotPassword';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Dashboard & Students Components
import Dashboard from './components/dashboard/Dashboard';
import StudentToolbar from './components/students/StudentToolbar';
import StudentTable from './components/students/StudentTable';
import StudentModal from './components/students/StudentModal';
import Pagination from './components/students/Pagination';
import CsvModal from './components/students/CsvModal';

// Profile & Settings
import Profile from './components/profile/Profile';
import Settings from './components/settings/Settings';

export default function App() {
  // Theme State
  const [theme, setTheme] = useState(() => localStorage.getItem('sms_theme') || 'dark');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sms_theme', theme);
  }, [theme]);
  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  // Navigation State
  const [currentPage, setCurrentPage] = useState('dashboard'); // 'dashboard' | 'students' | 'profile' | 'settings' | 'login' | 'signup' | 'forgot-password'
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auth State
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Toast State
  const [toast, setToast] = useState(null);
  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    setToast({ message, type, duration, id: Date.now() });
  }, []);

  // Students & Dashboard Data State
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [stats, setStats] = useState({ total: 0, recent: [], departmentCounts: {} });

  // Filtering, Sorting & Pagination State
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(() => Number(localStorage.getItem('sms_page_size')) || 10);

  useEffect(() => {
    localStorage.setItem('sms_page_size', pageSize);
    setCurrentPageNum(1);
  }, [pageSize]);

  // Modals & Selection State
  const [selectedIds, setSelectedIds] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [csvModalMode, setCsvModalMode] = useState(null); // null | 'import' | 'export'
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  // 1. Supabase Auth Listener
  useEffect(() => {
    let subscription = null;

    if (!isSupabaseConfigured) {
      setAuthLoading(false);
      if (!['login', 'signup', 'forgot-password'].includes(currentPage)) {
        setCurrentPage('login');
      }
      return;
    }

    // Check active session
    authService.getCurrentUser().then(currUser => {
      setUser(currUser);
      setAuthLoading(false);
      if (!currUser && !['login', 'signup', 'forgot-password'].includes(currentPage)) {
        setCurrentPage('login');
      }
    }).catch(() => {
      setAuthLoading(false);
      setCurrentPage('login');
    });

    // Listen for auth changes
    const subRes = authService.onAuthStateChange((event, sessionUser) => {
      setUser(sessionUser);
      setAuthLoading(false);
      if (sessionUser && ['login', 'signup', 'forgot-password'].includes(currentPage)) {
        setCurrentPage('dashboard');
      } else if (!sessionUser && !['login', 'signup', 'forgot-password'].includes(currentPage)) {
        setCurrentPage('login');
      }
    });

    if (subRes && subRes.subscription) {
      subscription = subRes.subscription;
    }

    return () => {
      if (subscription && subscription.unsubscribe) {
        subscription.unsubscribe();
      }
    };
  }, []);

  // 2. Fetch Students & Stats when User is logged in
  const fetchAllData = useCallback(async () => {
    if (!user || !isSupabaseConfigured) return;

    setLoadingStudents(true);
    try {
      const [allStudents, statsRes] = await Promise.all([
        studentService.getStudents(),
        studentService.getDepartmentStats()
      ]);
      setStudents(allStudents?.data || (Array.isArray(allStudents) ? allStudents : []));
      setStats(statsRes || { total: 0, recent: [], departmentCounts: {} });
    } catch (err) {
      showToast(`Error fetching records: ${err.message}`, 'error');
    } finally {
      setLoadingStudents(false);
    }
  }, [user, showToast]);

  useEffect(() => {
    if (user && isSupabaseConfigured) {
      fetchAllData();
    }
  }, [user, fetchAllData]);

  // 3. Keyboard Shortcuts Listener (Ctrl+K, Alt+N)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+K -> Focus Search
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (currentPage !== 'students') {
          setCurrentPage('students');
        }
        setTimeout(() => {
          const searchInput = document.getElementById('global-search-input');
          if (searchInput) searchInput.focus();
        }, 100);
      }
      // Alt+N -> Add Student Modal
      if (e.altKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        if (user) {
          setEditingStudent(null);
          setIsAddModalOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, user]);

  // 4. Filter, Sort, and Paginate Students
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesSearch = !searchQuery || 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.department.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDept = departmentFilter === 'All' || s.department === departmentFilter;
      const matchesYear = yearFilter === 'All' || String(s.year) === String(yearFilter);

      return matchesSearch && matchesDept && matchesYear;
    }).sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (sortBy === 'created_at') {
        valA = new Date(valA || 0).getTime();
        valB = new Date(valB || 0).getTime();
      } else if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB?.toLowerCase() || '';
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [students, searchQuery, departmentFilter, yearFilter, sortBy, sortOrder]);

  const paginatedStudents = useMemo(() => {
    const start = (currentPageNum - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, currentPageNum, pageSize]);

  // 5. Handlers for CRUD Actions
  const handleSortChange = (column) => {
    if (sortBy === column) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === paginatedStudents.length && paginatedStudents.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedStudents.map(s => s.id));
    }
  };

  const handleSaveStudent = async (studentData, id = null) => {
    try {
      if (id) {
        await studentService.updateStudent(id, studentData);
        showToast('Student record updated successfully!', 'success');
      } else {
        await studentService.createStudent(studentData);
        showToast('New student registered successfully!', 'success');
      }
      setIsAddModalOpen(false);
      setEditingStudent(null);
      fetchAllData();
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteStudent = (studentObj) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Student Record',
      message: `Are you sure you want to permanently delete ${studentObj.name} (${studentObj.email})? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await studentService.deleteStudent(studentObj.id);
          showToast('Student record deleted.', 'success');
          setSelectedIds(prev => prev.filter(id => id !== studentObj.id));
          fetchAllData();
        } catch (err) {
          showToast(`Error deleting student: ${err.message}`, 'error');
        } finally {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setConfirmModal({
      isOpen: true,
      title: 'Bulk Delete Students',
      message: `Are you sure you want to delete ${selectedIds.length} selected student records? This action is permanent.`,
      onConfirm: async () => {
        try {
          await studentService.deleteStudentsBulk(selectedIds);
          showToast(`Successfully deleted ${selectedIds.length} records.`, 'success');
          setSelectedIds([]);
          fetchAllData();
        } catch (err) {
          showToast(`Bulk delete failed: ${err.message}`, 'error');
        } finally {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
      showToast('You have been logged out.', 'info');
      setCurrentPage('login');
    } catch (err) {
      showToast(`Logout error: ${err.message}`, 'error');
    }
  };

  // 6. Render Page Routing
  const renderContent = () => {
    // Unauthenticated Views
    if (['login', 'signup', 'forgot-password'].includes(currentPage)) {
      if (currentPage === 'login') {
        return (
          <Login
            onNavigate={setCurrentPage}
            onSuccess={(msg) => showToast(msg, 'success')}
            onError={(msg) => showToast(msg, 'error')}
            isSupabaseConfigured={isSupabaseConfigured}
          />
        );
      }
      if (currentPage === 'signup') {
        return (
          <SignUp
            onNavigate={setCurrentPage}
            onSuccess={(msg) => showToast(msg, 'success')}
            onError={(msg) => showToast(msg, 'error')}
            isSupabaseConfigured={isSupabaseConfigured}
          />
        );
      }
      if (currentPage === 'forgot-password') {
        return (
          <ForgotPassword
            onNavigate={setCurrentPage}
            onSuccess={(msg) => showToast(msg, 'success')}
            onError={(msg) => showToast(msg, 'error')}
            isSupabaseConfigured={isSupabaseConfigured}
          />
        );
      }
    }

    // Protected Views
    return (
      <ProtectedRoute user={user} authLoading={authLoading} onNavigate={setCurrentPage}>
        <div className="app-container">
          {/* Sidebar */}
          <Sidebar
            currentPage={currentPage}
            onNavigate={(page) => { setCurrentPage(page); setSidebarOpen(false); }}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          {/* Main Layout Area */}
          <div className="main-content">
            {/* Header */}
            <Header
              user={user}
              theme={theme}
              onToggleTheme={toggleTheme}
              onToggleSidebar={() => setSidebarOpen(prev => !prev)}
              onSignOut={handleSignOut}
              currentPage={currentPage}
              onNavigate={setCurrentPage}
            />

            {/* Page View Body */}
            <main className="page-body">
              {currentPage === 'dashboard' && (
                <Dashboard
                  stats={stats}
                  loading={loadingStudents}
                  onNavigate={setCurrentPage}
                  onOpenAddModal={() => { setEditingStudent(null); setIsAddModalOpen(true); }}
                  onOpenCsvModal={(mode) => setCsvModalMode(mode)}
                  onOpenSearch={() => { setCurrentPage('students'); setTimeout(() => document.getElementById('global-search-input')?.focus(), 100); }}
                />
              )}

              {currentPage === 'students' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justify: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <h1 style={{ fontSize: '1.85rem', marginBottom: '6px' }}>Student Directory</h1>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                        Browse, filter, and manage all student enrollments across departments.
                      </p>
                    </div>
                  </div>

                  <StudentToolbar
                    search={searchQuery}
                    onSearchChange={setSearchQuery}
                    department={departmentFilter}
                    onDepartmentChange={setDepartmentFilter}
                    year={yearFilter}
                    onYearChange={setYearFilter}
                    onOpenAddModal={() => { setEditingStudent(null); setIsAddModalOpen(true); }}
                    onOpenCsvModal={(mode) => setCsvModalMode(mode)}
                    selectedCount={selectedIds.length}
                    onBulkDelete={handleBulkDelete}
                  />

                  {filteredStudents.length === 0 && !loadingStudents ? (
                    <EmptyState
                      title="No students found"
                      description={searchQuery || departmentFilter !== 'All' || yearFilter !== 'All' 
                        ? 'No student records match your active search filters.'
                        : 'Your student directory is empty. Add your first student or import via CSV to begin.'}
                      actionLabel={searchQuery || departmentFilter !== 'All' || yearFilter !== 'All' ? 'Reset Filters' : 'Add First Student'}
                      onAction={() => {
                        if (searchQuery || departmentFilter !== 'All' || yearFilter !== 'All') {
                          setSearchQuery('');
                          setDepartmentFilter('All');
                          setYearFilter('All');
                        } else {
                          setEditingStudent(null);
                          setIsAddModalOpen(true);
                        }
                      }}
                    />
                  ) : (
                    <>
                      <StudentTable
                        students={paginatedStudents}
                        loading={loadingStudents}
                        selectedIds={selectedIds}
                        onToggleSelect={handleToggleSelect}
                        onToggleSelectAll={handleToggleSelectAll}
                        onEdit={(studentObj) => { setEditingStudent(studentObj); setIsAddModalOpen(true); }}
                        onDelete={handleDeleteStudent}
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSortChange={handleSortChange}
                      />

                      <Pagination
                        currentPage={currentPageNum}
                        pageSize={pageSize}
                        totalCount={filteredStudents.length}
                        onPageChange={setCurrentPageNum}
                        onPageSizeChange={setPageSize}
                      />
                    </>
                  )}
                </div>
              )}

              {currentPage === 'profile' && (
                <Profile
                  user={user}
                  onSuccess={(msg) => showToast(msg, 'success')}
                  onError={(msg) => showToast(msg, 'error')}
                />
              )}

              {currentPage === 'settings' && (
                <Settings
                  theme={theme}
                  onToggleTheme={toggleTheme}
                  pageSize={pageSize}
                  onPageSizeChange={setPageSize}
                />
              )}
            </main>

            {/* Footer */}
            <Footer />
          </div>
        </div>
      </ProtectedRoute>
    );
  };

  return (
    <>
      {/* Active Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => setToast(null)}
        />
      )}

      {/* Confirmation Dialog Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />

      {/* Student Create / Edit Modal */}
      <StudentModal
        isOpen={isAddModalOpen}
        onClose={() => { setIsAddModalOpen(false); setEditingStudent(null); }}
        onSave={handleSaveStudent}
        student={editingStudent}
      />

      {/* CSV Import / Export Modal */}
      <CsvModal
        isOpen={Boolean(csvModalMode)}
        onClose={() => setCsvModalMode(null)}
        mode={csvModalMode || 'import'}
        students={students}
        onImportSuccess={(msg) => { showToast(msg, 'success'); fetchAllData(); setCsvModalMode(null); }}
      />

      {/* Main Render View */}
      {renderContent()}
    </>
  );
}
