//IMPORTAÇÃO DE BIBLIOTECAS

import promptSync from "prompt-sync"; // Biblioteca para entrada de dados no console
const prompt = promptSync(); // Inicializa o prompt

//CLASSE MOVIMENTAÇÃO

abstract class Movimentacao { // Classe base para movimentações
  constructor(
    protected data: Date,
    protected quantidade: number,
    protected produto: Produto
  ) {}

  public getQuantidade(): number { // Retorna a quantidade movimentada
    return this.quantidade;
  }

  public getProduto(): Produto { // Retorna o produto movimentado
    return this.produto;
  }

  abstract registrar(): string;
}

// CLASSE PRODUTO

class Produto { // Classe Produto com atributos e métodos
  constructor(
    public nome: string,
    public codigo: string,
    public preco: number,
    private quantidade: number
  ) {
    // Validações básicas
    if (!nome || nome == "") { // Verifica se nome não está vazio
      throw new Error("Nome do produto não permetido.");
    } 
    if (!codigo || codigo == "") { // Verifica se o código não está vazio
      throw new Error("Código do produto não permitido")
    }
    if (preco <= 0 || isNaN(preco)) { // Verifica se o preço é maior que zero
      throw new Error("O preço do produto deve ser maior que zero.");
    }
    if (quantidade < 0 || isNaN(quantidade)) { // Verifica se a quantidade inicial é zero ou maior
      throw new Error("Quantidade inicial não permitida.");
    }
  }

  // Metodos get/set
  getQuantidade(): number { // Retorna a quantidade do produto
    return this.quantidade;
  }

  setQuantidade(quantidade: number): void { // Atualiza a quantidade do produto
    if (quantidade < 0) {
      // Validação para evitar quantidade negativa
      throw new Error("A quantidade não pode ser negativa.");
    }
    this.quantidade = quantidade;
  }

  estoqueBaixo(): boolean { // Verifica se o estoque está baixo (5 ou menos)
    return this.quantidade <= 5;
  }

  toString(): string { // Retorna as informações do produto em uma única linha
    return `Código: ${this.codigo} | Nome: ${
      this.nome
    } | Preço: R$${this.preco.toFixed(2)} | Quantidade: ${this.quantidade}`;
  }
}

//CLASSE DE ENTRADA E SAIDA

class Entrada extends Movimentacao { // Classe filha de Movimentacao
  registrar(): string { // Metodo que registra a entrada do produto
    const novaQuantidade = this.produto.getQuantidade() + this.quantidade;
    this.produto.setQuantidade(novaQuantidade);
    return `[ENTRADA] ${this.quantidade} unidade(s) de ${
      this.produto.nome
    } (cod: ${
      this.produto.codigo
    }) em ${this.data.toLocaleString()}. Nova quantidade: ${this.produto.getQuantidade()}`;
  }
}

class Saida extends Movimentacao { // Classe filha de Movimentacao
  public registrar(): string { // Metodo que registra a saída do produto
    if (this.produto.getQuantidade() >= this.getQuantidade()) {
      const novaQuantidade =
        this.produto.getQuantidade() - this.getQuantidade();
      this.produto.setQuantidade(novaQuantidade);
      return `[SAÍDA] ${this.quantidade} unidade(s) de ${
        this.produto.nome
      } (cod: ${
        this.produto.codigo
      }) em ${this.data.toLocaleString()}. Nova quantidade: ${this.produto.getQuantidade()}`;
    } else {
      throw new Error(
        `Quantidade insuficiente em estoque de ${this.produto.nome} (cod: ${this.produto.codigo}).`
      );
    }
  }
}

// CLASSE ESTOQUE

class Estoque {
  // Lista de produtos e historico de movimentações
  private produtos: Produto[] = [];
  private historico: string[] = [];

  // Metodo que busca um produto pelo codigo
  public buscarProduto(codigo: string): Produto | undefined { // Retorna o produto ou undefined se não encontrado
    return this.produtos.find((produto) => produto.codigo === codigo);
  }

