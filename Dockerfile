FROM nginx:alpine

# Copia os arquivos estáticos para a pasta pública do Nginx
COPY ./ /usr/share/nginx/html/

# Expõe a porta 80
EXPOSE 80

# Inicia o Nginx em modo foreground
CMD ["nginx", "-g", "daemon off;"]
