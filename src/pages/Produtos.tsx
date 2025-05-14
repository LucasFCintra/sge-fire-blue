import { useState, useEffect } from "react";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { useProdutos, useGrupos, useSubgrupos, useSubSubgrupos } from "@/hooks/use-supabase-crud";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Loader2, Plus, Pencil, Trash2, Search, BarcodeIcon } from "lucide-react";
import { BarcodeScanner } from "@/components/BarcodeScanner";

export default function Produtos() {
  // Estados para produtos
  const [produtos, setProdutos] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;
  
  // Estados para hierarquia de categorias
  const [grupos, setGrupos] = useState<any[]>([]);
  const [subgrupos, setSubgrupos] = useState<any[]>([]);
  const [subSubgrupos, setSubSubgrupos] = useState<any[]>([]);
  const [filteredSubgrupos, setFilteredSubgrupos] = useState<any[]>([]);
  const [filteredSubSubgrupos, setFilteredSubSubgrupos] = useState<any[]>([]);
  
  // Estados para formulário
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [currentProduto, setCurrentProduto] = useState<any>(null);
  const [formData, setFormData] = useState({
    codigo: "",
    codigo_barras: "",
    nome: "",
    descricao: "",
    grupo_id: "",
    subgrupo_id: "",
    sub_subgrupo_id: "",
    preco_custo: 0,
    preco_venda: 0,
    estoque_atual: 0,
    estoque_minimo: 0,
    unidade: "un",
    status: "Ativo"
  });
  
  // Hooks CRUD
  const produtosCrud = useProdutos();
  const gruposCrud = useGrupos();
  const subgruposCrud = useSubgrupos();
  const subSubgruposCrud = useSubSubgrupos();

  // Carregar dados iniciais
  useEffect(() => {
    loadProdutos();
    loadGrupos();
    loadSubgrupos();
    loadSubSubgrupos();
  }, [page]);

  // Carregar produtos com paginação e filtro
  const loadProdutos = async () => {
    const filters: Record<string, any> = {};
    
    if (search) {
      filters.nome = `%${search}%`;
    }
    
    const { data, count } = await produtosCrud.getAll({
      page,
      pageSize,
      filters,
      orderBy: 'nome'
    });
    
    if (data) {
      setProdutos(data);
      setTotalItems(count || 0);
    }
  };

  // Carregar grupos, subgrupos e sub-subgrupos
  const loadGrupos = async () => {
    const { data } = await gruposCrud.getAll({ orderBy: 'nome' });
    if (data) setGrupos(data);
  };
  
  const loadSubgrupos = async () => {
    const { data } = await subgruposCrud.getAll({ orderBy: 'nome' });
    if (data) setSubgrupos(data);
  };
  
  const loadSubSubgrupos = async () => {
    const { data } = await subSubgruposCrud.getAll({ orderBy: 'nome' });
    if (data) setSubSubgrupos(data);
  };

  // Filtrar subgrupos quando o grupo é selecionado
  useEffect(() => {
    if (formData.grupo_id) {
      const filtered = subgrupos.filter(sg => sg.grupo_id === formData.grupo_id);
      setFilteredSubgrupos(filtered);
      setFormData(prev => ({ ...prev, subgrupo_id: "", sub_subgrupo_id: "" }));
    } else {
      setFilteredSubgrupos([]);
    }
  }, [formData.grupo_id, subgrupos]);

  // Filtrar sub-subgrupos quando o subgrupo é selecionado
  useEffect(() => {
    if (formData.subgrupo_id) {
      const filtered = subSubgrupos.filter(ssg => ssg.subgrupo_id === formData.subgrupo_id);
      setFilteredSubSubgrupos(filtered);
      setFormData(prev => ({ ...prev, sub_subgrupo_id: "" }));
    } else {
      setFilteredSubSubgrupos([]);
    }
  }, [formData.subgrupo_id, subSubgrupos]);

  // Manipular pesquisa
  const handleSearch = () => {
    setPage(1);
    loadProdutos();
  };

  // Abrir modal para novo produto
  const handleNewProduto = () => {
    setCurrentProduto(null);
    setFormData({
      codigo: "",
      codigo_barras: "",
      nome: "",
      descricao: "",
      grupo_id: "",
      subgrupo_id: "",
      sub_subgrupo_id: "",
      preco_custo: 0,
      preco_venda: 0,
      estoque_atual: 0,
      estoque_minimo: 0,
      unidade: "un",
      status: "Ativo"
    });
    setIsModalOpen(true);
  };

  // Abrir modal para editar produto
  const handleEditProduto = (produto: any) => {
    setCurrentProduto(produto);
    setFormData({
      codigo: produto.codigo || "",
      codigo_barras: produto.codigo_barras || "",
      nome: produto.nome,
      descricao: produto.descricao || "",
      grupo_id: produto.grupo_id || "",
      subgrupo_id: produto.subgrupo_id || "",
      sub_subgrupo_id: produto.sub_subgrupo_id || "",
      preco_custo: produto.preco_custo,
      preco_venda: produto.preco_venda,
      estoque_atual: produto.estoque_atual,
      estoque_minimo: produto.estoque_minimo,
      unidade: produto.unidade || "un",
      status: produto.status || "Ativo"
    });
    
    // Pre-filter subgroups and sub-subgroups
    if (produto.grupo_id) {
      const filtered = subgrupos.filter(sg => sg.grupo_id === produto.grupo_id);
      setFilteredSubgrupos(filtered);
    }
    
    if (produto.subgrupo_id) {
      const filtered = subSubgrupos.filter(ssg => ssg.subgrupo_id === produto.subgrupo_id);
      setFilteredSubSubgrupos(filtered);
    }
    
    setIsModalOpen(true);
  };

  // Abrir diálogo de confirmação para exclusão
  const handleDeleteClick = (produto: any) => {
    setCurrentProduto(produto);
    setIsDeleteDialogOpen(true);
  };

  // Salvar produto (criar ou editar)
  const handleSaveProduto = async () => {
    // Validações
    if (!formData.nome) {
      alert("Nome do produto é obrigatório");
      return;
    }

    try {
      if (currentProduto) {
        // Atualizar produto existente
        await produtosCrud.update(currentProduto.id, formData);
      } else {
        // Criar novo produto
        await produtosCrud.create(formData);
      }
      
      // Fechar modal e atualizar lista
      setIsModalOpen(false);
      loadProdutos();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    }
  };

  // Excluir produto
  const handleDeleteProduto = async () => {
    if (currentProduto) {
      await produtosCrud.remove(currentProduto.id);
      setIsDeleteDialogOpen(false);
      loadProdutos();
    }
  };

  // Lidar com leitura de código de barras
  const handleBarcodeDetected = (barcode: string) => {
    setFormData(prev => ({ ...prev, codigo_barras: barcode }));
    setIsScannerOpen(false);
  };

  // Renderizar nome do grupo/subgrupo/sub-subgrupo
  const renderGrupoNome = (id: string) => {
    const grupo = grupos.find(g => g.id === id);
    return grupo ? grupo.nome : "";
  };

  const renderSubgrupoNome = (id: string) => {
    const subgrupo = subgrupos.find(sg => sg.id === id);
    return subgrupo ? subgrupo.nome : "";
  };

  const renderSubSubgrupoNome = (id: string) => {
    const subSubgrupo = subSubgrupos.find(ssg => ssg.id === id);
    return subSubgrupo ? subSubgrupo.nome : "";
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
        <Button onClick={handleNewProduto}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Produto
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Catálogo de Produtos</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar produtos..."
                  className="pl-8 w-[200px] md:w-[300px]"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button variant="secondary" size="sm" onClick={handleSearch}>
                Buscar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {produtosCrud.isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Estoque</TableHead>
                      <TableHead>Preço Venda</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {produtos.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                          Nenhum produto encontrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      produtos.map((produto) => (
                        <TableRow key={produto.id}>
                          <TableCell>{produto.codigo || produto.codigo_barras || '-'}</TableCell>
                          <TableCell>{produto.nome}</TableCell>
                          <TableCell>
                            {produto.grupo_id ? renderGrupoNome(produto.grupo_id) : '-'}
                          </TableCell>
                          <TableCell className={produto.estoque_atual <= produto.estoque_minimo ? "text-red-600 font-medium" : ""}>
                            {produto.estoque_atual} {produto.unidade}
                          </TableCell>
                          <TableCell>{formatCurrency(produto.preco_venda)}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                              ${produto.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {produto.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleEditProduto(produto)}>
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Editar</span>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(produto)}>
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Excluir</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Anterior
                </Button>
                <div className="text-sm text-muted-foreground">
                  Página {page} de {Math.ceil(totalItems / pageSize)}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= Math.ceil(totalItems / pageSize)}
                >
                  Próxima
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal de Produto */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {currentProduto ? "Editar Produto" : "Novo Produto"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Código</label>
                <Input
                  placeholder="Código do Produto"
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Código de Barras</label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Código de Barras"
                    value={formData.codigo_barras}
                    onChange={(e) => setFormData({ ...formData, codigo_barras: e.target.value })}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setIsScannerOpen(true)}
                  >
                    <BarcodeIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Nome *</label>
                <Input
                  placeholder="Nome do Produto"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <Input
                  placeholder="Descrição do Produto"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Grupo</label>
                <Select
                  value={formData.grupo_id}
                  onValueChange={(value) => setFormData({ ...formData, grupo_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um grupo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhum</SelectItem>
                    {grupos.map((grupo) => (
                      <SelectItem key={grupo.id} value={grupo.id}>
                        {grupo.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.grupo_id && (
                <div>
                  <label className="block text-sm font-medium mb-1">Subgrupo</label>
                  <Select
                    value={formData.subgrupo_id}
                    onValueChange={(value) => setFormData({ ...formData, subgrupo_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um subgrupo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Nenhum</SelectItem>
                      {filteredSubgrupos.map((subgrupo) => (
                        <SelectItem key={subgrupo.id} value={subgrupo.id}>
                          {subgrupo.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.subgrupo_id && (
                <div>
                  <label className="block text-sm font-medium mb-1">Sub-subgrupo</label>
                  <Select
                    value={formData.sub_subgrupo_id}
                    onValueChange={(value) => setFormData({ ...formData, sub_subgrupo_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um sub-subgrupo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Nenhum</SelectItem>
                      {filteredSubSubgrupos.map((subSubgrupo) => (
                        <SelectItem key={subSubgrupo.id} value={subSubgrupo.id}>
                          {subSubgrupo.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Preço de Custo *</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  value={formData.preco_custo}
                  onChange={(e) => setFormData({ ...formData, preco_custo: parseFloat(e.target.value) })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Preço de Venda *</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  value={formData.preco_venda}
                  onChange={(e) => setFormData({ ...formData, preco_venda: parseFloat(e.target.value) })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Estoque Atual *</label>
                <Input
                  type="number"
                  step="1"
                  min="0"
                  placeholder="0"
                  value={formData.estoque_atual}
                  onChange={(e) => setFormData({ ...formData, estoque_atual: parseInt(e.target.value) })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Estoque Mínimo *</label>
                <Input
                  type="number"
                  step="1"
                  min="0"
                  placeholder="0"
                  value={formData.estoque_minimo}
                  onChange={(e) => setFormData({ ...formData, estoque_minimo: parseInt(e.target.value) })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Unidade</label>
                <Select
                  value={formData.unidade}
                  onValueChange={(value) => setFormData({ ...formData, unidade: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="un">Unidade (un)</SelectItem>
                    <SelectItem value="kg">Quilograma (kg)</SelectItem>
                    <SelectItem value="g">Grama (g)</SelectItem>
                    <SelectItem value="l">Litro (l)</SelectItem>
                    <SelectItem value="ml">Mililitro (ml)</SelectItem>
                    <SelectItem value="m">Metro (m)</SelectItem>
                    <SelectItem value="cm">Centímetro (cm)</SelectItem>
                    <SelectItem value="pct">Pacote (pct)</SelectItem>
                    <SelectItem value="cx">Caixa (cx)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveProduto} disabled={produtosCrud.isLoading}>
              {produtosCrud.isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmação de exclusão */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteProduto}
        title="Excluir Produto"
        description={`Tem certeza que deseja excluir o produto "${currentProduto?.nome}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="destructive"
      />

      {/* Modal do Scanner de Código de Barras */}
      <Dialog open={isScannerOpen} onOpenChange={setIsScannerOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Escanear Código de Barras</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center space-y-4">
            <BarcodeScanner onDetected={handleBarcodeDetected} />
            <p className="text-sm text-muted-foreground">
              Posicione o código de barras na frente da câmera para leitura automática.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScannerOpen(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
