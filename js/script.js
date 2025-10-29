const toggleBtn = document.querySelector('.menu-toggle');
            const navLinks = document.querySelector('.nav-links');

            toggleBtn.addEventListener('click', () => {
                const isOpen = navLinks.classList.toggle('active');
                toggleBtn.classList.toggle('active');
                toggleBtn.textContent = isOpen ? '✖' : '☰'; // troca o ícone
            });


            document.getElementById('cep').addEventListener('input', function (e) {
                            let value = e.target.value;
                            // Remove tudo que não for número
                            value = value.replace(/\D/g, '');
                            // Adiciona a máscara do CEP
                            if (value.length > 5) {
                                value = value.replace(/(\d{5})(\d)/, '$1-$2');
                            }
                            e.target.value = value;
                        });

                        // limita os caracteres a 9 (8 números + hífen)
                        document.getElementById('cep').setAttribute('maxlength', '9');

                        //impede a submissao do formulario caso o cep esteja incompleto
                        document.getElementById('cepForm').addEventListener('submit', function (e) {
                            const cepValue = document.getElementById('cep').value;
                            if (cepValue.length < 9) {
                                e.preventDefault();
                                alert('Por favor, insira um CEP válido.');
                            }
                        });

                        // máscara simples de moeda (PT-BR)
                        const donationInput = document.getElementById('donation-amount');
                        donationInput.addEventListener('input', function (e) {
                            let v = e.target.value.replace(/\D/g, '');
                            v = (v / 100).toFixed(2) + '';
                            v = v.replace('.', ',');
                            v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
                            e.target.value = v;
                        });

                        document.getElementById('donateForm').addEventListener('submit', function (e) {
                            const raw = document.getElementById('donation-amount').value;
                            // converte formato '1.234,56' para número 1234.56
                            const num = Number(raw.replace(/\./g, '').replace(',', '.'));
                            if (isNaN(num) || num < 1) {
                                e.preventDefault();
                                alert('Insira um valor de doação válido (mínimo R$1,00).');
                            }
                        });

                        //scroll reveal

                        window.sr = ScrollReveal({reset:true});

sr.reveal('article', {duration: 2000});
sr.reveal('#doacao-contato', {duration: 1000});
sr.reveal('.input', {duration: 1000});
sr.reveal('.img-site', {duration: 1000});
sr.reveal('.titulo', {duration: 3000});
sr.reveal('.grid-equipe', {duration: 1000});
sr.reveal('h2', {duration: 1000});


