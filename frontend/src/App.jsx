import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  Bed,
  Bell,
  ClipboardList,
  FileText,
  HeartPulse,
  LayoutDashboard,
  Moon,
  Search,
  ShieldCheck,
  Sun,
  Users,
  Wallet,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import './App.css';

const departments = [
  'Cardiology',
  'Neurology',
  'Oncology',
  'Orthopedics',
  'Pulmonology',
  'Pediatrics',
  'Nephrology',
  'Emergency',
];

const doctors = [
  'Dr. Ethan Clark',
  'Dr. Lara Quinn',
  'Dr. Mei Lin',
  'Dr. Ryan Holt',
  'Dr. James Xu',
  'Dr. Nikhil Rao',
  'Dr. Helen Kim',
  'Dr. Olivia Reed',
];

const firstNames = [
  'Liam',
  'Noah',
  'Olivia',
  'Emma',
  'Ava',
  'Sophia',
  'Mason',
  'Elijah',
  'Lucas',
  'Amelia',
  'Isabella',
  'Mia',
  'Harper',
  'Evelyn',
  'James',
  'Benjamin',
  'Charlotte',
  'Henry',
  'Jack',
  'Scarlett',
];

const lastNames = [
  'Turner',
  'Ward',
  'Flores',
  'Simmons',
  'Carter',
  'Hill',
  'Powell',
  'Brooks',
  'Bennett',
  'Morgan',
  'Cruz',
  'Foster',
  'Hughes',
  'Edwards',
  'King',
  'Perry',
  'Long',
  'Howard',
  'Ross',
  'Diaz',
];

const conditions = [
  'Cardiac Monitoring',
  'Post-op Recovery',
  'Respiratory Observation',
  'Acute Neurology Watch',
  'Chemo Infusion Cycle',
  'Renal Function Review',
  'Orthopedic Rehab',
  'High-Risk Infection Control',
];

