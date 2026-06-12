'use strict';

// --- CONFIGURAÇÃO FIREBASE ---
const firebaseConfig = {
    apiKey: "AIzaSyAJY7pPpxurwbiIhjjDfsPh0NPyuO_vNi8",
    authDomain: "oitchauserv.firebaseapp.com",
    projectId: "oitchauserv",
    storageBucket: "oitchauserv.firebasestorage.app",
    messagingSenderId: "670263819451",
    appId: "1:670263819451:web:08addbf9f8c2b8d78dbd9e"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const dbRef = database.ref('pontos');
const driversRef = database.ref('equipe');

// --- VARIÁVEIS GLOBAIS ---
let driverList = [];
let db = {}; 
let currentApprover = "";
let currentDateKey = "";
let selectedIndivCad = ""; 
let currentSector = "rodoviario"; 

// --- BASE DE DADOS LIMPA ---
const cleanDriverList = [
    // RODOVIÁRIOS - APUCARANA
    { b: "Apucarana", c: "21001", n: "Anderson Patricio Schatz", t: "rodoviario" },
    { b: "Apucarana", c: "21905", n: "Aniele de Lima Siqueira Santana Inocêncio", t: "rodoviario" },
    { b: "Apucarana", c: "21919", n: "Diego Aparecido de Camargo", t: "rodoviario" },
    { b: "Apucarana", c: "19999", n: "Antonio Gomes de Lima", t: "rodoviario" },
    { b: "Apucarana", c: "21672", n: "João Marcos Balachi", t: "rodoviario" },
    { b: "Apucarana", c: "9213", n: "Olimpio Pereira da Silva", t: "rodoviario" },
    { b: "Apucarana", c: "21474", n: "Ricardo Hikazutani Marques", t: "rodoviario" },
    // RODOVIÁRIOS - ARARAQUARA
    { b: "Araraquara", c: "2037", n: "Ademilson Jesus da Silva", t: "rodoviario" },
    { b: "Araraquara", c: "1968", n: "Anderson Lucas Vieira Rocha", t: "rodoviario" },
    { b: "Araraquara", c: "1974", n: "Alexsandro Brito Meira Rodrigues", t: "rodoviario" },
    { b: "Araraquara", c: "1843", n: "Anailson Nunes dos Santos", t: "rodoviario" },
    { b: "Araraquara", c: "SC001", n: "Diego Henrique Vieira", t: "rodoviario" },
    { b: "Araraquara", c: "2042", n: "Michel de Araújo dos Santos", t: "rodoviario" },
    { b: "Araraquara", c: "2115", n: "Peterson Luis Apº Victor Jacyntho", t: "rodoviario" },
    { b: "Araraquara", c: "SC002", n: "Renato Ferro", t: "rodoviario" },
    { b: "Araraquara", c: "2111", n: "Roberto Gonsalves da Silva", t: "rodoviario" },
    { b: "Araraquara", c: "2100", n: "Tiago Pereira da Silva Santos", t: "rodoviario" },
    // RODOVIÁRIOS - BRASÍLIA
    { b: "Brasília", c: "1066", n: "Carlos Santana da Silva Neto", t: "rodoviario" },
    { b: "Brasília", c: "SC003", n: "Emerson Campos de Almeira", t: "rodoviario" },
    { b: "Brasília", c: "1994", n: "Gesiel Ferreira dos Santos", t: "rodoviario" },
    { b: "Brasília", c: "2069", n: "Felipe Batista da Silva", t: "rodoviario" },
    { b: "Brasília", c: "2260", n: "Igor Alves da Silva", t: "rodoviario" },
    { b: "Brasília", c: "2072", n: "Marcio Espinosa Sousa", t: "rodoviario" },
    { b: "Brasília", c: "2252", n: "Messias Junio Alves Pereira Marinho", t: "rodoviario" },
    { b: "Brasília", c: "2073", n: "Paulo Henrique Nunes dos Santos", t: "rodoviario" },
    { b: "Brasília", c: "2259", n: "Welinton Daniel Gonsalves", t: "rodoviario" },
    // RODOVIÁRIOS - CASCAVEL
    { b: "Cascavel", c: "21308", n: "Alexandre Magno Jacobs", t: "rodoviario" },
    { b: "Cascavel", c: "2119", n: "Alison Brun Domingos", t: "rodoviario" },
    { b: "Cascavel", c: "14733", n: "Alvandir Alves de Oliveira", t: "rodoviario" },
    { b: "Cascavel", c: "1993", n: "Amilton Golub", t: "rodoviario" },
    { b: "Cascavel", c: "1544", n: "Atair do Bonfim", t: "rodoviario" },
    { b: "Cascavel", c: "1389", n: "Claudemir Galvan", t: "rodoviario" },
    { b: "Cascavel", c: "1402", n: "Claudemar Pasti", t: "rodoviario" },
    { b: "Cascavel", c: "2095", n: "Daniel Eduardo da Cruz", t: "rodoviario" },
    { b: "Cascavel", c: "2263", n: "Davi dos Santos Moraes", t: "rodoviario" },
    { b: "Cascavel", c: "2083", n: "Deoclides Marcos da Silveira", t: "rodoviario" },
    { b: "Cascavel", c: "SC004", n: "Edson José Herdt Pontos", t: "rodoviario" },
    { b: "Cascavel", c: "2174", n: "Magno Elias Zanatta", t: "rodoviario" },
    { b: "Cascavel", c: "2176", n: "Mauricio dos Santos Melo", t: "rodoviario" },
    { b: "Cascavel", c: "19450", n: "Odair Soares de Carvalho", t: "rodoviario" },
    { b: "Cascavel", c: "2031", n: "Ronaldo de Souza", t: "rodoviario" },
    { b: "Cascavel", c: "1759", n: "Santiago Teixeira Bertolino", t: "rodoviario" },
    { b: "Cascavel", c: "1816", n: "Valderi de Jesus Fernando", t: "rodoviario" },
    { b: "Cascavel", c: "2057", n: "Wandei Braz de Camargo", t: "rodoviario" },
    // RODOVIÁRIOS - CAMPINAS
    { b: "Campinas", c: "2032", n: "Adriano Oliveira de Souza", t: "rodoviario" },
    { b: "Campinas", c: "1301", n: "Alex Rubens Tiba Fiori", t: "rodoviario" },
    { b: "Campinas", c: "2182", n: "Adalberto Junior da Silva Crurz", t: "rodoviario" },
    { b: "Campinas", c: "SC005", n: "Alan Junio da Silva", t: "rodoviario" },
    { b: "Campinas", c: "SC006", n: "Claudio Aparecido Maximiniano", t: "rodoviario" },
    { b: "Campinas", c: "2094", n: "Edson Antonio da Silva", t: "rodoviario" },
    { b: "Campinas", c: "2249", n: "Ewerton Luiz Cabral", t: "rodoviario" },
    { b: "Campinas", c: "1996", n: "Gustavo Gonsalves do Nascimento", t: "rodoviario" },
    { b: "Campinas", c: "2224", n: "João Vitor Quirino da Silva", t: "rodoviario" },
    { b: "Campinas", c: "2078", n: "João Gabriel Lima dos Santos", t: "rodoviario" },
    { b: "Campinas", c: "2106", n: "José Antonio da Silva", t: "rodoviario" },
    { b: "Campinas", c: "1841", n: "Luciano Pereira da Silva", t: "rodoviario" },
    { b: "Campinas", c: "2118", n: "Luiz Lopes", t: "rodoviario" },
    { b: "Campinas", c: "2079", n: "Marcelo Magalhães", t: "rodoviario" },
    { b: "Campinas", c: "2158", n: "Marcos Willian da Silva", t: "rodoviario" },
    { b: "Campinas", c: "2089", n: "Moisés Alves Teixeira", t: "rodoviario" },
    { b: "Campinas", c: "2044", n: "Otávio Augusto dos Santos Custódio Pinheiro", t: "rodoviario" },
    { b: "Campinas", c: "2248", n: "Renan Narciso de Paris", t: "rodoviario" },
    { b: "Campinas", c: "2183", n: "Ricardo Edgar Quarenta", t: "rodoviario" },
    { b: "Campinas", c: "2017", n: "Valdemir dos Santos", t: "rodoviario" },
    { b: "Campinas", c: "2240", n: "William Biet Oliveira", t: "rodoviario" },
    { b: "Campinas", c: "1802", n: "Willian dos Santos de Moura", t: "rodoviario" },
    // RODOVIÁRIOS - CAMPO MOURÃO
    { b: "Campo Mourão", c: "19413", n: "Ademir Ribeiro Pepineli", t: "rodoviario" },
    { b: "Campo Mourão", c: "85", n: "Adenilson Araújo do Vale", t: "rodoviario" },
    { b: "Campo Mourão", c: "21712", n: "Adriano Luiz Ramos", t: "rodoviario" },
    { b: "Campo Mourão", c: "2177", n: "Alan Jones Duarte de Lima", t: "rodoviario" },
    { b: "Campo Mourão", c: "1375", n: "Aldair da Silva", t: "rodoviario" },
    { b: "Campo Mourão", c: "1944", n: "Altervir Silveira da Silva", t: "rodoviario" },
    { b: "Campo Mourão", c: "1549", n: "Carlos Barbosa de Oliveira", t: "rodoviario" },
    { b: "Campo Mourão", c: "21825", n: "Cilas Rosa Sobrinho", t: "rodoviario" },
    { b: "Campo Mourão", c: "2011", n: "Cleber Gabriel da Rocha", t: "rodoviario" },
    { b: "Campo Mourão", c: "2133", n: "Davi Cardoso de Oliveira", t: "rodoviario" },
    { b: "Campo Mourão", c: "70", n: "Denis Isao Okubo", t: "rodoviario" },
    { b: "Campo Mourão", c: "21869", n: "Douglas Vieira Santana", t: "rodoviario" },
    { b: "Campo Mourão", c: "322", n: "Edevanildo Francisco Lima", t: "rodoviario" },
    { b: "Campo Mourão", c: "1091", n: "Elton Jonnatan dos Santos", t: "rodoviario" },
    { b: "Campo Mourão", c: "21893", n: "Erivaldo da Cruz", t: "rodoviario" },
    { b: "Campo Mourão", c: "1088", n: "Fernando Ferreira da Silva", t: "rodoviario" },
    { b: "Campo Mourão", c: "2065", n: "Ismael Dias de Souza Ventura", t: "rodoviario" },
    { b: "Campo Mourão", c: "1669", n: "lury Araújo do Vale", t: "rodoviario" },
    { b: "Campo Mourão", c: "1967", n: "Jadson Enéias Fidelis", t: "rodoviario" },
    { b: "Campo Mourão", c: "1966", n: "João Paulo Souza de Lima", t: "rodoviario" },
    { b: "Campo Mourão", c: "21388", n: "Jhione Cleiton Coelho Capiche", t: "rodoviario" },
    { b: "Campo Mourão", c: "20316", n: "Jonatas do Nascimento", t: "rodoviario" },
    { b: "Campo Mourão", c: "20874", n: "Junior Stevanelli Martins", t: "rodoviario" },
    { b: "Campo Mourão", c: "21853", n: "Paulo João dos Santos", t: "rodoviario" },
    { b: "Campo Mourão", c: "SC007", n: "Paulo Sergio Nascimento", t: "rodoviario" },
    { b: "Campo Mourão", c: "1315", n: "Reginaldo de Paula", t: "rodoviario" },
    { b: "Campo Mourão", c: "1422", n: "Reginaldo Vitorino de Oliveira", t: "rodoviario" },
    { b: "Campo Mourão", c: "1823", n: "Robson Kummorow Ferreira", t: "rodoviario" },
    { b: "Campo Mourão", c: "1978", n: "Rodrigo Aparecido Mafra de Assis", t: "rodoviario" },
    { b: "Campo Mourão", c: "527", n: "Rodrigo Antonio Viana", t: "rodoviario" },
    { b: "Campo Mourão", c: "2087", n: "Romário da Silva", t: "rodoviario" },
    { b: "Campo Mourão", c: "2053", n: "Romário Santos Sá", t: "rodoviario" },
    { b: "Campo Mourão", c: "1294", n: "Sandro Estevam de Almeida", t: "rodoviario" },
    { b: "Campo Mourão", c: "1308", n: "Sergio Miguel da Silva", t: "rodoviario" },
    { b: "Campo Mourão", c: "2148", n: "Serzio Antonio de Barros", t: "rodoviario" },
    { b: "Campo Mourão", c: "20733", n: "Tiago da Silva", t: "rodoviario" },
    { b: "Campo Mourão", c: "2227", n: "Tiago da Silva", t: "rodoviario" },
    { b: "Campo Mourão", c: "2147", n: "Thiago Borges de Lima", t: "rodoviario" },
    { b: "Campo Mourão", c: "1219", n: "Wesley Diogo Gomes Vieria", t: "rodoviario" },
    // RODOVIÁRIOS - CURITIBA
    { b: "Curitiba", c: "1470", n: "Agripino Moreira de Almeida", t: "rodoviario" },
    { b: "Curitiba", c: "2123", n: "Alex Sandro Vasconcelos", t: "rodoviario" },
    { b: "Curitiba", c: "1501", n: "Anderson Antonio de Oliveira", t: "rodoviario" },
    { b: "Curitiba", c: "2234", n: "Antonio Luiz da Silva", t: "rodoviario" },
    { b: "Curitiba", c: "2253", n: "Aristides Medina da Silva", t: "rodoviario" },
    { b: "Curitiba", c: "1972", n: "Cleucir Alves Gonzales", t: "rodoviario" },
    { b: "Curitiba", c: "1861", n: "Djalma Lúcio de Souza Castro Yoshimoto", t: "rodoviario" },
    { b: "Curitiba", c: "2138", n: "Edson de Macedo França", t: "rodoviario" },
    { b: "Curitiba", c: "1862", n: "Edenilson Vaz de França", t: "rodoviario" },
    { b: "Curitiba", c: "1860", n: "Edinan Henrique Ferreira de Oliveira", t: "rodoviario" },
    { b: "Curitiba", c: "2270", n: "Eleandro Aparecido da Silva", t: "rodoviario" },
    { b: "Curitiba", c: "2213", n: "Estevão Alves de Jesus da Silva", t: "rodoviario" },
    { b: "Curitiba", c: "2273", n: "Everton Salatini", t: "rodoviario" },
    { b: "Curitiba", c: "1795", n: "Flávio Reis da Silva", t: "rodoviario" },
    { b: "Curitiba", c: "2159", n: "Harley Augusto Caetano Figueredo", t: "rodoviario" },
    { b: "Curitiba", c: "2108", n: "Jameson dos Santos Pereira", t: "rodoviario" },
    { b: "Curitiba", c: "2035", n: "Jean Douglas Gonsalves de Jesus", t: "rodoviario" },
    { b: "Curitiba", c: "1857", n: "Jailton Azeredo dos Santos", t: "rodoviario" },
    { b: "Curitiba", c: "2099", n: "João Barbosa dos Santos", t: "rodoviario" },
    { b: "Curitiba", c: "2091", n: "João Marcos Santana Machado", t: "rodoviario" },
    { b: "Curitiba", c: "1696", n: "Jorge Antonio Silva", t: "rodoviario" },
    { b: "Curitiba", c: "1923", n: "José Rafael Marques", t: "rodoviario" },
    { b: "Curitiba", c: "1798", n: "Laerson José de Santana", t: "rodoviario" },
    { b: "Curitiba", c: "1814", n: "Leandro aparecido dos Santos", t: "rodoviario" },
    { b: "Curitiba", c: "1909", n: "Leonardo Francisco da Silva", t: "rodoviario" },
    { b: "Curitiba", c: "1776", n: "Luiz Carlos do Nascimento", t: "rodoviario" },
    { b: "Curitiba", c: "2265", n: "Luiz Fernando Godoy de Arruda Grigoli", t: "rodoviario" },
    { b: "Curitiba", c: "1858", n: "Maicon Rodrigues Ribeiro", t: "rodoviario" },
    { b: "Curitiba", c: "789", n: "Nilton José Rodrigues", t: "rodoviario" },
    { b: "Curitiba", c: "2168", n: "Paulo Henrique dos Santos", t: "rodoviario" },
    { b: "Curitiba", c: "618", n: "Rafael de Souza Santos", t: "rodoviario" },
    { b: "Curitiba", c: "1885", n: "Reinaldo Moreira Filho", t: "rodoviario" },
    { b: "Curitiba", c: "1990", n: "Robisclei dos Santos Joaquim", t: "rodoviario" },
    { b: "Curitiba", c: "2019", n: "Thiago do Nascimento Flor", t: "rodoviario" },
    { b: "Curitiba", c: "2137", n: "Valdir Barbosa", t: "rodoviario" },
    { b: "Curitiba", c: "2264", n: "Wellington Biagio", t: "rodoviario" },
    { b: "Curitiba", c: "1342", n: "Willian Cleyton Siqueira", t: "rodoviario" },
    { b: "Curitiba", c: "21870", n: "Cesar Augusto Dias dos Santos", t: "rodoviario" },
    // RODOVIÁRIOS - FLORIANÓPOLIS
    { b: "Florianópolis", c: "2156", n: "Anderson Barreto Santos de Almeida", t: "rodoviario" },
    { b: "Florianópolis", c: "2004", n: "Carlos Alexandre da Costa Wolf", t: "rodoviario" },
    { b: "Florianópolis", c: "2164", n: "Douglas Zanqueti Ribeiro", t: "rodoviario" },
    { b: "Florianópolis", c: "2101", n: "Edivaldo de Jesus Andrade", t: "rodoviario" },
    { b: "Florianópolis", c: "1052", n: "Jeferson Luiz da Silva", t: "rodoviario" },
    { b: "Florianópolis", c: "2045", n: "Ferdinando Giareta", t: "rodoviario" },
    { b: "Florianópolis", c: "2127", n: "Gibram Vieira da Cruz", t: "rodoviario" },
    { b: "Florianópolis", c: "2155", n: "Giovani Beck Martins", t: "rodoviario" },
    { b: "Florianópolis", c: "2204", n: "Jaison Luiz Marafon", t: "rodoviario" },
    { b: "Florianópolis", c: "2005", n: "João Vitor Knevitz Cardoso", t: "rodoviario" },
    { b: "Florianópolis", c: "2201", n: "Leandro Rubin Dornelles", t: "rodoviario" },
    { b: "Florianópolis", c: "2203", n: "Lourinaldo da Silveira Souza", t: "rodoviario" },
    { b: "Florianópolis", c: "1887", n: "Luis Carlos Pivoto Dorneles", t: "rodoviario" },
    { b: "Florianópolis", c: "2216", n: "Mauricio D Angelo Nunes Krause", t: "rodoviario" },
    { b: "Florianópolis", c: "2171", n: "Nelson Italo Chaves Esteves", t: "rodoviario" },
    { b: "Florianópolis", c: "SC008", n: "Paul Wagner Oliveira", t: "rodoviario" },
    { b: "Florianópolis", c: "2097", n: "Paulo Sergio Rosa Batista", t: "rodoviario" },
    { b: "Florianópolis", c: "2096", n: "Rarisson André Aquino Vieira", t: "rodoviario" },
    { b: "Florianópolis", c: "1753", n: "Rangel Rosa", t: "rodoviario" },
    { b: "Florianópolis", c: "1176", n: "Silvano Feijó", t: "rodoviario" },
    { b: "Florianópolis", c: "2212", n: "Tiago Santos Silva", t: "rodoviario" },
    { b: "Florianópolis", c: "2141", n: "Veridiano Giareta", t: "rodoviario" },
    { b: "Florianópolis", c: "2140", n: "Wilson Meira da Silva", t: "rodoviario" },
    // RODOVIÁRIOS - FOZ DO IGUAÇU
    { b: "Foz do Iguaçu", c: "2207", n: "Alexandre Brisola Vieira", t: "rodoviario" },
    { b: "Foz do Iguaçu", c: "2175", n: "Antolim Ramom Cristaldo Velazquez", t: "rodoviario" },
    { b: "Foz do Iguaçu", c: "2007", n: "Cleiton B. de Oliveira", t: "rodoviario" },
    { b: "Foz do Iguaçu", c: "2052", n: "Denivaldo Dorta", t: "rodoviario" },
    { b: "Foz do Iguaçu", c: "2008", n: "Erivaldo Pereira de Macedo", t: "rodoviario" },
    { b: "Foz do Iguaçu", c: "2066", n: "Jean Patrick Cabral Felisberto", t: "rodoviario" },
    { b: "Foz do Iguaçu", c: "2082", n: "Nivaldo de Moraes Sampaio", t: "rodoviario" },
    { b: "Foz do Iguaçu", c: "2262", n: "Paulo Alexandre Dench Souza", t: "rodoviario" },
    { b: "Foz do Iguaçu", c: "1953", n: "Renato Freire dos Santos", t: "rodoviario" },
    { b: "Foz do Iguaçu", c: "2261", n: "Rodrigo Cezar Ardana", t: "rodoviario" },
    { b: "Foz do Iguaçu", c: "1662", n: "Sergio Augusto Ribeiro dos Santos", t: "rodoviario" },
    // RODOVIÁRIOS - GOIOERÊ
    { b: "Goioerê", c: "21806", n: "Allan Araújo de Oliveira", t: "rodoviario" },
    { b: "Goioerê", c: "18328", n: "Alvaro Agostini", t: "rodoviario" },
    { b: "Goioerê", c: "19994", n: "João Alves da Cunha", t: "rodoviario" },
    { b: "Goioerê", c: "21258", n: "José Aparecido Perecin", t: "rodoviario" },
    { b: "Goioerê", c: "21889", n: "José Tiago Pereira Valentim", t: "rodoviario" },
    { b: "Goioerê", c: "20362", n: "Lázaro Aparecido de Lima", t: "rodoviario" },
    { b: "Goioerê", c: "21857", n: "Leonardo Romeiro Alves", t: "rodoviario" },
    { b: "Goioerê", c: "19770", n: "Roberto do Carmo Ubaldino", t: "rodoviario" },
    // RODOVIÁRIOS - GUARAPUAVA
    { b: "Guarapuava", c: "2214", n: "Adriano de Lara", t: "rodoviario" },
    { b: "Guarapuava", c: "21479", n: "Ariquemes Junior Carneiro", t: "rodoviario" },
    { b: "Guarapuava", c: "21603", n: "Daniel Pacheco", t: "rodoviario" },
    { b: "Guarapuava", c: "1228", n: "Diego Pires Bueno Moreira", t: "rodoviario" },
    { b: "Guarapuava", c: "21739", n: "Everaldo José Michalesi", t: "rodoviario" },
    { b: "Guarapuava", c: "2226", n: "Guilherme Mayer Scholze", t: "rodoviario" },
    { b: "Guarapuava", c: "2193", n: "Gunter Koenig Netoi", t: "rodoviario" },
    { b: "Guarapuava", c: "1900", n: "Ildo de Campos Junior", t: "rodoviario" },
    { b: "Guarapuava", c: "21745", n: "Jociel Pieteniska Fonseca", t: "rodoviario" },
    { b: "Guarapuava", c: "1108", n: "Juliano de Oliveira", t: "rodoviario" },
    { b: "Guarapuava", c: "1210", n: "Julio Pereira Herbst", t: "rodoviario" },
    { b: "Guarapuava", c: "21218", n: "Marcelo Bueno Bertonceli", t: "rodoviario" },
    { b: "Guarapuava", c: "19019", n: "Neivaldo Carneiro", t: "rodoviario" },
    { b: "Guarapuava", c: "20527", n: "Pedro Celso Santos", t: "rodoviario" },
    { b: "Guarapuava", c: "19622", n: "Romildo Rodrigues da Silva", t: "rodoviario" },
    // RODOVIÁRIOS - IRATI
    { b: "Irati", c: "1432", n: "Cristiano Alves Kuller", t: "rodoviario" },
    { b: "Irati", c: "2018", n: "Eriton Miranda", t: "rodoviario" },
    { b: "Irati", c: "2167", n: "João Adriano Alves Pereira", t: "rodoviario" },
    { b: "Irati", c: "831", n: "José Bueno", t: "rodoviario" },
    { b: "Irati", c: "1667", n: "Nilton Junior Capote", t: "rodoviario" },
    { b: "Irati", c: "1613", n: "Paulo da Silva Gonsalves", t: "rodoviario" },
    { b: "Irati", c: "830", n: "William Dyego de Oliveira", t: "rodoviario" },
    // RODOVIÁRIOS - LAGES
    { b: "Lages", c: "1076", n: "Alexandre José Amaral Raulino", t: "rodoviario" },
    { b: "Lages", c: "1691", n: "Alisson Salomão Atanasio", t: "rodoviario" },
    { b: "Lages", c: "1079", n: "Claudio de Souza Santos", t: "rodoviario" },
    { b: "Lages", c: "2002", n: "Ezequiel Petry", t: "rodoviario" },
    { b: "Lages", c: "1964", n: "José Iradi da Silveira Mota", t: "rodoviario" },
    { b: "Lages", c: "2001", n: "Josiel Oliveira de Campos", t: "rodoviario" },
    { b: "Lages", c: "1085", n: "Lindomar Rodrigues", t: "rodoviario" },
    { b: "Lages", c: "1537", n: "Roseraldo Voni Moraes", t: "rodoviario" },
    { b: "Lages", c: "1771", n: "Vanderlei Duarte Camilo", t: "rodoviario" },
    // RODOVIÁRIOS - LONDRINA
    { b: "Londrina", c: "2157", n: "Amilton Fagundes Leião", t: "rodoviario" },
    { b: "Londrina", c: "2068", n: "Anderson dos Anjos Carmargo", t: "rodoviario" },
    { b: "Londrina", c: "2015", n: "Anderson José Hidaldo", t: "rodoviario" },
    { b: "Londrina", c: "2039", n: "Anderson da Silva Bueno", t: "rodoviario" },
    { b: "Londrina", c: "1520", n: "Adriano Aparecido Silverio", t: "rodoviario" },
    { b: "Londrina", c: "505", n: "Adriano José Batista", t: "rodoviario" },
    { b: "Londrina", c: "1208", n: "Amarildo dos Santos Trento", t: "rodoviario" },
    { b: "Londrina", c: "1015", n: "Cassio Alves de Moura", t: "rodoviario" },
    { b: "Londrina", c: "1961", n: "Claudian Leonel dos Santos", t: "rodoviario" },
    { b: "Londrina", c: "1602", n: "David Cicero Inácio", t: "rodoviario" },
    { b: "Londrina", c: "SC009", n: "Diogo Felipe de Oliveira Castro", t: "rodoviario" },
    { b: "Londrina", c: "2022", n: "Edson Rodrigues da Silva", t: "rodoviario" },
    { b: "Londrina", c: "1200", n: "Edival da Silva", t: "rodoviario" },
    { b: "Londrina", c: "1898", n: "Edivandro do Nascimento Ferreira", t: "rodoviario" },
    { b: "Londrina", c: "1677", n: "Everson Alan Momesso", t: "rodoviario" },
    { b: "Londrina", c: "2130", n: "Fábio Henrique Mattos", t: "rodoviario" },
    { b: "Londrina", c: "2103", n: "Gerson Henrique Ribeiro", t: "rodoviario" },
    { b: "Londrina", c: "421", n: "Jaime Carvalho da Costa", t: "rodoviario" },
    { b: "Londrina", c: "587", n: "João Marquesete Filho", t: "rodoviario" },
    { b: "Londrina", c: "2165", n: "Julio Cezar Alves da Silva", t: "rodoviario" },
    { b: "Londrina", c: "SC010", n: "Lucas de Paiva", t: "rodoviario" },
    { b: "Londrina", c: "SC011", n: "Matheus da Silva Venâncio dos Santos", t: "rodoviario" },
    { b: "Londrina", c: "1149", n: "Marcelo dos Santos Oliveira", t: "rodoviario" },
    { b: "Londrina", c: "1206", n: "Nilton de Souza Valério", t: "rodoviario" },
    { b: "Londrina", c: "2185", n: "Paulo de Oliveira", t: "rodoviario" },
    { b: "Londrina", c: "1998", n: "Wilson Brescia", t: "rodoviario" },
    { b: "Londrina", c: "2269", n: "Wanderson Bezerra da Silva", t: "rodoviario" },
    // RODOVIÁRIOS - MARINGÁ
    { b: "Maringá", c: "965", n: "Antonio Carlos de Lima", t: "rodoviario" },
    { b: "Maringá", c: "2258", n: "João Antonio do Prado", t: "rodoviario" },
    { b: "Maringá", c: "21827", n: "Jonathan Felipe Pereira da Luz", t: "rodoviario" },
    { b: "Maringá", c: "21850", n: "Mário Henrique Gonsalves", t: "rodoviario" },
    // RODOVIÁRIOS - MARILÂNDIA DO SUL
    { b: "Marilândia do Sul", c: "21090", n: "Adilson José de Almeida", t: "rodoviario" },
    { b: "Marilândia do Sul", c: "16349", n: "Antônio Ap. Lourenço", t: "rodoviario" },
    // RODOVIÁRIOS - PARANAVAÍ
    { b: "Paranavaí", c: "726", n: "Carlos Eduardo Torres Ferreira", t: "rodoviario" },
    { b: "Paranavaí", c: "SC012", n: "João Paulo Dias de Oliveira", t: "rodoviario" },
    { b: "Paranavaí", c: "1216", n: "Junior Mendonça Santos", t: "rodoviario" },
    { b: "Paranavaí", c: "2244", n: "Vanderlei Martins", t: "rodoviario" },
    { b: "Paranavaí", c: "727", n: "Vinícius José Claudino Santos", t: "rodoviario" },
    { b: "Paranavaí", c: "21828", n: "Wallace Denilson Moreno Moraes", t: "rodoviario" },
    { b: "Paranavaí", c: "21855", n: "William Batista Borges", t: "rodoviario" },
    // RODOVIÁRIOS - PONTA GROSSA
    { b: "Ponta Grossa", c: "193", n: "Abel de Carvalho", t: "rodoviario" },
    { b: "Ponta Grossa", c: "2081", n: "Alessandro de Jesus Martins dos Santos", t: "rodoviario" },
    { b: "Ponta Grossa", c: "1963", n: "Anderson Sovinski", t: "rodoviario" },
    { b: "Ponta Grossa", c: "1872", n: "Bruno Lima de Oliveira", t: "rodoviario" },
    { b: "Ponta Grossa", c: "474", n: "Carlos Alves Pereira", t: "rodoviario" },
    { b: "Ponta Grossa", c: "1532", n: "Cesar Cassiano da Silva", t: "rodoviario" },
    { b: "Ponta Grossa", c: "2151", n: "Cristiano Antunes Correira", t: "rodoviario" },
    { b: "Ponta Grossa", c: "1794", n: "David Ribeiro", t: "rodoviario" },
    { b: "Ponta Grossa", c: "1764", n: "Diego Cristiano de Almeida", t: "rodoviario" },
    { b: "Ponta Grossa", c: "1697", n: "Douglas Ricardo Martins de Araújo", t: "rodoviario" },
    { b: "Ponta Grossa", c: "2256", n: "Douglas Schmitt da Silva", t: "rodoviario" },
    { b: "Ponta Grossa", c: "2239", n: "Emerson Fernando Alves", t: "rodoviario" },
    { b: "Ponta Grossa", c: "1973", n: "Jardel Teixeira da Silva", t: "rodoviario" },
    { b: "Ponta Grossa", c: "2051", n: "João Alfredo Dias Silveira", t: "rodoviario" },
    { b: "Ponta Grossa", c: "2050", n: "João Ricardo Quadros Quentin", t: "rodoviario" },
    { b: "Ponta Grossa", c: "632", n: "Joarez Marcelo Valhux", t: "rodoviario" },
    { b: "Ponta Grossa", c: "1971", n: "Mauro Sergio da Silva Junior", t: "rodoviario" },
    { b: "Ponta Grossa", c: "SC013", n: "Odilon Emanuel Tarum Borges", t: "rodoviario" },
    { b: "Ponta Grossa", c: "1160", n: "Osmair Moraes de Jesus", t: "rodoviario" },
    { b: "Ponta Grossa", c: "2034", n: "Osnan Ferreira Haas", t: "rodoviario" },
    { b: "Ponta Grossa", c: "952", n: "Paulo Henrique Rodrigues de Mello", t: "rodoviario" },
    { b: "Ponta Grossa", c: "1793", n: "Rafhael de Oliveira Martins", t: "rodoviario" },
    { b: "Ponta Grossa", c: "2110", n: "Renato Aparecido Nunes de Oliveira", t: "rodoviario" },
    { b: "Ponta Grossa", c: "2062", n: "Robson Simar Pedroso", t: "rodoviario" },
    { b: "Ponta Grossa", c: "2180", n: "Rodrigo Batista", t: "rodoviario" },
    { b: "Ponta Grossa", c: "1164", n: "Rodrigo Canani de Paula", t: "rodoviario" },
    // RODOVIÁRIOS - PORTO ALEGRE
    { b: "Porto Alegre", c: "1060", n: "Adelir Tonieto", t: "rodoviario" },
    { b: "Porto Alegre", c: "1896", n: "Amauri de Jesus", t: "rodoviario" },
    { b: "Porto Alegre", c: "1600", n: "Ari Galvão", t: "rodoviario" },
    { b: "Porto Alegre", c: "2267", n: "Charles Anderson Tomasi", t: "rodoviario" },
    { b: "Porto Alegre", c: "990", n: "Denarde Mendes Bandeira", t: "rodoviario" },
    { b: "Porto Alegre", c: "2014", n: "Fabrício da Silva Dinatt", t: "rodoviario" },
    { b: "Porto Alegre", c: "2061", n: "Gilson Abreu", t: "rodoviario" },
    { b: "Porto Alegre", c: "2222", n: "Igor Romão Lopes Peroba", t: "rodoviario" },
    { b: "Porto Alegre", c: "1779", n: "José Antonio Pires Neto", t: "rodoviario" },
    { b: "Porto Alegre", c: "2060", n: "Leandro Aguiar dos Santos", t: "rodoviario" },
    { b: "Porto Alegre", c: "1881", n: "Leandro Quintanilha dos Santos", t: "rodoviario" },
    { b: "Porto Alegre", c: "1930", n: "Matheus Kalata do Amaral", t: "rodoviario" },
    { b: "Porto Alegre", c: "2075", n: "Nathan Quevedo Ribeiro", t: "rodoviario" },
    { b: "Porto Alegre", c: "2218", n: "Neri Cesar da Silva", t: "rodoviario" },
    { b: "Porto Alegre", c: "1977", n: "Paulo Rogério Tenedini", t: "rodoviario" },
    { b: "Porto Alegre", c: "2013", n: "Paulo Victor Nunes Rocha", t: "rodoviario" },
    { b: "Porto Alegre", c: "2154", n: "Renato Cesar da Silva Bittencout", t: "rodoviario" },
    { b: "Porto Alegre", c: "2268", n: "Rodrigo Nascimento Machado", t: "rodoviario" },
    { b: "Porto Alegre", c: "2030", n: "Vagner da Silva Glapinski", t: "rodoviario" },
    // RODOVIÁRIOS - RONCADOR
    { b: "Roncador", c: "21852", n: "Alessandro Koziel", t: "rodoviario" },
    { b: "Roncador", c: "19169", n: "Celso Joenk", t: "rodoviario" },
    { b: "Roncador", c: "20988", n: "Diego Carmona de Souza", t: "rodoviario" },
    { b: "Roncador", c: "21563", n: "José Hilareski Junior", t: "rodoviario" },
    { b: "Roncador", c: "21608", n: "Roni Padilha Izaias", t: "rodoviario" },
    { b: "Roncador", c: "751", n: "Valter Rodrigues Carneiro", t: "rodoviario" },
    // RODOVIÁRIOS - PITANGA
    { b: "Pitanga", c: "16653", n: "Antonio de Jesus de Campos", t: "rodoviario" },
    { b: "Pitanga", c: "20210", n: "Claudecir de Araújo", t: "rodoviario" },
    { b: "Pitanga", c: "2228", n: "Cristiano Junior Lorazetli", t: "rodoviario" },
    { b: "Pitanga", c: "21747", n: "José de Oliveira", t: "rodoviario" },
    { b: "Pitanga", c: "17969", n: "Mário Sérgio Kuchuruba", t: "rodoviario" },
    { b: "Pitanga", c: "21453", n: "Roberto Rank", t: "rodoviario" },
    { b: "Pitanga", c: "21756", n: "Roni Willian dos Santos Caetano", t: "rodoviario" },
    // RODOVIÁRIOS - SÃO PAULO
    { b: "São Paulo", c: "1086", n: "Ernesto leite dos Santos Junior", t: "rodoviario" },
    { b: "São Paulo", c: "SC014", n: "Flávio da Silva Santana", t: "rodoviario" },
    { b: "São Paulo", c: "SC015", n: "Gustavo Cardoso dos Santos", t: "rodoviario" },
    { b: "São Paulo", c: "1878", n: "Jairo Cordeiro de Oliveira", t: "rodoviario" },
    { b: "São Paulo", c: "1460", n: "José Ferreira da Silva Filho", t: "rodoviario" },
    { b: "São Paulo", c: "2206", n: "Lucinei Delbone", t: "rodoviario" },
    { b: "São Paulo", c: "2063", n: "Marcio José dos Santos", t: "rodoviario" },
    { b: "São Paulo", c: "2117", n: "Marcelo Ramos de Lima", t: "rodoviario" },
    { b: "São Paulo", c: "2254", n: "Marcos Antonio Donato de Mesquita", t: "rodoviario" },
    { b: "São Paulo", c: "2113", n: "Orley de Melo Brasil", t: "rodoviario" },
    { b: "São Paulo", c: "2020", n: "Sandro Leite de Moraes", t: "rodoviario" },
    { b: "São Paulo", c: "SC016", n: "Thiago Fernandes Bezerra", t: "rodoviario" },
    // RODOVIÁRIOS - TOLEDO
    { b: "Toledo", c: "2121", n: "Alceu Silva de Almeida Junior", t: "rodoviario" },
    { b: "Toledo", c: "1908", n: "Alexsandro dos Santos de Souza", t: "rodoviario" },
    { b: "Toledo", c: "21918", n: "Anderson Alves de Souza", t: "rodoviario" },
    { b: "Toledo", c: "2144", n: "Anderson Vieira", t: "rodoviario" },
    { b: "Toledo", c: "20572", n: "Calaudino Ribeiro", t: "rodoviario" },
    { b: "Toledo", c: "1852", n: "Calil Ferreira Ramos", t: "rodoviario" },
    { b: "Toledo", c: "19102", n: "Carlos Roberto Santos", t: "rodoviario" },
    { b: "Toledo", c: "21569", n: "Claudenir José da Silva", t: "rodoviario" },
    { b: "Toledo", c: "21748", n: "Diego Rogério de Oliveira Pava", t: "rodoviario" },
    { b: "Toledo", c: "21676", n: "Gilmar Leocadio Alves", t: "rodoviario" },
    { b: "Toledo", c: "21917", n: "Jhony Luan da Silva Teixeira", t: "rodoviario" },
    { b: "Toledo", c: "21485", n: "José Lucas Barbosa", t: "rodoviario" },
    { b: "Toledo", c: "1834", n: "Luciano Nunes da Silva", t: "rodoviario" },
    { b: "Toledo", c: "21670", n: "Luiz Guilherme Ferreira Pinheiro", t: "rodoviario" },
    { b: "Toledo", c: "20438", n: "Marcio Roberto Kelm", t: "rodoviario" },
    { b: "Toledo", c: "20879", n: "Nilton Batista Maciel", t: "rodoviario" },
    { b: "Toledo", c: "21468", n: "Rafael Augusto de Oliveira", t: "rodoviario" },
    { b: "Toledo", c: "21349", n: "Valmir Dechotti", t: "rodoviario" },
    
    // FRETAMENTO COAMO
    { b: "Fretamento Coamo", c: "21527", n: "Anderson Nunes Paulista", t: "fretamento" },
    { b: "Fretamento Coamo", c: "21273", n: "Fernando Rodrigo de Lima", t: "fretamento" },
    { b: "Fretamento Coamo", c: "21687", n: "Jair José Rozão", t: "fretamento" },
    { b: "Fretamento Coamo", c: "21358", n: "Leonil Arruda de Freitas", t: "fretamento" },
    { b: "Fretamento Coamo", c: "20584", n: "Oracílio Martins da Costa", t: "fretamento" },
    
    // FRETAMENTO UNITÁ
    { b: "Fretamento Unitá", c: "21236", n: "Alan Dione Amaro", t: "fretamento" },
    { b: "Fretamento Unitá", c: "21370", n: "Célio de Lima", t: "fretamento" },
    { b: "Fretamento Unitá", c: "21589", n: "Elizeu Machado dos Santos", t: "fretamento" },
    { b: "Fretamento Unitá", c: "21229", n: "Gervasio Godoi Junior", t: "fretamento" },
    { b: "Fretamento Unitá", c: "21845", n: "Lucas Pereira de Freitas", t: "fretamento" },
    { b: "Fretamento Unitá", c: "21851", n: "Orlei Mendes", t: "fretamento" },
    { b: "Fretamento Unitá", c: "21913", n: "Ronaldo David da Silva", t: "fretamento" },
    { b: "Fretamento Unitá", c: "21586", n: "Anderson de Almeida Martins", t: "fretamento" },
    { b: "Fretamento Unitá", c: "20004", n: "Edinelson de Araújo Vasconcelos", t: "fretamento" },
    { b: "Fretamento Unitá", c: "21752", n: "Jeferson Luiz Godoi da Silva", t: "fretamento" },
    { b: "Fretamento Unitá", c: "21246", n: "Jefferson Lopes de Souza", t: "fretamento" },
    { b: "Fretamento Unitá", c: "21226", n: "Luiz Carlos Pelizaro", t: "fretamento" },
    { b: "Fretamento Unitá", c: "21588", n: "Maurício Portela Francisco", t: "fretamento" },
    { b: "Fretamento Unitá", c: "21838", n: "Odair Pereira da Silva", t: "fretamento" },
    { b: "Fretamento Unitá", c: "21587", n: "Valdeci Tavares de Lima", t: "fretamento" },
    { b: "Fretamento Unitá", c: "20415", n: "Valdenei Chelni", t: "fretamento" },
    { b: "Fretamento Unitá", c: "21242", n: "Vilson Costa Cristo", t: "fretamento" },
    { b: "Fretamento Unitá", c: "21372", n: "Wagner Danilo Evangelista", t: "fretamento" },
    
    // FRETAMENTO COOPACOL
    { b: "Fretamento Coopacol", c: "21887", n: "Alex Sandro de Oliveira Ferreira", t: "fretamento" },
    { b: "Fretamento Coopacol", c: "21791", n: "Claudemir Chagas", t: "fretamento" },
    { b: "Fretamento Coopacol", c: "21846", n: "Cristiano José Haubert", t: "fretamento" },
    { b: "Fretamento Coopacol", c: "20424", n: "Edimar Bazzoti Amaral", t: "fretamento" },
    { b: "Fretamento Coopacol", c: "21243", n: "Emerson José da Silva", t: "fretamento" },
    { b: "Fretamento Coopacol", c: "20430", n: "Erasmo Carlos Garcia", t: "fretamento" },
    { b: "Fretamento Coopacol", c: "19739", n: "Jose Carlos Teixera", t: "fretamento" },
    { b: "Fretamento Coopacol", c: "20953", n: "Luiz Carlos da Silva", t: "fretamento" },
    { b: "Fretamento Coopacol", c: "19835", n: "Marcos A. A. Pereira", t: "fretamento" },
    { b: "Fretamento Coopacol", c: "20568", n: "Marcos Aparecido de Souza", t: "fretamento" },
    { b: "Fretamento Coopacol", c: "21810", n: "Valdir llário Schmidt", t: "fretamento" },
    { b: "Fretamento Coopacol", c: "21907", n: "Robson Luiz Ovani", t: "fretamento" },
    { b: "Fretamento Coopacol", c: "21881", n: "Devanir da Silva Bertolino", t: "fretamento" },
    { b: "Fretamento Coopacol", c: "21899", n: "Geisiel Lucas Martins", t: "fretamento" },
    { b: "Fretamento Coopacol", c: "SC017", n: "Marciano André Wecker", t: "fretamento" },
    { b: "Fretamento Coopacol", c: "21365", n: "William de Souza Eugenio", t: "fretamento" },
    
    // FRETAMENTO JBS
    { b: "Fretamento JBS", c: "1628", n: "Alexandre Klabundi", t: "fretamento" },
    { b: "Fretamento JBS", c: "2257", n: "Antonio Carlos Elias", t: "fretamento" },
    { b: "Fretamento JBS", c: "1632", n: "Dirceu Nogueira Ortega", t: "fretamento" },
    { b: "Fretamento JBS", c: "2266", n: "Jideon José dos Santos", t: "fretamento" },
    { b: "Fretamento JBS", c: "1761", n: "Giovane Carvalho de Almeida", t: "fretamento" },
    { b: "Fretamento JBS", c: "1640", n: "Marcos Rogério Souza", t: "fretamento" },
    { b: "Fretamento JBS", c: "1641", n: "Odair dos Santos Custódio", t: "fretamento" },
    { b: "Fretamento JBS", c: "1689", n: "Rubens Adriano Ferreira da Silva", t: "fretamento" },
    { b: "Fretamento JBS", c: "1688", n: "Wagner Antonio da Silva", t: "fretamento" },
    { b: "Fretamento JBS", c: "2237", n: "Alisson da Silva Galvão", t: "fretamento" },
    { b: "Fretamento JBS", c: "1630", n: "Claudinei Lopes da Silveira", t: "fretamento" },
    { b: "Fretamento JBS", c: "1631", n: "Claudio Procópio de Souza", t: "fretamento" },
    { b: "Fretamento JBS", c: "1633", n: "Elias Gularte", t: "fretamento" },
    { b: "Fretamento JBS", c: "1943", n: "Fernando Ferreira da Silva", t: "fretamento" },
    { b: "Fretamento JBS", c: "1642", n: "Paulo Silva", t: "fretamento" },
    { b: "Fretamento JBS", c: "1989", n: "Ronaldo Pereira", t: "fretamento" },
    { b: "Fretamento JBS", c: "1625", n: "Adarildo Gonçalves dos Santos", t: "fretamento" },
    { b: "Fretamento JBS", c: "1755", n: "Alisson Verly Vaz", t: "fretamento" },
    { b: "Fretamento JBS", c: "1648", n: "Celso Anastácio Amaro", t: "fretamento" },
    { b: "Fretamento JBS", c: "1675", n: "Devanir José de Souza", t: "fretamento" },
    { b: "Fretamento JBS", c: "1773", n: "Enoque M. de Oliveira", t: "fretamento" },
    { b: "Fretamento JBS", c: "2211", n: "Marisa Silva Pereira Toebe", t: "fretamento" },
    { b: "Fretamento JBS", c: "2139", n: "Vanessa Prado de Paula", t: "fretamento" }
];

// --- SISTEMA DE LOGIN ---
function realizarLogin(e) {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const errorMsg = document.getElementById('loginError');

    if (user === 'admin' && pass === 'expresso') {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
        initApp(); 
    } else {
        errorMsg.style.display = 'block';
    }
}

function sairSistema() {
    document.getElementById('mainApp').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('loginError').style.display = 'none';
}

// --- NAVEGAÇÃO DE ABAS ---
function switchMainTab(tabName) {
    document.querySelectorAll('.main-tab').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById('tab-' + tabName).classList.add('active');
    document.getElementById('view-' + tabName).classList.add('active');
}

function switchSector(sector) {
    currentSector = sector;
    document.querySelectorAll('.sector-tab').forEach(btn => btn.classList.remove('active'));
    document.getElementById('sec-' + sector).classList.add('active');
    renderTable();
}

// --- INICIALIZAÇÃO DO APP ---
function initApp() {
    const savedApprover = localStorage.getItem('approverName');
    if (savedApprover) {
        document.getElementById('approverName').value = savedApprover;
        currentApprover = savedApprover;
    } else {
        document.getElementById('approverName').value = "Kaio";
        currentApprover = "Kaio";
    }

    const today = new Date().toISOString().split('T')[0];
    document.getElementById('datePicker').value = today;
    
    driversRef.once('value', (snapshot) => {
        driversRef.set(cleanDriverList);
    });

    driversRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            driverList = data;
            sortDriverList();
            renderTable();
        }
    });

    dbRef.on('value', (snapshot) => {
        db = snapshot.val() || {};
        renderTable();
        if(selectedIndivCad) renderIndividualPeriod(); 
        updateStatus(true);
    }, (error) => {
        console.error(error);
        updateStatus(false);
    });

    loadDate();
}

