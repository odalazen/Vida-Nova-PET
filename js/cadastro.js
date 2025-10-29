// Máscaras simples: CEP, CPF, Telefone
    function setMask(input, fn) {
      input.addEventListener('input', function(e){
        const pos = this.selectionStart || 0;
        this.value = fn(this.value);
        // tenta manter o caret no fim quando necessário
        this.selectionStart = this.selectionEnd = this.value.length;
      }, { passive: true });
    }

    function maskCEP(v){
      v = v.replace(/\D/g,'').slice(0,8);
      if (v.length > 5) return v.slice(0,5) + '-' + v.slice(5);
      return v;
    }

    function maskCPF(v){
      v = v.replace(/\D/g,'').slice(0,11);
      return v
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }

    function maskPhone(v){
      v = v.replace(/\D/g,'').slice(0,11);
      if (v.length <= 2) return v;
      if (v.length <= 6) return '(' + v.slice(0,2) + ') ' + v.slice(2);
      if (v.length <= 10) return '(' + v.slice(0,2) + ') ' + v.slice(2,6) + '-' + v.slice(6);
      // 11 dígitos (celular com 9) -> (XX) 9XXXX-XXXX
      return '(' + v.slice(0,2) + ') ' + v.slice(2,7) + '-' + v.slice(7);
    }

    document.addEventListener('DOMContentLoaded', function(){
      const cepEl = document.getElementById('cep');
      const cpfEl = document.getElementById('cpf');
      const telEl = document.getElementById('telefone');
      const form = document.getElementById('cadastroForm');
      const submitBtn = form.querySelector('button[type="submit"]');

      setMask(cepEl, maskCEP);
      setMask(cpfEl, maskCPF);
      setMask(telEl, maskPhone);

      form.addEventListener('submit', function(e){
        e.preventDefault();
        // validação: todos os campos obrigatórios devem estar preenchidos
        if (!form.checkValidity()) {
          // mostra mensagens nativas e impede envio
          form.reportValidity();
          return;
        }
        // validação mínima
        const cpf = cpfEl.value.replace(/\D/g,'');
        const telefone = telEl.value.replace(/\D/g,'');
        const cep = cepEl.value.replace(/\D/g,'');

        if (cpf.length !== 11) {
          alert('CPF inválido');
          cpfEl.focus();
          return;
        }
        if (telefone.length < 10) {
          alert('Telefone inválido');
          telEl.focus();
          return;
        }
        if (cep.length !== 8) {
          alert('CEP inválido');
          cepEl.focus();
          return;
        }

        // desativa botão e mostra estado de envio
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Enviando...';
        }

        // Simula envio (substitua por fetch() real quando necessário)
        setTimeout(function(){
          // supondo sucesso: limpe os dados do formulário
          form.reset();
          // restaura texto do botão
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Enviar';
          }
          // foco no primeiro campo
          const first = form.querySelector('input, select, textarea');
          if (first) first.focus();
          // feedback para o usuário
          alert('Cadastro realizado com sucesso.');
        }, 700);
      });
    });


