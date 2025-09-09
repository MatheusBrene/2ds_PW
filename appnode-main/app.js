
const http = require("http");
const fs = require("fs");
const path = require("path");
const PORT = 3000;

const basePages = path.join(__dirname, "pages");
const dataFile = path.join(__dirname, "data", "usuarios.json");

function serveFile(res, filepath, contentType = "text/html") {
  fs.readFile(filepath, (err, content) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Página não encontrada");
      return;
    }
    res.writeHead(200, { "Content-Type": contentType + "; charset=utf-8" });
    res.end(content);
  });
}

function serveJSON(res, filepath) {
  fs.readFile(filepath, (err, content) => {
    if (err) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end("[]");
      return;
    }
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(content);
  });
}

function staticServe(req, res) {
  const p = path.join(__dirname, req.url);
  if (!p.startsWith(path.join(__dirname, "public"))) {
    res.writeHead(403); res.end("Forbidden"); return;
  }
  const ext = path.extname(p).toLowerCase();
  let contentType = "text/plain";
  if (ext === ".css") contentType = "text/css";
  else if (ext === ".js") contentType = "application/javascript";
  else if (ext === ".png") contentType = "image/png";
  else if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
  else if (ext === ".svg") contentType = "image/svg+xml";
  serveFile(res, p, contentType);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // rotas de páginas
  const routes = {
    "/": "index.html",
    "/index": "index.html",
    "/integrantes": "integrantes.html",
    "/componente1": "componente1.html",
    "/componente2": "componente2.html",
    "/cadastro": "cadastro.html",
    "/usuarios": "usuarios.html",
    "/editar": "editar.html",
    "/show": "show.html",
    "/base": "base.html"
  };

  if (pathname === "/public" || pathname.startsWith("/public/")) {
    staticServe(req, res);
    return;
  }

  // servir JSON dos usuários
  if (pathname === "/data/usuarios.json") {
    serveJSON(res, dataFile);
    return;
  }

  // páginas estáticas
  if (routes[pathname]) {
    serveFile(res, path.join(basePages, routes[pathname]));
    return;
  }

  // adicionar usuário
  if (pathname === "/addUsuario" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      const params = new URLSearchParams(body);
      const nome = params.get("nome") || "";
      const email = params.get("email") || "";
      const tel = params.get("tel") || "";
      const novo = { id: Date.now(), nome, email, tel };
      let arr = [];
      if (fs.existsSync(dataFile)) {
        try { arr = JSON.parse(fs.readFileSync(dataFile)); } catch {}
      }
      arr.push(novo);
      fs.writeFileSync(dataFile, JSON.stringify(arr, null, 2));
      res.writeHead(302, { Location: "/usuarios" });
      res.end();
    });
    return;
  }

  // editar usuário
  if (pathname === "/editUsuario" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      const params = new URLSearchParams(body);
      const id = Number(params.get("id"));
      const nome = params.get("nome") || "";
      const email = params.get("email") || "";
      const tel = params.get("tel") || "";
      let arr = [];
      if (fs.existsSync(dataFile)) {
        try { arr = JSON.parse(fs.readFileSync(dataFile)); } catch {}
      }
      arr = arr.map(u => u.id === id ? { id, nome, email, tel } : u);
      fs.writeFileSync(dataFile, JSON.stringify(arr, null, 2));
      res.writeHead(302, { Location: "/usuarios" });
      res.end();
    });
    return;
  }

  // excluir usuário via query ?id=...
  if (pathname === "/deleteUsuario" && req.method === "GET") {
    const id = Number(url.searchParams.get("id"));
    let arr = [];
    if (fs.existsSync(dataFile)) {
      try { arr = JSON.parse(fs.readFileSync(dataFile)); } catch {}
    }
    arr = arr.filter(u => u.id !== id);
    fs.writeFileSync(dataFile, JSON.stringify(arr, null, 2));
    res.writeHead(302, { Location: "/usuarios" });
    res.end();
    return;
  }

  // servir qualquer arquivo extra em /pages (por segurança apenas)
  if (pathname.startsWith("/pages/")) {
    const fp = path.join(__dirname, pathname);
    serveFile(res, fp);
    return;
  }

  // 404
  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Rota não encontrada");
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