function updateStatus(online) {
    const el = document.getElementById('connectionStatus');
    if (online) {
        el.innerHTML = '<i class="fas fa-check-circle"></i> Sincronizado ao Servidor';
        el.className = 'status-connection status-online';
    } else {
        el.innerHTML = '<i class="fas fa-times-circle"></i> Servidor Offline';
        el.className = 'status-connection status-offline';
    }
}

function saveConfig() {
    currentApprover = document.getElementById('approverName').value;
    localStorage.setItem('approverName', currentApprover);
}

function sortDriverList() {
    driverList.sort((a, b) => {
        if (a.b < b.b) return -1;
        if (a.b > b.b) return 1;
        return a.n.localeCompare(b.n);
    });
}

function loadDate() {
    currentDateKey = document.getElementById('datePicker').value;
    if (!currentDateKey) return;
    renderTable();
}

// --- RENDERS COM NOVOS STATUS E ÍCONE DE HISTÓRICO ---
function renderTable() {
    const container = document.getElementById('tableContainer');
    if(!container) return;
    container.innerHTML = "";

    let countOK = 0;
    let countPending = 0;
    let totalSector = 0;

    const groups = {};
    driverList.forEach(d => {
        const tipo = d.t || 'rodoviario';
        if(tipo === currentSector) {
            if(!groups[d.b]) groups[d.b] = [];
            groups[d.b].push(d);
            totalSector++;
        }
    });

    const dayRecords = db[currentDateKey] || {};
    const sortedBranches = Object.keys(groups).sort();

    for (const branch of sortedBranches) {
        const drivers = groups[branch];
        const block = document.createElement('div');
        block.className = 'branch-block';

        let html = `
            <div class="branch-head">
                <span class="branch-name"><i class="fas fa-map-marker-alt"></i> ${branch}</span>
                <button class="btn-branch-approve" onclick="approveBranch('${branch}')">
                    <i class="fas fa-check"></i> Aprovar Filial (Tela)
                </button>
            </div>
            <table class="modern-table">
                <thead>
                    <tr>
                        <th width="10%">CAD</th>
                        <th width="25%">Nome</th>
                        <th width="18%">Status</th>
                        <th width="22%">Observação / Motivo</th>
                        <th width="13%">Aprovador</th>
                        <th width="12%">Hora Ação</th>
                    </tr>
                </thead>
                <tbody>
        `;

        drivers.forEach(d => {
            const record = dayRecords[d.c]; 
            const status = record ? record.status : "Pendente";
            const obs = record ? record.obs : "";
            const approver = record ? record.approver : "-";
            const time = record ? record.time : "-";

            if (status === 'OK' || status === 'Verificado') countOK++;
            else countPending++;

            let badgeClass = status === 'OK' ? 'st-ok' : (status === 'Erro' ? 'st-erro' : (status === 'Verificado' ? 'st-verificado' : 'st-pendente'));
            let statusLabel = status === 'OK' ? 'Aprovado' : (status === 'Erro' ? 'Reprovado' : (status === 'Verificado' ? 'Verificado' : 'Pendente'));

            html += `
                <tr>
                    <td><b>${d.c}</b></td>
                    <td>${d.n}</td>
                    <td>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span class="status-badge ${badgeClass}" onclick="cycleStatus('${d.c}', '${currentDateKey}')">${statusLabel}</span>
                            <i class="fas fa-history text-muted" style="cursor:pointer; font-size:14px;" onclick="openHistoryModal('${d.c}', '${currentDateKey}')" title="Ver Histórico"></i>
                        </div>
                    </td>
                    <td>
                        <input type="text" class="obs-input" placeholder="Justificativa..." 
                        value="${obs}" onblur="saveObs('${d.c}', '${currentDateKey}', this.value)">
                    </td>
                    <td style="color:var(--brand); font-weight:700; font-size:12px;">${approver}</td>
                    <td style="font-size:12px; color:var(--text-muted);">${time}</td>
                </tr>
            `;
        });

        html += `</tbody></table>`;
        block.innerHTML = html;
        container.appendChild(block);
    }

    if (totalSector === 0) {
        container.innerHTML = `<div style="text-align:center; padding: 40px; color:var(--text-muted); font-size:16px;">Nenhum colaborador na base para o setor: <b>${currentSector === 'rodoviario' ? 'Rodoviário' : 'Fretamento'}</b>.</div>`;
    }

    document.getElementById('count-ok').innerText = countOK;
    document.getElementById('count-pending').innerText = countPending;
    document.getElementById('count-total').innerText = totalSector;
}

