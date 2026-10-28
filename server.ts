import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const USERS_CSV = path.join(DATA_DIR, 'users_sheet.csv');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');
const BOOKINGS_CSV = path.join(DATA_DIR, 'bookings_sheet.csv');
const TRAINS_FILE = path.join(DATA_DIR, 'trains.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial default data
const DEFAULT_USERS = [
  { id: 'usr_1', name: 'Rahul Sharma', email: 'rahul@gmail.com', password: 'pass', role: 'user', createdAt: new Date().toISOString() },
  { id: 'usr_admin', name: 'IRCTC Admin', email: 'admin@railyatra.com', password: 'admin123', role: 'admin', createdAt: new Date().toISOString() }
];

const DEFAULT_TRAINS = [
  {
    number: '12124',
    name: 'Deccan Queen Superfast',
    stops: [
      { station: 'PUNE', distance: 0, arr: '07:15', dep: '07:15', platform: 1 },
      { station: 'LNL',  distance: 64, arr: '08:18', dep: '08:20', platform: 2 },
      { station: 'KYN',  distance: 138, arr: '09:33', dep: '09:35', platform: 7 },
      { station: 'CSMT', distance: 192, arr: '10:25', dep: '10:25', platform: 8 }
    ]
  },
  {
    number: '12123',
    name: 'Deccan Queen Express',
    stops: [
      { station: 'CSMT', distance: 0, arr: '17:10', dep: '17:10', platform: 8 },
      { station: 'KYN',  distance: 54, arr: '18:08', dep: '18:10', platform: 6 },
      { station: 'LNL',  distance: 128, arr: '19:28', dep: '19:30', platform: 1 },
      { station: 'PUNE', distance: 192, arr: '20:25', dep: '20:25', platform: 5 }
    ]
  },
  {
    number: '12951',
    name: 'Mumbai Rajdhani Express',
    stops: [
      { station: 'CSMT', distance: 0, arr: '16:35', dep: '16:35', platform: 18 },
      { station: 'ST',   distance: 263, arr: '19:43', dep: '19:48', platform: 1 },
      { station: 'BRC',  distance: 392, arr: '21:06', dep: '21:16', platform: 2 },
      { station: 'NDLS', distance: 1386, arr: '08:32', dep: '08:32', platform: 3 }
    ]
  },
  {
    number: '12952',
    name: 'Delhi Mumbai Rajdhani',
    stops: [
      { station: 'NDLS', distance: 0, arr: '16:55', dep: '16:55', platform: 2 },
      { station: 'BRC',  distance: 994, arr: '04:18', dep: '04:28', platform: 1 },
      { station: 'ST',   distance: 1123, arr: '05:48', dep: '05:53', platform: 2 },
      { station: 'CSMT', distance: 1386, arr: '09:15', dep: '09:15', platform: 18 }
    ]
  },
  {
    number: '11029',
    name: 'Koyna Express',
    stops: [
      { station: 'CSMT', distance: 0, arr: '08:40', dep: '08:40', platform: 7 },
      { station: 'KYN',  distance: 54, arr: '09:33', dep: '09:35', platform: 5 },
      { station: 'LNL',  distance: 128, arr: '11:00', dep: '11:02', platform: 1 },
      { station: 'PUNE', distance: 192, arr: '12:40', dep: '12:45', platform: 1 },
      { station: 'STR',  distance: 337, arr: '15:57', dep: '16:00', platform: 2 },
      { station: 'KOP',  distance: 518, arr: '20:10', dep: '20:10', platform: 1 }
    ]
  },
  {
    number: '11030',
    name: 'Koyna Express Return',
    stops: [
      { station: 'KOP', distance: 0, arr: '08:15', dep: '08:15', platform: 2 },
      { station: 'STR', distance: 181, arr: '11:35', dep: '11:40', platform: 1 },
      { station: 'PUNE', distance: 326, arr: '15:45', dep: '15:50', platform: 2 },
      { station: 'LNL', distance: 390, arr: '17:08', dep: '17:10', platform: 2 },
      { station: 'KYN', distance: 464, arr: '18:47', dep: '18:50', platform: 6 },
      { station: 'CSMT', distance: 518, arr: '20:05', dep: '20:05', platform: 12 }
    ]
  },
  {
    number: '12009',
    name: 'Mumbai Ahmedabad Shatabdi',
    stops: [
      { station: 'CSMT', distance: 0, arr: '06:20', dep: '06:20', platform: 5 },
      { station: 'ST',   distance: 263, arr: '09:20', dep: '09:23', platform: 1 },
      { station: 'BRC',  distance: 392, arr: '10:48', dep: '10:53', platform: 2 },
      { station: 'ADI',  distance: 492, arr: '12:45', dep: '12:45', platform: 1 }
    ]
  },
  {
    number: '12010',
    name: 'Ahmedabad Mumbai Shatabdi',
    stops: [
      { station: 'ADI', distance: 0, arr: '14:50', dep: '14:50', platform: 1 },
      { station: 'BRC', distance: 100, arr: '16:15', dep: '16:20', platform: 1 },
      { station: 'ST', distance: 229, arr: '17:52', dep: '17:55', platform: 3 },
      { station: 'CSMT', distance: 492, arr: '21:20', dep: '21:20', platform: 5 }
    ]
  },
  {
    number: '12157',
    name: 'Hutatma Superfast',
    stops: [
      { station: 'PUNE', distance: 0, arr: '17:55', dep: '17:55', platform: 3 },
      { station: 'SUR',  distance: 264, arr: '21:50', dep: '21:50', platform: 2 }
    ]
  },
  {
    number: '12158',
    name: 'Hutatma Superfast Return',
    stops: [
      { station: 'SUR',  distance: 0, arr: '06:30', dep: '06:30', platform: 1 },
      { station: 'PUNE', distance: 264, arr: '10:30', dep: '10:30', platform: 4 }
    ]
  },
  {
    number: '12780',
    name: 'Goa Nizamuddin Superfast',
    stops: [
      { station: 'PUNE', distance: 0, arr: '16:35', dep: '16:35', platform: 1 },
      { station: 'KYN',  distance: 138, arr: '18:45', dep: '18:48', platform: 6 },
      { station: 'BRC',  distance: 530, arr: '00:30', dep: '00:40', platform: 3 },
      { station: 'NDLS', distance: 1524, arr: '12:15', dep: '12:15', platform: 4 }
    ]
  },
  {
    number: '12628',
    name: 'Karnataka Express',
    stops: [
      { station: 'NDLS', distance: 0, arr: '20:20', dep: '20:20', platform: 4 },
      { station: 'NGP',  distance: 1084, arr: '11:10', dep: '11:15', platform: 1 },
      { station: 'SUR',  distance: 1678, arr: '20:40', dep: '20:45', platform: 2 },
      { station: 'SBC',  distance: 2396, arr: '09:00', dep: '09:00', platform: 1 }
    ]
  },
  {
    number: '12163',
    name: 'Mumbai Chennai Superfast',
    stops: [
      { station: 'CSMT', distance: 0, arr: '18:45', dep: '18:45', platform: 14 },
      { station: 'KYN',  distance: 54, arr: '19:42', dep: '19:45', platform: 7 },
      { station: 'PUNE', distance: 192, arr: '22:40', dep: '22:45', platform: 2 },
      { station: 'SUR',  distance: 456, arr: '03:00', dep: '03:05', platform: 3 },
      { station: 'MAS',  distance: 1281, arr: '16:30', dep: '16:30', platform: 5 }
    ]
  },
  {
    number: '12702',
    name: 'Hussain Sagar Express',
    stops: [
      { station: 'HYB',  distance: 0, arr: '14:50', dep: '14:50', platform: 5 },
      { station: 'SUR',  distance: 338, arr: '20:40', dep: '20:45', platform: 2 },
      { station: 'PUNE', distance: 602, arr: '01:20', dep: '01:25', platform: 3 },
      { station: 'KYN',  distance: 740, arr: '04:02', dep: '04:05', platform: 6 },
      { station: 'CSMT', distance: 794, arr: '05:00', dep: '05:00', platform: 9 }
    ]
  }
];

const DEFAULT_BOOKINGS = [
  {
    pnr: '8420194821',
    trainNumber: '12124',
    trainName: 'Deccan Queen Superfast',
    from: 'PUNE',
    to: 'CSMT',
    date: new Date().toISOString().split('T')[0],
    classType: '3A',
    platform: 1,
    farePaid: 580,
    status: 'CONFIRMED',
    userId: 'usr_1',
    bookedAt: new Date().toISOString(),
    passengers: [
      { name: 'Rahul Sharma', age: 24, gender: 'Male', coach: 'B1', seat: 14, berth: 'UB' },
      { name: 'Pooja Sharma', age: 22, gender: 'Female', coach: 'B1', seat: 15, berth: 'SL' }
    ]
  }
];

// Helper functions for CSV generation
function updateUsersCSV(users: any[]) {
  const header = 'ID,Name,Email,Password,Role,CreatedAt\n';
  const rows = users.map(u => `"${u.id}","${u.name}","${u.email}","${u.password}","${u.role}","${u.createdAt}"`).join('\n');
  fs.writeFileSync(USERS_CSV, header + rows, 'utf-8');
}

function updateBookingsCSV(bookings: any[]) {
  const header = 'PNR,TrainNumber,TrainName,FromStation,ToStation,Date,Class,Platform,FarePaid,Status,PassengerCount,UserId,BookedAt\n';
  const rows = bookings.map(b =>
    `"${b.pnr}","${b.trainNumber}","${b.trainName}","${b.from}","${b.to}","${b.date}","${b.classType}","${b.platform}","${b.farePaid}","${b.status}","${b.passengers ? b.passengers.length : 1}","${b.userId}","${b.bookedAt}"`
  ).join('\n');
  fs.writeFileSync(BOOKINGS_CSV, header + rows, 'utf-8');
}

// Initialize seed data files
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(DEFAULT_USERS, null, 2), 'utf-8');
  updateUsersCSV(DEFAULT_USERS);
}
if (!fs.existsSync(BOOKINGS_FILE)) {
  fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(DEFAULT_BOOKINGS, null, 2), 'utf-8');
  updateBookingsCSV(DEFAULT_BOOKINGS);
}
if (!fs.existsSync(TRAINS_FILE)) {
  fs.writeFileSync(TRAINS_FILE, JSON.stringify(DEFAULT_TRAINS, null, 2), 'utf-8');
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // -------------------------------------------------------------
  // API ROUTES
  // -------------------------------------------------------------

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'RailYatra Backend API', storage: 'file-backed (json & csv)' });
  });

  // 1. Register: Accepts ANY value without arbitrary rejection!
  app.post('/api/auth/register', (req, res) => {
    try {
      const { name, email, password } = req.body;
      const cleanName = String(name || 'Passenger').trim();
      const cleanEmail = String(email || 'user@railyatra.com').trim();
      const cleanPass = String(password || 'pass').trim();

      const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8') || '[]');

      // If user with this email/username exists, update or return it
      const existing = users.find((u: any) => u.email.toLowerCase() === cleanEmail.toLowerCase());
      if (existing) {
        existing.password = cleanPass;
        existing.name = cleanName;
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
        updateUsersCSV(users);
        return res.json({ success: true, user: existing, message: 'Account updated and logged in' });
      }

      const role = cleanEmail.toLowerCase().includes('admin') ? 'admin' : 'user';
      const newUser = {
        id: 'usr_' + Date.now(),
        name: cleanName,
        email: cleanEmail,
        password: cleanPass,
        role: role,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
      updateUsersCSV(users);

      return res.json({ success: true, user: newUser, message: 'Registered and saved to backend sheet' });
    } catch (e: any) {
      console.error('Register error:', e);
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // 2. Login: Accepts ANY value! If not found, auto-creates account so testing is frictionless!
  app.post('/api/auth/login', (req, res) => {
    try {
      const { email, password } = req.body;
      const cleanEmail = String(email || 'guest@railyatra.com').trim();
      const cleanPass = String(password || 'pass').trim();

      const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8') || '[]');

      let user = users.find((u: any) => u.email.toLowerCase() === cleanEmail.toLowerCase());

      if (!user) {
        // Auto-create on login with any value!
        const role = cleanEmail.toLowerCase().includes('admin') ? 'admin' : 'user';
        user = {
          id: 'usr_' + Date.now(),
          name: cleanEmail.includes('@') ? cleanEmail.split('@')[0] : cleanEmail,
          email: cleanEmail,
          password: cleanPass,
          role: role,
          createdAt: new Date().toISOString()
        };
        users.push(user);
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
        updateUsersCSV(users);
      }

      return res.json({ success: true, user: user, message: 'Login successful' });
    } catch (e: any) {
      console.error('Login error:', e);
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // 3. Get all users
  app.get('/api/auth/users', (_req, res) => {
    try {
      const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8') || '[]');
      res.json(users);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // 4. Get all bookings from backend file
  app.get('/api/bookings', (_req, res) => {
    try {
      const bookings = JSON.parse(fs.readFileSync(BOOKINGS_FILE, 'utf-8') || '[]');
      res.json(bookings);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // 5. Save new booking to backend file & CSV sheet
  app.post('/api/bookings', (req, res) => {
    try {
      const newBookings = Array.isArray(req.body) ? req.body : [req.body];
      const bookings = JSON.parse(fs.readFileSync(BOOKINGS_FILE, 'utf-8') || '[]');

      for (const b of newBookings) {
        bookings.unshift(b);
      }

      fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), 'utf-8');
      updateBookingsCSV(bookings);

      res.json({ success: true, count: newBookings.length, message: 'Saved to backend file and sheet' });
    } catch (e: any) {
      console.error('Save booking error:', e);
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // 6. Cancel booking in backend file
  app.post('/api/bookings/cancel', (req, res) => {
    try {
      const { pnr } = req.body;
      const bookings = JSON.parse(fs.readFileSync(BOOKINGS_FILE, 'utf-8') || '[]');
      const b = bookings.find((item: any) => item.pnr === pnr);

      if (b) {
        b.status = 'CANCELLED';
        fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), 'utf-8');
        updateBookingsCSV(bookings);
        return res.json({ success: true, booking: b });
      }
      res.status(404).json({ success: false, message: 'PNR not found' });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // 7. Trains CRUD
  app.get('/api/trains', (_req, res) => {
    try {
      const trains = JSON.parse(fs.readFileSync(TRAINS_FILE, 'utf-8') || '[]');
      res.json(trains);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/trains', (req, res) => {
    try {
      const trains = req.body;
      fs.writeFileSync(TRAINS_FILE, JSON.stringify(trains, null, 2), 'utf-8');
      res.json({ success: true, message: 'Train fleet updated in backend' });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // 8. Download / View backend sheet files (CSV & JSON)
  app.get('/api/sheet/users.csv', (_req, res) => {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'inline; filename="users_sheet.csv"');
    res.sendFile(USERS_CSV);
  });

  app.get('/api/sheet/bookings.csv', (_req, res) => {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'inline; filename="bookings_sheet.csv"');
    res.sendFile(BOOKINGS_CSV);
  });

  app.get('/api/sheet/db-status', (_req, res) => {
    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8') || '[]');
    const bookings = JSON.parse(fs.readFileSync(BOOKINGS_FILE, 'utf-8') || '[]');
    const trains = JSON.parse(fs.readFileSync(TRAINS_FILE, 'utf-8') || '[]');
    res.json({
      storageLocation: DATA_DIR,
      files: {
        usersJson: USERS_FILE,
        usersCsv: USERS_CSV,
        bookingsJson: BOOKINGS_FILE,
        bookingsCsv: BOOKINGS_CSV,
        trainsJson: TRAINS_FILE
      },
      counts: {
        usersCount: users.length,
        bookingsCount: bookings.length,
        trainsCount: trains.length
      }
    });
  });

  // Mount Vite development middlewares
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RailYatra Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
