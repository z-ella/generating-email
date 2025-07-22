import React, { useState } from 'react';

export default function AIEmailGenerator() {
  const [formData, setFormData] = useState({
    sender: '',
    recipient_name: '',
    recipient: '',
    subject: '',
    tone: 'professional',
    purpose: '',
    keyPoints: '',
    length: 'medium',
    attachment: null
  });
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [file, setFile] = useState(null);
  const [copied, setCopied] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setCopied(false);

    try {
     const response = await fetch('/generate-email', {  
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(formData),
});


      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      setGeneratedEmail(data.email);
    } catch (error) {
      console.error('Error generating email:', error);
      setGeneratedEmail('Oops! Something went wrong while generating the email.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendEmail = async () => {
  const formDataToSend = new FormData();
  formDataToSend.append("recipient", formData.recipient);
  formDataToSend.append("subject", formData.subject);
  formDataToSend.append("emailBody", generatedEmail);
  if (file) {
    formDataToSend.append("attachment", file);
  }

  try {
    const res = await fetch("http://localhost:5000/send-email", {
      method: "POST",
      body: formDataToSend,
    });
    const data = await res.json();
    if (data.success) {
      alert("✅ Email sent!");
    } else {
      alert("❌ Failed to send email.");
    }
  } catch (err) {
    console.error(err);
    alert("❌ An error occurred.");
  }
};



  const getResponsiveStyles = () => {
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth < 1024;

  return {
    container: {
      minHeight: '100vh',
      backgroundColor: '#000000ff', 
      padding: isMobile ? '10px' : '20px',
      fontFamily: 'Arial, sans-serif'
    },
    maxWidth: {
      maxWidth: 'flex',
      margin: '0 auto'
    },
    header: {
      textAlign: 'center',
      marginBottom: isMobile ? '20px' : '40px',
      paddingTop: isMobile ? '20px' : '40px'
    },
    icon: {
      background: 'linear-gradient(45deg, #ffffffff 0%, #ffffffff 100%)',
      padding: isMobile ? '12px' : '15px',
      borderRadius: '50%',
      display: 'inline-block',
      marginBottom: '20px',
      fontSize: isMobile ? '20px' : '24px'
    },
    title: {
      fontSize: isMobile ? '32px' : isTablet ? '40px' : '48px',
      fontWeight: 'bold',
      color: '#f1f5f9',
      marginBottom: '16px'
    },
    subtitle: {
      fontSize: isMobile ? '16px' : '20px',
      color: '#94a3b8',
      maxWidth: '600px',
      margin: '0 auto',
      padding: isMobile ? '0 10px' : '0'
    },
    grid: {
      display: 'flex',
      flexDirection: isTablet ? 'column' : 'row',
      gap: isMobile ? '20px' : '30px',
      flexWrap: 'wrap'
    },
    card: {
      flex: 1,
      backgroundColor: '#1c1c1cff',
      borderRadius: isMobile ? '16px' : '24px',
      padding: isMobile ? '20px' : '40px',
      border: '1px solid #4c4c4dff',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
      minWidth: 0
    },
    cardTitle: {
      fontSize: isMobile ? '20px' : '24px',
      fontWeight: 'bold',
      color: '#f1f5f9',
      marginBottom: isMobile ? '20px' : '30px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    formGroup: {
      marginBottom: isMobile ? '16px' : '24px'
    },
    label: {
      display: 'block',
      color: '#cbd5e1',
      fontSize: isMobile ? '12px' : '14px',
      fontWeight: '500',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: isMobile ? '10px 14px' : '12px 16px',
      backgroundColor: '#1d1d1dff',
      border: '1px solid #ffffffff',
      borderRadius: '12px',
      color: '#f8fafc',
      fontSize: isMobile ? '14px' : '16px',
      outline: 'none',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box'
    },
    textarea: {
      width: '100%',
      padding: isMobile ? '10px 14px' : '12px 16px',
      backgroundColor: '#262627ff',
      border: '1px solid #ffffffff',
      borderRadius: '12px',
      color: '#f8fafc',
      fontSize: isMobile ? '14px' : '16px',
      outline: 'none',
      resize: 'none',
      minHeight: isMobile ? '80px' : '100px',
      boxSizing: 'border-box'
    },
    select: {
      width: '100%',
      padding: isMobile ? '10px 14px' : '12px 16px',
      backgroundColor: '#1b1b1bff',
      border: '1px solid #ffffffff',
      borderRadius: '12px',
      color: '#ffffffff',
      fontSize: isMobile ? '14px' : '16px',
      outline: 'none',
      boxSizing: 'border-box'
    },
    gridTwo: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gap: isMobile ? '8px' : '16px'
    },
    button: {
      width: '100%',
      background: 'linear-gradient(45deg, #000000ff 0%, #000000ff 100%)',
      color: 'white',
      fontWeight: '600',
      padding: isMobile ? '14px 20px' : '16px 24px',
      borderRadius: '12px',
      border: 'none',
      fontSize: isMobile ? '14px' : '16px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      transition: 'all 0.3s ease'
    },
    buttonDisabled: {
      background: '#334155',
      cursor: 'not-allowed'
    },
    outputHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: isMobile ? '16px' : '24px',
      flexDirection: isMobile ? 'column' : 'row',
      gap: isMobile ? '10px' : '0'
    },
    actionButtons: {
      display: 'flex',
      gap: '8px'
    },
    actionButton: {
      background: '#334155',
      color: '#ffffffff',
      padding: isMobile ? '6px 10px' : '8px 12px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: isMobile ? '12px' : '14px',
      transition: 'all 0.2s ease'
    },
    output: {
      backgroundColor: '#0f172a',
      borderRadius: '12px',
      padding: isMobile ? '16px' : '24px',
      minHeight: isMobile ? '300px' : '400px',
      border: '1px solid #334155',
      overflowY: 'auto'
    },
    placeholder: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      textAlign: 'center'
    },
    placeholderIcon: {
      background: 'linear-gradient(45deg, #3b3b3bff 0%, #434344ff 100%)',
      padding: isMobile ? '12px' : '16px',
      borderRadius: '50%',
      marginBottom: '16px',
      opacity: '0.7',
      fontSize: isMobile ? '24px' : '32px'
    },
    email: {
      color: '#ffffffff',
      whiteSpace: 'pre-wrap',
      fontFamily: 'monospace',
      fontSize: isMobile ? '13px' : '15px',
      lineHeight: '1.6'
    },
    footer: {
      textAlign: 'center',
      marginTop: isMobile ? '30px' : '48px',
      paddingBottom: isMobile ? '20px' : '32px',
      color: '#64748b',
      fontSize: '13px'
    }
  };
};

  const styles = getResponsiveStyles();

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.icon}></div>
          <h1 style={styles.title}>AI Email Generator</h1>
          <p style={styles.subtitle}>
            Craft professional, personalized emails in seconds with the power of AI
          </p>
        </div>
   
        <div style={styles.grid}>
          {/* Input Form */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>
              📧 Email Details
            </h2>
            
            <div>
              <div style={styles.formGroup}>
                <label style={styles.label}>👤 sender Name</label>
                <input
                  type="text"
                  name="sender"
                  value={formData.sender}
                  onChange={handleInputChange}
                  placeholder="your name"
                  style={styles.input}
                />

              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>👤 Recipient Name</label>
                <input
                  type="text"
                  name="recipient_name"
                  value={formData.recipient_name}
                  onChange={handleInputChange}
                  placeholder="name of the recipient"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>👤 Recipient email</label>
                <input
                  type="text"
                  name="recipient"
                  value={formData.recipient}
                  onChange={handleInputChange}
                  placeholder="recipient@example.com"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Subject (reason for the email)"
                  style={styles.input}
                />
              </div>

              <div style={styles.gridTwo}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Tone</label>
                  <select
                    name="tone"
                    value={formData.tone}
                    onChange={handleInputChange}
                    style={styles.select}
                  >
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly</option>
                    <option value="formal">Formal</option>
                    <option value="casual">Casual</option>
                    <option value="persuasive">Persuasive</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Length</label>
                  <select
                    name="length"
                    value={formData.length}
                    onChange={handleInputChange}
                    style={styles.select}
                  >
                    <option value="short">Short</option>
                    <option value="medium">Medium</option>
                    <option value="long">Long</option>
                  </select>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Purpose of the email</label>
                <input
                  type="text"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  placeholder="reason for the email"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Key Points (one per line)</label>
                <textarea
                  name="keyPoints"
                  value={formData.keyPoints}
                  onChange={handleInputChange}
                  placeholder="Project timeline discussion&#10;Budget considerations&#10;Team assignments"
                  style={styles.textarea}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>📎 Attach File</label>
                <input
                  type="file"
                  name="attachment"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={styles.input}
                />
              </div>


              <button
                onClick={handleGenerate}
                disabled={isGenerating || !formData.subject || !formData.purpose}
                style={{
                  ...styles.button,
                  ...(isGenerating || !formData.subject || !formData.purpose ? styles.buttonDisabled : {})
                }}
              >
                {isGenerating ? (
                  <>🔄 Generating...</>
                ) : (
                  <>⚡ Generate Email</>
                )}
              </button>
            </div>
          </div>

          {/* Generated Email Output */}
          <div style={styles.card}>
            <div style={styles.outputHeader}>
              <h2 style={styles.cardTitle}>
                📨 Generated Email
              </h2>
              
              {generatedEmail && (
                <div style={styles.actionButtons}>
                  <button
                    onClick={handleCopy}
                    style={styles.actionButton}
                    title="copy to clipboard"
                  >
                    📋 {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                onClick={handleSendEmail}
                style={styles.actionButton}
                title="send email"
              >
                📤 Send Email
              </button>
                </div>
              )}
            </div>

            <div style={styles.output}>
              {generatedEmail ? (
                <pre style={styles.email}>{generatedEmail}</pre>
              ) : (
                <div style={styles.placeholder}>
                  <div style={styles.placeholderIcon}>📧</div>
                  <p style={{color: '#cbd5e1', fontSize: '18px', marginBottom: '8px'}}>
                    Your AI-generated email will appear here once you are done filling the parameters and launch the generation
                  </p>
                  <p style={{color: '#94a3b8', fontSize: '14px'}}>
                    Fill in the details and click "Generate Email" to get started
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p style={{color: '#cbd5e1', fontSize: '14px'}}>
            Create professional emails in seconds using our AMAZING ai tool
          </p>
        </div>
      </div>
    </div>
  );
}