function renderIndividualPeriod() {
    if (!selectedIndivCad) return;
    const startVal = document.getElementById('indivStartDate').value;
    const endVal = document.getElementById('indivEndDate').value;

    if(!startVal || !endVal) {
        document.getElementById('indivPeriodContainer').style.display = 'none';
        return;
    }

    const start = new Date(startVal + "T12:00:00");
    const end = new Date(endVal + "T12:00:00");

    if(start > end) {
        document.getElementById('indivPeriodContainer').style.display = 'none';
        return;
    }

    document.getElementById('indivPeriodContainer').style.display = 'block';
    const tbody = document.getElementById('indivPeriodTableBody');
    tbody.innerHTML = '';

    let loopDate = new Date(start);
    while (loopDate <= end) {
        const dateKeyStr = loopDate.toISOString().split('T')[0];
        const record = (db[dateKeyStr] && db[dateKeyStr][selectedIndivCad]) ? db[dateKeyStr][selectedIndivCad] : null;
        
        const status = record ? record.status : "Pendente";
        const obs = record ? record.obs : "";
        const approver = record ? record.approver : "-";
        const time = record ? record.time : "-";

        let badgeClass = status === 'OK' ? 'st-ok' : (status === 'Erro' ? 'st-erro' : (status === 'Verificado' ? 'st-verificado' : 'st-pendente'));
        let statusLabel = status === 'OK' ? 'Aprovado' : (status === 'Erro' ? 'Reprovado' : (status === 'Verificado' ? 'Verificado' : 'Pendente'));
        let dataStr = loopDate.toLocaleDateString('pt-BR');

        tbody.innerHTML += `
            <tr>
                <td style="font-weight:700; color:var(--text);">${dataStr}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span class="status-badge ${badgeClass}" style="cursor:default;">${statusLabel}</span>
                        <i class="fas fa-history text-muted" style="cursor:pointer; font-size:14px;" onclick="openHistoryModal('${selectedIndivCad}', '${dateKeyStr}')" title="Ver Histórico"></i>
                    </div>
                </td>
                <td>
                    <input type="text" class="obs-input" placeholder="Justificativa / Motivo..." 
                    value="${obs}" onblur="saveObs('${selectedIndivCad}', '${dateKeyStr}', this.value)">
                </td>
                <td>
                    <div style="font-weight:700; color:var(--brand); font-size:13px;">${approver}</div>
                    <div style="font-size:11px; color:var(--text-muted);">${time}</div>
                </td>
                <td>
                    <div style="display:flex; gap:5px;">
                        <button class="btn btn-save btn-small" onclick="applyIndividualDayAction('${dateKeyStr}', 'OK')" title="Aprovar este dia"><i class="fas fa-check"></i></button>
                        <button class="btn btn-reprove btn-small" onclick="applyIndividualDayAction('${dateKeyStr}', 'Erro')" title="Reprovar este dia"><i class="fas fa-times"></i></button>
                        <button class="btn btn-undo btn-small" onclick="applyIndividualDayAction('${dateKeyStr}', 'Pendente')" title="Voltar Pendente"><i class="fas fa-undo"></i></button>
                    </div>
                </td>
            </tr>
        `;
        loopDate.setDate(loopDate.getDate() + 1);
    }
}

