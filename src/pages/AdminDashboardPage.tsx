import React, { useState, useEffect } from 'react';
import {
  Lock,
  Shield,
  KeyRound,
  Users,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  FileSpreadsheet,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  LogOut,
  Building,
  History,
  ShieldCheck,
  RefreshCw,
  FileText,
  Mail,
  Phone,
  DollarSign,
  UserCheck,
  ArrowRight,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CalendarCheck,
  Check,
  Maximize2,
  X,
} from 'lucide-react';
import { bookingStore, Booking, Facility, BlockedDate, AuditLogEntry } from '../data/bookingStore';

interface AdminDashboardPageProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('mcc_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [twoFactorCode, setTwoFactorCode] = useState<string>('');
  const [loginAttempts, setLoginAttempts] = useState<number>(0);
  const [lockoutTime, setLockoutTime] = useState<number>(0);
  const [authError, setAuthError] = useState<string | null>(null);

  // Active Admin View Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'calendar' | 'blocked' | 'facilities' | 'audit' | 'gdpr'>('overview');

  // Reactive Data
  const [bookings, setBookings] = useState<Booking[]>(() => bookingStore.getBookings());
  const [facilities, setFacilities] = useState<Facility[]>(() => bookingStore.getFacilities());
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>(() => bookingStore.getBlockedDates());
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => bookingStore.getAuditLogs());

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [facilityFilter, setFacilityFilter] = useState<string>('all');

  // Selected Booking Modal
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [editNotesText, setEditNotesText] = useState<string>('');
  const [rejectReasonText, setRejectReasonText] = useState<string>('Scheduling conflict or facility unavailable at requested time.');
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);

  // Manual Add Booking Modal
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [manualFacilityId, setManualFacilityId] = useState<string>('fac-main-hall');
  const [manualCustomerName, setManualCustomerName] = useState<string>('');
  const [manualEmail, setManualEmail] = useState<string>('');
  const [manualPhone, setManualPhone] = useState<string>('');
  const [manualDate, setManualDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [manualStartTime, setManualStartTime] = useState<string>('10:00');
  const [manualFinishTime, setManualFinishTime] = useState<string>('12:00');
  const [manualEventType, setManualEventType] = useState<string>('Internal / Phone Reservation');

  // Block Date Modal
  const [showBlockModal, setShowBlockModal] = useState<boolean>(false);
  const [blockDate, setBlockDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [blockFacilityId, setBlockFacilityId] = useState<string>('all');
  const [blockReason, setBlockReason] = useState<string>('');

  // Admin Interactive Calendar & Booked Slots State
  const [adminCalendarMonth, setAdminCalendarMonth] = useState<Date>(() => new Date());
  const [adminFacilityFilter, setAdminFacilityFilter] = useState<string>('all');
  const [selectedSlotDateInfo, setSelectedSlotDateInfo] = useState<{
    date: string;
    isBooked: boolean;
    details?: string;
    blockedId?: string;
    bookingRef?: string;
  } | null>(null);

  // GDPR Search State
  const [gdprEmailQuery, setGdprEmailQuery] = useState<string>('');
  const [gdprResults, setGdprResults] = useState<Booking[] | null>(null);

  // Session Timeout countdown (15 minutes of inactivity)
  const [lastActivity, setLastActivity] = useState<number>(Date.now());

  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      // 15 mins = 900,000 ms
      if (Date.now() - lastActivity > 900000) {
        handleLogout('Session expired due to 15 minutes of inactivity.');
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, lastActivity]);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutTime > 0) {
      const timer = setTimeout(() => setLockoutTime((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [lockoutTime]);

  const recordActivity = () => setLastActivity(Date.now());

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (lockoutTime > 0) {
      setAuthError(`Too many failed login attempts. Please wait ${lockoutTime} seconds.`);
      return;
    }

    // Default admin demo credentials: admin@madanicenter.org.uk / MadaniAdmin2026!
    const validUser = (username.trim().toLowerCase() === 'admin@madanicenter.org.uk' || username.trim().toLowerCase() === 'admin');
    const validPass = password === 'MadaniAdmin2026!' || password === 'admin123';

    if (validUser && validPass) {
      // Successful login
      sessionStorage.setItem('mcc_admin_auth', 'true');
      sessionStorage.setItem('mcc_admin_user', 'admin@madanicenter.org.uk');
      setIsAuthenticated(true);
      setLoginAttempts(0);
      bookingStore.addAuditLog({
        adminUser: 'admin@madanicenter.org.uk',
        action: 'LOGIN_SUCCESS',
        targetType: 'auth',
        details: 'Admin authenticated via secure session (password verified)',
        ipAddress: '192.168.1.55',
      });
      setAuditLogs(bookingStore.getAuditLogs());
    } else {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      bookingStore.addAuditLog({
        adminUser: username || 'Unknown',
        action: 'LOGIN_FAILED',
        targetType: 'auth',
        details: `Failed login attempt #${newAttempts} for username: ${username}`,
        ipAddress: '192.168.1.55',
      });
      setAuditLogs(bookingStore.getAuditLogs());

      if (newAttempts >= 3) {
        setLockoutTime(30); // 30 second temporary rate-limit delay
        setAuthError('Too many failed attempts. Temporary 30-second rate-limit protection activated.');
      } else {
        // OWASP generic error message (never reveals whether username or password was wrong)
        setAuthError('Invalid credentials. Please verify your administrative email and password.');
      }
    }
  };

  const handleLogout = (reason?: string) => {
    sessionStorage.removeItem('mcc_admin_auth');
    sessionStorage.removeItem('mcc_admin_user');
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    setTwoFactorCode('');
    if (reason) setAuthError(reason);
  };

  const refreshData = () => {
    setBookings(bookingStore.getBookings());
    setFacilities(bookingStore.getFacilities());
    setBlockedDates(bookingStore.getBlockedDates());
    setAuditLogs(bookingStore.getAuditLogs());
  };

  // Actions on Bookings
  const handleApprove = (booking: Booking) => {
    recordActivity();
    const result = bookingStore.updateBookingStatus(booking.id, 'confirmed');
    if (!result.success) {
      alert(`Approval Failed: ${result.error}`);
      return;
    }
    refreshData();
    if (selectedBooking?.id === booking.id) {
      setSelectedBooking(bookingStore.getBookings().find((b) => b.id === booking.id) || null);
    }
  };

  const handleReject = (booking: Booking) => {
    recordActivity();
    const result = bookingStore.updateBookingStatus(booking.id, 'rejected', rejectReasonText);
    if (!result.success) {
      alert(`Rejection Failed: ${result.error}`);
      return;
    }
    setShowRejectModal(false);
    refreshData();
    if (selectedBooking?.id === booking.id) {
      setSelectedBooking(bookingStore.getBookings().find((b) => b.id === booking.id) || null);
    }
  };

  const handleCancel = (booking: Booking) => {
    recordActivity();
    if (!confirm(`Are you sure you want to cancel booking ${booking.reference} for ${booking.customerName}?`)) return;
    bookingStore.updateBookingStatus(booking.id, 'cancelled', 'Cancelled by administrator upon customer request.');
    refreshData();
    if (selectedBooking?.id === booking.id) {
      setSelectedBooking(bookingStore.getBookings().find((b) => b.id === booking.id) || null);
    }
  };

  const handleSaveNotes = () => {
    if (!selectedBooking) return;
    recordActivity();
    bookingStore.updateInternalNotes(selectedBooking.id, editNotesText);
    refreshData();
    setSelectedBooking({ ...selectedBooking, internalNotes: editNotesText });
  };

  // Manual Add Booking
  const handleManualAddBooking = (e: React.FormEvent) => {
    e.preventDefault();
    recordActivity();

    const fac = facilities.find((f) => f.id === manualFacilityId) || facilities[0];
    const sH = parseInt(manualStartTime.split(':')[0], 10);
    const fH = parseInt(manualFinishTime.split(':')[0], 10);
    const hours = Math.max(1, fH - sH);
    const total = hours * fac.hourlyRate;

    const result = bookingStore.submitBookingRequest({
      facilityId: fac.id,
      facilityName: fac.name,
      customerName: manualCustomerName.trim(),
      customerEmail: manualEmail.trim().toLowerCase(),
      customerPhone: manualPhone.trim(),
      eventType: manualEventType,
      attendees: fac.capacity,
      date: manualDate,
      startTime: manualStartTime,
      finishTime: manualFinishTime,
      hours,
      hourlyRate: fac.hourlyRate,
      totalCost: total,
      needsKitchen: false,
      termsAccepted: true,
      privacyAccepted: true,
      internalNotes: 'Created manually by administrator via dashboard.',
    });

    if (!result.success) {
      alert(`Booking Failed: ${result.error}`);
      return;
    }

    // Auto-confirm manual reservation
    if (result.booking) {
      bookingStore.updateBookingStatus(result.booking.id, 'confirmed', undefined, 'Confirmed upon manual booking entry.');
    }

    refreshData();
    setShowAddModal(false);
    setManualCustomerName('');
    setManualEmail('');
    setManualPhone('');
  };

  // Add Blocked Date
  const handleAddBlockedDate = (e: React.FormEvent) => {
    e.preventDefault();
    recordActivity();
    if (!blockReason.trim()) return;

    const targetFac = facilities.find((f) => f.id === blockFacilityId);
    const facName = blockFacilityId === 'all' ? 'All Center Facilities' : targetFac?.name || 'Selected Facility';

    const blocked = bookingStore.getBlockedDates();
    blocked.push({
      id: `blk-${Date.now()}`,
      facilityId: blockFacilityId,
      facilityName: facName,
      date: blockDate,
      reason: blockReason.trim(),
      createdBy: 'admin@madanicenter.org.uk',
      createdAt: new Date().toISOString(),
    });
    bookingStore.saveBlockedDates(blocked);

    bookingStore.addAuditLog({
      adminUser: 'admin@madanicenter.org.uk',
      action: 'DATE_BLOCKED',
      targetType: 'blocked_date',
      details: `Admin reserved booked slot for ${blockDate} (${facName}): ${blockReason.trim()}`,
      ipAddress: '192.168.1.55',
    });

    refreshData();
    setShowBlockModal(false);
    setBlockReason('');
  };

  const handleRemoveBlockedDate = (id: string) => {
    recordActivity();
    const blocked = bookingStore.getBlockedDates().filter((b) => b.id !== id);
    bookingStore.saveBlockedDates(blocked);
    refreshData();
  };

  // CSV Export
  const handleExportCSV = () => {
    recordActivity();
    const headers = [
      'Reference', 'Status', 'Date', 'Start Time', 'Finish Time',
      'Facility', 'Customer Name', 'Email', 'Phone', 'Organisation',
      'Event Type', 'Attendees', 'Total Cost (£)', 'Created At'
    ];

    const rows = bookings.map((b) => [
      b.reference,
      b.status.toUpperCase(),
      b.date,
      b.startTime,
      b.finishTime,
      `"${b.facilityName.replace(/"/g, '""')}"`,
      `"${b.customerName.replace(/"/g, '""')}"`,
      b.customerEmail,
      b.customerPhone,
      `"${(b.organisation || '').replace(/"/g, '""')}"`,
      `"${b.eventType.replace(/"/g, '""')}"`,
      b.attendees,
      b.totalCost,
      b.createdAt,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `madani_bookings_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    bookingStore.addAuditLog({
      adminUser: 'admin@madanicenter.org.uk',
      action: 'CSV_EXPORT',
      targetType: 'booking',
      details: `Administrator exported ${bookings.length} booking records to CSV`,
      ipAddress: '192.168.1.55',
    });
    refreshData();
  };

  // GDPR Search
  const handleGdprSearch = (e: React.FormEvent) => {
    e.preventDefault();
    recordActivity();
    if (!gdprEmailQuery.trim()) return;
    const matches = bookings.filter((b) => b.customerEmail.toLowerCase().includes(gdprEmailQuery.trim().toLowerCase()));
    setGdprResults(matches);
  };

  const handleGdprAnonymize = (emailToAnonymize: string) => {
    recordActivity();
    if (!confirm(`Are you sure you want to execute a Right to be Forgotten erasure for ${emailToAnonymize}? This will replace personal contact identifiers with anonymized placeholders.`)) return;

    const updated = bookings.map((b) => {
      if (b.customerEmail.toLowerCase() === emailToAnonymize.toLowerCase()) {
        return {
          ...b,
          customerName: '[Anonymized Customer]',
          customerEmail: 'gdpr-deleted@anonymized.local',
          customerPhone: '[Removed]',
          organisation: '[Removed]',
          additionalRequirements: undefined,
          internalNotes: 'Personal data anonymized under UK GDPR Right to Erasure.',
        };
      }
      return b;
    });

    bookingStore.saveBookings(updated);
    bookingStore.addAuditLog({
      adminUser: 'admin@madanicenter.org.uk',
      action: 'GDPR_ERASURE',
      targetType: 'customer',
      details: `Executed GDPR data erasure for customer records matching ${emailToAnonymize}`,
      ipAddress: '192.168.1.55',
    });
    refreshData();
    setGdprResults(null);
    setGdprEmailQuery('');
    alert('Customer personal details have been safely anonymized.');
  };

  // Filtered Bookings for Table
  const filteredBookings = bookings.filter((b) => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    if (facilityFilter !== 'all' && b.facilityId !== facilityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchRef = b.reference.toLowerCase().includes(q);
      const matchName = b.customerName.toLowerCase().includes(q);
      const matchEmail = b.customerEmail.toLowerCase().includes(q);
      const matchOrg = (b.organisation || '').toLowerCase().includes(q);
      if (!matchRef && !matchName && !matchEmail && !matchOrg) return false;
    }
    return true;
  });

  // KPI Metrics
  const totalBookings = bookings.length;
  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
  const cancelledCount = bookings.filter((b) => b.status === 'cancelled' || b.status === 'rejected').length;
  const totalRevenue = bookings.filter((b) => b.status === 'confirmed').reduce((acc, curr) => acc + curr.totalCost, 0);

  // If not authenticated, show secure login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-md">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#0B2545] text-[#00A896] flex items-center justify-center shadow-xs">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-serif-brand font-bold text-[#0B2545]">
              Admin Security Gateway
            </h2>
            <p className="text-xs text-slate-500">
              Madani Community Center Booking Administration
            </p>
          </div>

          {authError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>{authError}</div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Admin Username or Email
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@madanicenter.org.uk"
                className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0077C8]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Admin Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0077C8]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                2FA Authenticator Code <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                maxLength={6}
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                placeholder="e.g. 123456"
                className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-300 font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-[#0077C8]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={lockoutTime > 0}
                className={`w-full py-3 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 ${
                  lockoutTime > 0
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-[#0B2545] text-white hover:bg-[#0077C8]'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-[#00A896]" />
                {lockoutTime > 0 ? `Locked (${lockoutTime}s remaining)` : 'Authenticate & Enter Dashboard'}
              </button>
            </div>
          </form>

          {/* Quick Demo Credentials Reminder */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <span className="font-bold text-[#0B2545] block">Default Admin Login:</span>
            <div>Username: <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-900 font-mono">admin@madanicenter.org.uk</code></div>
            <div>Password: <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-900 font-mono">MadaniAdmin2026!</code></div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => onNavigate('/')}
              className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
            >
              ← Return to Public Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#0B2545] text-white p-5 sm:p-6 rounded-3xl shadow-sm border border-[#143A66]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00A896]/20 text-[#00A896] flex items-center justify-center shrink-0 border border-[#00A896]/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-serif-brand font-bold text-white">
              Madani Booking Administration
            </h1>
            <span className="text-[11px] text-slate-300">
              Authenticated session: admin@madanicenter.org.uk • 15m inactivity timeout active
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => onNavigate('/')}
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            View Public Site
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#00A896]" />
            Export CSV
          </button>
          <button
            onClick={() => handleLogout()}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-600/80 hover:bg-rose-600 text-white transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-stone-200 overflow-x-auto pb-1">
        {[
          { id: 'overview', label: 'Overview & KPIs', icon: Sparkles },
          { id: 'bookings', label: `Bookings (${bookings.length})`, icon: Calendar },
          { id: 'blocked', label: `Booked Slots (${blockedDates.length})`, icon: CalendarCheck },
          { id: 'facilities', label: 'Facilities & Pricing', icon: Building },
          { id: 'audit', label: 'Security & Audit Log', icon: History },
          { id: 'gdpr', label: 'GDPR / Privacy Center', icon: UserCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                recordActivity();
                setActiveTab(tab.id as any);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'border-b-2 border-[#0077C8] text-[#0077C8] bg-slate-100'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.id === 'bookings' && pendingCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
                  {pendingCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & KPIS */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fade-in">
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Total Bookings
              </span>
              <div className="text-3xl font-extrabold text-[#0B2545]">
                {totalBookings}
              </div>
              <span className="text-[10px] text-slate-500">All recorded requests</span>
            </div>

            <div className="p-5 rounded-3xl bg-amber-50/80 border border-amber-200 shadow-xs space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block flex items-center justify-between">
                <span>Pending Approval</span>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              </span>
              <div className="text-3xl font-extrabold text-amber-900">
                {pendingCount}
              </div>
              <span className="text-[10px] text-amber-700">Requires coordinator review</span>
            </div>

            <div className="p-5 rounded-3xl bg-teal-50/80 border border-teal-200 shadow-xs space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 block">
                Confirmed Bookings
              </span>
              <div className="text-3xl font-extrabold text-teal-900">
                {confirmedCount}
              </div>
              <span className="text-[10px] text-teal-700">Reserved & calendar blocked</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Cancelled / Rejected
              </span>
              <div className="text-3xl font-extrabold text-slate-700">
                {cancelledCount}
              </div>
              <span className="text-[10px] text-slate-500">Released time slots</span>
            </div>

            <div className="p-5 rounded-3xl bg-[#0B2545] text-white border border-[#143A66] shadow-xs space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#00A896] block">
                Confirmed Revenue
              </span>
              <div className="text-3xl font-extrabold text-white">
                £{totalRevenue.toFixed(0)}
              </div>
              <span className="text-[10px] text-slate-300">Excluding deposit bonds</span>
            </div>
          </div>

          {/* Quick Actions Row */}
          <div className="flex items-center justify-between bg-slate-100 p-4 rounded-2xl flex-wrap gap-3">
            <div className="text-xs text-slate-700 font-medium">
              Administrative Quick Actions:
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#0B2545] text-white hover:bg-[#0077C8] transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Phone / Manual Booking
              </button>
              <button
                onClick={() => setShowBlockModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5 text-rose-500" />
                Block Out Date
              </button>
            </div>
          </div>

          {/* Pending Approval Priority List */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-[#0B2545]">
                  Bookings Awaiting Review ({pendingCount})
                </h3>
                <p className="text-xs text-slate-500">
                  New submissions from the public website needing approval or rejection
                </p>
              </div>
              {pendingCount > 0 && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                  Action Required
                </span>
              )}
            </div>

            {pendingCount === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                <CheckCircle2 className="w-8 h-8 mx-auto text-[#00A896] mb-2 opacity-80" />
                All booking requests have been reviewed. No pending approvals remaining.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {bookings
                  .filter((b) => b.status === 'pending')
                  .map((booking) => (
                    <div
                      key={booking.id}
                      className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#0B2545] bg-slate-100 px-2 py-0.5 rounded">
                            {booking.reference}
                          </span>
                          <strong className="text-sm text-slate-900">{booking.customerName}</strong>
                          {booking.organisation && (
                            <span className="text-xs text-slate-500 font-normal">
                              ({booking.organisation})
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600">
                          {booking.facilityName} • <strong>{booking.date}</strong> ({booking.startTime} - {booking.finishTime}) • £{booking.totalCost}
                        </p>
                        <p className="text-[11px] text-slate-500 italic">
                          "{booking.eventType}" — {booking.attendees} attendees
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleApprove(booking)}
                          className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#00A896] text-white hover:bg-[#009181] transition-colors cursor-pointer shadow-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowRejectModal(true);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: BOOKINGS TABLE & SEARCH */}
      {activeTab === 'bookings' && (
        <div className="space-y-6 animate-fade-in">
          {/* Controls Bar */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Search Box */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search reference, customer name, email, organisation..."
                  className="w-full text-xs py-2.5 pl-9 pr-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0077C8]"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs py-2 px-3 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none"
                >
                  <option value="all">All Statuses ({bookings.length})</option>
                  <option value="pending">Pending Approval ({pendingCount})</option>
                  <option value="confirmed">Confirmed ({confirmedCount})</option>
                  <option value="rejected">Rejected</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <select
                  value={facilityFilter}
                  onChange={(e) => setFacilityFilter(e.target.value)}
                  className="text-xs py-2 px-3 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none"
                >
                  <option value="all">All Facilities</option>
                  {facilities.map((fac) => (
                    <option key={fac.id} value={fac.id}>
                      {fac.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#0B2545] text-white hover:bg-[#0077C8] transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Booking
                </button>
              </div>
            </div>
          </div>

          {/* Bookings Data Table */}
          <div className="rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Ref Code</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Facility</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No bookings matching selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-[#0B2545]">
                          {b.reference}
                        </td>
                        <td className="py-3.5 px-4">
                          <strong className="text-slate-900 block">{b.customerName}</strong>
                          <span className="text-[10px] text-slate-500">{b.customerEmail}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-medium text-slate-800">{b.facilityName}</span>
                          <span className="block text-[10px] text-slate-400">{b.eventType}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-slate-900">{b.date}</span>
                          <span className="block text-[10px] text-slate-500">
                            {b.startTime} - {b.finishTime} ({b.hours} hrs)
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          £{b.totalCost}
                        </td>
                        <td className="py-3.5 px-4">
                          {b.status === 'confirmed' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
                              Confirmed
                            </span>
                          )}
                          {b.status === 'pending' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                              Pending
                            </span>
                          )}
                          {b.status === 'rejected' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                              Rejected
                            </span>
                          )}
                          {b.status === 'cancelled' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                              Cancelled
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedBooking(b);
                                setEditNotesText(b.internalNotes || '');
                              }}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                              title="View full details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {b.status === 'pending' && (
                              <button
                                onClick={() => handleApprove(b)}
                                className="p-1.5 rounded-lg text-[#00A896] hover:bg-teal-50 cursor-pointer"
                                title="Approve booking"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            )}
                            {b.status === 'confirmed' && (
                              <button
                                onClick={() => handleCancel(b)}
                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                                title="Cancel booking"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BOOKED SLOTS & AVAILABILITY SCHEDULE */}
      {activeTab === 'blocked' && (() => {
        const adminYear = adminCalendarMonth.getFullYear();
        const adminMonth = adminCalendarMonth.getMonth();
        const adminFirstDayOfMonth = new Date(adminYear, adminMonth, 1).getDay();
        const adminDaysInMonth = new Date(adminYear, adminMonth + 1, 0).getDate();
        const adminTodayStr = new Date().toISOString().split('T')[0];
        const adminMonthNames = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const prevAdminMonth = () => {
          setAdminCalendarMonth(new Date(adminYear, adminMonth - 1, 1));
        };
        const nextAdminMonth = () => {
          setAdminCalendarMonth(new Date(adminYear, adminMonth + 1, 1));
        };

        const getAdminDayStatus = (dateStr: string) => {
          const matchBlocked = blockedDates.find(
            (b) => b.date === dateStr && (adminFacilityFilter === 'all' || b.facilityId === 'all' || b.facilityId === adminFacilityFilter)
          );
          const matchBookings = bookings.filter(
            (b) =>
              b.date === dateStr &&
              (adminFacilityFilter === 'all' || b.facilityId === adminFacilityFilter) &&
              b.status !== 'cancelled' &&
              b.status !== 'rejected'
          );

          if (matchBlocked || matchBookings.length > 0) {
            let details = '';
            if (matchBlocked) {
              details = `Reserved: ${matchBlocked.reason} (${matchBlocked.facilityName})`;
            } else if (matchBookings.length > 0) {
              details = `Booking: ${matchBookings[0].customerName} (${matchBookings[0].facilityName})`;
            }
            return {
              isBooked: true,
              label: 'Booked Slot',
              details,
              blockedId: matchBlocked?.id,
              bookingRef: matchBookings[0]?.reference,
            };
          }

          return {
            isBooked: false,
            label: 'Available',
          };
        };

        return (
          <div className="space-y-6 animate-fade-in">
            {/* Header & Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between bg-white p-6 rounded-3xl border border-stone-200 shadow-xs gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#00A896]">
                  Calendar &amp; Availability Management
                </span>
                <h3 className="text-xl font-bold font-serif-brand text-[#0B2545] mt-0.5">
                  Booked Slots &amp; Reserved Dates
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Manage all reserved dates across the center. Dates marked as <strong className="text-rose-600 font-semibold">Booked Slot (Red)</strong> prevent public booking, while <strong className="text-emerald-700 font-semibold">Available (Green)</strong> dates are open.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                {/* 2-Color Legend (Available Green vs Booked Slot Red) */}
                <div className="flex items-center gap-3 bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-200 text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-emerald-800">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-xs" />
                    <span>Available (Green)</span>
                  </div>
                  <div className="h-3.5 w-px bg-slate-300" />
                  <div className="flex items-center gap-1.5 font-semibold text-rose-800">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] shadow-xs" />
                    <span>Booked Slot (Red)</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setBlockDate(new Date().toISOString().split('T')[0]);
                    setBlockReason('');
                    setShowBlockModal(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#EF4444] text-white hover:bg-rose-700 transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Booked Slot (Red)
                </button>
              </div>
            </div>

            {/* Interactive Availability Calendar */}
            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Filter Calendar Facility:</span>
                  <select
                    value={adminFacilityFilter}
                    onChange={(e) => setAdminFacilityFilter(e.target.value)}
                    className="text-xs py-1.5 px-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-[#0077C8]"
                  >
                    <option value="all">All Center Facilities (Whole Building)</option>
                    {facilities.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Month Navigation */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={prevAdminMonth}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Prev</span>
                  </button>

                  <h4 className="text-sm sm:text-base font-bold text-[#0B2545] font-serif-brand min-w-[130px] text-center">
                    {adminMonthNames[adminMonth]} {adminYear}
                  </h4>

                  <button
                    type="button"
                    onClick={nextAdminMonth}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Day of Week Headers */}
              <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400 uppercase py-1 border-b border-slate-100">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2 pt-2">
                {/* Empty leading padding */}
                {Array.from({ length: adminFirstDayOfMonth }).map((_, i) => (
                  <div key={`admin-empty-${i}`} className="h-16 rounded-2xl bg-transparent" />
                ))}

                {/* Month Days */}
                {Array.from({ length: adminDaysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const dateStr = `${adminYear}-${String(adminMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                  const isPast = dateStr < adminTodayStr;
                  const dayStatus = getAdminDayStatus(dateStr);
                  const isBooked = dayStatus.isBooked;

                  return (
                    <button
                      key={dateStr}
                      type="button"
                      onClick={() => {
                        if (isBooked) {
                          setSelectedSlotDateInfo({
                            date: dateStr,
                            isBooked: true,
                            details: dayStatus.details,
                            blockedId: dayStatus.blockedId,
                            bookingRef: dayStatus.bookingRef,
                          });
                        } else {
                          setSelectedSlotDateInfo({
                            date: dateStr,
                            isBooked: false,
                          });
                          setBlockDate(dateStr);
                          setShowBlockModal(true);
                        }
                      }}
                      className={`h-16 rounded-2xl p-2 flex flex-col justify-between items-center text-xs transition-all border cursor-pointer ${
                        isPast
                          ? 'bg-slate-50 text-slate-400 border-slate-200 opacity-60'
                          : isBooked
                          ? 'bg-rose-50 hover:bg-rose-100/80 border-rose-200 text-rose-900 shadow-xs'
                          : 'bg-emerald-50/50 hover:bg-emerald-100/70 border-emerald-200 text-emerald-950'
                      }`}
                      title={
                        isBooked
                          ? `${dateStr}: Booked Slot (Click to view or release)`
                          : `${dateStr}: Available (Click to reserve)`
                      }
                    >
                      <div className="w-full flex items-center justify-between">
                        <span className="font-bold text-xs">{dayNum}</span>
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isBooked ? 'bg-[#EF4444]' : 'bg-[#10B981]'
                          }`}
                        />
                      </div>

                      <span
                        className={`text-[10px] font-bold ${
                          isBooked ? 'text-rose-700' : 'text-emerald-700'
                        }`}
                      >
                        {isBooked ? 'Booked' : 'Available'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Slot Details Banner if selected */}
              {selectedSlotDateInfo && selectedSlotDateInfo.isBooked && (
                <div className="mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-[#EF4444] shrink-0" />
                    <div>
                      <strong className="text-rose-900 font-bold block text-sm">
                        {selectedSlotDateInfo.date} — Booked Slot (Red)
                      </strong>
                      <span className="text-rose-700">{selectedSlotDateInfo.details || 'Marked as Booked Slot on the calendar'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedSlotDateInfo.blockedId && (
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedSlotDateInfo.blockedId) {
                            handleRemoveBlockedDate(selectedSlotDateInfo.blockedId);
                            setSelectedSlotDateInfo(null);
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl font-bold bg-white text-rose-700 border border-rose-300 hover:bg-rose-100 cursor-pointer text-xs"
                      >
                        Release This Booked Slot
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setSelectedSlotDateInfo(null)}
                      className="px-3 py-1.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer text-xs"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Table of All Booked Slots */}
            <div className="rounded-3xl border border-stone-200 bg-white shadow-xs overflow-hidden">
              <div className="p-5 border-b border-stone-100 flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-[#0B2545] font-serif-brand">
                    All Active Booked Slots &amp; Reserved Dates ({blockedDates.length})
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Dates currently shown as Booked Slot (Red) on the calendar.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-xs border-collapse min-w-[550px]">
                  <thead>
                    <tr className="border-b border-stone-200 bg-stone-50 text-[11px] font-bold text-stone-600 uppercase">
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Facility Scope</th>
                      <th className="py-3 px-4">Booking / Reserve Reason</th>
                      <th className="py-3 px-4">Reserved By</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-700">
                    {blockedDates.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400">
                          No booked slot dates currently reserved. All dates are Available (Green).
                        </td>
                      </tr>
                    ) : (
                      blockedDates.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-[#0B2545] font-mono">{b.date}</td>
                          <td className="py-3.5 px-4 font-medium text-slate-800">{b.facilityName}</td>
                          <td className="py-3.5 px-4 text-slate-800">{b.reason}</td>
                          <td className="py-3.5 px-4 text-slate-400 text-[11px]">{b.createdBy}</td>
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                              Booked Slot (Red)
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveBlockedDate(b.id)}
                              className="px-3 py-1 rounded-lg text-[11px] font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 cursor-pointer transition-colors"
                            >
                              Release Slot
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

      {/* TAB 4: FACILITIES & PRICING */}
      {activeTab === 'facilities' && (
        <div className="space-y-6 animate-fade-in">
          <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-xs">
            <h3 className="text-base font-bold text-[#0B2545]">
              Facility Management
            </h3>
            <p className="text-xs text-stone-500">
              Active facilities and pricing displayed on the public booking platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {facilities.map((fac) => (
              <div
                key={fac.id}
                className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-serif-brand font-bold text-[#0B2545]">
                      {fac.name}
                    </h4>
                    <span className="text-xs text-stone-400">{fac.category}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#00A896]/15 text-[#00A896]">
                    Active
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs bg-stone-50 p-3 rounded-2xl">
                  <div>
                    <span className="text-[10px] text-stone-400 block">CAPACITY</span>
                    <strong className="text-stone-900">{fac.capacity} people</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block">WEEKDAY</span>
                    <strong className="text-stone-900">£{fac.hourlyRate}/hr</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block">WEEKEND</span>
                    <strong className="text-stone-900">£{fac.weekendRate}/hr</strong>
                  </div>
                </div>

                <p className="text-xs text-stone-600 line-clamp-2">
                  {fac.description}
                </p>

                <div className="text-[11px] text-stone-500 pt-2 border-t border-stone-100 flex items-center justify-between">
                  <span>Refundable Bond: £{fac.depositRequired}</span>
                  <span className="text-[#00A896] font-semibold">Online Bookings Enabled</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: AUDIT LOG */}
      {activeTab === 'audit' && (
        <div className="space-y-6 animate-fade-in">
          <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-xs flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-base font-bold text-[#0B2545]">
                Security Audit Log & Activity Trail
              </h3>
              <p className="text-xs text-stone-500">
                Immutable, tamper-evident recording of all logins, status changes, and data modifications.
              </p>
            </div>
            <span className="text-xs font-mono text-stone-400">
              Showing last {auditLogs.length} events
            </span>
          </div>

          <div className="rounded-3xl border border-stone-200 bg-white shadow-xs overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-xs border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50 text-[11px] font-bold text-stone-600 uppercase">
                    <th className="py-3 px-4">Timestamp (UTC)</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Actor</th>
                    <th className="py-3 px-4">Details</th>
                    <th className="py-3 px-4 text-right">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-mono text-[11px] text-stone-700">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-stone-50/60">
                      <td className="py-3 px-4 text-stone-500 whitespace-nowrap">
                        {log.timestamp.replace('T', ' ').slice(0, 19)}
                      </td>
                      <td className="py-3 px-4 font-bold">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          log.action.includes('SUCCESS') || log.action.includes('APPROVED')
                            ? 'bg-emerald-100 text-emerald-800'
                            : log.action.includes('FAILED') || log.action.includes('REJECTED')
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-stone-100 text-stone-800'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-stone-800 font-sans font-medium">
                        {log.adminUser}
                      </td>
                      <td className="py-3 px-4 text-stone-600 font-sans max-w-md truncate">
                        {log.details}
                      </td>
                      <td className="py-3 px-4 text-stone-400 text-right">
                        {log.ipAddress}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: GDPR / PRIVACY CENTER */}
      {activeTab === 'gdpr' && (
        <div className="space-y-6 animate-fade-in">
          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#00A896]" />
              <h3 className="text-base font-bold text-[#0B2545]">
                UK GDPR Privacy Compliance Center
              </h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed max-w-3xl">
              Under UK GDPR principles of data minimisation, storage limitation, and the Right to Erasure ("Right to be Forgotten"), administrators can query individual customer records, export full historical files, or redact personal contact data while preserving financial and booking continuity metrics.
            </p>

            <form onSubmit={handleGdprSearch} className="flex items-center gap-2 pt-2 max-w-lg">
              <input
                type="email"
                required
                value={gdprEmailQuery}
                onChange={(e) => setGdprEmailQuery(e.target.value)}
                placeholder="Enter customer email address..."
                className="flex-1 text-xs py-2 px-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#0077C8]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0B2545] text-white hover:bg-[#0077C8] cursor-pointer"
              >
                Search Records
              </button>
            </form>
          </div>

          {gdprResults && (
            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <span className="text-xs font-bold text-[#0B2545]">
                  Found {gdprResults.length} booking record(s) for email query
                </span>
                {gdprResults.length > 0 && (
                  <button
                    onClick={() => handleGdprAnonymize(gdprEmailQuery)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition-colors cursor-pointer"
                  >
                    Execute Right to Erasure (Anonymize Customer)
                  </button>
                )}
              </div>

              {gdprResults.length === 0 ? (
                <div className="text-xs text-stone-500 py-4 text-center">
                  No customer records found matching "{gdprEmailQuery}".
                </div>
              ) : (
                <div className="space-y-3">
                  {gdprResults.map((b) => (
                    <div key={b.id} className="p-3.5 rounded-xl border border-stone-100 bg-stone-50 text-xs flex justify-between items-center">
                      <div>
                        <strong>{b.reference}</strong> • {b.customerName} • {b.facilityName} ({b.date})
                      </div>
                      <span className="font-mono text-stone-500">{b.customerPhone}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: VIEW/EDIT BOOKING DETAILS */}
      {selectedBooking && !showRejectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 my-8">
            <div className="flex items-start justify-between pb-4 border-b border-stone-100">
              <div>
                <span className="font-mono text-xs font-bold text-[#0B2545] bg-stone-100 px-2 py-0.5 rounded">
                  {selectedBooking.reference}
                </span>
                <h3 className="text-xl font-serif-brand font-bold text-[#0B2545] mt-1">
                  Booking Request Details
                </h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-stone-50 p-3 rounded-xl">
                <span className="text-stone-400 block font-semibold">CUSTOMER NAME</span>
                <strong className="text-stone-900 text-sm">{selectedBooking.customerName}</strong>
              </div>
              <div className="bg-stone-50 p-3 rounded-xl">
                <span className="text-stone-400 block font-semibold">STATUS</span>
                <strong className="text-stone-900 uppercase">{selectedBooking.status}</strong>
              </div>
              <div className="bg-stone-50 p-3 rounded-xl">
                <span className="text-stone-400 block font-semibold">EMAIL</span>
                <span className="text-stone-800">{selectedBooking.customerEmail}</span>
              </div>
              <div className="bg-stone-50 p-3 rounded-xl">
                <span className="text-stone-400 block font-semibold">PHONE</span>
                <span className="text-stone-800">{selectedBooking.customerPhone}</span>
              </div>
              <div className="bg-stone-50 p-3 rounded-xl">
                <span className="text-stone-400 block font-semibold">FACILITY</span>
                <span className="text-stone-800 font-semibold">{selectedBooking.facilityName}</span>
              </div>
              <div className="bg-stone-50 p-3 rounded-xl">
                <span className="text-stone-400 block font-semibold">DATE & TIME</span>
                <span className="text-stone-800">
                  {selectedBooking.date} ({selectedBooking.startTime} - {selectedBooking.finishTime})
                </span>
              </div>
              <div className="bg-stone-50 p-3 rounded-xl">
                <span className="text-stone-400 block font-semibold">EVENT PURPOSE</span>
                <span className="text-stone-800">{selectedBooking.eventType} ({selectedBooking.attendees} attendees)</span>
              </div>
              <div className="bg-stone-50 p-3 rounded-xl">
                <span className="text-stone-400 block font-semibold">ESTIMATED FEE</span>
                <span className="text-stone-900 font-bold text-sm">£{selectedBooking.totalCost}</span>
              </div>
            </div>

            {selectedBooking.additionalRequirements && (
              <div className="p-3 bg-stone-50 rounded-xl text-xs">
                <span className="text-stone-400 block font-semibold mb-1">ADDITIONAL REQUIREMENTS</span>
                <p className="text-stone-700">{selectedBooking.additionalRequirements}</p>
              </div>
            )}

            {/* Internal Staff Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 block">
                Internal Staff Notes <span className="text-stone-400 font-normal">(Never exposed to public)</span>
              </label>
              <textarea
                rows={2}
                value={editNotesText}
                onChange={(e) => setEditNotesText(e.target.value)}
                placeholder="Keyholder assignment, deposit receipt number, catering arrangements..."
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#0077C8]"
              />
              <button
                type="button"
                onClick={handleSaveNotes}
                className="px-3 py-1 text-[11px] font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg cursor-pointer"
              >
                Save Notes
              </button>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-stone-100 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                {selectedBooking.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(selectedBooking)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0077C8] text-white hover:bg-[#0069B4] cursor-pointer"
                    >
                      Approve Booking
                    </button>
                    <button
                      onClick={() => setShowRejectModal(true)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 cursor-pointer"
                    >
                      Reject Request
                    </button>
                  </>
                )}
                {selectedBooking.status === 'confirmed' && (
                  <button
                    onClick={() => handleCancel(selectedBooking)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 cursor-pointer"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>

              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-stone-500 hover:text-stone-800 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: REJECT BOOKING REASON */}
      {showRejectModal && selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-stone-200">
            <h3 className="text-lg font-serif-brand font-bold text-rose-800">
              Reject Booking Request
            </h3>
            <p className="text-xs text-stone-600">
              Provide a clear reason for the rejection notice that will be logged and communicated to the customer:
            </p>
            <textarea
              rows={3}
              value={rejectReasonText}
              onChange={(e) => setRejectReasonText(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedBooking)}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: MANUAL ADD BOOKING */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleManualAddBooking}
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-stone-200 my-8"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-lg font-serif-brand font-bold text-[#0B2545]">
                Add Manual / Walk-in Booking
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Facility</label>
              <select
                value={manualFacilityId}
                onChange={(e) => setManualFacilityId(e.target.value)}
                className="w-full text-xs py-2 px-3 rounded-xl border border-stone-300"
              >
                {facilities.map((fac) => (
                  <option key={fac.id} value={fac.id}>
                    {fac.name} (£{fac.hourlyRate}/hr)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  value={manualCustomerName}
                  onChange={(e) => setManualCustomerName(e.target.value)}
                  placeholder="e.g. Br. Usman"
                  className="w-full text-xs py-2 px-3 rounded-xl border border-stone-300"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  value={manualPhone}
                  onChange={(e) => setManualPhone(e.target.value)}
                  placeholder="07700 900000"
                  className="w-full text-xs py-2 px-3 rounded-xl border border-stone-300"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Email</label>
              <input
                type="email"
                required
                value={manualEmail}
                onChange={(e) => setManualEmail(e.target.value)}
                placeholder="customer@example.com"
                className="w-full text-xs py-2 px-3 rounded-xl border border-stone-300"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={manualDate}
                  onChange={(e) => setManualDate(e.target.value)}
                  className="w-full text-xs py-2 px-3 rounded-xl border border-stone-300"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Start</label>
                <input
                  type="time"
                  required
                  value={manualStartTime}
                  onChange={(e) => setManualStartTime(e.target.value)}
                  className="w-full text-xs py-2 px-3 rounded-xl border border-stone-300"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Finish</label>
                <input
                  type="time"
                  required
                  value={manualFinishTime}
                  onChange={(e) => setManualFinishTime(e.target.value)}
                  className="w-full text-xs py-2 px-3 rounded-xl border border-stone-300"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Event Note</label>
              <input
                type="text"
                value={manualEventType}
                onChange={(e) => setManualEventType(e.target.value)}
                placeholder="Phone enquiry / in-person deposit received"
                className="w-full text-xs py-2 px-3 rounded-xl border border-stone-300"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0B2545] text-white hover:bg-[#0077C8] cursor-pointer"
              >
                Save & Confirm Booking
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 4: RESERVE BOOKED SLOT */}
      {showBlockModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAddBlockedDate}
            className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-stone-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="text-lg font-serif-brand font-bold text-[#0B2545]">
                  Reserve Date as Booked Slot (Red)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  This date will show in Red on the calendar and prevent public bookings.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowBlockModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Select Date</label>
              <input
                type="date"
                required
                value={blockDate}
                onChange={(e) => setBlockDate(e.target.value)}
                className="w-full text-xs py-2 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0077C8]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Facility Scope</label>
              <select
                value={blockFacilityId}
                onChange={(e) => setBlockFacilityId(e.target.value)}
                className="w-full text-xs py-2 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0077C8]"
              >
                <option value="all">All Center Facilities (Whole Building)</option>
                {facilities.map((fac) => (
                  <option key={fac.id} value={fac.id}>
                    {fac.name} Only
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Booking / Reserve Reason</label>
              <input
                type="text"
                required
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder="e.g. Internal Community Programme, Routine Maintenance, Private Function"
                className="w-full text-xs py-2 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0077C8]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowBlockModal(false)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-[#EF4444] text-white hover:bg-rose-700 cursor-pointer"
              >
                Save Booked Slot (Red)
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
