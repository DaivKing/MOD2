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
      const novaQuantidade = this.produto.getQuantidade() - this.getQuantidade();
      this.produto.setQuantidade(novaQuantidade);
      console.log(`Saida registrada. Nova quantidade de ${this.produto.nome}: ${this.produto.getQuantidade()}`);
    } else {
      throw new Error("Quantidade insuficiente em estoque para realizar a saída.");
    }
  }
}

class Estoque {
  private produtos: Produto[] = [];

  public addProduto(produto: Produto): void {
    this.produtos.push(produto);
  }

  public buscarProduto(codigo: string): Produto | undefined {
    return this.produtos.find((produto) => produto.codigo === codigo);
  }
}

/* const p1 = new Produto("Caneta", "001", 1.5, 10);
const p2 = new Produto("Caderno", "002", 15.0, 3);
const estoque = new Estoque();
estoque.addProduto(p1);
estoque.addProduto(p2);
estoque.ShowEstoque(); */