// --- CICLOS E LOGS COM DATA DA REALIZAÇÃO ---
function cycleStatus(cad, dateKeyStr) {
    if (!currentApprover) { alert("Insira seu nome no topo da tela para aprovar!"); return; }
    const currentRecord = (db[dateKeyStr] && db[dateKeyStr][cad]) ? db[dateKeyStr][cad] : null;
    const currentStatus = currentRecord ? currentRecord.status : "Pendente";
    
    let next = "OK";
    if (currentStatus === "Pendente") next = "OK";
    else if (currentStatus === "OK") next = "Erro";
    else if (currentStatus === "Erro") next = "Verificado";
    else if (currentStatus === "Verificado") next = "Pendente";
    
    const path = `pontos/${dateKeyStr}/${cad}`;
    const timeNow = new Date().toLocaleTimeString('pt-BR');
    const dateRealization = new Date().toLocaleDateString('pt-BR');
    
    let historyObj = (currentRecord && currentRecord.history) ? currentRecord.history : {};
    const logId = Date.now() + "_" + Math.floor(Math.random() * 1000);
    
    historyObj[logId] = {
        status: next,
        approver: currentApprover,
        time: timeNow,
        actionDate: dateRealization
    };

    database.ref(path).set({ 
        status: next, 
        approver: currentApprover, 
        time: timeNow, 
        actionDate: dateRealization, 
        obs: currentRecord ? currentRecord.obs : "",
        history: historyObj
    });
}

