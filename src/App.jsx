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
  Plus
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

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <BrainCircuit size={32} />
          <span>PredictiveInsight</span>
        </div>
        
        <nav className="nav-links">
          <div className="nav-item active">
            <LayoutDashboard size={20} />
            <span>Overview</span>
          </div>
          <div className="nav-item">
            <Database size={20} />
            <span>Dataset Explorer</span>
          </div>
          <div className="nav-item">
            <TrendingUp size={20} />
            <span>Market Trends</span>
          </div>
          <div className="nav-item">
            <MapPin size={20} />
            <span>Geospatial</span>
          </div>
        </nav>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button className="predict-btn" style={{ padding: '0.5rem', fontSize: '0.8rem' }} onClick={handleExport}>
            <Download size={14} style={{ marginRight: 6 }} /> 
            {isExporting ? 'Exporting...' : 'Export Report'}
          </button>
          <div className="nav-item">
            <Settings size={20} />
            <span>Settings</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content" ref={dashboardRef}>
        <header className="header">
          <div>
            <h1>Predictive Analytics Dashboard</h1>
            <p style={{ color: 'var(--text-muted)' }}>Advanced Model v2.4 • Analysis of US PERM Dataset</p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div className="user-profile">
              <User size={18} />
              <span>Samba V.</span>
            </div>
            <Bell size={20} className="nav-item" />
          </div>
        </header>

        {/* Top Insights Row */}
        <div className="dashboard-grid">
          {[
            { label: 'Dataset Size', value: '374,362', trend: 'Total Records', up: true, icon: Database },
            { label: 'Model Confidence', value: '96.2%', trend: '+0.4%', up: true, icon: BrainCircuit },
            { label: 'Top Sector', value: 'IT / Tech', trend: '34% Share', up: true, icon: Briefcase },
            { label: 'Approval Avg', value: '82.4%', trend: 'Historical', up: true, icon: FileCheck },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card stat-card"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span className="stat-label">{stat.label}</span>
                <stat.icon size={18} style={{ color: 'var(--primary)' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <span className="stat-value">{stat.value}</span>
                <span className={stat.up ? 'trend-up' : 'trend-down'} style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                  {stat.trend}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Analytics Section */}
        <div className="prediction-panel">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Historical Trends */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ height: '300px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>Historical Approval Trends</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="nav-item" style={{ fontSize: '0.7rem', padding: '4px 8px' }}>Monthly</button>
                  <button className="nav-item" style={{ fontSize: '0.7rem', padding: '4px 8px' }}>Yearly</button>
                </div>
              </div>
              <div style={{ height: '220px' }}>
                <Line data={historicalData} options={chartOptions} />
              </div>
            </motion.div>

            {/* Feature Importance & State Distribution */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ height: '250px' }}>
                <h4>Feature Impact (SHAP)</h4>
                <div style={{ height: '180px', marginTop: '1rem' }}>
                  <Bar 
                    data={importanceData} 
                    options={{
                      ...chartOptions,
                      indexAxis: 'y',
                    }} 
                  />
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

          {/* Prediction Input Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card"
            style={{ position: 'sticky', top: '2rem', height: 'fit-content' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '10px' }}>
                  <BrainCircuit size={20} color="white" />
                </div>
                <h3>Profile Predictor</h3>
              </div>
              <button className="nav-item" style={{ padding: '6px' }} title="Compare Profiles">
                <Plus size={16} />
              </button>
            </div>
            
            <div className="form-group">
              <label><Briefcase size={14} style={{ marginRight: 6 }} /> Economic Sector</label>
              <select value={formData.sector} onChange={e => setFormData({...formData, sector: e.target.value})}>
                <option>IT</option>
                <option>Aerospace</option>
                <option>Advanced Mfg</option>
                <option>Finance</option>
                <option>Education</option>
              </select>
            </div>

            <div className="form-group">
              <label>Education Level</label>
              <select value={formData.education} onChange={e => setFormData({...formData, education: e.target.value})}>
                <option>High School</option>
                <option>Bachelor's</option>
                <option>Master's</option>
                <option>Doctorate</option>
              </select>
            </div>

            <div className="form-group">
              <label>Annual Wage (USD)</label>
              <input type="number" value={formData.wage} onChange={e => setFormData({...formData, wage: parseInt(e.target.value)})} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Experience</label>
                <input type="number" value={formData.experience} onChange={e => setFormData({...formData, experience: parseInt(e.target.value)})} />
              </div>
              <div className="form-group">
                <label>Region</label>
                <select value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})}>
                  <option>Northeast</option>
                  <option>South</option>
                  <option>Midwest</option>
                  <option>West</option>
                </select>
              </div>
            </div>

            <button className="predict-btn" onClick={handlePredict} disabled={isPredicting}>
              {isPredicting ? 'Calculating Probabilities...' : 'Run Analysis'}
            </button>

            <AnimatePresence>
              {prediction && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '20px', border: '1px solid rgba(99, 102, 241, 0.2)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Score Probability</p>
                      <h2 style={{ fontSize: '2.5rem' }}>{(prediction * 100).toFixed(1)}%</h2>
                    </div>
                    <div style={{ width: '80px', height: '80px', position: 'relative' }}>
                      <svg viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                        <motion.path 
                          initial={{ strokeDasharray: '0, 100' }}
                          animate={{ strokeDasharray: `${prediction * 100}, 100` }}
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                          fill="none" 
                          stroke="var(--primary)" 
                          strokeWidth="3" 
                        />
                      </svg>
                    </div>
                  </div>
                  <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <button className="nav-item" style={{ flex: 1, justifyContent: 'center', fontSize: '0.75rem' }}>
                      <Copy size={12} style={{ marginRight: 6 }} /> Copy Result
                    </button>
                    <button className="nav-item" style={{ flex: 1, justifyContent: 'center', fontSize: '0.75rem' }}>
                      <TrendingUp size={12} style={{ marginRight: 6 }} /> Insights
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default App;
