FROM node:stretch

ADD ["./", "/"]

RUN cd / \
&& npm i
&& npm run compile

CMD npm run run