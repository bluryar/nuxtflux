# 第一阶段：构建环境
FROM node:18 AS builder

ENV VITE_TITLE="NuxtFlux"

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装项目依赖
RUN corepack enable && pnpm install

# 复制项目文件到工作目录
COPY . .

# 构建 Nuxt3 应用
RUN pnpm run build

# 从构建阶段复制输出文件
# 注意：Nuxt3 Nitro 的构建产物位于 `.output` 目录
FROM node:18-slim AS runner

WORKDIR /app

COPY --from=builder /app/.output ./.output

# 暴露应用运行的端口
EXPOSE 3000

# 设置环境变量
ENV NODE_ENV production

# 使用 Nitro 启动命令
CMD ["node", ".output/server/index.mjs"]