  public addProduto(produto: Produto): void { // Adiciona produto ao estoque
    //Verifica se já existe um produto com o mesmo código
    if (this.buscarProduto(produto.codigo)) {
      throw new Error( //Mensagem de erro
        `Já existe um produto cadastrado com o código ${produto.codigo}.`
      );
    }
    this.produtos.push(produto);
  }

  public registrarHistorico(info: string): void { // Adiciona info ao historico
    this.historico.push(info);
  }

  public exibirRelatorio(): void { // Gera o relatório de estoque e movimentações
    console.log("\n=== RELATÓRIO DE ESTOQUE ===");
    this.produtos.forEach((produto) => {
      const alerta = produto.estoqueBaixo() ? "Estoque baixo!" : ""; // Alerta de estoque baixo
      console.log( // Exibe as informações do produto
        `Produto: ${produto.nome} (cod: ${
          produto.codigo
        }) | Quantidade: ${produto.getQuantidade()} | Preço: R$${produto.preco.toFixed(
          2
        )} ${alerta}`
      );
    });

    console.log("\n=== HISTÓRICO DE MOVIMENTAÇÕES ==="); // Exibe o histórico de movimentações
    this.historico.forEach((registro) => console.log(registro));
  }
}

//Menu Interativo

const estoque = new Estoque();

function menu() { // Menu de opções dentro da função para melhor organização
  console.log("\n=== Menu: ===");
  console.log("1 - Adicionar Produto");
  console.log("2 - Registrar Entrada");
  console.log("3 - Registrar Saída");
  console.log("4 - Gerar Relatório");
  console.log("0 - Sair");
}

let opcao: string;  // Variável para armazenar a opção do usuário
do { // Laço principal do programa
  menu(); // Chama o menu
  opcao = prompt("Escolha uma opção: "); // Lê a opção do usuário

  try { // Bloco try-catch para tratamento de erros
    switch (opcao) { // Estrutura de controle para as opções
      case "1": { // Adicionar produto ao estoque
        const nome = prompt("Nome do produto: ");
        const codigo = prompt("Código do produto: ");
        const preco = parseFloat(prompt("Preço do produto: "));
        const quantidade = parseInt(prompt("Quantidade inicial: "));

        const produto = new Produto(nome, codigo, preco, quantidade);
        estoque.addProduto(produto);
        console.log("Produto adicionado com sucesso!");
        break;
      }

      case "2": { // Registrar entrada de produto
        const codigoEntrada = prompt("Código do produto para entrada: ");
        const produtoEntrada = estoque.buscarProduto(codigoEntrada);
        if (!produtoEntrada) throw new Error("Produto não encontrado."); // Verifica se o produto existe

        const quantidadeEntrada = parseInt(prompt("Quantidade de entrada: "));
        const entrada = new Entrada(new Date(), quantidadeEntrada, produtoEntrada);
        const registro = entrada.registrar();
        estoque.registrarHistorico(registro); // Adiciona ao histórico
        console.log(registro);
        break;
      }

      case "3": { // Registrar saída de produto
        const codigoSaida = prompt("Código do produto para saída: ");
        const produtoSaida = estoque.buscarProduto(codigoSaida);
        if (!produtoSaida) throw new Error("Produto não encontrado."); // Verifica se o produto existe

        const quantidadeSaida = parseInt(prompt("Quantidade de saída: "));
        const saida = new Saida(new Date(), quantidadeSaida, produtoSaida);
        const registro = saida.registrar();
        estoque.registrarHistorico(registro); // Adiciona ao histórico
        console.log(registro);
        break;  
      }

      case "4": // Gerar relatório de estoque e movimentações
        estoque.exibirRelatorio();
        break;

      case "0": // Sair do sistema
        console.log("Saindo do sistema.");
        break;

      default:
        console.log("Opção inválida!");
    }
  } catch (erro: any) { // Tratamento de erros
    console.log(`Erro: ${erro.message}`);
  }
} while (opcao !== "0"); //FIM DO PROGRAMA