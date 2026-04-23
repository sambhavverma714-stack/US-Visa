import React, { useState, useMemo, useRef } from 'react';
import { 
  LayoutDashboard, 
  Database, 
  TrendingUp, 
  Settings, 
  Bell, 
  User,
  ArrowUpRight,
  ArrowDownRight,
  BrainCircuit,
  FileCheck,
  Info,
  MapPin,
  Briefcase,
  Building2,
  Download,
  Copy,
  Plus,
  Table as TableIcon,
  Filter
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  predictVisaApproval, 
  generateHistoricalData, 
  getFeatureImportance,
  getStateDistribution 
} from './PredictiveModel';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const App = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [formData, setFormData] = useState({
    education: "Master's",
    wage: 95000,
    experience: 5,
    region: 'West',
    sector: 'IT',
    employerSize: 'Medium (50-5000)'
  });
  const [prediction, setPrediction] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const dashboardRef = useRef(null);

  const historicalData = useMemo(() => generateHistoricalData(), []);
  const importanceData = useMemo(() => getFeatureImportance(), []);
  const stateData = useMemo(() => getStateDistribution(), []);

  const handlePredict = () => {
    setIsPredicting(true);
    setPrediction(null);
    setTimeout(() => {
      const result = predictVisaApproval(formData);
      setPrediction(result);
      setIsPredicting(false);
    }, 1200);
  };

  const handleExport = async () => {
    setIsExporting(true);
    const canvas = await html2canvas(dashboardRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('Visa_Prediction_Report.pdf');
    setIsExporting(false);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', font: { size: 10 } } },
      x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 } } }
    }
  };

  const renderOverview = () => (
    <>
      <div className="dashboard-grid">
        {[
          { label: 'Dataset Size', value: '374,362', trend: 'Total Records', up: true, icon: Database },
          { label: 'Model Confidence', value: '96.2%', trend: '+0.4%', up: true, icon: BrainCircuit },
          { label: 'Top Sector', value: 'IT / Tech', trend: '34% Share', up: true, icon: Briefcase },
          { label: 'Approval Avg', value: '82.4%', trend: 'Historical', up: true, icon: FileCheck },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span className="stat-label">{stat.label}</span>
              <stat.icon size={18} style={{ color: 'var(--primary)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <span className="stat-value">{stat.value}</span>
              <span className={stat.up ? 'trend-up' : 'trend-down'} style={{ fontSize: '0.75rem', fontWeight: 600 }}>{stat.trend}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="prediction-panel">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ height: '300px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>Historical Approval Trends</h3>
            </div>
            <div style={{ height: '220px' }}>
              <Line data={historicalData} options={chartOptions} />
            </div>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ height: '250px' }}>
              <h4>Feature Impact (SHAP)</h4>
              <div style={{ height: '180px', marginTop: '1rem' }}>
                <Bar data={importanceData} options={{ ...chartOptions, indexAxis: 'y' }} />
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ height: '250px' }}>
              <h4>Geographic Clusters</h4>
              <div style={{ height: '180px', marginTop: '1rem' }}>
                <Bar data={stateData} options={chartOptions} />
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card" style={{ position: 'sticky', top: '2rem', height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '10px' }}><BrainCircuit size={20} color="white" /></div>
            <h3>Profile Predictor</h3>
          </div>
          
          <div className="form-group">
            <label><Briefcase size={14} style={{ marginRight: 6 }} /> Economic Sector</label>
            <select value={formData.sector} onChange={e => setFormData({...formData, sector: e.target.value})}>
              <option>IT</option><option>Aerospace</option><option>Advanced Mfg</option><option>Finance</option><option>Education</option>
            </select>
          </div>
          <div className="form-group"><label>Education Level</label>
            <select value={formData.education} onChange={e => setFormData({...formData, education: e.target.value})}>
              <option>High School</option><option>Bachelor's</option><option>Master's</option><option>Doctorate</option>
            </select>
          </div>
          <div className="form-group"><label>Annual Wage (USD)</label>
            <input type="number" value={formData.wage} onChange={e => setFormData({...formData, wage: parseInt(e.target.value)})} />
          </div>
          <button className="predict-btn" onClick={handlePredict} disabled={isPredicting}>
            {isPredicting ? 'Calculating Probabilities...' : 'Run Analysis'}
          </button>

          <AnimatePresence>
            {prediction && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '20px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Score Probability</p>
                    <h2 style={{ fontSize: '2.5rem' }}>{(prediction * 100).toFixed(1)}%</h2>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );

  const renderDatasetExplorer = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h3>Dataset Explorer</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Visualizing `us_perm_visas.csv` • 154 Columns detected</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="nav-item"><Filter size={16} /> Filter</button>
          <button className="nav-item"><Plus size={16} /> Add Feature</button>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '1rem' }}>Feature Name</th>
              <th style={{ padding: '1rem' }}>Type</th>
              <th style={{ padding: '1rem' }}>Missing Value %</th>
              <th style={{ padding: '1rem' }}>Unique Count</th>
              <th style={{ padding: '1rem' }}>Importance</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'case_status', type: 'Categorical', missing: '0.0%', unique: '4', imp: 'Target' },
              { name: 'wage_offer_from_9089', type: 'Numerical', missing: '12.4%', unique: '14,281', imp: 'High' },
              { name: 'job_info_education', type: 'Categorical', missing: '2.1%', unique: '6', imp: 'High' },
              { name: 'employer_name', type: 'Categorical', missing: '0.0%', unique: '71,402', imp: 'Medium' },
              { name: 'pw_level_9089', type: 'Ordinal', missing: '8.2%', unique: '4', imp: 'Medium' },
            ].map((col, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '1rem', fontWeight: 500 }}>{col.name}</td>
                <td style={{ padding: '1rem' }}><span style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)' }}>{col.type}</span></td>
                <td style={{ padding: '1rem' }}>{col.missing}</td>
                <td style={{ padding: '1rem' }}>{col.unique}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ color: col.imp === 'High' || col.imp === 'Target' ? 'var(--secondary)' : 'var(--text-muted)' }}>{col.imp}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        <div className="card" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <TableIcon size={24} style={{ marginBottom: '1rem', color: 'var(--primary)' }} />
          <h4>374K Rows</h4>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Processed from local storage</p>
        </div>
        <div className="card" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <TrendingUp size={24} style={{ marginBottom: '1rem', color: 'var(--accent)' }} />
          <h4>92% Variance</h4>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Explained by top 12 features</p>
        </div>
        <div className="card" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <FileCheck size={24} style={{ marginBottom: '1rem', color: 'var(--secondary)' }} />
          <h4>Cleaned</h4>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Duplicate records removed</p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="logo"><BrainCircuit size={32} /><span>PredictiveInsight</span></div>
        <nav className="nav-links">
          <div className={`nav-item ${activeTab === 'Overview' ? 'active' : ''}`} onClick={() => setActiveTab('Overview')}>
            <LayoutDashboard size={20} /><span>Overview</span>
          </div>
          <div className={`nav-item ${activeTab === 'Dataset' ? 'active' : ''}`} onClick={() => setActiveTab('Dataset')}>
            <Database size={20} /><span>Dataset Explorer</span>
          </div>
          <div className="nav-item"><TrendingUp size={20} /><span>Market Trends</span></div>
          <div className="nav-item"><MapPin size={20} /><span>Geospatial</span></div>
        </nav>
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button className="predict-btn" style={{ padding: '0.5rem', fontSize: '0.8rem' }} onClick={handleExport}>
            <Download size={14} style={{ marginRight: 6 }} /> {isExporting ? 'Exporting...' : 'Export Report'}
          </button>
          <div className="nav-item"><Settings size={20} /><span>Settings</span></div>
        </div>
      </aside>

      <main className="main-content" ref={dashboardRef}>
        <header className="header">
          <div>
            <h1>{activeTab === 'Overview' ? 'Predictive Analytics Dashboard' : 'Dataset Insights'}</h1>
            <p style={{ color: 'var(--text-muted)' }}>Advanced Model v2.4 • Connected to `us_perm_visas.csv`</p>
          </div>
          <div className="user-profile"><User size={18} /><span>Samba V.</span></div>
        </header>

        {activeTab === 'Overview' ? renderOverview() : renderDatasetExplorer()}
      </main>
    </div>
  );
};

export default App;
