FROM node:18.12.1-alpine

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /app/
COPY yarn.lock /app/
RUN yarn install


COPY . /app
RUN yarn build
# start app
CMD [ "yarn", "start" ]