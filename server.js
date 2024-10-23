const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// Configurando a pasta estática para servir HTML, CSS, JS
app.use(express.static(path.join(__dirname, 'public')));

// Rota para a página principal (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Configurando o multer para upload de arquivos
const upload = multer({ dest: 'uploads/' });

// Rota para upload de arquivos XML
app.post('/upload', upload.array('xmlFiles'), (req, res) => {
    res.send('Arquivos recebidos!');
});

// Iniciando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
