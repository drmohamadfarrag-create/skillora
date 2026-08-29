import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import pinoHttp from 'pino-http';
import { PrismaClient } from '@prisma/client';
import { Resend } from 'resend';

dotenv.config();

const app = express();
const db = new PrismaClient();
const PORT = Number(process.env.PORT || 4000);
const isProduction = process.env.NODE_ENV === 'production';
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

app.set('trust proxy', 1);
app.use(pinoHttp());
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || !isProduction) return callback(null, true);
    const allowed = (process.env.FRONTEND_URL || '').split(',').map(x => x.trim()).filter(Boolean);
    return allowed.includes(origin) ? callback(null, true) : callback(new Error('CORS_NOT_ALLOWED'));
  }
}));
app.use(express.json({ limit: '1mb' }));
app.get('/', (req, res) => {
  res.json({ status: 'SKILLORA API is running' });
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'TOO_MANY_REQUESTS' }
});

const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const randomToken = () => crypto.randomBytes(32).toString('base64url');
const makeAccessToken = user => jwt.sign(
  { sub: user.id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: '15m' }
);

function requireAuth(req, res, next) {
  try {
    req.user = jwt.verify(
      (req.headers.authorization || '').replace('Bearer ', ''),
      process.env.JWT_SECRET
    );
    next();
  } catch {
    return res.status(401).json({ error: 'UNAUTHORIZED' });
  }
}

async function sendEmail({ to, subject, html }) {
  console.log("EMAIL DEBUG START");
  console.log("EMAIL FROM:", process.env.EMAIL_FROM);
  console.log("RESEND KEY EXISTS:", Boolean(process.env.RESEND_API_KEY));
  console.log("SENDING TO:", to);

  if (!resend || !process.env.EMAIL_FROM) {
    console.error("EMAIL_PROVIDER_NOT_CONFIGURED");
    return false;
  }

  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html
    });

    console.log("RESEND RESULT:", JSON.stringify(result));

    if (result.error) {
      console.error("RESEND ERROR:", result.error);
      return false;
    }

    console.log("EMAIL SENT SUCCESSFULLY");
    return true;

  } catch (error) {
    console.error(
      "EMAIL SEND FAILED:",
      error.message || error
    );
    return false;
  }
}

  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html
    });

    console.log("RESEND_RESULT:", JSON.stringify(result));

    if (result.error) {
      throw new Error(
        typeof result.error === "string"
          ? result.error
          : result.error.message || JSON.stringify(result.error)
      );
    }

    return true;
  } catch (error) {
    console.error("EMAIL_SEND_FAILED:", error);
    return false;
  }
}

app.get('/healthz', async (req, res) => {
  try {
    await db.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  } catch {
    res.status(503).json({ status: 'degraded' });
  }
});

