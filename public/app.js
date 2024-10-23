// Escutar o envio do formulário
document.getElementById('uploadForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Impede o envio padrão do formulário
    const files = document.getElementById('xmlFiles').files; // Obtém os arquivos selecionados

    for (let file of files) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(event.target.result, "text/xml");
            const cMun = xmlDoc.getElementsByTagName('cMun')[0].textContent;
            const xMun = xmlDoc.getElementsByTagName('xMun')[0].textContent;
            const infCte = xmlDoc.getElementsByTagName('infCte')[0].getAttribute('Id'); // Extraindo a chave infCte

            // Consultando a API do IBGE
            fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/municipios/${cMun}`)
                .then(response => response.json())
                .then(data => {
                    const nomeIBGE = data.nome;
                    const resultado = nomeIBGE.toLowerCase() === xMun.toLowerCase()
                        ? `<p>${xMun} (Código: ${cMun}) está correto!</p>`
                        : `<p>${xMun} (Código: ${cMun}) está incorreto! Nome correto: ${nomeIBGE}. Chave infCte: ${infCte}</p>`; // Usando infCte
                    document.getElementById('result').innerHTML += resultado; // Adiciona o resultado ao HTML
                });
        };
        reader.readAsText(file); // Lê o arquivo como texto
    }
});

function compararComIBGE(cMun, xMun) {
    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/municipios/${cMun}`)
    .then(response => response.json())
    .then(data => {
        const nomeIBGE = data.nome;
        const resultado = nomeIBGE.toLowerCase() === xMun.toLowerCase()
            ? `<p>${xMun} (Código: ${cMun}) está correto!</p>`
            : `<p>${xMun} (Código: ${cMun}) está incorreto! Nome correto: ${nomeIBGE}. Chave infNFe: ${infCte}</p>`;
        document.getElementById('result').innerHTML += resultado;
        })
        .catch(error => console.error('Erro ao consultar API do IBGE:', error));
}

// Escutar o clique no botão de limpar
document.getElementById('clearButtom').addEventListener('click', function () {
    // Limpar o conteúdo da div de resultados
    document.getElementById('result').innerHTML = '';
});