function saveObs(cad, dateKeyStr, text) {
    const path = `pontos/${dateKeyStr}/${cad}`;
    const currentRecord = (db[dateKeyStr] && db[dateKeyStr][cad]) ? db[dateKeyStr][cad] : null;
    if (!currentRecord) {
        const timeNow = new Date().toLocaleTimeString('pt-BR');
        const dateRealization = new Date().toLocaleDateString('pt-BR');
        let historyObj = {};
        historyObj[Date.now()] = { status: "Pendente", approver: "-", time: timeNow, actionDate: dateRealization };
        database.ref(path).set({ status: "Pendente", approver: "-", time: timeNow, actionDate: dateRealization, obs: text, history: historyObj });
    } else {
        database.ref(path).update({ obs: text });
    }
}

function approveBranch(branchName) {
    if (!currentApprover) { alert("Insira seu nome no topo da tela!"); return; }
    if (!confirm(`Confirmar aprovação de TODOS os motoristas exibidos na filial ${branchName}?`)) return;
    const timeNow = new Date().toLocaleTimeString('pt-BR');
    const dateRealization = new Date().toLocaleDateString('pt-BR');
    const updates = {};
    let idx = 0;

    driverList.forEach(d => {
        const tipo = d.t || 'rodoviario';
        if (d.b === branchName && tipo === currentSector) {
            const currentRecord = (db[currentDateKey] && db[currentDateKey][d.c]) ? db[currentDateKey][d.c] : null;
            const currentObs = currentRecord ? currentRecord.obs : "";
            let historyObj = (currentRecord && currentRecord.history) ? currentRecord.history : {};
            
            historyObj[Date.now() + "_" + (idx++)] = { status: "OK", approver: currentApprover, time: timeNow, actionDate: dateRealization };
            updates[`pontos/${currentDateKey}/${d.c}`] = { status: "OK", approver: currentApprover, time: timeNow, actionDate: dateRealization, obs: currentObs, history: historyObj };
        }
    });
    database.ref().update(updates);
}

