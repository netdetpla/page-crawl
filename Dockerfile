FROM node:stretch

ADD ["sources.list", "/etc/apt/"]

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

RUN apt update \
&& apt install -y chromium

ADD ["./", "/"]

RUN cd / \
&& npm i \
&& npm run compile

CMD npm run run