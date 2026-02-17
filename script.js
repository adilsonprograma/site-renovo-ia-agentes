document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Loaded - Inicializando aplicação');

    // ===============================
    // CEP Lookup (ViaCEP API)
    // ===============================
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('blur', async function() {
            const cep = this.value.replace(/\D/g, '');
            if (cep.length === 8) {
                try {
                    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                    const data = await response.json();
                    if (!data.erro) {
                        document.getElementById('logradouro').value = data.logradouro || '';
                        document.getElementById('bairro').value = data.bairro || '';
                        document.getElementById('localidade').value = `${data.localidade}/${data.uf}`;
                    } else {
                        alert('CEP não encontrado');
                    }
                } catch (error) {
                    console.error('Erro ao buscar CEP:', error);
                }
            }
        });
    }

    // ===============================
    // Service Selection & Pricing
    // ===============================
    const servicoSelect = document.getElementById('servico');
    const valorInput = document.getElementById('valor');

    const precos = {
        'corte_masculino': 40.00,
        'corte_feminino': 70.00,
        'coloracao': 150.00,
        'neutralizacao': 120.00,
        'tratamento': 100.00,
        'manicure': 50.00
    };

    function atualizarValor() {
        const servico = servicoSelect.value;
        const preco = precos[servico] || 0;
        valorInput.value = `R$ ${preco.toFixed(2).replace('.', ',')}`;
    }

    if (servicoSelect) {
        servicoSelect.addEventListener('change', atualizarValor);
        atualizarValor();
    }

    // ===============================
    // Form Submission
    // ===============================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = {
                nome: document.getElementById('nome').value,
                email: document.getElementById('email').value,
                cep: document.getElementById('cep').value,
                logradouro: document.getElementById('logradouro').value,
                bairro: document.getElementById('bairro').value,
                localidade: document.getElementById('localidade').value,
                servico: document.getElementById('servico').value,
                data: document.getElementById('data').value,
                hora: document.getElementById('hora').value,
                profissional: document.getElementById('profissional').value,
                pagamento: document.getElementById('pagamento').value,
                valor: document.getElementById('valor').value,
                timestamp: new Date().toLocaleString('pt-BR')
            };

            // Save to localStorage
            let agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
            agendamentos.push(formData);
            localStorage.setItem('agendamentos', JSON.stringify(agendamentos));

            alert('Agendamento realizado com sucesso!');
            atualizarListaAgendamentos();
            contactForm.reset();
            atualizarValor();
        });
    }

    // ===============================
    // Display Appointments List
    // ===============================
    function atualizarListaAgendamentos() {
        const listaAgendamentos = document.getElementById('listaAgendamentos');
        if (!listaAgendamentos) return;

        const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
        listaAgendamentos.innerHTML = '';

        if (agendamentos.length === 0) {
            listaAgendamentos.innerHTML = '<li class="list-group-item">Nenhum agendamento registrado</li>';
        } else {
            agendamentos.forEach((ag, index) => {
                const item = document.createElement('li');
                item.className = 'list-group-item';
                item.innerHTML = `
                    <strong>${ag.nome}</strong> - ${ag.data} às ${ag.hora}<br>
                    <small>${ag.servico} | ${ag.profissional}</small>
                `;
                listaAgendamentos.appendChild(item);
            });
        }
    }

    // Initial load
    atualizarListaAgendamentos();

    // ===============================
    // Assistant Content
    // ===============================
    const assistenteTopicoSelect = document.getElementById('assistenteTopico');
    const assistenteDicas = document.getElementById('assistenteDicas');
    const assistenteText = document.getElementById('assistenteText');

    const conteudoAssistente = {
        'tendencias': {
            titulo: 'Tendências Atuais',
            conteudo: `
            <strong>Masculino:</strong><br>
            • Undercut com fade progressivo<br>
            • Cabelo natural e comprido (mullet)<br>
            • Textura e volume na frente<br>
            • Degradê com máquina 1 a 2<br>
            <br>
            <strong>Feminino:</strong><br>
            • Cortes curtos e assimétricos<br>
            • Long bob (lob) com movimento<br>
            • Franja grossa e texturas<br>
            • Camadas dinâmicas
            `
        },
        'estrela_oswald': {
            titulo: 'Estrela de Oswald',
            conteudo: `
            A Estrela de Oswald ajuda a determinar qual estilo, cor e corte melhor se adequa ao seu tipo de beleza.<br>
            <br>
            <strong>Cores de Pele:</strong><br>
            • Quente: tons cobre, dourado<br>
            • Fria: tons prateados, acinzentados<br>
            • Neutro: equilibrado<br>
            <br>
            <strong>Dica:</strong> Faça teste de cores nos pulsos para definir sua paleta melhor.
            `
        },
        'neutralizacao': {
            titulo: 'Neutralização de Cor',
            conteudo: `
            Técnica para corrigir cores indesejadas no cabelo descolorido.<br>
            <br>
            <strong>Processo:</strong><br>
            1. Avalie o tom do cabelo atual<br>
            2. Escolha a cor correta baseado na Roda Cromática<br>
            3. Amarelo = Roxo | Verde = Vermelho | Rosa = Verde<br>
            4. Tempo de exposição: 20-40 minutos<br>
            5. Teste de mecha antes<br>
            <br>
            <strong>Cuidado:</strong> Não deixe produtos demais para não desidratar o fio.
            `
        },
        'luzes': {
            titulo: 'Técnicas de Luzes e Mechas',
            conteudo: `
            <strong>Balayage:</strong> Descoloração feita à mão para efeito natural<br>
            <br>
            <strong>Babylights:</strong> Fios bem fininhos e próximos<br>
            <br>
            <strong>Ombré:</strong> Degradê de cor, mais claro nas pontas<br>
            <br>
            <strong>Highlights:</strong> Mechas tradicionais com touca ou papel alumínio<br>
            <br>
            <strong>Dica:</strong> Mantenha o cronograma de hidratação a cada 15 dias.
            `
        },
        'cuidado': {
            titulo: 'Cuidados e Tratamentos',
            conteudo: `
            <strong>Pós-coloração:</strong><br>
            • Use shampoo sem sulfato<br>
            • Hidrate 2x por semana<br>
            • Evite água muito quente<br>
            • Durabilidade: 4-6 semanas<br>
            <br>
            <strong>Pós-descoloração:</strong><br>
            • Tratamento protetor imediato<br>
            • Evite químicas por 2 semanas<br>
            • Durabilidade: 6-8 semanas<br>
            <br>
            <strong>Produtos recomendados:</strong><br>
            • Máscara de hidratação<br>
            • Óleo capilar ou sérum<br>
            • Leave-in condicionador
            `
        }
    };

    if (assistenteTopicoSelect) {
        assistenteTopicoSelect.addEventListener('change', function() {
            const topico = this.value;
            const conteudo = conteudoAssistente[topico];
            
            if (conteudo) {
                assistenteText.innerHTML = `<strong>${conteudo.titulo}</strong>`;
                assistenteDicas.innerHTML = conteudo.conteudo;
            }
        });

        // Load initial content
        assistenteTopicoSelect.dispatchEvent(new Event('change'));
    }

    console.log('Inicialização completada com sucesso!');
});
