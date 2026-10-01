"use client";

import { useState, useRef, useEffect } from "react";
import { HeroSection } from "@/components/blocks/hero-section-dark";

export default function Home() {
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

  const totalPecas = items.reduce((acc, item) => acc + ((item.qtd || 0) * (item.preco || 0)), 0);
  const totalGeral = totalPecas + (maoDeObra || 0);

  const [isGenerating, setIsGenerating] = useState(false);

  const updateItem = (id: number, field: string, value: any) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const gerarECompartilharPDF = async () => {
    if (!osPdfAreaRef.current) return;
    setIsGenerating(true);

    try {
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

  // Força o dark mode no document
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="bg-[#0B0D13] text-gray-100 min-h-screen font-sans selection:bg-cyan-500/30">
      
      {/* Navbar Minimalista Dark */}
      <nav className="fixed top-0 w-full z-50 bg-[#0B0D13]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.3)]">
              <i className="fa-solid fa-microchip text-xl text-white"></i>
            </div>
            <span className="font-black text-2xl tracking-tighter text-white">SAD <span className="text-cyan-400">TEC</span></span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
            <a href="#" className="hover:text-cyan-400 transition-colors">Início</a>
            <a href="#services" className="hover:text-cyan-400 transition-colors">Especialidades</a>
            <a href="#admin" className="text-cyan-400">Portal O.S.</a>
          </div>
        </div>
      </nav>

      {/* NOVO HERO SECTION DO 21st */}
      <HeroSection 
        bottomImage={{
          light: "/tv_repair.jpg",
          dark: "/tv_repair.jpg"
        }}
      />

      {/* Brands Slider Estilo Apple/Vercel (Dark Mode) */}
      <div className="py-20 border-y border-white/5 bg-[#0B0D13] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,229,255,0.05)_0%,transparent_70%)]"></div>
        <div className="text-center mb-10 relative z-10">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-[0.3em]">Laboratório Homologado e Certificado</h3>
        </div>
        <div className="slider opacity-50 hover:opacity-100 transition-opacity duration-700">
          <div className="slide-track">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="contents">
                <div className="slide-item"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Philco_logo.svg/2560px-Philco_logo.svg.png" alt="Philco" className="invert brightness-0" /></div>
                <div className="slide-item"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/LG_logo_%282015%29.svg/2048px-LG_logo_%282015%29.svg.png" alt="LG" className="invert brightness-0" /></div>
                <div className="slide-item"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/2560px-Samsung_Logo.svg.png" alt="Samsung" className="invert brightness-0" /></div>
                <div className="slide-item"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Electrolux_logo.svg/2560px-Electrolux_logo.svg.png" alt="Electrolux" className="invert brightness-0" /></div>
                <div className="slide-item"><img src="https://logospng.org/download/mondial/logo-mondial-2048.png" alt="Mondial" className="invert brightness-0" /></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ADMIN PORTAL: Gerador de O.S Integrado no Fluxo da Página */}
      <section id="admin" className="py-32 relative bg-[#090A0F]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">Gerador Digital de O.S.</h2>
            <p className="text-gray-400 text-lg">Substitua o papel. Gere e envie Ordens de Serviço diretamente para o WhatsApp do cliente em PDF de alta qualidade.</p>
          </div>

          <div className="bg-[#161B29]/80 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="flex justify-end mb-8">
              <button 
                onClick={gerarECompartilharPDF} 
                disabled={isGenerating}
                className="bg-cyan-500 hover:bg-cyan-400 text-[#090A0F] px-8 py-4 rounded-xl font-bold shadow-[0_0_20px_rgba(0,229,255,0.4)] flex items-center gap-3 transition-all disabled:opacity-70 disabled:shadow-none">
                {isGenerating ? (
                  <><i className="fa-solid fa-spinner fa-spin text-xl"></i> Processando PDF...</>
                ) : (
                  <><i className="fa-brands fa-whatsapp text-2xl"></i> Emitir O.S. e Enviar</>
                )}
              </button>
            </div>

            {/* A ÁREA DA OS - Mantemos amarelada e com design de papel para o cliente final receber o formato clássico, mas num container moderno */}
            <div className="overflow-x-auto pb-10 bg-black/40 p-4 rounded-2xl border border-white/5">
              <div 
                id="os-pdf-area" 
                ref={osPdfAreaRef}
                className="p-8 shadow-2xl mx-auto relative rounded-sm" 
                style={{ width: "210mm", minHeight: "297mm", backgroundColor: "#fef9c3", color: "#000", fontFamily: "Arial, sans-serif" }}>
                
                {/* Header (Igual o HTML original) */}
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
                      <input type="text" className="border border-gray-400 bg-white w-32 p-1 font-bold outline-none" value={osNum} onChange={(e) => setOsNum(e.target.value)} />
                    </div>
                  </div>
                  <div className="text-xs w-1/2 text-right leading-tight">
                    <p>Razão Social : Luiz Vieira Gloria</p>
                    <p>CPF: 252.707.971-20</p>
                    <p>Quadra 14, LOTE 09 - Parque 11A</p>
                    <p>Santo Antônio do Descoberto - GO</p>
                  </div>
                </div>

                <div className="border border-gray-400 p-2 mb-4 os-form">
                  <div className="flex items-end mb-2">
                    <label className="w-24">Cliente:</label>
                    <input type="text" placeholder="Nome do cliente" value={nomeCliente} onChange={(e) => setNomeCliente(e.target.value)} className="flex-1 border-b border-gray-400 bg-transparent outline-none px-2" />
                  </div>
                  <div className="flex gap-4 mb-2">
                    <div className="flex flex-1 items-end">
                      <label className="w-24">CPF / CNPJ:</label>
                      <input type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} className="flex-1 border-b border-gray-400 bg-transparent outline-none px-2" />
                    </div>
                    <div className="flex flex-1 items-end">
                      <label className="w-20">Telefone:</label>
                      <input type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} className="flex-1 border-b border-gray-400 bg-transparent outline-none px-2" />
                    </div>
                  </div>
                  <div className="flex items-end mb-2">
                    <label className="w-24">ENDEREÇO:</label>
                    <input type="text" value={endereco} onChange={(e) => setEndereco(e.target.value)} className="flex-1 border-b border-gray-400 bg-transparent outline-none px-2" />
                  </div>
                  <div className="flex items-end mb-2">
                    <label className="w-28">EQUIPAMENTO:</label>
                    <input type="text" value={equipamento} onChange={(e) => setEquipamento(e.target.value)} className="flex-1 border-b border-gray-400 bg-transparent outline-none px-2" />
                  </div>
                  <div className="flex items-end mb-2 gap-4">
                    <div className="flex flex-1 items-end">
                      <label className="w-20">MODELO:</label>
                      <input type="text" value={modelo} onChange={(e) => setModelo(e.target.value)} className="flex-1 border-b border-gray-400 bg-transparent outline-none px-2" />
                    </div>
                    <div className="flex flex-1 items-end">
                      <label className="w-16">SÉRIE:</label>
                      <input type="text" value={serie} onChange={(e) => setSerie(e.target.value)} className="flex-1 border-b border-gray-400 bg-transparent outline-none px-2" />
                    </div>
                  </div>
                </div>

                <div className="border border-gray-400 p-2 mb-4 bg-gray-200/50 flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-1">DEFEITO APRESENTADO:</label>
                  <input type="text" value={defeito} onChange={(e) => setDefeito(e.target.value)} className="border-b border-gray-400 bg-transparent outline-none px-2 py-1" />
                </div>

                <table className="w-full os-table mb-4 border-collapse border border-gray-400 text-sm">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border border-gray-400 p-1 w-12 text-center">Itens</th>
                      <th className="border border-gray-400 p-1">DESCRIMINAÇÃO PEÇAS/SERVIÇOS</th>
                      <th className="border border-gray-400 p-1 w-16 text-center">QTD</th>
                      <th className="border border-gray-400 p-1 w-24 text-right">Preço Unit.</th>
                      <th className="border border-gray-400 p-1 w-24 text-right">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={item.id}>
                        <td className="border border-gray-400 p-1 text-center font-bold">{index + 1}</td>
                        <td className="border border-gray-400 p-1"><input type="text" className="w-full bg-transparent outline-none" value={item.desc} onChange={(e) => updateItem(item.id, 'desc', e.target.value)} /></td>
                        <td className="border border-gray-400 p-1"><input type="number" className="w-full bg-transparent outline-none text-center" value={item.qtd || ""} onChange={(e) => updateItem(item.id, 'qtd', parseFloat(e.target.value))} /></td>
                        <td className="border border-gray-400 p-1"><input type="number" className="w-full bg-transparent outline-none text-right" value={item.preco || ""} onChange={(e) => updateItem(item.id, 'preco', parseFloat(e.target.value))} /></td>
                        <td className="border border-gray-400 p-1 text-right font-medium">R$ {((item.qtd||0) * (item.preco||0)).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={4} className="border border-gray-400 p-1 text-right font-bold bg-gray-100">TOTAL PEÇAS ------&gt;</td>
                      <td className="border border-gray-400 p-1 text-right font-bold">R$ {totalPecas.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td colSpan={4} className="border border-gray-400 p-1 text-right font-bold bg-gray-100">MÃO DE OBRA ------&gt;</td>
                      <td className="border border-gray-400 p-0 text-right font-bold">
                        <input type="number" className="w-full h-full bg-transparent outline-none text-right font-bold p-1" value={maoDeObra || ""} onChange={(e) => setMaoDeObra(parseFloat(e.target.value) || 0)} />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={4} className="border border-gray-400 p-1 text-right font-black bg-gray-200">TOTAL GERAL ------&gt;</td>
                      <td className="border border-gray-400 p-1 text-right font-black bg-gray-200">R$ {totalGeral.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>

                <div className="border border-gray-400 p-2 mb-4 bg-gray-200/50 flex flex-col">
                  <label className="text-xs font-bold text-gray-700 mb-1">LAUDO TÉCNICO:</label>
                  <textarea rows={3} className="w-full bg-transparent outline-none resize-none border-b border-gray-400 px-2" value={laudo} onChange={(e) => setLaudo(e.target.value)}></textarea>
                </div>

                <div className="border border-gray-400 p-4 mb-6 text-sm flex flex-col items-center">
                  <div className="font-bold mb-3">CONDIÇÃO DE PAGAMENTO:</div>
                  <div className="flex gap-6 mb-8 w-full justify-center">
                    <label><input type="checkbox" className="mr-1" /> Dinheiro</label>
                    <label><input type="checkbox" className="mr-1" /> Cartão Crédito</label>
                    <label><input type="checkbox" className="mr-1" /> PIX</label>
                  </div>
                  
                  <div className="flex justify-between w-full mt-6">
                    <div className="w-[45%] text-center border-t border-black pt-2">
                      <span className="block text-xs font-bold mb-1">SERVIÇO AUTORIZADO POR:</span>
                      Assinatura Técnico
                    </div>
                    <div className="w-[45%] text-center border-t border-black pt-2 mt-4">
                      Assinatura CLIENTE
                    </div>
                  </div>
                  <div className="w-full flex justify-center mt-6 gap-2">
                    <span className="font-bold">DATA:</span>
                    <input type="text" className="border-b border-black outline-none bg-transparent w-32 text-center" defaultValue="___/___/______" />
                  </div>
                </div>

                <div className="bg-gray-700 text-white text-center text-[10px] p-2 mt-auto w-full absolute bottom-0 left-0">
                  90 dias Prazo para retirada do Equipamento : Art. 1.275. Além das causas consideradas neste Código, perde-se a propriedade:<br />
                  Lei nº 10.406 de 10 de Janeiro de 2002 II - pela renúncia: III - por abandono;<br />
                  Garantia Peças e Serviços - 90 Dias
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Buttons Reestilizados */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        <a href="https://maps.app.goo.gl/5zZN1isS1f3BrFTM6?g_st=awb" target="_blank" rel="noreferrer" className="bg-[#161B29] text-yellow-400 border border-yellow-400/30 p-4 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.2)] hover:bg-[#1C2233] hover:scale-110 transition-all flex items-center justify-center group relative w-14 h-14">
          <i className="fa-solid fa-star text-2xl"></i>
          <span className="absolute right-16 bg-[#161B29] text-white border border-white/10 text-sm whitespace-nowrap px-4 py-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity font-bold">Avalie no Google</span>
        </a>
        
        <a href="https://wa.me/5561983034759" target="_blank" rel="noreferrer" className="bg-[#00E5FF] text-[#090A0F] p-4 rounded-full shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:bg-white hover:scale-110 transition-all flex items-center justify-center group relative w-14 h-14">
          <i className="fa-brands fa-whatsapp text-3xl"></i>
          <span className="absolute right-16 bg-[#00E5FF] text-[#090A0F] text-sm whitespace-nowrap px-4 py-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity font-bold">Fale Conosco</span>
        </a>
      </div>
    </div>
  );
}
