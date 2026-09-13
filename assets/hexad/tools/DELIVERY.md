# Entrega CyberShield Hexad

## Entregue

A entrega contém **13 modelos GLB procedurais**, **10 texturas fonte 1024×1024**, **4 fallbacks WebP 1920×1080**, **8 vídeos WebM/MP4**, **16 SFX WAV**, **7 beds ambientais**, uma trilha master gerada, um manifest completo e um toolkit de runtime para Three.js.

Os modelos têm objetos nomeados para núcleo, rings, shields, access gates, data channels, moons, nodes, fragments, scanner e micro-lights. A interação é implementada no runtime via clips/procedural motion: orbit, scan, failure, restore, failover, fracture/repair e signature scan.

## Compatibilidade

- Principal: WebM, GLB, PNG fonte, WAV e MP3.
- Fallback: MP4 H.264 e WebP.
- KTX2: o pacote inclui fonte PNG e `tools/build_ktx2.sh`; o encoder Khronos `toktx` precisa estar instalado no ambiente de build para produzir o binário KTX2.
- Draco/Meshopt: o GLB está organizado para aplicar compressão no pipeline final; a compressão depende do encoder escolhido pelo projeto.

## Limites práticos

A geração musical disponível nesta sessão produz aproximadamente até 3 minutos em uma chamada. O master entregue é uma faixa de aproximadamente 3 minutos, e o README explica como compor uma versão de 3–6 minutos com crossfade. Os vídeos procedurais são motion plates baseados na arte gerada e estão prontos como fallback narrativo; se a produção exigir simulação 3D renderizada, eles devem ser substituídos por renders finais do motor.

## Verificação

`verify_hexad_assets.py` validou carregamento dos 13 GLB, leitura dos arquivos de áudio/vídeo via ffprobe, dimensões 1920×1080 dos WebP e a presença do manifesto. Resultado: `VALIDATION_OK`.

SHA-256 do ZIP final: `2a99114bcabd2994d91e52514036b6dd75d1ab1a7ec644f23f4fb8e243ad3595`.