// --- AÇÕES EM MASSA ---
function approveAllDaily() {
    if (!currentApprover) { alert("Nome de Aprovador Obrigatório!"); return; }
    if (!confirm(`Aprovar TODOS os colaboradores (${currentSector.toUpperCase()}) da tela do dia ${currentDateKey}?`)) return;
    const timeNow = new Date().toLocaleTimeString('pt-BR');
    const dateRealization = new Date().toLocaleDateString('pt-BR');
    const updates = {};
    let idx = 0;

    driverList.forEach(d => {
        const tipo = d.t || 'rodoviario';
        if(tipo === currentSector) {
            const currentRecord = (db[currentDateKey] && db[currentDateKey][d.c]) ? db[currentDateKey][d.c] : null;
            const currentObs = currentRecord ? currentRecord.obs : "";
            let historyObj = (currentRecord && currentRecord.history) ? currentRecord.history : {};
            
            historyObj[Date.now() + "_" + (idx++)] = { status: "OK", approver: currentApprover, time: timeNow, actionDate: dateRealization };
            updates[`pontos/${currentDateKey}/${d.c}`] = { status: "OK", approver: currentApprover, time: timeNow, actionDate: dateRealization, obs: currentObs, history: historyObj };
        }
    });
    database.ref().update(updates);
}

