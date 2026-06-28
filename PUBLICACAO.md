# Como publicar e instalar a Ficha Elegante via manifesto

> Este é um **módulo de aparência**. Ele **não toca no sistema** `ligeia-rpg`:
> só registra uma ficha de personagem alternativa. O sistema continua exatamente
> como está — esta ficha apenas troca o visual (abas + barras coloridas) e herda
> toda a lógica original (rolagens, efeitos, condições, XP, arrastar e soltar).

## Visão geral

A instalação por manifesto usa **GitHub Releases**. Cada release expõe dois
arquivos: `module.json` e `ligeia-ficha-elegante.zip`. A GitHub Action
(`.github/workflows/release.yml`) gera e anexa esses arquivos automaticamente —
e ainda ajusta a versão e as URLs conforme a tag e o repositório.

## 1. Subir o módulo para o GitHub (uma vez)

```bash
cd LigeiaModuloDeFichas
git init
git add .
git commit -m "Ligéia — Ficha Elegante (módulo de ficha em abas)"
git branch -M main
git remote add origin https://github.com/pedrohmlimonta/LigeiaModuloDeFichas.git
git push -u origin main
```

> O repositório aqui está nomeado **LigeiaModuloDeFichas** e o usuário
> **pedrohmlimonta** (valores nas URLs do `module.json`). Se você usar outro
> nome/usuário, a Action corrige as URLs sozinha no momento da release; só
> ajuste manualmente se for instalar **sem** criar uma release.

## 2. Publicar uma versão (a cada atualização)

1. No GitHub: **Releases → Draft a new release**.
2. Em **Choose a tag**, digite a versão como `v1.0.0` (com o "v") e clique em
   "Create new tag on publish".
3. Dê um título (ex.: "1.0.0") e clique em **Publish release**.
4. A Action roda sozinha, casa a versão do `module.json` com a tag e anexa
   `module.json` + `ligeia-ficha-elegante.zip` à release.

> A tag DEVE ser `vX.Y.Z`. Para a próxima, use `v1.1.0`, `v2.0.0`, etc.

## 3. Instalar no Foundry (qualquer instância)

Pré-requisito: o sistema **Ligeia RPG** (`ligeia-rpg`) já instalado.

1. Foundry → **Add-on Modules → Install Module**.
2. No campo **Manifest URL**, cole:
   ```
   https://github.com/pedrohmlimonta/LigeiaModuloDeFichas/releases/latest/download/module.json
   ```
3. **Install**.
4. No seu mundo: **Game Settings → Manage Modules** e ative
   **Ligéia — Ficha Elegante**.

Como o manifest aponta para `releases/latest`, futuras atualizações aparecem
sozinhas no Foundry (botão "Update").

## 4. Escolher a ficha

O módulo já se registra como ficha padrão dos personagens. Se ainda aparecer a
ficha antiga (o mundo pode ter uma escolha salva), abra a ficha → ícone de
engrenagem do cabeçalho → **Sheet Configuration** → selecione
**Ligéia — Ficha Elegante (abas)**. Para voltar à ficha original do sistema, é
só reescolhê-la no mesmo lugar — as duas convivem.

## Instalação manual (alternativa, sem release)

Baixe o `ligeia-ficha-elegante.zip` e extraia em
`Data/modules/ligeia-ficha-elegante/` de modo que o `module.json` fique direto
nessa pasta. Reinicie o Foundry e ative o módulo.

## Notas

- O módulo depende do sistema `ligeia-rpg` (declarado em `relationships`). Se o
  sistema não estiver presente, o Foundry avisa.
- Nenhum arquivo do sistema é alterado: dá para remover o módulo a qualquer
  momento e a ficha original volta.
