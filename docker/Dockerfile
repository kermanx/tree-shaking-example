FROM ubuntu:24.04

# Install basic dependencies and Chrome/Puppeteer dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    build-essential \
    cloc \
    sudo \
    tar \
    unzip \
    wget \
    ca-certificates \
    fonts-liberation \
    libasound2t64 \
    libatk-bridge2.0-0t64 \
    libatk1.0-0t64 \
    libcairo2 \
    libcups2t64 \
    libdbus-1-3 \
    libdrm2 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libglib2.0-0t64 \
    libgtk-3-0t64 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user
RUN useradd -m -s /bin/bash user && \
    echo "user ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

USER user
WORKDIR /home/user

# Install fnm (Node.js manager)
RUN curl -fsSL https://fnm.vercel.app/install | bash

# Install uv (Python manager)
RUN curl -LsSf https://astral.sh/uv/install.sh | sh

# Install rustup with specific toolchain 1.91.1
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --default-toolchain 1.91.1

# Set up environment variables
ENV PATH="/home/user/.local/share/fnm:/home/user/.cargo/bin:/home/user/.local/bin:${PATH}"
ENV FNM_DIR="/home/user/.local/share/fnm"

# Load fnm environment and install Node.js 24.11
RUN bash -c 'source $HOME/.bashrc && fnm install 24.11 && fnm default 24.11'

# Enable corepack and install pnpm 10.30.3
RUN bash -c 'source $HOME/.bashrc && eval "$(fnm env --use-on-cd)" && corepack enable pnpm && corepack install -g pnpm@10.30.3'

# Install Python 3.12.3 via uv
RUN bash -c 'source $HOME/.cargo/env && uv python install 3.12.3'

# Create workspace directory
RUN mkdir -p /home/user/workspace

WORKDIR /home/user/workspace

# Copy entrypoint script
COPY --chown=user:user entrypoint.sh /home/user/entrypoint.sh
RUN chmod +x /home/user/entrypoint.sh

ENTRYPOINT ["/home/user/entrypoint.sh"]
CMD ["/bin/bash"]