const claimStatuses = ['Approved', 'Pending', 'Denied', 'Under Review'];
const risks = ['Low', 'Medium', 'High'];
const appointmentStatuses = ['Checked In', 'In Consultation', 'Awaiting Vitals', 'Rescheduled', 'Cancelled'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const patientRegistry = Array.from({ length: 220 }, (_, index) => {
  const number = index + 1;
  const risk = risks[number % 3];
  const department = departments[number % departments.length];
  return {
    patientId: `PT-${String(5000 + number)}`,
    name: `${firstNames[number % firstNames.length]} ${lastNames[(number * 3) % lastNames.length]}`,
    age: 19 + ((number * 7) % 63),
    risk,
    department,
    condition: conditions[number % conditions.length],
    room: `${department.slice(0, 3).toUpperCase()}-${String((number % 24) + 1).padStart(2, '0')}`,
    monitored: number % 4 !== 0,
  };
});

const appointments = Array.from({ length: 160 }, (_, index) => {
  const number = index + 1;
  const department = departments[number % departments.length];
  const status = appointmentStatuses[number % appointmentStatuses.length];
  return {
    id: `AP-${String(9000 + number)}`,
    patient: `${firstNames[(number + 5) % firstNames.length]} ${lastNames[(number + 2) % lastNames.length]}`,
    unit: department,
    doctor: doctors[number % doctors.length],
    time: `${String(8 + ((number * 13) % 10)).padStart(2, '0')}:${String((number * 7) % 60).padStart(2, '0')} ${number % 2 ? 'AM' : 'PM'}`,
    status,
  };
});

const claims = Array.from({ length: 180 }, (_, index) => {
  const number = index + 1;
  const charge = 1800 + ((number * 319) % 14200);
  const paid = charge * (0.45 + ((number * 11) % 45) / 100);
  return {
    id: `CL-${String(20000 + number)}`,
    patient: `${firstNames[(number + 7) % firstNames.length]} ${lastNames[(number + 9) % lastNames.length]}`,
    provider: ['Aetna', 'United Health', 'Blue Cross', 'Cigna'][number % 4],
    status: claimStatuses[number % claimStatuses.length],
    department: departments[number % departments.length],
    submitted: `2026-${String(((number % 3) + 1)).padStart(2, '0')}-${String((number % 27) + 1).padStart(2, '0')}`,
    charge,
    paid: Math.round(paid),
  };
});

const alerts = [
  'Blood bank stock for O- is below 20 units.',
  'MRI machine calibration scheduled at 03:00 PM.',
  'Three ICU ventilators marked for preventive service.',
  'Pharmacy reorder request pending approval for insulin pens.',
  'Regional dengue watch advisory activated for next 72 hours.',
  'Trauma room 2 maintenance window starts in 45 minutes.',
  'Pediatric unit expected surge from partner clinic referrals.',
  'Telemetry packet loss detected in west wing floor 3.',
];

const admissionsTrend = months.map((month, idx) => ({
  month,
  admissions: 1100 + idx * 56 + (idx % 3) * 40,
  discharges: 1000 + idx * 49 + (idx % 2) * 35,
}));

const departmentLoad = departments.map((name, idx) => ({
  name,
  occupancy: 62 + ((idx * 9 + 13) % 34),
  staff: 70 + ((idx * 7 + 22) % 28),
}));

const telemedicine = Array.from({ length: 12 }, (_, idx) => ({
  week: `W${idx + 1}`,
  virtual: 290 + idx * 18 + (idx % 3) * 11,
  followUp: 120 + idx * 8 + (idx % 4) * 6,
}));

const emergencyQueue = [
  { ticket: 'ER-901', case: 'Chest pain + dyspnea', wait: '02m', priority: 'Critical' },
  { ticket: 'ER-902', case: 'Fracture (open tibia)', wait: '07m', priority: 'High' },
  { ticket: 'ER-903', case: 'Hypoglycemia episode', wait: '09m', priority: 'High' },
  { ticket: 'ER-904', case: 'Severe abdominal pain', wait: '14m', priority: 'Medium' },
  { ticket: 'ER-905', case: 'Pediatric fever', wait: '21m', priority: 'Medium' },
  { ticket: 'ER-906', case: 'Minor laceration', wait: '28m', priority: 'Low' },
];

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function statusClass(status) {
  return `status ${status.toLowerCase().replace(/\s+/g, '-')}`;
}

function riskClass(risk) {
  return `risk ${risk.toLowerCase()}`;
}

function downloadCsv(filename, rows, columns) {
  const header = columns.map((column) => column.label).join(',');
  const lines = rows.map((row) => columns.map((column) => JSON.stringify(column.value(row))).join(','));
  const csv = [header, ...lines].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function SummaryCard({ title, value, trend, Icon }) {
  return (
    <article className="summary-card">
      <div className="summary-icon">
        <Icon size={18} />
      </div>
      <p>{title}</p>
      <h3>{value}</h3>
      <span>{trend}</span>
    </article>
  );
}

function OverviewPage({ kpis }) {
  return (
    <div className="page-grid">
      <section className="summary-grid">
        {kpis.map((item) => (
          <SummaryCard key={item.title} {...item} />
        ))}
      </section>

      <section className="panel panel-wide">
        <div className="panel-head">
          <h2>Admissions vs Discharges</h2>
          <p>Monthly throughput for all facilities</p>
        </div>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={admissionsTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
              <XAxis dataKey="month" stroke="var(--axis)" />
              <YAxis stroke="var(--axis)" />
              <Tooltip />
              <Line type="monotone" dataKey="admissions" stroke="var(--accent)" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="discharges" stroke="var(--accent-alt)" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>Department Load</h2>
          <p>Live occupancy and staffing ratio</p>
        </div>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={departmentLoad}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
              <XAxis dataKey="name" stroke="var(--axis)" interval={0} angle={-20} height={60} textAnchor="end" />
              <YAxis stroke="var(--axis)" />
              <Tooltip />
              <Bar dataKey="occupancy" fill="var(--accent)" radius={[8, 8, 0, 0]} />
              <Bar dataKey="staff" fill="var(--accent-alt)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>Virtual Care Performance</h2>
          <p>Telemedicine and follow-up sessions</p>
        </div>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={telemedicine}>
              <defs>
                <linearGradient id="gradientVirtual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
              <XAxis dataKey="week" stroke="var(--axis)" />
              <YAxis stroke="var(--axis)" />
              <Tooltip />
              <Area type="monotone" dataKey="virtual" stroke="var(--accent)" fill="url(#gradientVirtual)" />
              <Line type="monotone" dataKey="followUp" stroke="var(--accent-alt)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="panel panel-wide">
        <div className="panel-head row">
          <div>
            <h2>Emergency Queue and Appointments</h2>
            <p>Critical triage and top 16 upcoming appointments</p>
          </div>
          <NavLink className="text-btn" to="/patients">
            View full patient register
          </NavLink>
        </div>
        <div className="dual-block">
          <div className="queue-list">
            {emergencyQueue.map((item) => (
              <div key={item.ticket} className="queue-item">
                <div>
                  <p className="queue-ticket">{item.ticket}</p>
                  <p className="queue-case">{item.case}</p>
                </div>
                <div className="queue-meta">
                  <span>{item.wait}</span>
                  <strong>{item.priority}</strong>
                </div>
              </div>
            ))}
          </div>
          <div className="table-wrap compact">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient</th>
                  <th>Department</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.slice(0, 16).map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.patient}</td>
                    <td>{item.unit}</td>
                    <td>
                      <span className={statusClass(item.status)}>{item.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

function PatientsPage({ addToast }) {
  const [query, setQuery] = useState('');
  const [risk, setRisk] = useState('All');
  const [department, setDepartment] = useState('All');

  const filtered = useMemo(() => {
    return patientRegistry.filter((entry) => {
      const matchesQuery =
        entry.name.toLowerCase().includes(query.toLowerCase()) ||
        entry.patientId.toLowerCase().includes(query.toLowerCase()) ||
        entry.condition.toLowerCase().includes(query.toLowerCase());
      const matchesRisk = risk === 'All' ? true : entry.risk === risk;
      const matchesDepartment = department === 'All' ? true : entry.department === department;
      return matchesQuery && matchesRisk && matchesDepartment;
    });
  }, [query, risk, department]);

  return (
    <section className="panel">
      <div className="panel-head row">
        <div>
          <h2>Patient Register</h2>
          <p>220 hardcoded records with live search and filtering</p>
        </div>
        <div className="button-row">
          <button
            className="action-btn secondary"
            onClick={() => {
              downloadCsv(
                'patients.csv',
                filtered,
                [
                  { label: 'Patient ID', value: (row) => row.patientId },
                  { label: 'Name', value: (row) => row.name },
                  { label: 'Age', value: (row) => row.age },
                  { label: 'Risk', value: (row) => row.risk },
                  { label: 'Department', value: (row) => row.department },
                  { label: 'Condition', value: (row) => row.condition },
                ],
              );
              addToast('Patient CSV exported');
            }}
          >
            Export CSV
          </button>
        </div>
      </div>
      <div className="controls">
        <label className="search-box">
          <Search size={15} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search patient, ID, condition" />
        </label>
        <select value={risk} onChange={(event) => setRisk(event.target.value)}>
          <option value="All">All risk levels</option>
          {risks.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <select value={department} onChange={(event) => setDepartment(event.target.value)}>
          <option value="All">All departments</option>
          {departments.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Patient ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Risk</th>
              <th>Department</th>
              <th>Condition</th>
              <th>Room</th>
              <th>Telemetry</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((entry) => (
              <tr key={entry.patientId}>
                <td>{entry.patientId}</td>
                <td>{entry.name}</td>
                <td>{entry.age}</td>
                <td>
                  <span className={riskClass(entry.risk)}>{entry.risk}</span>
                </td>
                <td>{entry.department}</td>
                <td>{entry.condition}</td>
                <td>{entry.room}</td>
                <td>{entry.monitored ? 'Active' : 'Paused'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function BillingPage({ addToast }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');

  const filtered = useMemo(() => {
    return claims.filter((entry) => {
      const matchesQuery =
        entry.id.toLowerCase().includes(query.toLowerCase()) ||
        entry.patient.toLowerCase().includes(query.toLowerCase()) ||
        entry.provider.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === 'All' ? true : entry.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [query, status]);

  const totals = useMemo(() => {
    return filtered.reduce(
      (accumulator, current) => {
        accumulator.charge += current.charge;
        accumulator.paid += current.paid;
        return accumulator;
      },
      { charge: 0, paid: 0 },
    );
  }, [filtered]);

  return (
    <div className="page-grid">
      <section className="summary-grid small">
        <article className="summary-card">
          <p>Visible Claims</p>
          <h3>{filtered.length}</h3>
          <span>Based on active filters</span>
        </article>
        <article className="summary-card">
          <p>Total Charged</p>
          <h3>{formatCurrency(totals.charge)}</h3>
          <span>Current list aggregate</span>
        </article>
        <article className="summary-card">
          <p>Total Paid</p>
          <h3>{formatCurrency(totals.paid)}</h3>
          <span>Cleared by insurers</span>
        </article>
      </section>

      <section className="panel panel-wide">
        <div className="panel-head row">
          <div>
            <h2>Claims and Reimbursements</h2>
            <p>180 hardcoded claims with status filtering</p>
          </div>
          <button
            className="action-btn secondary"
            onClick={() => {
              downloadCsv(
                'claims.csv',
                filtered,
                [
                  { label: 'Claim ID', value: (row) => row.id },
                  { label: 'Patient', value: (row) => row.patient },
                  { label: 'Provider', value: (row) => row.provider },
                  { label: 'Status', value: (row) => row.status },
                  { label: 'Submitted', value: (row) => row.submitted },
                  { label: 'Charge', value: (row) => row.charge },
                  { label: 'Paid', value: (row) => row.paid },
                ],
              );
              addToast('Claims CSV exported');
            }}
          >
            Export CSV
          </button>
        </div>
        <div className="controls">
          <label className="search-box">
            <Search size={15} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search claim, patient, insurer" />
          </label>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="All">All statuses</option>
            {claimStatuses.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Claim ID</th>
                <th>Patient</th>
                <th>Provider</th>
                <th>Department</th>
                <th>Submitted</th>
                <th>Status</th>
                <th>Charge</th>
                <th>Paid</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.id}</td>
                  <td>{entry.patient}</td>
                  <td>{entry.provider}</td>
                  <td>{entry.department}</td>
                  <td>{entry.submitted}</td>
                  <td>
                    <span className={statusClass(entry.status)}>{entry.status}</span>
                  </td>
                  <td>{formatCurrency(entry.charge)}</td>
                  <td>{formatCurrency(entry.paid)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function ReportsPage({ addToast }) {
  const [selectedMonth, setSelectedMonth] = useState(months[months.length - 1]);
  const [lastGenerated, setLastGenerated] = useState('Not generated yet');

  const report = useMemo(() => {
    const index = months.indexOf(selectedMonth);
    return {
      admissions: admissionsTrend[index]?.admissions ?? 0,
      discharges: admissionsTrend[index]?.discharges ?? 0,
      virtualVisits: telemedicine[index]?.virtual ?? telemedicine[0].virtual,
      claimRevenue: claims.slice(index * 12, index * 12 + 12).reduce((sum, row) => sum + row.paid, 0),
    };
  }, [selectedMonth]);

  return (
    <div className="page-grid">
      <section className="panel panel-wide print-target">
        <div className="panel-head row">
          <div>
            <h2>Executive Monthly Report</h2>
            <p>Printable one-page summary for leadership review</p>
          </div>
          <div className="button-row">
            <button
              className="action-btn secondary"
              onClick={() => {
                setLastGenerated(new Date().toLocaleString());
                addToast('Report snapshot generated');
              }}
            >
              Generate Snapshot
            </button>
            <button
              className="action-btn"
              onClick={() => {
                window.print();
                addToast('Print dialog opened');
              }}
            >
              Print View
            </button>
          </div>
        </div>

        <div className="controls">
          <select value={selectedMonth} onChange={(event) => setSelectedMonth(event.target.value)}>
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
          <p className="muted">Last generated: {lastGenerated}</p>
        </div>

        <div className="report-grid">
          <article>
            <h3>Admissions</h3>
            <p>{report.admissions}</p>
          </article>
          <article>
            <h3>Discharges</h3>
            <p>{report.discharges}</p>
          </article>
          <article>
            <h3>Virtual Visits</h3>
            <p>{report.virtualVisits}</p>
          </article>
          <article>
            <h3>Claim Revenue</h3>
            <p>{formatCurrency(report.claimRevenue)}</p>
          </article>
        </div>

        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={admissionsTrend}>
              <defs>
                <linearGradient id="gradientAdmissions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
              <XAxis dataKey="month" stroke="var(--axis)" />
              <YAxis stroke="var(--axis)" />
              <Tooltip />
              <Area type="monotone" dataKey="admissions" stroke="var(--accent)" fill="url(#gradientAdmissions)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

function AppShell() {
  const [theme, setTheme] = useState('dark');
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [syncTime, setSyncTime] = useState(new Date().toLocaleTimeString());
  const [signal, setSignal] = useState(0);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (toast) {
        setToast('');
      }
    }, 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  const kpis = useMemo(() => {
    const growth = 1 + signal * 0.01;
    const activePatients = Math.round(patientRegistry.length * growth + 12110);
    const monitored = patientRegistry.filter((item) => item.monitored).length;
    const highRisk = patientRegistry.filter((item) => item.risk === 'High').length;
    const totalPaid = claims.reduce((sum, row) => sum + row.paid, 0);
    return [
      { title: 'Total Patients', value: activePatients.toLocaleString(), trend: '+6.1%', Icon: Users },
      { title: 'Critical Risk', value: String(highRisk), trend: '+1.4%', Icon: HeartPulse },
      { title: 'Monitored Beds', value: String(monitored), trend: '+4.8%', Icon: Bed },
      { title: 'Claims Paid', value: formatCurrency(totalPaid), trend: '+5.2%', Icon: Wallet },
      { title: 'Emergency Queue', value: `${emergencyQueue.length} cases`, trend: '+2.2%', Icon: Activity },
      { title: 'Compliance', value: '98.6%', trend: '+0.9%', Icon: ShieldCheck },
    ];
  }, [signal]);

  const navItems = [
    { to: '/', label: 'Overview', Icon: LayoutDashboard },
    { to: '/patients', label: 'Patients', Icon: Users },
    { to: '/billing', label: 'Billing', Icon: Wallet },
    { to: '/reports', label: 'Reports', Icon: FileText },
  ];

  return (
    <div className="site-shell">
      <aside className="sidebar">
        <h1>Northstar Health</h1>
        <p>Operations Command Center</p>
        <nav>
          {navItems.map(({ to, label, Icon }) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Healthcare Prototype Website</p>
            <h2>Regional Operations Dashboard</h2>
          </div>
          <div className="button-row">
            <button
              className="action-btn secondary"
              onClick={() => {
                setSyncTime(new Date().toLocaleTimeString());
                setSignal((value) => (value + 1) % 9);
                setToast('Data synced from prototype dataset');
              }}
            >
              <ClipboardList size={15} />
              Refresh Data
            </button>
            <button className="action-btn secondary" onClick={() => setAlertsOpen((value) => !value)}>
              <Bell size={15} />
              Alerts ({alerts.length})
            </button>
            <button
              className="action-btn"
              onClick={() => {
                setTheme((value) => (value === 'dark' ? 'light' : 'dark'));
                setToast(`Theme switched to ${theme === 'dark' ? 'light' : 'dark'}`);
              }}
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </header>

        <p className="sync-meta">Last sync: {syncTime}</p>

        <Routes>
          <Route path="/" element={<OverviewPage kpis={kpis} />} />
          <Route path="/patients" element={<PatientsPage addToast={setToast} />} />
          <Route path="/billing" element={<BillingPage addToast={setToast} />} />
          <Route path="/reports" element={<ReportsPage addToast={setToast} />} />
        </Routes>
      </main>

      {alertsOpen && (
        <aside className="alerts-drawer">
          <div className="panel-head row">
            <h3>Operational Alerts</h3>
            <button className="text-btn" onClick={() => setAlertsOpen(false)}>
              Close
            </button>
          </div>
          <ul>
            {alerts.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </aside>
      )}

      {toast ? <div className="toast">{toast}</div> : null}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;