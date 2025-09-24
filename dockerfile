FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./ 
RUN npm install --only=production

USER node 

COPY / ./
CMD ["npm" , "run" , "prod"]

EXPOSE 8000