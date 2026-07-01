.PHONY: setup dev stop reset

# Cores para output
GREEN  := \033[0;32m
YELLOW := \033[0;33m
RESET  := \033[0m

## setup: instala dependências, sobe o banco, roda migrations e seed
setup:
	@echo "$(YELLOW)→ Inicializando submodules (api + web)...$(RESET)"
	@git submodule update --init --recursive
	@echo "$(YELLOW)→ Subindo banco de dados...$(RESET)"
	@docker compose up -d db
	@echo "$(YELLOW)→ Aguardando o banco ficar pronto...$(RESET)"
	@until docker compose exec db pg_isready -U postgres > /dev/null 2>&1; do \
		printf "."; sleep 1; \
	done; echo ""
	@echo "$(YELLOW)→ Instalando dependências da API...$(RESET)"
	@cd api && npm install
	@echo "$(YELLOW)→ Instalando dependências do Web...$(RESET)"
	@cd web && npm install
	@echo "$(YELLOW)→ Instalando dependências da raiz...$(RESET)"
	@npm install
	@echo "$(YELLOW)→ Copiando .env da API...$(RESET)"
	@[ -f api/.env ] || cp api/.env.example api/.env && echo "  api/.env criado"
	@echo "$(YELLOW)→ Rodando migrations...$(RESET)"
	@cd api && npm run prisma:deploy
	@echo "$(YELLOW)→ Rodando seed...$(RESET)"
	@cd api && npm run prisma:seed
	@echo ""
	@echo "$(GREEN)✓ Setup concluído! Execute 'make dev' para iniciar.$(RESET)"

## dev: inicia o banco (se parado) + API + Web em paralelo
dev:
	@echo "$(YELLOW)→ Subindo banco de dados...$(RESET)"
	@docker compose up -d db
	@until docker compose exec db pg_isready -U postgres > /dev/null 2>&1; do \
		printf "."; sleep 1; \
	done; echo ""
	@echo "$(GREEN)→ Iniciando API (http://localhost:3002) e Web (http://localhost:4200)...$(RESET)"
	@npm run dev

## stop: para os containers Docker
stop:
	@echo "$(YELLOW)→ Parando containers...$(RESET)"
	@docker compose down
	@echo "$(GREEN)✓ Containers parados.$(RESET)"

## reset: destrói o banco e refaz o setup do zero
reset:
	@echo "$(YELLOW)→ Resetando banco de dados (dados serão perdidos)...$(RESET)"
	@docker compose down -v
	@$(MAKE) setup
