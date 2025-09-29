//IMPORTAÇÃO DE BIBLIOTECAS

import promptSync from "prompt-sync";
const prompt = promptSync();

//CLASSE MOVIMENTAÇÃO

class Movimentacao {
  constructor(protected data: Date, protected quantidade: number) {}

  public getQuantidade(): number {
    return this.quantidade;
  }

  public setQuantidade(quantidade: number): void {
    this.quantidade = quantidade;
  }

  public getData(): Date {
    return this.data;
  }

  public getTipo(): string {
    return "Movimentacao"; // será sobrescrito em Entrada/Saida
  }
}

// CLASSE PRODUTO

class Produto {
  constructor(
    public nome: string,
    public codigo: string,
    public preco: number,
    private quantidade: number
  ) {}

  //Metodos get/set

  getQuantidade(): number {
    return this.quantidade;
  }

  setQuantidade(quantidade: number): void {
    this.quantidade = quantidade;
  }

  estoqueBaixo(): void {
    if (this.quantidade < 3) {
      console.log(`Estoque baixo para o produto: ${this.nome}`);
    }
  }

  //Metodo que converte as info do produto em uma unica linha(string)
  toString(): string {
    return `Código: ${this.codigo} | Nome: ${
      this.nome
    } | Preço: R$${this.preco.toFixed(2)} | Quantidade: ${this.quantidade}`;
  }
}

//CLASSE DE ENTRADA E SAIDA

class Entrada extends Movimentacao {
  constructor(data: Date, quantidade: number, private produto: Produto) {
    super(data, quantidade);
  }

  registrarEntrada(): void {
    if (this.getQuantidade() <= 0) {
      throw new Error("Quantidade de entrada deve ser maior que zero.");
    }
    const novaQuantidade = this.produto.getQuantidade() + this.getQuantidade();
    this.produto.setQuantidade(novaQuantidade);
    console.log(
      `Entrada registrada. Nova quantidade de ${
        this.produto.nome
      }: ${this.produto.getQuantidade()}`
    );
  }

  public getTipo(): string {
    return "Entrada";
  }
}

class Saida extends Movimentacao {
  constructor(data: Date, quantidade: number, private produto: Produto) {
    super(data, quantidade);
  }

  registrarSaida(): void {
    if (this.produto.getQuantidade() >= this.getQuantidade()) {
      const novaQuantidade =
        this.produto.getQuantidade() - this.getQuantidade();
      this.produto.setQuantidade(novaQuantidade);
      console.log(
        `✅ Saída registrada. Nova quantidade de ${
          this.produto.nome
        }: ${this.produto.getQuantidade()}`
      );
      this.produto.estoqueBaixo();
    } else {
      throw new Error(
        `Quantidade insuficiente em estoque para ${
          this.produto.nome
        }. Estoque atual: ${this.produto.getQuantidade()}, solicitado: ${this.getQuantidade()}`
      );
    }
  }

  public getTipo(): string {
    return "Saida";
  }
}

// CLASSE ESTOQUE

class Estoque {
  private produtos: Produto[] = [];
  public historico: Movimentacao[] = [];

  public addProduto(produto: Produto): void {
    this.produtos.push(produto);
    console.log(`Produto "${produto.nome}" adicionado ao estoque.`);
  }

  public buscarProduto(codigo: string): Produto | undefined {
    return this.produtos.find((produto) => produto.codigo === codigo);
  }

  public listarProdutos(): void {
    if (this.produtos.length === 0) {
      console.log("Nenhum produto no estoque.");
      return;
    }
    console.log("\n=== LISTA DE PRODUTOS ===");
    this.produtos.forEach((p) => {
      console.log(p.toString());
      p.estoqueBaixo();
    });
  }

  public registrarMovimentacao(mov: Movimentacao): void {
    this.historico.push(mov);
  }

  //Lista o historico completo
  public listarHistorico(): void {
    if (this.historico.length === 0) {
      console.log("Nenhuma movimentação registrada.");
      return;
    } else {
      console.log("\n=== HISTÓRICO DE MOVIMENTAÇÕES ===");
      this.historico.forEach((m, i) => {
        console.log(
          `${i + 1} - Data: ${m[
            "data"
          ].toLocaleString()} | Quantidade: ${m.getQuantidade()}`
        );
      });
    }
  }
}
//Menu Interativo

const estoque = new Estoque();
let opcao = "";

do {
  console.log("\n=== MENU ESTOQUE ===");
  console.log("1 - Adicionar Produto");
  console.log("2 - Registrar Entrada");
  console.log("3 - Registrar Saída");
  console.log("4 - Gerar Relatório");
  console.log("0 - Sair");

  opcao = prompt("Escolha uma opção: ");

  switch (opcao) {
    case "1":
      const nome = prompt("Nome do produto: ");
      const codigo = prompt("Código do produto: ");
      const preco = parseFloat(prompt("Preço do produto: "));
      const quantidade = parseInt(prompt("Quantidade inicial: "));
      estoque.addProduto(new Produto(nome, codigo, preco, quantidade));
      break;

    case "2":
      const codigoEntrada = prompt("Código do produto: ");
      const produtoEntrada = estoque.buscarProduto(codigoEntrada);
      if (produtoEntrada) {
        const qtdEntrada = parseInt(prompt("Quantidade a adicionar: "));
        new Entrada(new Date(), qtdEntrada, produtoEntrada).registrarEntrada();
      } else {
        console.log("Produto não encontrado.");
      }
      break;

    case "3":
      const codigoSaida = prompt("Código do produto: ");
      const produtoSaida = estoque.buscarProduto(codigoSaida);
      if (produtoSaida) {
        const qtdSaida = parseInt(prompt("Quantidade a remover: "));
        new Saida(new Date(), qtdSaida, produtoSaida).registrarSaida();
      } else {
        console.log("Produto não encontrado.");
      }
      break;

    case "4":
      console.log("\n=== RELATÓRIO COMPLETO DO ESTOQUE ===");
      estoque.listarProdutos(); // Lista produtos e alerta estoque baixo
      estoque.listarHistorico(); // Lista histórico de entradas/saídas
      break;

    case "0":
      console.log("Saindo do sistema");
      break;

    default:
      console.log("Opção inválida!");
  }
} while (opcao !== "0");

/* const p1 = new Produto("Caneta", "001", 1.5, 10);
const p2 = new Produto("Caderno", "002", 15.0, 3);
const estoque = new Estoque();
estoque.addProduto(p1);
estoque.addProduto(p2);
estoque.ShowEstoque(); */
