# Sistema de Gestão de Ponto — Expresso Nordeste (Controle Oitchau)

## Sobre o Projeto

Este repositório apresenta uma aplicação web desenvolvida para modernizar e automatizar o processo de controle e aprovação de ponto eletrônico dos colaboradores da empresa **Expresso Nordeste**.

Antes da implementação do sistema, grande parte do processo era realizada manualmente, utilizando registros em papel para conferência, organização e acompanhamento das aprovações de ponto. Esse método tornava as rotinas administrativas mais lentas, suscetíveis a erros operacionais e com maior dificuldade de controle e rastreabilidade das informações.

Diante dessa necessidade, a plataforma foi desenvolvida para centralizar todas as operações em um único ambiente digital, proporcionando maior agilidade, organização e precisão nos processos internos relacionados ao fechamento da folha de pagamento.

A aplicação foi projetada especialmente para atender às demandas do setor administrativo, oferecendo uma interface intuitiva, rápida e eficiente para acompanhamento diário das equipes.

---

# Objetivos da Plataforma

O sistema possui como principais objetivos:

* substituir processos manuais realizados em papel;
* centralizar o controle de aprovações de ponto;
* reduzir falhas operacionais;
* agilizar rotinas administrativas;
* facilitar o acompanhamento de pendências;
* otimizar o fechamento da folha de pagamento;
* garantir sincronização em tempo real entre diferentes acessos administrativos.

---

# Tecnologias Utilizadas

A aplicação foi desenvolvida utilizando tecnologias modernas, priorizando desempenho, estabilidade e organização estrutural.

## HTML5 e CSS3

Responsáveis pela construção da interface visual da plataforma, utilizando:

* estrutura semântica organizada;
* responsividade para diferentes resoluções;
* identidade visual alinhada ao padrão corporativo da empresa;
* variáveis globais de estilização;
* componentes adaptáveis e organizados.

A identidade visual foi construída utilizando predominância das cores verde e laranja, alinhadas ao padrão visual corporativo da empresa.

---

## JavaScript (Vanilla)

Toda a lógica da aplicação foi desenvolvida em JavaScript puro, sem utilização de frameworks externos.

Entre os recursos implementados, destacam-se:

* manipulação dinâmica do DOM;
* processamento de dados em tempo real;
* filtros e buscas inteligentes;
* ações automatizadas em lote;
* geração dinâmica de relatórios;
* exportação de arquivos CSV.

A utilização de JavaScript nativo proporcionou maior desempenho, carregamento rápido e melhor controle da lógica operacional do sistema.

---

## Firebase Realtime Database

O sistema utiliza o **Firebase Realtime Database** como solução de armazenamento em nuvem e sincronização em tempo real.

Essa integração permite:

* atualização instantânea das informações;
* sincronização simultânea entre gestores;
* armazenamento seguro dos dados;
* gerenciamento centralizado das aprovações de ponto.

---

# Principais Funcionalidades

## Sistema de Autenticação

A plataforma possui uma tela de login destinada exclusivamente a gestores e administradores autorizados, restringindo o acesso às funcionalidades internas do sistema.

---

## Dashboard Administrativo em Tempo Real

O sistema apresenta indicadores visuais atualizados em tempo real, permitindo acompanhamento rápido de:

* colaboradores com ponto aprovado;
* pendências administrativas;
* status de fechamento diário;
* informações operacionais da equipe.

---

## Ações em Massa

A aplicação permite execução de ações coletivas com apenas um clique, incluindo:

* aprovação em lote;
* reprovação em lote;
* limpeza de status;
* fechamento por período;
* gerenciamento por filial ou empresa completa.

Esse recurso reduz significativamente o tempo gasto em tarefas repetitivas do setor administrativo.

---

## Gestão Individual de Colaboradores

O sistema oferece mecanismos de busca rápida por:

* nome;
* CAD;
* período específico.

A funcionalidade permite realizar correções individuais e análises específicas de cada colaborador com maior precisão operacional.

---

## Gerenciamento de Equipe

A plataforma possibilita:

* cadastro de colaboradores;
* remoção de registros;
* organização por filiais;
* gerenciamento centralizado do banco de dados.

---

## Exportação de Relatórios

O sistema realiza geração automática de relatórios em formato CSV, permitindo integração prática com sistemas de folha de pagamento e processos administrativos internos.

Os relatórios incluem:

* fechamento diário;
* relatórios por período;
* matrizes operacionais;
* dados organizados para análise e arquivamento.

---

# Acesso de Teste / Homologação

Para acesso ao ambiente de testes, utilize as credenciais padrão:

* **Usuário:** `admin`
* **Senha:** `expresso`

---

# Estrutura de Arquivos

```text id="p3z9kl"
/
├── index.html      # Estrutura principal da aplicação
├── style.css       # Interface visual e responsividade
├── script.js       # Lógica operacional e integração com Firebase
```

---

# Considerações Finais

O sistema foi desenvolvido com foco em eficiência operacional, digitalização de processos administrativos e modernização das rotinas internas da empresa.

A substituição do controle manual em papel por uma plataforma web integrada proporcionou maior organização, velocidade e confiabilidade no gerenciamento das aprovações de ponto, demonstrando como soluções tecnológicas podem transformar processos administrativos tradicionais em operações mais eficientes e seguras.

---

**Desenvolvido por Kaio Daniel S. Costa**
Solução focada em automação de processos, controle operacional e eficiência administrativa.
