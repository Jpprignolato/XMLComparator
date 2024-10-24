document.getElementById('uploadForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Impede o envio padrão do formulário
    const files = document.getElementById('xmlFiles').files; // Obtém os arquivos selecionados
    const xmlType = document.getElementById('xmlType').value; // Obtém o tipo de XML (nfe ou cte)

    for (let file of files) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(event.target.result, "text/xml");
            
            let cMun, xMun, chaveAcesso;
            
            if (xmlType === 'nfe') {
                const infNFe = xmlDoc.getElementsByTagName('infNFe')[0];
                cMun = infNFe.getElementsByTagName('cMun')[0].textContent;
                xMun = infNFe.getElementsByTagName('xMun')[0].textContent;
                chaveAcesso = infNFe.getAttribute('Id');
            } else if (xmlType === 'cte') {
                const infCte = xmlDoc.getElementsByTagName('infCte')[0];
                cMun = infCte.getElementsByTagName('cMun')[0].textContent;
                xMun = infCte.getElementsByTagName('xMun')[0].textContent;
                chaveAcesso = infCte.getAttribute('Id');
            }

            fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/municipios/${cMun}`)
                .then(response => response.json())
                .then(data => {
                    const nomeIBGE = data.nome;
                    let resultadoHTML;
                    if (nomeIBGE.toLowerCase() === xMun.toLowerCase()) {
                        // Município correto - Adiciona a classe de sucesso
                        resultadoHTML = `<p class="result-correct">${xMun} (Código: ${cMun}) está correto!</p>`;
                    } else {
                        // Município incorreto - Adiciona a classe de erro
                        resultadoHTML = `<p class="result-incorrect">${xMun} (Código: ${cMun}) está incorreto! Nome correto: ${nomeIBGE}. Chave de Acesso: ${chaveAcesso}</p>`;
                    }
                    document.getElementById('result').innerHTML += resultadoHTML;
                });
                
        };
        
        reader.readAsText(file);

    }
    
});

// Escutar o clique no botão de limpar
document.getElementById('clearButton').addEventListener('click', function () {
document.getElementById('result').innerHTML = ''; // Limpa a div de resultados
});


