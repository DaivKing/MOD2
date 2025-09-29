import promptSync from "prompt-sync";
const prompt = promptSync();

class Movimentacao {
  constructor(protected data: Date, protected quantidade: number) {}

  public getQuantidade(): number {
    return this.quantidade;
  }

  public setQuantidade(quantidade: number): void {
    this.quantidade = quantidade;
  }
}

class Produto {
  constructor(
    public nome: string,
    public codigo: string,
    public preco: number,
    private quantidade: number
  ) {}

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

  toString(): string {
    return `Código: ${this.codigo} | Nome: ${
      this.nome
    } | Preço: R$${this.preco.toFixed(2)} | Quantidade: ${this.quantidade}`;
  }
}

class Entrada extends Movimentacao {
  private produto: Produto;

  constructor(data: Date, quantidade: number, produto: Produto) {
    super(data, quantidade);
    this.produto = produto;
  }

  registrarEntrada(): void {
    const novaQuantidade = this.produto.getQuantidade() + this.quantidade;
    this.produto.setQuantidade(novaQuantidade);
    console.log(
      `Entrada registrada. Nova quantidade de ${
        this.produto.nome
      }: ${this.produto.getQuantidade()}`
    );
  }
}

class Saida extends Movimentacao {
  private produto: Produto;

  constructor(data: Date, quantidade: number, produto: Produto) {
    super(data, quantidade);
    this.produto = produto;
  }

  public registrarSaida(): void {
    if (this.produto.getQuantidade() >= this.getQuantidade()) {
      const novaQuantidade =
        this.produto.getQuantidade() - this.getQuantidade();
      this.produto.setQuantidade(novaQuantidade);
      console.log(
        `Saida registrada. Nova quantidade de ${
          this.produto.nome
        }: ${this.produto.getQuantidade()}`
      );
    } else {
      throw new Error(
        "Quantidade insuficiente em estoque para realizar a saída."
      );
    }
  }
}

class Estoque {
  private produtos: Produto[] = [];
  private historico: Movimentacao[] = [];

  public registrarMovimentacao(mov: Movimentacao): void {
    this.historico.push(mov);
  }
  public listarHistorico(): void {
    if (this.historico.length === 0) {
      console.log("📜 Nenhuma movimentação registrada.");
      return;
    }
    console.log("\n=== HISTÓRICO DE MOVIMENTAÇÕES ===");
    this.historico.forEach((m, i) => {
      console.log(`${i + 1} - Data: ${m['data'].toLocaleString()} | Quantidade: ${m.getQuantidade()}`);
    });
  }

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
}

const estoque = new Estoque();
let opcao = "";

do {
  console.log("\n=== MENU ESTOQUE ===");
  console.log("1 - Adicionar Produto");
  console.log("2 - Registrar Entrada");
  console.log("3 - Registrar Saída");
  console.log("4 - Listar Produtos");
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
      estoque.listarProdutos();
      break;

    case "0":
      console.log("Saindo do sistema...");
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
