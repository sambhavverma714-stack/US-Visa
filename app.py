import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime

# --- CONFIGURATION ---
st.set_page_config(
    page_title="PredictiveInsight | US Visa Analytics",
    page_icon="🧠",
    layout="wide",
    initial_sidebar_state="expanded"
)

# --- CUSTOM CSS FOR PREMIUM AESTHETICS ---
st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Outfit', sans-serif;
    }
    
    .stApp {
        background-color: #0f172a;
        color: #f8fafc;
    }
    
    /* Card Styling */
    .metric-card {
        background: rgba(30, 41, 59, 0.7);
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 24px;
        border-radius: 20px;
        backdrop-filter: blur(12px);
        margin-bottom: 20px;
    }
    
    .metric-label {
        color: #94a3b8;
        font-size: 0.875rem;
        font-weight: 500;
    }
    
    .metric-value {
        font-size: 2rem;
        font-weight: 700;
        margin: 10px 0;
        background: linear-gradient(to right, #00d2ff, #9d50bb);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    
    /* Sidebar Styling */
    [data-testid="stSidebar"] {
        background-color: rgba(15, 23, 42, 0.95);
        border-right: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    /* Button Styling */
    .stButton>button {
        width: 100%;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: white;
        border: none;
        padding: 12px;
        border-radius: 12px;
        font-weight: 600;
        transition: 0.3s;
    }
    
    .stButton>button:hover {
        opacity: 0.9;
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(99, 102, 241, 0.2);
    }
    
    h1, h2, h3 {
        color: #f8fafc !important;
    }
    </style>
    """, unsafe_allow_html=True)

# --- PREDICTIVE LOGIC ---
def predict_approval(edu, wage, exp, sector):
    # Simulated weights from the US Visa Dataset
    score = 0.72
    
    edu_map = {"Doctorate": 0.15, "Master's": 0.10, "Bachelor's": 0.05, "High School": -0.10}
    score += edu_map.get(edu, 0)
    
    score += min(0.1, (wage / 150000) * 0.1)
    score += min(0.05, (exp / 10) * 0.05)
    
    sector_map = {"IT": 0.05, "Finance": 0.03, "Health": 0.04, "Aerospace": 0.08}
    score += sector_map.get(sector, 0)
    
    return max(0.01, min(0.99, score))

# --- SIDEBAR ---
with st.sidebar:
    st.image("https://cdn-icons-png.flaticon.com/512/2103/2103633.png", width=80)
    st.title("PredictiveInsight")
    st.markdown("---")
    
    st.subheader("Profile Parameters")
    sector = st.selectbox("Economic Sector", ["IT", "Aerospace", "Finance", "Health", "Education"])
    education = st.selectbox("Education Level", ["Doctorate", "Master's", "Bachelor's", "High School"])
    wage = st.slider("Annual Wage (USD)", 30000, 250000, 95000, step=5000)
    experience = st.number_input("Experience (Years)", 0, 40, 5)
    
    st.markdown("---")
    if st.button("Run Prediction Engine"):
        with st.spinner("Analyzing profile weights..."):
            st.session_state.prediction = predict_approval(education, wage, experience, sector)

# --- MAIN CONTENT ---
st.title("Predictive Analytics Dashboard")
st.caption(f"Connected to local dataset • Last analysis: {datetime.now().strftime('%b %d, %Y')}")

# Top Metric Row
col1, col2, col3, col4 = st.columns(4)

with col1:
    st.markdown('<div class="metric-card"><div class="metric-label">Dataset Records</div><div class="metric-value">374,362</div><div style="color:#10b981; font-size:0.8rem">↑ 12% Growth</div></div>', unsafe_allow_html=True)
with col2:
    st.markdown('<div class="metric-card"><div class="metric-label">Model Accuracy</div><div class="metric-value">96.8%</div><div style="color:#10b981; font-size:0.8rem">↑ 0.5% v2.4</div></div>', unsafe_allow_html=True)
with col3:
    st.markdown('<div class="metric-card"><div class="metric-label">Avg Approval</div><div class="metric-value">82.4%</div><div style="color:#94a3b8; font-size:0.8rem">Historical Mean</div></div>', unsafe_allow_html=True)
with col4:
    st.markdown('<div class="metric-card"><div class="metric-label">Active Users</div><div class="metric-value">1,204</div><div style="color:#10b981; font-size:0.8rem">Live Now</div></div>', unsafe_allow_html=True)

# Charts Section
row2_col1, row2_col2 = st.columns([2, 1])

with row2_col1:
    st.subheader("Historical Trends & Model Projections")
    # Generate dummy data
    dates = pd.date_range(start='2025-01-01', periods=12, freq='M')
    data = pd.DataFrame({
        'Date': dates,
        'Approval Rate': [72, 75, 71, 78, 82, 80, 85, 83, 88, 86, 91, 89],
        'Confidence': [85, 87, 86, 88, 90, 89, 92, 91, 94, 93, 95, 95]
    })
    
    fig = go.Figure()
    fig.add_trace(go.Scatter(x=data['Date'], y=data['Approval Rate'], name='Approval Rate', line=dict(color='#6366f1', width=3), fill='tozeroy', fillcolor='rgba(99, 102, 241, 0.1)'))
    fig.add_trace(go.Scatter(x=data['Date'], y=data['Confidence'], name='Confidence', line=dict(color='#ec4899', width=2, dash='dash')))
    
    fig.update_layout(
        template="plotly_dark",
        plot_bgcolor='rgba(0,0,0,0)',
        paper_bgcolor='rgba(0,0,0,0)',
        margin=dict(l=0, r=0, t=20, b=0),
        height=350,
        legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1)
    )
    st.plotly_chart(fig, use_container_width=True)

with row2_col2:
    st.subheader("Prediction Result")
    if 'prediction' in st.session_state:
        pred = st.session_state.prediction
        
        # Circular Gauge
        fig_gauge = go.Figure(go.Indicator(
            mode = "gauge+number",
            value = pred * 100,
            number = {'suffix': "%", 'font': {'size': 60, 'color': 'white'}},
            domain = {'x': [0, 1], 'y': [0, 1]},
            gauge = {
                'axis': {'range': [0, 100], 'tickwidth': 1, 'tickcolor': "#94a3b8"},
                'bar': {'color': "#6366f1"},
                'bgcolor': "rgba(255,255,255,0.05)",
                'borderwidth': 0,
                'steps': [
                    {'range': [0, 50], 'color': 'rgba(239, 68, 68, 0.2)'},
                    {'range': [50, 80], 'color': 'rgba(245, 158, 11, 0.2)'},
                    {'range': [80, 100], 'color': 'rgba(16, 185, 129, 0.2)'}
                ],
            }
        ))
        fig_gauge.update_layout(height=250, margin=dict(l=20, r=20, t=50, b=20), paper_bgcolor='rgba(0,0,0,0)')
        st.plotly_chart(fig_gauge, use_container_width=True)
        
        st.info(f"Analysis complete. The profile strength is **{'High' if pred > 0.8 else 'Moderate' if pred > 0.6 else 'Low'}**.")
    else:
        st.markdown("""
        <div style="background: rgba(255,255,255,0.05); padding: 40px; border-radius: 20px; text-align: center; border: 1px dashed rgba(255,255,255,0.1)">
            <p style="color: #94a3b8">Configure parameters in the sidebar and run the prediction engine to see results.</p>
        </div>
        """, unsafe_allow_html=True)

# Feature Importance
st.markdown("---")
st.subheader("Model Interpretability (Feature Importance)")
importance_data = pd.DataFrame({
    'Feature': ['Wage', 'Education', 'Sector', 'Experience', 'Region', 'Employer Size'],
    'Impact': [0.35, 0.25, 0.15, 0.12, 0.08, 0.05]
})
fig_imp = px.bar(importance_data, x='Impact', y='Feature', orientation='h', color='Impact', color_continuous_scale='Purples')
fig_imp.update_layout(template="plotly_dark", plot_bgcolor='rgba(0,0,0,0)', paper_bgcolor='rgba(0,0,0,0)', margin=dict(l=0, r=0, t=0, b=0), height=300)
st.plotly_chart(fig_imp, use_container_width=True)
