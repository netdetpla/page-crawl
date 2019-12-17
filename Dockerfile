FROM node:stretch

ADD ["sources.list", "/etc/apt/"]

ADD ["./", "/"]

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

RUN apt update \
&& apt install -y chromium

RUN cd / \
&& npm i \
&& npm run compile

CMD npm run run