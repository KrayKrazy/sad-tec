"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"home" | "admin">("home");
  const osPdfAreaRef = useRef<HTMLDivElement>(null);
  
  // OS Form State
  const [osNum, setOsNum] = useState("0001");
  const [nomeCliente, setNomeCliente] = useState("");
  const [cpf, setCpf] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [equipamento, setEquipamento] = useState("");
  const [modelo, setModelo] = useState("");
  const [serie, setSerie] = useState("");
  const [defeito, setDefeito] = useState("");
  const [laudo, setLaudo] = useState("");
  
  const [items, setItems] = useState([
    { id: 1, desc: "", qtd: 0, preco: 0 },
    { id: 2, desc: "", qtd: 0, preco: 0 },
    { id: 3, desc: "", qtd: 0, preco: 0 },
  ]);
  const [maoDeObra, setMaoDeObra] = useState(0);

  // Derived state for totals
  const totalPecas = items.reduce((acc, item) => acc + (item.qtd * item.preco), 0);
  const totalGeral = totalPecas + maoDeObra;

  const [isGenerating, setIsGenerating] = useState(false);

  const updateItem = (id: number, field: string, value: any) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const gerarECompartilharPDF = async () => {
    if (!osPdfAreaRef.current) return;
    setIsGenerating(true);

    try {
      // Import html2pdf dynamically to avoid SSR window is not defined error
      const html2pdf = (await import("html2pdf.js")).default;
      
      const element = osPdfAreaRef.current;
      const filename = `OS_${osNum}_${nomeCliente || "Cliente"}.pdf`.replace(/\s+/g, '_');

      const opt = {
        margin:       0,
        filename:     filename,
        image:        { type: 'jpeg' as const, quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm' as const, format: 'a4', orientation: 'portrait' as const }
      };

      const pdfBlob = await html2pdf().set(opt).from(element).output('blob');

      // Tentativa de compartilhar via celular (WhatsApp, etc)
      if (navigator.share && navigator.canShare) {
        const file = new File([pdfBlob], filename, { type: 'application/pdf' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `Ordem de Serviço - ${nomeCliente || "Cliente"}`,
            text: 'Segue em anexo a sua Ordem de Serviço da SAD Tec Eletrônica.',
            files: [file]
          });
          setIsGenerating(false);
          return;
        }
      }
      
      // Fallback para PC: Faz o download do arquivo
      const blobUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(blobUrl);

    } catch (err) {
      console.error("Erro ao gerar/compartilhar PDF:", err);
      alert("Ocorreu um erro ao gerar a O.S. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <i className="fa-solid fa-microchip text-2xl mr-2"></i>
              <span className="font-bold text-xl tracking-wider">SAD TEC ELETRÔNICA</span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setActiveTab('home')} 
                className={`hover:text-blue-200 font-medium transition ${activeTab === 'home' ? 'border-b-2 border-white' : ''}`}>
                Início
              </button>
              <button 
                onClick={() => setActiveTab('admin')} 
                className={`bg-white text-blue-600 px-4 py-2 rounded-md font-bold text-sm shadow hover:bg-gray-100 transition ${activeTab === 'admin' ? 'ring-2 ring-white ring-offset-2 ring-offset-blue-600' : ''}`}>
                Portal Admin
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* HOME TAB */}
      {activeTab === "home" && (
        <div className="animate-in fade-in duration-500">
          
          {/* Hero Section */}
          <div className="relative bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto">
              <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                  <div className="sm:text-center lg:text-left">
                    <span className="text-xs font-bold tracking-widest text-blue-600 uppercase">Assistência Técnica Especializada</span>
                    <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl mt-2">
                      <span className="block">Os únicos autorizados</span>
                      <span className="block text-blue-600">Philco e LG na cidade.</span>
                    </h1>
                    <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                      Conserto rápido e de confiança para eletrodomésticos e eletrônicos. Exclusividade em TVs de borda infinita em Santo Antônio do Descoberto - GO.
                    </p>
                    <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                      <div className="rounded-md shadow">
                        <a href="https://wa.me/5561983034759" target="_blank" rel="noreferrer" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition">
                          <i className="fa-brands fa-whatsapp mr-2"></i> Solicitar Orçamento
                        </a>
                      </div>
                      <div className="mt-3 sm:mt-0 sm:ml-3">
                        <a href="https://maps.app.goo.gl/5zZN1isS1f3BrFTM6?g_st=awb" target="_blank" rel="noreferrer" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10 transition">
                          <i className="fa-solid fa-star text-yellow-500 mr-2"></i> Ver Avaliações
                        </a>
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            </div>
            <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
              <img className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full" src="/tv_repair.jpg" alt="Conserto de TV Borda Infinita" />
            </div>
          </div>

          {/* Features */}
          <div className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Nossos Serviços</h2>
                <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                  Soluções completas para sua casa
                </p>
              </div>

              <div className="mt-10">
                <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                  
                  <div className="relative bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                        <i className="fa-solid fa-tv text-xl"></i>
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-gray-900">TVs (Borda Infinita)</p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">
                      Somos os únicos na cidade com laboratório e expertise técnica para manutenção segura em TVs ultra-finas e de borda infinita.
                    </dd>
                  </div>

                  <div className="relative bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                        <i className="fa-solid fa-fire-burner text-xl"></i>
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Linha Branca & Cozinha</p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">
                      Conserto especializado em Air Fryers, Micro-ondas, e Panelas Elétricas. Peças originais e garantia de serviço.
                    </dd>
                  </div>

                  <div className="relative bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                        <i className="fa-solid fa-fan text-xl"></i>
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Ventiladores e Climatização</p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">
                      Seu ventilador parou? Resolvemos problemas de motor, hélice e elétrica com rapidez para você não passar calor.
                    </dd>
                  </div>

                  <div className="relative bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                        <i className="fa-solid fa-wind text-xl"></i>
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Secadores e Beleza</p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">
                      Manutenção em secadores de cabelo, chapinhas e equipamentos de salão. Conserto rápido.
                    </dd>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>

          {/* Brands Slider */}
          <div className="py-10 bg-white">
            <div className="text-center mb-6">
              <h3 className="text-lg font-bold text-gray-400 uppercase tracking-widest">Trabalhamos com as melhores marcas</h3>
            </div>
            <div className="slider">
              <div className="slide-track">
                {/* Repetido duas vezes para o loop infinito */}
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="contents">
                    <div className="slide-item"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Philco_logo.svg/2560px-Philco_logo.svg.png" alt="Philco" /></div>
                    <div className="slide-item"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/LG_logo_%282015%29.svg/2048px-LG_logo_%282015%29.svg.png" alt="LG" /></div>
                    <div className="slide-item"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/2560px-Samsung_Logo.svg.png" alt="Samsung" /></div>
                    <div className="slide-item"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Electrolux_logo.svg/2560px-Electrolux_logo.svg.png" alt="Electrolux" /></div>
                    <div className="slide-item"><img src="https://logospng.org/download/mondial/logo-mondial-2048.png" alt="Mondial" /></div>
                    <div className="slide-item"><img src="https://logospng.org/download/britania/logo-britania-2048.png" alt="Britania" /></div>
                    <div className="slide-item"><img src="https://logospng.org/download/arno/logo-arno-2048.png" alt="Arno" /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Footer com imagem hero */}
          <div className="w-full h-64 bg-cover bg-center flex items-center justify-center relative" style={{ backgroundImage: "url('/appliance_repair.jpg')" }}>
            <div className="absolute inset-0 bg-blue-900 bg-opacity-70"></div>
            <div className="relative z-10 text-center text-white px-4">
              <h2 className="text-3xl font-bold mb-4">Seu aparelho quebrou? Nós consertamos!</h2>
              <p className="mb-6">Quadra 14, LOTE 09 - Parque 11A, Santo Antônio do Descoberto - GO</p>
              <div className="flex justify-center gap-4">
                <a href="https://wa.me/5561983034759" target="_blank" rel="noreferrer" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition shadow-lg">
                  (61) 98303-4759
                </a>
                <a href="https://wa.me/5561981977940" target="_blank" rel="noreferrer" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition shadow-lg">
                  (61) 98197-7940
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN TAB */}
      {activeTab === "admin" && (
        <div className="bg-gray-100 min-h-screen py-8 animate-in fade-in duration-500">
          <div className="max-w-4xl mx-auto px-4 lg:px-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Gerador Digital de Ordem de Serviço</h2>
              <button 
                onClick={gerarECompartilharPDF} 
                disabled={isGenerating}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold shadow-lg flex items-center gap-2 transition disabled:opacity-70">
                {isGenerating ? (
                  <><i className="fa-solid fa-spinner fa-spin text-xl"></i> Gerando...</>
                ) : (
                  <><i className="fa-brands fa-whatsapp text-xl"></i> Gerar PDF e Compartilhar</>
                )}
              </button>
            </div>

            {/* Área do Papel (O.S) */}
            <div className="overflow-x-auto pb-10">
              <div 
                id="os-pdf-area" 
                ref={osPdfAreaRef}
                className="p-8 shadow-2xl mx-auto relative rounded-sm border border-gray-300" 
                style={{ width: "210mm", minHeight: "297mm", backgroundColor: "#fef9c3", color: "#000", fontFamily: "Arial, sans-serif" }}>
                
                {/* Header */}
                <div className="flex justify-between items-center border-b-2 border-gray-800 pb-4 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-black italic tracking-tighter border-2 border-black px-2 rounded">SAD</div>
                    <div>
                      <div className="font-bold text-xl">Tec Eletrônica</div>
                      <div className="text-xs">"Conserto Rápido: Seu Eletrodoméstico e Eletrônico em Boas Mãos!"</div>
                    </div>
                  </div>
                  <div className="text-xs text-right">
                    <div><i className="fa-brands fa-whatsapp"></i> 9-8303-4759</div>
                    <div><i className="fa-brands fa-whatsapp"></i> 9-8197-7940</div>
                  </div>
                </div>

                <div className="flex justify-between mb-6">
                  <div className="w-1/2">
                    <h3 className="font-black text-xl tracking-widest">ORÇAMENTO</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <label>Número O.S</label>
                      <input type="text" className="border border-gray-400 bg-white w-32 p-1 font-bold" value={osNum} onChange={(e) => setOsNum(e.target.value)} />
                    </div>
                  </div>
                  <div className="text-xs w-1/2 text-right leading-tight">
                    <p>Razão Social : Luiz Vieira Gloria</p>
                    <p>CPF: 252.707.971-20</p>
                    <p>Quadra 14, LOTE 09 - Parque 11A</p>
                    <p>Santo Antônio do Descoberto - GO</p>
                  </div>
                </div>

                {/* Dados Cliente */}
                <div className="border border-gray-400 p-2 mb-4 os-form">
                  <div className="flex items-end mb-2">
                    <label className="w-24">Cliente:</label>
                    <input type="text" placeholder="Nome do cliente" value={nomeCliente} onChange={(e) => setNomeCliente(e.target.value)} />
                  </div>
                  <div className="flex items-end mb-2">
                    <label className="w-24">CPF / CNPJ:</label>
                    <input type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} />
                  </div>
                  <div className="flex items-end mb-2">
                    <label className="w-24">ENDEREÇO:</label>
                    <input type="text" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
                  </div>
                  <div className="flex items-end mb-2">
                    <label className="w-24">Telefone:</label>
                    <input type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
                  </div>
                  <div className="flex items-end mb-2">
                    <label className="w-28">EQUIPAMENTO:</label>
                    <input type="text" value={equipamento} onChange={(e) => setEquipamento(e.target.value)} />
                  </div>
                  <div className="flex items-end mb-2 gap-4">
                    <div className="flex flex-1 items-end">
                      <label className="w-20">MODELO:</label>
                      <input type="text" value={modelo} onChange={(e) => setModelo(e.target.value)} />
                    </div>
                    <div className="flex flex-1 items-end">
                      <label className="w-16">SÉRIE:</label>
                      <input type="text" value={serie} onChange={(e) => setSerie(e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* Defeito */}
                <div className="border border-gray-400 p-2 mb-4 os-form bg-gray-200/50">
                  <label>DEFEITO APRESENTADO:</label>
                  <input type="text" value={defeito} onChange={(e) => setDefeito(e.target.value)} />
                </div>

                {/* Itens Tabela */}
                <table className="w-full os-table mb-4 border-collapse">
                  <thead>
                    <tr className="bg-gray-200 border-gray-400">
                      <th className="w-12 text-center">Itens</th>
                      <th>DESCRIMINAÇÃO PEÇAS/SERVIÇOS</th>
                      <th className="w-16 text-center">QTD</th>
                      <th className="w-24 text-right">Preço Unit.</th>
                      <th className="w-24 text-right">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={item.id}>
                        <td className="text-center font-bold">{index + 1}</td>
                        <td><input type="text" className="w-full bg-transparent outline-none" value={item.desc} onChange={(e) => updateItem(item.id, 'desc', e.target.value)} /></td>
                        <td><input type="number" className="w-full bg-transparent outline-none text-center" value={item.qtd || ""} onChange={(e) => updateItem(item.id, 'qtd', parseFloat(e.target.value))} /></td>
                        <td><input type="number" className="w-full bg-transparent outline-none text-right" value={item.preco || ""} onChange={(e) => updateItem(item.id, 'preco', parseFloat(e.target.value))} /></td>
                        <td className="text-right font-medium">R$ {(item.qtd * item.preco).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={4} className="text-right font-bold bg-gray-100 border-gray-400">TOTAL PEÇAS ------&gt;</td>
                      <td className="text-right font-bold border-gray-400">R$ {totalPecas.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td colSpan={4} className="text-right font-bold bg-gray-100 border-gray-400">MÃO DE OBRA ------&gt;</td>
                      <td className="text-right font-bold p-0 border-gray-400">
                        <input type="number" className="w-full bg-transparent outline-none text-right font-bold p-1" value={maoDeObra || ""} onChange={(e) => setMaoDeObra(parseFloat(e.target.value) || 0)} />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={4} className="text-right font-black bg-gray-200 border-gray-400">TOTAL GERAL ------&gt;</td>
                      <td className="text-right font-black bg-gray-200 border-gray-400">R$ {totalGeral.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>

                {/* Laudo */}
                <div className="border border-gray-400 p-2 mb-4 os-form bg-gray-200/50">
                  <label>LAUDO TÉCNICO:</label>
                  <textarea rows={3} className="w-full bg-transparent outline-none resize-none" value={laudo} onChange={(e) => setLaudo(e.target.value)}></textarea>
                </div>

                {/* Pagamento e Assinaturas */}
                <div className="border border-gray-400 p-2 mb-6 text-sm">
                  <div className="text-center font-bold mb-2">CONDIÇÃO DE PAGAMENTO:</div>
                  <div className="flex justify-center gap-6 mb-6">
                    <label><input type="checkbox" className="mr-1" /> Dinheiro</label>
                    <label><input type="checkbox" className="mr-1" /> Cartão Crédito</label>
                    <label><input type="checkbox" className="mr-1" /> PIX</label>
                  </div>
                  
                  <div className="flex justify-between items-end mt-8">
                    <div className="w-1/2 text-center border-t border-black pt-1 mr-4">
                      <span className="block text-xs">SERVIÇO AUTORIZADO POR:</span>
                      Assinatura Técnico
                    </div>
                    <div className="w-1/2 flex gap-2 mb-2 items-end">
                      <span className="font-bold">DATA:</span>
                      <input type="text" className="border-b border-black outline-none bg-transparent w-full" defaultValue="___/___/______" />
                    </div>
                  </div>
                  <div className="w-full text-center border-t border-black pt-1 mt-8 ml-auto" style={{ width: "50%" }}>
                    Assinatura CLIENTE
                  </div>
                </div>

                {/* Rodapé Legal */}
                <div className="bg-gray-600 text-white text-center text-[10px] p-1 mt-auto absolute bottom-0 left-0 w-full">
                  90 dias Prazo para retirada do Equipamento : Art. 1.275. Além das causas consideradas neste Código, perde-se a propriedade:<br />
                  Lei nº 10.406 de 10 de Janeiro de 2002 II - pela renúncia: III - por abandono;<br />
                  Garantia Peças e Serviços - 90 Dias
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        <a href="https://maps.app.goo.gl/5zZN1isS1f3BrFTM6?g_st=awb" target="_blank" rel="noreferrer" className="bg-white text-blue-600 border border-blue-200 p-4 rounded-full shadow-2xl hover:bg-gray-50 hover:scale-110 transition-transform flex items-center justify-center group relative w-14 h-14">
          <i className="fa-solid fa-star text-2xl text-yellow-400"></i>
          <span className="absolute right-16 bg-white text-sm whitespace-nowrap px-3 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity font-bold">Avalie no Google</span>
        </a>
        
        <a href="https://wa.me/5561983034759" target="_blank" rel="noreferrer" className="bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 hover:scale-110 transition-transform flex items-center justify-center group relative w-14 h-14">
          <i className="fa-brands fa-whatsapp text-3xl"></i>
          <span className="absolute right-16 bg-white text-gray-800 text-sm whitespace-nowrap px-3 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity font-bold">Fale Conosco</span>
        </a>
      </div>
    </div>
  );
}