app.use('/api/auth', authLimiter);

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || String(password).length < 8) {
    return res.status(400).json({ error: 'INVALID_INPUT' });
  }
  if (await db.user.findUnique({ where: { email } })) {
    return res.status(409).json({ error: 'EMAIL_EXISTS' });
  }

  const user = await db.user.create({
    data: {
      name,
      email: String(email).toLowerCase().trim(),
      passwordHash: await bcrypt.hash(password, 12)
    }
  });

  const rawToken = randomToken();
  await db.emailVerificationToken.create({
    data: {
      userId: user.id,
      tokenHash: hash(rawToken),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    }
  });

  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${encodeURIComponent(rawToken)}`;
  await sendEmail({
    to: user.email,
    subject: 'Verify your SKILLORA account',
    html: `<p>Welcome to SKILLORA.</p><p><a href="${verificationUrl}">Verify your email</a></p>`
  });

  // Development fallback only. Never expose raw tokens in production.
  const response = {
    user: { id: user.id, email: user.email },
    verificationRequired: true
  };
  if (!isProduction && !resend) response.verificationToken = rawToken;
  res.status(201).json(response);
});

app.post('/api/auth/verify-email', async (req, res) => {
  const tokenHash = hash(req.body?.token || '');
  const record = await db.emailVerificationToken.findUnique({ where: { tokenHash } });
  if (!record || record.usedAt || record.expiresAt < new Date()) {
    return res.status(400).json({ error: 'INVALID_OR_EXPIRED_TOKEN' });
  }
  await db.$transaction([
    db.user.update({ where: { id: record.userId }, data: { emailVerified: true } }),
    db.emailVerificationToken.update({ where: { id: record.id }, data: { usedAt: new Date() } })
  ]);
  res.json({ verified: true });
});

app.post('/api/auth/login', async (req, res) => {
  const email = String(req.body?.email || '').toLowerCase().trim();
  const password = req.body?.password || '';
  const user = await db.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: 'INVALID_CREDENTIALS' });
  }
  if (!user.emailVerified) return res.status(403).json({ error: 'EMAIL_NOT_VERIFIED' });

  const refreshToken = randomToken();
  await db.refreshSession.create({
    data: {
      userId: user.id,
      tokenHash: hash(refreshToken),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
  });

  res.json({
    accessToken: makeAccessToken(user),
    refreshToken,
    user: { id: user.id, name: user.name, email: user.email }
  });
});

app.post('/api/auth/refresh', async (req, res) => {
  const tokenHash = hash(req.body?.refreshToken || '');
  const session = await db.refreshSession.findUnique({
    where: { tokenHash },
    include: { user: true }
  });
  if (!session || session.revokedAt || session.expiresAt < new Date()) {
    return res.status(401).json({ error: 'INVALID_REFRESH' });
  }

  await db.refreshSession.update({
    where: { id: session.id },
    data: { revokedAt: new Date() }
  });

  const refreshToken = randomToken();
  await db.refreshSession.create({
    data: {
      userId: session.userId,
      tokenHash: hash(refreshToken),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
  });

  res.json({ accessToken: makeAccessToken(session.user), refreshToken });
});

app.get('/api/lessons', requireAuth, async (req, res) => {
  res.json(await db.lesson.findMany({ orderBy: { sortOrder: 'asc' } }));
});

app.get('/api/progress', requireAuth, async (req, res) => {
  res.json(await db.learnerProgress.findMany({ where: { userId: req.user.sub } }));
});

app.get('/api/achievements', requireAuth, async (req, res) => {
  const completed = await db.learnerProgress.findMany({
    where: { userId: req.user.sub, status: 'COMPLETED' }
  });
  const done = completed.map(x => x.lessonId);
  res.json([
    { name: 'First Step', earned: done.length >= 1 },
    { name: 'Formula Builder', earned: done.includes('lesson-6') },
    { name: 'Halfway There', earned: done.length >= 9 },
    { name: 'Excel Ready', earned: done.length >= 17 }
  ]);
});

app.post('/api/certificates/issue', requireAuth, async (req, res) => {
  const completed = await db.learnerProgress.count({
    where: { userId: req.user.sub, status: 'COMPLETED' }
  });
  if (completed < 17) return res.status(400).json({ error: 'NOT_ELIGIBLE' });

  const certificate = await db.certificate.upsert({
    where: { userId: req.user.sub },
    update: {},
    create: {
      userId: req.user.sub,
      certificateId: `SKL-${new Date().getFullYear()}-${randomToken().slice(0, 10).toUpperCase()}`,
      verificationCode: randomToken().slice(0, 12).toUpperCase()
    }
  });
  res.status(201).json(certificate);
});

app.get('/api/certificates/verify/:code', async (req, res) => {
  const certificate = await db.certificate.findUnique({
    where: { verificationCode: req.params.code },
    include: { user: { select: { name: true } } }
  });
  if (!certificate) return res.status(404).json({ valid: false });

  res.json({
    valid: true,
    certificateId: certificate.certificateId,
    learner: certificate.user.name,
    issuedAt: certificate.issuedAt
  });
});

app.use((err, req, res, next) => {
  req.log?.error(err);
  res.status(err.message === 'CORS_NOT_ALLOWED' ? 403 : 500).json({
    error: err.message === 'CORS_NOT_ALLOWED' ? 'CORS_NOT_ALLOWED' : 'INTERNAL_SERVER_ERROR'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`SKILLORA API listening on ${PORT}`);
});
