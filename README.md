# Ligéia — Ficha Elegante

Módulo de **aparência** para o sistema [Ligeia RPG](https://github.com/pedrohmlimonta/LigeiaFoundry) no Foundry VTT v13.

Ele **não altera o sistema**. Apenas registra uma ficha de personagem alternativa,
com um visual em **abas** e **barras coloridas** de recursos. Toda a lógica
(rolagens, efeitos, condições, cálculo de XP, arrastar e soltar) é herdada da
ficha original do sistema — nada é reimplementado nem modificado.

## O que muda no visual

- **Barra superior fixa** com retrato, nome, conceito e três barras sempre
  visíveis enquanto você rola a ficha:
  - **Pontos de Vida** — vermelho-sangue (com sobreposição ciano de PV temporário e pulso de alerta quando ≤ 30%);
  - **Pontos de Magia** — azul;
  - **Pontos Heroicos** — verde.
- **7 abas**: Atributos · Equipamentos · Habilidades · Magias · Traços ·
  Efeitos & Condições · Personalidade & Notas. Cada aba mostra um contador.
- Os campos editáveis de valor atual de cada recurso ficam direto na barra.

## Requisitos

- Foundry VTT **v13**.
- Sistema **Ligeia RPG** (`ligeia-rpg`) instalado e ativo no mundo. É declarado
  como dependência: o Foundry avisa se ele não estiver presente.

## Instalação por manifesto

1. Foundry → **Add-on Modules → Install Module**.
2. No campo **Manifest URL**, cole:
   ```
   https://github.com/pedrohmlimonta/LigeiaModuloDeFichas/releases/latest/download/module.json
   ```
3. **Install**.
4. No seu mundo: **Game Settings → Manage Modules** e ative **Ligéia — Ficha Elegante**.

> Se o repositório tiver outro nome/usuário, ajuste `url`, `manifest` e
> `download` no `module.json` antes de publicar (são as únicas URLs a trocar).

## Escolher a ficha

O módulo já se registra como ficha padrão dos personagens. Se uma ficha antiga
continuar aparecendo (porque o mundo já tinha uma escolha salva), abra a ficha,
clique no ícone de engrenagem do cabeçalho → **Sheet Configuration** e selecione
**Ligéia — Ficha Elegante (abas)** (marque "para todos os personagens" se quiser).
Para voltar à ficha original do sistema, é só escolhê-la de novo no mesmo lugar.

## Licença

Mesmo autor do sistema. Use à vontade.
