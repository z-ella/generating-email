import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';
import nodemailer from 'nodemailer';
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});


app.post('/generate-email', async (req, res) => {
  console.log('Received body:', req.body);
  const { sender, recipient, subject, tone, purpose, keyPoints, length } = req.body;

  if (!subject || !tone || !purpose) {
    return res.status(400).json({ error: 'Subject, tone, and purpose are required fields' });
  }

  const formattedKeyPoints = keyPoints
    ? keyPoints.split('\n').map(point => `- ${point}`).join('\n')
    : '';

  const prompt = `
You are an AI assistant that generates professional emails.
Write an email (and nothing else) with the following details:
- sender (replaces [your name]) : ${sender} 
- Recipient: ${recipient}
- Subject: ${subject}
- Tone: ${tone}
- Length: ${length}
- Purpose: ${purpose}
${formattedKeyPoints ? `- Key Points:\n${formattedKeyPoints}` : ''}

Respond only with the email body, not with explanations or notes.
Include a proper email structure with greeting and closing.
`;

  try {
    const response = await groq.chat.completions.create({
      model: 'llama3-70b-8192',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    });

    console.log('AI response received');

    const emailText = response.choices[0]?.message?.content;

    if (!emailText) {
      throw new Error('No content in AI response');
    }

    res.json({
      success: true,
      email: emailText.trim(),
    });
  } catch (err) {
    console.error('AI API error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to generate email',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
});


app.post('/send-email', upload.single('attachment'), async (req, res) => {
  const { recipient, subject, emailBody } = req.body;

  if (!recipient || !subject || !emailBody) {
    return res.status(400).json({ error: 'Missing recipient, subject, or email body.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"AI Email Generator" <${process.env.EMAIL_USER}>`,
      to: recipient,
      subject,
      text: emailBody,
      attachments: req.file
        ? [{
            filename: req.file.originalname,
            content: req.file.buffer
          }]
        : []
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (err) {
    console.error('Send email error:', err);
    res.status(500).json({ success: false, error: 'Failed to send email.' });
  }
});



app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
