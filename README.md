API do Clube
Descrição do Sistema

Esta API foi desenvolvida para gerenciar usuários (sócios e administradores) e convidados de um clube, com foco na integração com aplicações externas, como sistemas Delphi e futuros apps móveis.

O fluxo principal é:

Usuários (sócios e administradores)

Administradores podem cadastrar outros usuários (admins ou sócios).

Sócios podem ser registrados pelo sistema Delphi existente.

Convidados

Usuários podem registrar convidados, enviando foto e CPF.

Futuramente, será possível gerar QR codes para os convites.

A portaria poderá verificar os convites e permitir a entrada do convidado, automatizando ou não a abertura da cancela.

Integração com outros sistemas

A aplicação Delphi do clube já consome endpoints de cadastro de sócios e consulta de convidados.

Futuras integrações permitirão enviar QR codes e automatizar a portaria.

O objetivo é ter uma API centralizada, segura e escalável, que permita futuras integrações com apps móveis e sistemas internos do clube.


Endpoints Disponíveis
Usuários (/api/users)

POST /register – Registrar usuário (Admin ou Sócio)

POST /login – Login de usuário

POST /generate-code – Gerar código de validação via e-mail

POST /validate-code – Validar código de e-mail

POST /setPassword – Definir senha do usuário

Convidados (/api/convidados)

POST /registerConvidado – Registrar convidado com foto

Integração com Sistema Delphi

A aplicação desktop em Delphi já consome alguns endpoints da API:

Cadastro de sócios → envia dados para /api/users/register com tipo S

Consulta de convidados → permite que a portaria verifique convites existentes

Futuras funcionalidades planejadas:

A portaria poderá receber QR codes de convites gerados via API

A abertura de cancelas será automatizada ou manual, dependendo da configuração

Testes

Estrutura de testes unitários e de integração pronta, usando Jest e Supertest

Testes específicos para usuários e convidados estão em src/tests/integration/

Funcionalidades Planejadas

Endpoint para criação de convites de convidados

Geração de QR code para cada convite

Integração com o sistema da portaria para leitura do QR code


Como rodar a API localmente

Clonar o repositório

git clone <URL_DO_REPO>
cd apis

Instalar dependências

npm install


Configurar variáveis de ambiente
Criar um arquivo .env na raiz do projeto com, por exemplo:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=senha
DB_NAME=nome_do_banco
JWT_SECRET=seu_segredo
PORT=3001