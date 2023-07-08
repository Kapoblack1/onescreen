Execução do projecto Mobile

Instalação e Execução do ISPMEDIA desenvolvido com React Native usando o VS Code

Pré-requisitos
Antes de prosseguir, certifique-se de ter as seguintes ferramentas instaladas em seu sistema:

Visual Studio Code: é um editor de código-fonte dprojetado para ser rápido e altamente personalizável, adequado para uma ampla gama de linguagens de programação e projetos de desenvolvimento de software.

Node.js: O Node.js é necessário para executar o ambiente de desenvolvimento do React Native e pode ser baixado em https://nodejs.org. Recomenda-se usar a versão LTS.

React Native CLI: O React Native CLI é uma interface de linha de comando para criar, desenvolver e gerenciar aplicativos React Native. Você pode instalá-lo executando o seguinte comando em seu terminal:

npm install -g react-native-cli ou yarn global add react-native-cli



Teste

Para testar precisará do Expo Go que é um aplicativo móvel disponível para dispositivos Android e iOS que permite executar e testar aplicativos desenvolvidos com o Expo. Ele é uma parte importante do ecossistema do Expo, uma plataforma de desenvolvimento de aplicativos móveis baseada em React Native.



Execução do Projeto
Siga estas etapas para executar o projeto ISPMIDIA no VS Code:

Abra o projecto 'ispbase-master' crom o vscode executando e instale as dependências do projeto executando o seguinte comando:
npm install ou yarn install

Aguarde a instalação terminar e execute o comando:
npx expo start 

Irá aparecer um código QR. Para dispositivos iOS, com o aplicativo da câmera, scaneie o código QR e ele redirecionará para o aplicativo do Expo GO, e para dispositivos Android, abra o aplicativo Expo GO e escolha a opção para scanear código QR.





Execução do projecto Web

Siga os mesmos requisitos básicos do projecto mobile.

Abra o projecto 'ispbase-master' crom o vscode executando e instale as dependências do projeto executando o seguinte comando:
npm install ou yarn install

Aguarde a instalação terminar e execute o comando:
npm start