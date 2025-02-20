import React, { useState } from 'react';
import axios from 'axios';
import './Tab4.css';

interface EmailAnalysisResult {
  headers: Record<string, string>[];
  bodies: string[];
  urls: string[][];
  vendorAnalysis: Record<string, any>;
  maliciousUrls: string[];
  timestamp: string;
}

interface EmailLink {
  url: string;
  sender: string;
  subject: string;
  date: string;
}

interface ThreatAnalysis {
  url: string;
  status: 'malicious' | 'clean' | 'pending';
  sender: string;
  date: string;
}

export function Tab4() {
  const [analysisResult, setAnalysisResult] = useState<EmailAnalysisResult | null>(null);
  const [showLinksView, setShowLinksView] = useState(false);
  const [threats, setThreats] = useState<ThreatAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleCompleteInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://127.0.0.1:5000/api/email/complete-analysis');
      setAnalysisResult(response.data);
    } catch (err) {
      setError('Failed to fetch complete analysis');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSpecificInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://127.0.0.1:5000/api/email/vendor-analysis');
      setAnalysisResult(response.data);
    } catch (err) {
      setError('Failed to fetch vendor analysis');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExtractUrls = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://127.0.0.1:5000/api/email/malicious-urls');
      setAnalysisResult(response.data);
    } catch (err) {
      setError('Failed to extract URLs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getAllLinks = (): EmailLink[] => {
    if (!analysisResult) return [];
    
    const links: EmailLink[] = [];
    analysisResult.headers.forEach((header, index) => {
      analysisResult.urls[index].forEach(url => {
        links.push({
          url,
          sender: header.from,
          subject: header.subject,
          date: header.date
        });
      });
    });
    return links;
  };

  const handleThreatDetection = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/analyze-threats', {
        urls: getAllLinks()
      });
      setThreats(response.data.threats);
    } catch (err) {
      setError('Failed to analyze threats');
    } finally {
      setLoading(false);
    }
  };

  const LinksView = () => (
    <div className="links-dashboard">
      <div className="links-header-bar">
        <h2>All Links ({getAllLinks().length})</h2>
        <button 
          className="threat-detect-button"
          onClick={handleThreatDetection}
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Detect Threats'}
        </button>
      </div>

      {threats.length > 0 && (
        <div className="threats-section">
          <h3>Threat Analysis Results</h3>
          <div className="threats-list">
            {threats.map((threat, index) => (
              <div key={index} className={`threat-item ${threat.status}`}>
                <div className="threat-status">
                  {threat.status === 'malicious' ? '⚠️' : '✅'}
                </div>
                <div className="threat-details">
                  <div className="threat-url">{threat.url}</div>
                  <div className="threat-meta">
                    <span>From: {threat.sender}</span>
                    <span>Date: {new Date(threat.date).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="links-list">
        {getAllLinks().map((link, index) => (
          <div key={index} className="link-card">
            <div className="link-main">
              <div className="link-url">
                <span className="url-icon">🔗</span>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.url}
                </a>
              </div>
              <div className="link-meta">
                <div className="sender-info">
                  <span className="meta-label">From:</span>
                  <span className="meta-value">{link.sender}</span>
                </div>
                <div className="email-info">
                  <span className="meta-label">Subject:</span>
                  <span className="meta-value">{link.subject}</span>
                </div>
                <div className="date-info">
                  <span className="meta-label">Date:</span>
                  <span className="meta-value">
                    {new Date(link.date).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="app-container">
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>🛡️ SecureEmail</h2>
          <button className="toggle-sidebar" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>
        <nav className="sidebar-nav">
          <a href="#" className="nav-item active">
            <span className="nav-icon">📊</span>
            Dashboard
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">📧</span>
            Emails
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">🔍</span>
            Analysis
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">⚠️</span>
            Threats
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">⚙️</span>
            Settings
          </a>
        </nav>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <div className="header-content">
            <h1>Email Security Analysis</h1>
            <div className="user-section">
              <span className="notification-badge">🔔</span>
              <div className="user-profile">
                <span className="user-avatar">👤</span>
                <span className="user-name">Admin User</span>
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard-container">
          <div className="action-buttons">
            <button 
              className={`dashboard-button ${loading ? 'disabled' : ''}`}
              onClick={() => {
                setShowLinksView(false);
                handleCompleteInfo();
              }}
              disabled={loading}
            >
              <span className="button-icon">📊</span>
              Complete Info
            </button>
            <button 
              className={`dashboard-button ${loading ? 'disabled' : ''}`}
              onClick={() => setShowLinksView(true)}
              disabled={loading}
            >
              <span className="button-icon">🔗</span>
              Links
            </button>
          </div>

          {loading && (
            <div className="loading-overlay">
              <div className="loader"></div>
              <p>Processing...</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}
          
          {showLinksView ? (
            <LinksView />
          ) : (
            analysisResult && (
              <div className="dashboard-grid">
                {analysisResult.headers && (
                  <div className="email-dashboard">
                    <div className="email-list">
                      {analysisResult.headers.map((header, index) => (
                        <div key={index} className="email-item">
                          <div className="email-header">
                            <div className="sender-info">
                              <div className="avatar">
                                {header.from.split('@')[0].charAt(0).toUpperCase()}
                              </div>
                              <div className="sender-details">
                                <div className="email-subject">
                                  {header.subject || 'No Subject'}
                                </div>
                                <div className="sender-meta">
                                  <span className="sender-name">
                                    {header.from.split('<')[0].trim()}
                                  </span>
                                  <span className="meta-separator">•</span>
                                  <span className="meta-date">
                                    {new Date(header.date).toLocaleString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="email-body">
                            <div className="recipient-info">
                              <span className="meta-label">To:</span>
                              <span className="meta-value">{header.to}</span>
                            </div>
                            
                            <div className="email-content">
                              <div dangerouslySetInnerHTML={{ 
                                __html: analysisResult.bodies[index] 
                              }} />
                            </div>
                            
                            {analysisResult.urls[index].length > 0 && (
                              <div className="email-links">
                                <div className="links-header">
                                  <span className="links-icon">🔗</span>
                                  <span className="links-title">
                                    Links in this email ({analysisResult.urls[index].length})
                                  </span>
                                </div>
                                <div className="links-list">
                                  {analysisResult.urls[index].map((url, urlIndex) => (
                                    <a key={urlIndex} 
                                       href={url} 
                                       target="_blank" 
                                       rel="noopener noreferrer" 
                                       className="link-item">
                                      <span className="link-icon">🌐</span>
                                      <span className="link-url">{url}</span>
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {analysisResult.vendorAnalysis && (
                  <div className="dashboard-card">
                    <div className="card-header">
                      <h3>🛡️ Security Analysis</h3>
                      <button className="card-action">⋮</button>
                    </div>
                    <div className="card-content">
                      <pre className="json-content">
                        {JSON.stringify(analysisResult.vendorAnalysis, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
                
                {analysisResult.maliciousUrls && (
                  <div className="dashboard-card">
                    <div className="card-header">
                      <h3>⚠️ Threat Detection</h3>
                      <button className="card-action">⋮</button>
                    </div>
                    <div className="card-content">
                      {analysisResult.maliciousUrls.length > 0 ? (
                        <ul className="url-list">
                          {analysisResult.maliciousUrls.map((url, index) => (
                            <li key={index} className="malicious-url">{url}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="no-urls">No threats detected</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
}

export default Tab4; 