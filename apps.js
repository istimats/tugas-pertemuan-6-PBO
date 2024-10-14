const express = require('express');
const mysql = require('mysql2');
const bodyparser = require('body-parser');
const {name} = require('ejs');
const app = express();

app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pertemuan6'
});

connection.connect((err) => {
    if(err){
        console.log('terjadi kesalahan saat terhubung ke database', err.stack);
        return;
    }
    console.log('terhubung ke database'+connection.threadId);
});

app.set('view engine', 'ejs');

//routing(CRUD)

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/dashboard', (req, res) => {
    let sql = 'select * from pengguna';
    let query = connection.query(sql, (err, results) => {
        if(err) throw err;
        res.render('dashboard.ejs', {'pengguna': results});
    });
});

app.get('/registrasi', (req, res) => {
    res.render('registrasi');
});
app.post('/registrasi', (req, res) => {
    const {username, password, nama_lengkap, email, alamat, nomor_telepon} = req.body;
    const query = 'insert into pengguna (username, password, nama_lengkap, email, alamat, nomor_telepon, tanggal_registrasi) values (?, ?, ?, ?, ?, ?, NOW())';
    connection.query(query, [username, password, nama_lengkap, email, alamat, nomor_telepon], (err, results) => {
        if(err) throw err;
        res.redirect('/login');
    });
});


app.get('/login', (req, res) => {
    res.render('login');
});
app.post('/login', (req, res) => {
    const {username, password} = req.body;
    const query = 'select * from pengguna where username = ? and password = ?';
    connection.query(query, [username, password], (err, results) => {
        if(err) throw err;  
        if(results.length > 0){
            res.redirect('/dashboard');
        }else{
            res.redirect('/login');
        }
    });
});
app.get('/edit/:id', (req, res)=>{
    const query = "SELECT * FROM pengguna where id_pengguna = ?";
    connection.query(query, [req.params.id],(err, result) => {
        if(err) throw err;
        res.render('edit', {user: result[0]});
    });
})

app.post ('/update/:id_pengguna', (req, res)=>{
    const {username, password, nama_lengkap, email, alamat, nomor_telepon} = req.body;
    const query = 'UPDATE pengguna SET username = ?, password = ?, nama_lengkap = ?, email = ?, alamat = ?, nomor_telepon = ? where id_pengguna = ?';
    connection.query(query, [username, password, nama_lengkap, email, alamat, nomor_telepon, req.params.id],  (err, result) => {
        if(err) throw err;
        res.redirect('/dashboard');
    });
})


app.get('/delete/:id_pengguna', (req, res)=>{
    const query = "DELETE FROM pengguna where id_pengguna = ?";
    connection.query(query, [req.params.id],(err, result) => {
        if(err) throw err;
        res.redirect('/');
    });
})

app.get('/logout', (req, res) => {
    res.redirect('/');
});




app.listen(3000, () => {
    console.log(`server berjalan di http://localhost:3000`);
});