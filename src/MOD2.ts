//IMPORTAÇÃO DE BIBLIOTECAS

import promptSync from "prompt-sync";
const prompt = promptSync();

//CLASSE MOVIMENTAÇÃO

abstract class Movimentacao {
  protected sucesso: boolean = false;

  constructor(protected data: Date, protected quantidade: number) {}

  public getQuantidade(): number {
    return this.quantidade;
  }

  public verSucesso(): boolean {
    return this.sucesso;
  }

  public abstract getTipo(): string;
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

  // Metodo que avisa quando o estoque esta baixo
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
      this.sucesso = false;
      throw new Error("Quantidade de entrada deve ser maior que zero.");
    }
    const novaQuantidade = this.produto.getQuantidade() + this.getQuantidade();
    this.produto.setQuantidade(novaQuantidade);
    this.sucesso = true;
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
      this.sucesso = true;
      console.log(
        `Saída registrada. Nova quantidade de ${
          this.produto.nome
        }: ${this.produto.getQuantidade()}`
      );
      this.produto.estoqueBaixo();
    } else {
      this.sucesso = false;
      throw new Error(
        `Quantidade insuficiente em estoque para ${
          this.produto.nome
        }. Estoque atual: ${this.produto.getQuantidade()}, solicitado: ${this.getQuantidade()}`
      );
    }
  }

  public getTipo(): string {
    return "Saída";
  }
}

// CLASSE ESTOQUE

class Estoque {
  private produtos: Produto[] = [];
  public historico: Movimentacao[] = [];

  public addProduto(produto: Produto): void {
    if (produto.getQuantidade() < 0) {
      throw new Error("Quantidade inicial não pode ser negativa.");
    }
    if (produto.preco < 0) {
      throw new Error("Preço do produto não pode ser negativo.");
    }
    this.produtos.push(produto);
    console.log(`Produto "${produto.nome}" adicionado ao estoque.`);
  }

  public registrarMovimentacao(mov: Movimentacao): void {
    this.historico.push(mov);
  }

  public buscarProduto(codigo: string): Produto | undefined {
    return this.produtos.find((produto) => produto.codigo === codigo);
  }

  public listarProdutos(): void {
    console.log("\n=== LISTA DE PRODUTOS ===");
    if (this.produtos.length === 0) {
      console.log("Nenhum produto no estoque.");
      return;
    }
    this.produtos.forEach((p) => {
      console.log(p.toString());
      p.estoqueBaixo();
    });
  }

  //Lista o historico completo
  public listarHistorico(): void {
    console.log("\n🕒 Histórico de Movimentações:");
    if (this.historico.length === 0) {
      console.log("Nenhuma movimentação registrada.");
      return;
    }
    this.historico.forEach((m) => {
      console.log(
        `${m.getTipo()} - Quantidade: ${m.getQuantidade()} - Data: ${m["data"].toLocaleString()} - ${
          m.verSucesso() ? "Sucesso" : "Falhou"
        }`
      );
    });
  }
}

//Menu Interativo

const estoque = new Estoque();
let opcao: string;

do {
  console.log("\n=== MENU ESTOQUE ===");
  console.log("1 - Adicionar Produto");
  console.log("2 - Registrar Entrada");
  console.log("3 - Registrar Saída");
  console.log("4 - Gerar Relatório");
  console.log("0 - Sair");

  opcao = prompt("Escolha uma opção: ");

  try {
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
        if (!produtoEntrada) throw new Error("Produto não encontrado.");
        const qtdEntrada = parseInt(prompt("Quantidade a adicionar: "));
        const entrada = new Entrada(new Date(), qtdEntrada, produtoEntrada);
        try {
          entrada.registrarEntrada();
        } catch (erroInterno: any) {
          console.log(`${erroInterno.message}`);
        } finally {
          estoque.registrarMovimentacao(entrada);
        }
        break;

      case "3":
        const codigoSaida = prompt("Código do produto: ");
        const produtoSaida = estoque.buscarProduto(codigoSaida);
        if (!produtoSaida) throw new Error("Produto não encontrado.");
        const qtdSaida = parseInt(prompt("Quantidade a remover: "));
        const saida = new Saida(new Date(), qtdSaida, produtoSaida);
        try {
          saida.registrarSaida();
        } catch (erroInterno: any) {
          console.log(`${erroInterno.message}`);
        } finally {
          estoque.registrarMovimentacao(saida);
        }
        break;

      case "4":
        console.log("\n📊 === RELATÓRIO COMPLETO DO ESTOQUE ===");
        estoque.listarProdutos();
        estoque.listarHistorico();
        break;

      case "0":
        console.log("Saindo do sistema.");
        break;

      default:
        console.log("Opção inválida!");
    }
  } catch (erro: any) {
    console.log(`Erro: ${erro.message}`);
  }
} while (opcao !== "0");

/* const p1 = new Produto("Caneta", "001", 1.5, 10);
const p2 = new Produto("Caderno", "002", 15.0, 3);
const estoque = new Estoque();
estoque.addProduto(p1);
estoque.addProduto(p2);
estoque.ShowEstoque(); */