function reproveAllDaily() {
    if (!currentApprover) { alert("Nome de Aprovador Obrigatório!"); return; }
    if (!confirm(`REPROVAR TODOS os colaboradores (${currentSector.toUpperCase()}) para o dia ${currentDateKey}?`)) return;
    const timeNow = new Date().toLocaleTimeString('pt-BR');
    const dateRealization = new Date().toLocaleDateString('pt-BR');
    const updates = {};
    let idx = 0;

    driverList.forEach(d => {
        const tipo = d.t || 'rodoviario';
        if(tipo === currentSector) {
            const currentRecord = (db[currentDateKey] && db[currentDateKey][d.c]) ? db[currentDateKey][d.c] : null;
            const currentObs = currentRecord ? currentRecord.obs : "";
            let historyObj = (currentRecord && currentRecord.history) ? currentRecord.history : {};
            
            historyObj[Date.now() + "_" + (idx++)] = { status: "Erro", approver: currentApprover, time: timeNow, actionDate: dateRealization };
            updates[`pontos/${currentDateKey}/${d.c}`] = { status: "Erro", approver: currentApprover, time: timeNow, actionDate: dateRealization, obs: currentObs, history: historyObj };
        }
    });
    database.ref().update(updates);
}

function cancelAllDaily() {
    if (!confirm(`Isso vai LIMPAR e deixar PENDENTE todas as aprovações de HOJE na tela atual.\nConfirmar?`)) return;
    const timeNow = new Date().toLocaleTimeString('pt-BR');
    const dateRealization = new Date().toLocaleDateString('pt-BR');
    const updates = {};
    let idx = 0;

    driverList.forEach(d => {
        const tipo = d.t || 'rodoviario';
        if(tipo === currentSector && db[currentDateKey] && db[currentDateKey][d.c]) {
            const currentRecord = db[currentDateKey][d.c];
            const currentObs = currentRecord.obs || "";
            let historyObj = currentRecord.history ? currentRecord.history : {};
            
            historyObj[Date.now() + "_" + (idx++)] = { status: "Pendente", approver: currentApprover || "Sistema", time: timeNow, actionDate: dateRealization };
            updates[`pontos/${currentDateKey}/${d.c}`] = { status: "Pendente", approver: currentApprover || "Sistema", time: timeNow, actionDate: dateRealization, obs: currentObs, history: historyObj };
        }
    });
    database.ref().update(updates);
}

// --- MODAL DE HISTÓRICO JS ---
function openHistoryModal(cad, dateKeyStr) {
    document.getElementById('historyModal').style.display = 'flex';
    const contentDiv = document.getElementById('historyModalContent');
    contentDiv.innerHTML = '<p style="color:var(--text-muted); font-size:14px; text-align:center;">Carregando logs...</p>';
    
    const record = (db[dateKeyStr] && db[dateKeyStr][cad]) ? db[dateKeyStr][cad] : null;
    if (!record || !record.history || Object.keys(record.history).length === 0) {
        contentDiv.innerHTML = '<p style="color:var(--text-muted); font-size:14px; text-align:center; padding: 20px;">Nenhum histórico registrado para este ponto ainda.</p>';
        return;
    }
    
    let html = '<div style="display:flex; flex-direction:column; gap:12px; padding: 5px 0;">';
    const sortedKeys = Object.keys(record.history).sort();
    
    sortedKeys.forEach(key => {
        const log = record.history[key];
        let badgeClass = log.status === 'OK' ? 'st-ok' : (log.status === 'Erro' ? 'st-erro' : (log.status === 'Verificado' ? 'st-verificado' : 'st-pendente'));
        let statusLabel = log.status === 'OK' ? 'Aprovado' : (log.status === 'Erro' ? 'Reprovado' : (log.status === 'Verificado' ? 'Verificado' : 'Pendente'));
        
        html += `
            <div style="background:#F8FAFC; border:1px solid var(--border); padding:12px; border-radius:8px; display:flex; flex-direction:column; gap:6px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span class="status-badge ${badgeClass}" style="cursor:default; width:auto; padding:4px 10px; font-size:11px;">${statusLabel}</span>
                    <span style="font-size:11px; color:var(--text-muted); font-weight:600;">Realizado em: ${log.actionDate || '-'} às ${log.time || '-'}</span>
                </div>
                <div style="font-size:13px; color:var(--text); font-weight:500;">
                    <i class="fas fa-user-shield" style="color:var(--brand); margin-right:4px;"></i> Por: <b>${log.approver}</b>
                </div>
            </div>
        `;
    });
    html += '</div>';
    contentDiv.innerHTML = html;
}

function closeHistoryModal() {
    document.getElementById('historyModal').style.display = 'none';
}

// --- GESTÃO DE EQUIPE ---
function openManageModal() {
    document.getElementById('manageModal').style.display = 'flex';
    renderBranchOptions('branchList');
    renderManageList();
}
function closeManageModal() { document.getElementById('manageModal').style.display = 'none'; }

function renderBranchOptions(elemId) {
    const branches = [...new Set(driverList.map(d => d.b))].sort();
    const dataList = document.getElementById(elemId);
    dataList.innerHTML = '';
    branches.forEach(b => {
        const opt = document.createElement('option');
        opt.value = b; dataList.appendChild(opt);
    });
}

function addDriver() {
    const cad = document.getElementById('newCad').value.trim();
    const branch = document.getElementById('newBranch').value.trim();
    const name = document.getElementById('newName').value.trim();
    const sector = document.getElementById('newSector').value;

    if (!cad || !branch || !name) { alert("Preencha todos os campos!"); return; }
    if (driverList.find(d => d.c === cad)) { alert("Esse CAD já está em uso na base!"); return; }
    
    const newList = [...driverList, { b: branch, c: cad, n: name, t: sector }];
    driversRef.set(newList);
    
    document.getElementById('newCad').value = ""; document.getElementById('newName').value = "";
    alert("Colaborador salvo com sucesso!");
}

