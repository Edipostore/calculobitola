// script.js
// Tabela de bitolas e suas capacidades (AWG/Metrico)
const tabelaBitolas = [
    { bitola: '14 AWG (2.08 mm²)', ampacidade: 15, resistencia: 8.286 },
    { bitola: '12 AWG (3.31 mm²)', ampacidade: 20, resistencia: 5.211 },
    { bitola: '10 AWG (5.26 mm²)', ampacidade: 30, resistencia: 3.277 },
    { bitola: '8 AWG (8.37 mm²)', ampacidade: 40, resistencia: 2.061 },
    { bitola: '6 AWG (13.3 mm²)', ampacidade: 55, resistencia: 1.300 },
    { bitola: '4 AWG (21.1 mm²)', ampacidade: 70, resistencia: 0.823 },
    { bitola: '2 AWG (33.6 mm²)', ampacidade: 95, resistencia: 0.519 },
    { bitola: '1/0 AWG (53.5 mm²)', ampacidade: 110, resistencia: 0.327 },
    { bitola: '2/0 AWG (67.4 mm²)', ampacidade: 125, resistencia: 0.261 },
    { bitola: '3/0 AWG (85.0 mm²)', ampacidade: 145, resistencia: 0.207 },
    { bitola: '4/0 AWG (107.2 mm²)', ampacidade: 170, resistencia: 0.164 },
];

function formatarNumero(numero) {
    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(numero);
}

function calcular() {
    const tensao = parseFloat(document.getElementById('tensao').value);
    const potencia = parseFloat(document.getElementById('potencia').value);
    const distancia = parseFloat(document.getElementById('distancia').value);
    const quedaMaxima = parseFloat(document.getElementById('quedaMaxima').value);

    // Validação dos campos
    if (isNaN(potencia) || isNaN(distancia) || potencia <= 0 || distancia <= 0) {
        alert('Por favor, preencha todos os campos obrigatórios com valores válidos.');
        return;
    }

    // Calcular corrente (I = P / V)
    const corrente = potencia / tensao;

    // Calcular queda de tensão máxima permitida
    const quedaPermitida = (quedaMaxima / 100) * tensao;

    // Encontrar a bitola adequada
    let bitolaRecomendada = null;
    let quedaCalculada = 0;

    for (const bitola of tabelaBitolas) {
        if (corrente <= bitola.ampacidade) {
            // Calcular queda de tensão: V = I * R * L (ida e volta = 2L)
            const resistenciaTotal = (bitola.resistencia * distancia * 2) / 1000; // resistência em ohms/km
            quedaCalculada = corrente * resistenciaTotal;
            
            if (quedaCalculada <= quedaPermitida) {
                bitolaRecomendada = bitola;
                break;
            }
        }
    }

    // Atualizar os resultados
    document.getElementById('tensao-resultado').textContent = tensao + ' V';
    document.getElementById('potencia-resultado').textContent = formatarNumero(potencia) + ' W';
    document.getElementById('distancia-resultado').textContent = formatarNumero(distancia) + ' m';
    document.getElementById('queda-permitida-resultado').textContent = quedaPermitida.toFixed(1) + ' V (' + quedaMaxima + '%)';
    document.getElementById('corrente-resultado').textContent = formatarNumero(corrente) + ' A';

    const recomendacaoContainer = document.getElementById('recomendacao-container');
    
    if (bitolaRecomendada) {
        recomendacaoContainer.innerHTML = `
            <h3>Bitola Recomendada</h3>
            <div class="bitola-value">${bitolaRecomendada.bitola}</div>
            <div class="capacity-info">Capacidade: ${bitolaRecomendada.ampacidade} A</div>
            <div class="voltage-drop">Queda de tensão calculada: ${quedaCalculada.toFixed(2)} V</div>
        `;
    } else {
        recomendacaoContainer.innerHTML = `
            <div class="error-message">
                <p>Não foi possível encontrar uma bitola adequada!</p>
                <p class="small">Considere reduzir a distância, aumentar a tensão ou usar múltiplos circuitos.</p>
            </div>
        `;
    }

    document.getElementById('resultado').style.display = 'block';
    
    // Scroll para o resultado em dispositivos móveis
    if (window.innerWidth <= 768) {
        document.getElementById('resultado').scrollIntoView({ behavior: 'smooth' });
    }
}

function limpar() {
    // Resetar os campos do formulário
    document.getElementById('tensao').value = '220';
    document.getElementById('potencia').value = '';
    document.getElementById('distancia').value = '';
    document.getElementById('quedaMaxima').value = '3';
    
    // Esconder o resultado
    document.getElementById('resultado').style.display = 'none';
    
    // Focar no primeiro campo obrigatório
    document.getElementById('potencia').focus();
}

// Adicionar evento de clique ao botão calcular
document.getElementById('calcular').addEventListener('click', calcular);

// Adicionar evento de clique ao botão limpar
document.getElementById('limpar').addEventListener('click', limpar);

// Adicionar suporte para tecla Enter
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        calcular();
    }
});

// Melhorar acessibilidade para dispositivos móveis
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar atributos de acessibilidade
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        if (!input.hasAttribute('aria-label')) {
            const label = document.querySelector(`label[for="${input.id}"]`);
            if (label) {
                input.setAttribute('aria-label', label.textContent.replace(' *', ''));
            }
        }
    });
});