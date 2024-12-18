const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const visitorsFile = path.join(__dirname, 'visitors.json');

// Middleware untuk menampilkan file statis
app.use(express.static('public'));

// Endpoint untuk mencatat pengunjung
app.get('/api/visit', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Baca file visitor
    fs.readFile(visitorsFile, 'utf-8', (err, data) => {
        let visitors = [];
        if (!err && data) {
            visitors = JSON.parse(data);
        }

        // Tambah data pengunjung
        const timestamp = new Date().toISOString();
        visitors.push({ ip, timestamp });

        // Simpan data kembali ke file
        fs.writeFile(visitorsFile, JSON.stringify(visitors, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Server error');
            }

            res.json({ message: 'Visitor recorded!', visitors });
        });
    });
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