function removeDriver(cad) {
    if (!confirm("Tem certeza que deseja apagar este colaborador da base de dados?")) return;
    const newList = driverList.filter(d => d.c !== cad);
    driversRef.set(newList);
}

function renderManageList() {
    const listContainer = document.getElementById('manageListContainer');
    listContainer.innerHTML = "";
    driverList.forEach(d => {
        const tipoTag = d.t === 'fretamento' ? '<span style="background:#FBAF17; color:#000; padding:3px 6px; border-radius:4px; font-size:10px; margin-left:8px; font-weight:700;">Fretamento</span>' : '<span style="background:#006B3F; color:#fff; padding:3px 6px; border-radius:4px; font-size:10px; margin-left:8px; font-weight:700;">Rodoviário</span>';
        const item = document.createElement('div');
        item.className = 'manage-item';
        item.innerHTML = `<span><b style="color:var(--brand)">${d.b}</b> - ${d.n} <small style="color:var(--text-muted)">(CAD: ${d.c})</small> ${tipoTag}</span> <button class="btn-del" onclick="removeDriver('${d.c}')"><i class="fas fa-trash"></i> Excluir</button>`;
        listContainer.appendChild(item);
    });
}

// --- BUSCA INDIVIDUAL DETALHADA ---
function searchDriver() {
    const term = document.getElementById('indivSearchInput').value.trim().toLowerCase();
    const resDiv = document.getElementById('indivSearchResult');
    
    if (!term) { resDiv.style.display = 'none'; document.getElementById('indivPeriodContainer').style.display = 'none'; return; }

    const found = driverList.find(d => d.c === term || d.n.toLowerCase().includes(term));

    resDiv.style.display = 'block';
    if (found) {
        selectedIndivCad = found.c;
        const tipoStr = found.t === 'fretamento' ? 'Fretamento' : 'Motorista Rodoviário';
        resDiv.style.background = '#F0FDF4';
        resDiv.style.color = '#065F46';
        resDiv.style.borderColor = '#10B981';
        resDiv.innerHTML = `<i class="fas fa-check-circle"></i> <b>Colaborador Localizado:</b><br><span style="font-size: 19px; font-weight:800; display:block; margin:5px 0;">${found.n}</span>Filial: ${found.b} | CAD: ${found.c} | Setor: ${tipoStr}`;
        renderIndividualPeriod(); 
    } else {
        selectedIndivCad = "";
        resDiv.style.background = '#FEE2E2';
        resDiv.style.color = '#991B1B';
        resDiv.style.borderColor = '#EF4444';
        resDiv.innerHTML = `<i class="fas fa-times-circle"></i> <b>Não localizado.</b><br>Verifique se o CAD ou o Nome estão corretos.`;
        document.getElementById('indivPeriodContainer').style.display = 'none';
    }
}

function applyIndividualDayAction(dateKeyStr, statusType) {
    const approver = document.getElementById('approverName').value;
    if(!approver) { alert("Preencha seu nome de Aprovador lá no topo!"); return; }

    const timeNow = new Date().toLocaleTimeString('pt-BR');
    const dateRealization = new Date().toLocaleDateString('pt-BR');
    const path = `pontos/${dateKeyStr}/${selectedIndivCad}`;
    const currentRecord = (db[dateKeyStr] && db[dateKeyStr][selectedIndivCad]) ? db[dateKeyStr][selectedIndivCad] : null;
    const currentObs = currentRecord ? currentRecord.obs : "";
    
    let historyObj = (currentRecord && currentRecord.history) ? currentRecord.history : {};
    historyObj[Date.now()] = { status: statusType, approver: approver, time: timeNow, actionDate: dateRealization };

    database.ref(path).set({ status: statusType, approver: approver, time: timeNow, actionDate: dateRealization, obs: currentObs, history: historyObj });
}

function applyIndividualAction(statusType) {
    const approver = document.getElementById('approverName').value;
    if(!approver) { alert("Preencha seu nome de Aprovador lá no topo!"); return; }
    if (!selectedIndivCad) { alert("Busque e selecione um colaborador válido primeiro."); return; }

    const startVal = document.getElementById('indivStartDate').value;
    const endVal = document.getElementById('indivEndDate').value;

    if(!startVal || !endVal) { alert("Defina o período (Data Inicial e Final)!"); return; }

    const start = new Date(startVal + "T12:00:00");
    const end = new Date(endVal + "T12:00:00");

    if(start > end) { alert("A Data Inicial não pode ser maior que a Final!"); return; }

    let actionName = statusType === 'OK' ? "APROVAR TODO O PERÍODO" : (statusType === 'Erro' ? "REPROVAR TODO O PERÍODO" : "DEIXAR TODO O PERÍODO PENDENTE");
    if(!confirm(`${actionName}\n\nTem certeza que deseja aplicar isso para todos os dias entre ${start.toLocaleDateString('pt-BR')} e ${end.toLocaleDateString('pt-BR')}?`)) return;

    const timeNow = new Date().toLocaleTimeString('pt-BR');
    const dateRealization = new Date().toLocaleDateString('pt-BR');
    const updates = {};
    let loopDate = new Date(start);
    let idx = 0;

    while(loopDate <= end) {
        const dateKey = loopDate.toISOString().split('T')[0];
        const path = `pontos/${dateKey}/${selectedIndivCad}`;
        const currentRecord = (db[dateKey] && db[dateKey][selectedIndivCad]) ? db[dateKey][selectedIndivCad] : null;
        const currentObs = currentRecord ? currentRecord.obs : "";
        
        let historyObj = (currentRecord && currentRecord.history) ? currentRecord.history : {};
        historyObj[Date.now() + "_" + (idx++)] = { status: statusType, approver: approver, time: timeNow, actionDate: dateRealization };

        updates[path] = { status: statusType, approver: approver, time: timeNow, actionDate: dateRealization, obs: currentObs, history: historyObj };
        loopDate.setDate(loopDate.getDate() + 1);
    }

    database.ref().update(updates)
        .then(() => alert(`Operação finalizada com sucesso!`))
        .catch((err) => alert("Erro: " + err.message));
}

// --- EXPORTAR EXCEL (Mapeado com novos status e data de realização) ---
function downloadCSV(content, fileName) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
}

function exportDay() {
    sortDriverList();
    let csv = "\ufeffFilial;Setor;CAD;Nome;Data Referencia;Status;Observacao;Aprovador;Hora Acao;Data Execucao\n";
    const dayData = db[currentDateKey] || {};
    
    driverList.forEach(d => {
        const rec = dayData[d.c];
        const st = rec ? (rec.status === 'OK' ? 'Aprovado' : (rec.status === 'Erro' ? 'Reprovado' : (rec.status === 'Verificado' ? 'Verificado' : 'Pendente'))) : "Pendente";
        const obs = rec ? rec.obs : "";
        const app = rec ? rec.approver : "";
        const time = rec ? rec.time : "";
        const actD = rec ? (rec.actionDate || currentDateKey) : "";
        const tipo = d.t === 'fretamento' ? 'Fretamento' : 'Rodoviario';
        
        csv += `${d.b};${tipo};${d.c};${d.n};${currentDateKey};${st};${obs};${app};${time};${actD}\n`;
    });
    downloadCSV(csv, `ExpressoNordeste_PontoDia_${currentDateKey}.csv`);
}

function getPeriodLimits(dateStr) {
    const current = new Date(dateStr + "T12:00:00");
    const day = current.getDate();
    const month = current.getMonth(); 
    const year = current.getFullYear();
    let start, end;
    if (day >= 11) { start = new Date(year, month, 11); end = new Date(year, month + 1, 10); }
    else { start = new Date(year, month - 1, 11); end = new Date(year, month, 10); }
    return { start, end };
}

function exportDetailedReport() {
    sortDriverList();
    const limits = getPeriodLimits(currentDateKey);
    let csv = "\ufeffFilial;Setor;CAD;Nome;Data do Ponto;Status;Observacao;Aprovador;Hora Acao;Data Execucao\n";
    
    let loopDate = new Date(limits.start);
    while (loopDate <= limits.end) {
        const dateKey = loopDate.toISOString().split('T')[0];
        const dayData = db[dateKey] || {};
        
        driverList.forEach(d => {
            const rec = dayData[d.c];
            const st = rec ? (rec.status === 'OK' ? 'Aprovado' : (rec.status === 'Erro' ? 'Reprovado' : (rec.status === 'Verificado' ? 'Verificado' : 'Pendente'))) : "Pendente";
            const obs = rec ? rec.obs : "";
            const app = rec ? rec.approver : "";
            const time = rec ? rec.time : "";
            const actD = rec ? (rec.actionDate || loopDate.toLocaleDateString('pt-BR')) : "";
            const tipo = d.t === 'fretamento' ? 'Fretamento' : 'Rodoviario';
            const dataFormatada = loopDate.toLocaleDateString('pt-BR');
            
            csv += `${d.b};${tipo};${d.c};${d.n};${dataFormatada};${st};${obs};${app};${time};${actD}\n`;
        });
        loopDate.setDate(loopDate.getDate() + 1);
    }
    
    const fileName = `ExpressoNordeste_RelatorioDetalhado_${limits.start.toLocaleDateString('pt-BR').replace(/\//g,'-')}_a_${limits.end.toLocaleDateString('pt-BR').replace(/\//g,'-')}.csv`;
    downloadCSV(csv, fileName);
}
